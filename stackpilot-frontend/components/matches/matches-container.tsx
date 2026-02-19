"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MatchFilters } from "@/components/matches/match-filters";
import { MatchesHeader } from "@/components/matches/matches-header";
import { MatchesList } from "@/components/matches/matches-list";
import { NoResumeState } from "@/components/matches/no-resume-state";
import { useMatches } from "@/lib/hooks/use-matches";
import { useResumes } from "@/lib/hooks/use-resumes";
import { useMatchesStore } from "@/lib/store/matches-store";
import { apiClient } from "@/lib/api/client";
import { Job, SavedJob } from "@/lib/types/api";

export function MatchesContainer() {
  const router = useRouter();
  const { resumes, primaryResume } = useResumes();
  const [selectedResume, setSelectedResume] = useState<string | null>(
    primaryResume?.id || null,
  );
  const { filters } = useMatchesStore();
  const { data: matches, isLoading } = useMatches(
    selectedResume || primaryResume?.id,
  );
  const [jobDetails, setJobDetails] = useState<Record<string, Job>>({});
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const hasFetchedDetails = useRef(false);
  const hasFetchedSaved = useRef(false);

  const fetchJobDetails = useCallback(async () => {
    if (!matches || hasFetchedDetails.current) return;

    hasFetchedDetails.current = true;
    const details: Record<string, Job> = {};

    try {
      await Promise.all(
        matches.map(async (match) => {
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
      hasFetchedDetails.current = false;
    }
  }, [matches]);

  const fetchSavedStatus = useCallback(async () => {
    if (!matches || hasFetchedSaved.current) return;

    hasFetchedSaved.current = true;
    try {
      const response = await apiClient.get<{ items: SavedJob[] }>(
        "/jobs/saved",
      );
      const saved = new Set(response.data.items.map((item) => item.jobId));
      setSavedJobs(saved);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      hasFetchedSaved.current = false;
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
    if (match.score < filters.minScore) return false;
    if (match.score > filters.maxScore) return false;
    return true;
  });

  const sortedMatches = filteredMatches?.sort((a, b) => {
    const multiplier = filters.sortOrder === "asc" ? 1 : -1;

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
      default:
        return 0;
    }
  });

  if (!primaryResume && (!resumes || resumes.length === 0)) {
    return (
      <NoResumeState onUploadClick={() => router.push("/resumes/upload")} />
    );
  }

  return (
    <div className="space-y-8">
      <MatchesHeader
        resumes={resumes}
        selectedResume={selectedResume}
        primaryResumeId={primaryResume?.id}
        showFilters={showFilters}
        onResumeChange={setSelectedResume}
        onFiltersChange={setShowFilters}
        filtersComponent={<MatchFilters className="border-0 shadow-none" />}
      />

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="hidden lg:block">
          <MatchFilters />
        </div>

        <MatchesList
          matches={sortedMatches || []}
          jobDetails={jobDetails}
          savedJobs={savedJobs}
          isLoading={isLoading}
          onSave={fetchSavedStatus}
        />
      </div>
    </div>
  );
}
