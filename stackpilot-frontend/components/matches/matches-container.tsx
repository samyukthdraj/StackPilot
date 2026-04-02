"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MatchFilters } from "@/components/matches/match-filters";
import { MatchesHeader } from "@/components/matches/matches-header";
import { MatchesList } from "@/components/matches/matches-list";
import { NoResumeState } from "@/components/matches/no-resume-state";
import { useMatches } from "@/lib/hooks/use-matches";
import { useResumes } from "@/lib/hooks/use-resumes";
import { useMatchesStore } from "@/lib/store/matches-store";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Job, SavedJob } from "@/lib/types/api";

export function MatchesContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeIdParam = searchParams.get("resumeId");
  const { resumes, primaryResume, isLoading: resumesLoading } = useResumes();
  const { filters } = useMatchesStore();

  const [internalSelectedResume, setInternalSelectedResume] = useState<string | null>(null);

  // Derived selected resume: priority order -> query param, manually selected, primary resume
  const currentResumeId = resumeIdParam || internalSelectedResume || primaryResume?.id || undefined;

  const { data: matches, isLoading } = useMatches(currentResumeId);
  const [jobDetails, setJobDetails] = useState<Record<string, Job>>({});
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"explore" | "saved">("explore");
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobDetails = useCallback(async () => {
    if (!matches) return;

    // Only fetch details for jobs we haven't fetched yet
    const jobsToFetch = matches.filter((match) => !jobDetails[match.jobId]);
    if (jobsToFetch.length === 0) return;

    try {
      const details: Record<string, Job> = { ...jobDetails };
      
      await Promise.all(
        jobsToFetch.map(async (match) => {
          try {
            const response = await apiClient.get<Job>(`/jobs/${match.jobId}`);
            details[match.jobId] = response.data;
          } catch (error) {
            console.error(`Error fetching job ${match.jobId}:`, error);
          }
        }),
      );
      
      setJobDetails(details);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  }, [matches, jobDetails]);

  const fetchSavedStatus = useCallback(async () => {
    if (!matches) return;
    try {
      const response = await apiClient.get<{ items: SavedJob[] }>(
        "/jobs/saved",
      );
      const saved = new Set(response.data.items.map((item) => item.jobId));
      setSavedJobs(saved);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  }, [matches]);

  useEffect(() => {
    if (!matches) return;

    const fetchData = async () => {
      await Promise.all([fetchJobDetails(), fetchSavedStatus()]);
    };

    fetchData();
  }, [matches, fetchJobDetails, fetchSavedStatus]);

  const filteredMatches = matches?.filter((match) => {
    if (viewMode === "saved" && !savedJobs.has(match.jobId)) return false;
    if (match.score <= 60) return false; // Only show high-quality matches (> 60%)
    if (match.score < filters.minScore) return false;
    if (match.score > filters.maxScore) return false;
    return true;
  });

  const sortedMatches = filteredMatches?.sort((a, b) => {
    // If user says desc shows asc, then we flip our logic to match their expectation
    const multiplier = filters.sortOrder === "asc" ? -1 : 1;

    switch (filters.sortBy) {
      case "score":
        return (a.score - b.score) * multiplier;
      case "date": {
        const dateA = jobDetails[a.jobId]?.postedAt
          ? new Date(jobDetails[a.jobId].postedAt!).getTime()
          : 0;
        const dateB = jobDetails[b.jobId]?.postedAt
          ? new Date(jobDetails[b.jobId].postedAt!).getTime()
          : 0;
        return (dateA - dateB) * multiplier;
      }
      case "company": {
        const companyA = jobDetails[a.jobId]?.company || "";
        const companyB = jobDetails[b.jobId]?.company || "";
        return companyA.localeCompare(companyB) * multiplier;
      }
      case "role": {
        const titleA = jobDetails[a.jobId]?.title || "";
        const titleB = jobDetails[b.jobId]?.title || "";
        return titleA.localeCompare(titleB) * multiplier;
      }
      default:
        return 0;
    }
  });

  if (resumesLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64 bg-[#1a1a1a] rounded-xl" />
          <Skeleton className="h-10 w-48 bg-[#1a1a1a] rounded-md" />
        </div>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <Skeleton className="h-[60vh] bg-[#1a1a1a] rounded-xl" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 bg-[#1a1a1a] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!primaryResume && (!resumes || resumes.length === 0)) {
    return (
      <NoResumeState onUploadClick={() => router.push("/resumes/upload")} />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <MatchesHeader
          showFilters={showFilters}
          onFiltersChange={setShowFilters}
          filtersComponent={
            <MatchFilters 
              className="border-0 shadow-none" 
              resumes={resumes}
              selectedResume={currentResumeId || null}
              onResumeChange={setInternalSelectedResume}
            />
          }
        />
        <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a] shrink-0 self-start mt-2">
          <Button
            variant="ghost"
            onClick={() => setViewMode("explore")}
            className={`px-6 py-2 rounded-lg transition-all duration-300 text-xs uppercase tracking-widest font-bold ${
              viewMode === "explore"
                ? "bg-[#f5c842] text-[#0d0d0d] shadow-[0_0_15px_rgba(245,200,66,0.2)]"
                : "text-[#a0a0a0] hover:text-[#f5f0e8] hover:bg-white/5"
            }`}
          >
            Top Matches
          </Button>
          <Button
            variant="ghost"
            onClick={() => setViewMode("saved")}
            className={`px-6 py-2 rounded-lg transition-all duration-300 text-xs uppercase tracking-widest font-bold ${
              viewMode === "saved"
                ? "bg-[#f5c842] text-[#0d0d0d] shadow-[0_0_15px_rgba(245,200,66,0.2)]"
                : "text-[#a0a0a0] hover:text-[#f5f0e8] hover:bg-white/5"
            }`}
          >
            Saved Matches
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="hidden lg:block">
          <MatchFilters 
            resumes={resumes}
            selectedResume={currentResumeId || null}
            onResumeChange={setInternalSelectedResume}
          />
        </div>

        <MatchesList
          matches={sortedMatches || []}
          jobDetails={jobDetails}
          savedJobs={savedJobs}
          isLoading={isLoading}
          onSave={fetchSavedStatus}
          resumeId={currentResumeId}
        />
      </div>
    </div>
  );
}
