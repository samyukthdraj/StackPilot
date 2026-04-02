"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Search, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck,
  TrendingUp,
  Clock,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { JobFilters } from "./job-filters";
import { useJobFiltersStore } from "@/lib/store/job-filters-store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  jobType: string;
  postedAt: string;
  jobUrl: string;
  requiredSkills: string[];
  experienceRequiredMin?: number;
  experienceRequiredMax?: number;
}

interface SavedJob {
  id: string;
  jobId: string;
  job: Job;
}

const JOBS_PER_PAGE = 15;

// Shared Sub-components for cleaner structure
const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center py-20 px-4 bg-[#1a1a1a] rounded-3xl border border-[#2a2a2a] border-dashed">
    <div className="mb-6 flex justify-center">
      <div className="w-16 h-16 rounded-full bg-[#f5c842]/5 flex items-center justify-center border border-[#f5c842]/10">
        <Search className="w-8 h-8 text-[#f5c842]/40" />
      </div>
    </div>
    <h3 className="text-xl font-bold text-[#f5f0e8]">No matches found</h3>
    <p className="mt-2 text-[#666] max-w-xs mx-auto">{message}</p>
  </div>
);

const JobCard = ({ 
  job, 
  handleSaveJob, 
  savedJobs, 
  formatDate, 
  getJobTypeLabel 
}: { 
  job: Job; 
  handleSaveJob: (id: string) => void; 
  savedJobs: Set<string>;
  formatDate: (d: string) => string;
  getJobTypeLabel: (t: string) => string;
}) => {
  const router = useRouter();
  const isSaved = savedJobs.has(job.id);

  return (
    <Card 
      className="border border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525] transition-all duration-300 group cursor-pointer"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
      onClick={() => router.push(`/jobs/${job.id}`)}
    >
      <CardHeader className="p-6 pb-2">
      <div className="flex justify-between items-start">
        <div className="space-y-1 pr-4 flex-1 overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-[#f5c842]/10 text-[#f5c842] border-[#f5c842]/20 text-[10px] uppercase font-bold tracking-tighter">
              {getJobTypeLabel(job.jobType)}
            </Badge>
            <span className="flex items-center text-[10px] text-[#a0a0a0] font-mono">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(job.postedAt)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#f5f0e8] leading-tight group-hover:text-[#f5c842] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
            {job.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-[#a0a0a0]">
            <span className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1.5 text-[#f5c842]/60" />
              {job.company}
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-[#f5c842]/60" />
              {job.location}
            </span>
            <span className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-[#f5c842]/60" />
              {job.experienceRequiredMin !== undefined && job.experienceRequiredMin !== null 
                ? `${job.experienceRequiredMin}${job.experienceRequiredMax ? `-${job.experienceRequiredMax}` : "+"} Yrs Exp`
                : "Exp Not Specified"}
            </span>
            {job.salary && (
              <span className="flex items-center text-[#f5c842] font-semibold">
                <Globe className="w-4 h-4 mr-1.5" />
                {job.salary}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveJob(job.id);
                  }}
                  className={`rounded-full h-10 w-10 border border-[#2a2a2a] ${
                    isSaved ? "text-[#f5c842] bg-[#f5c842]/10 border-[#f5c842]/30" : "text-[#a0a0a0] hover:text-[#f5f0e8] hover:bg-[#2a2a2a]"
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{isSaved ? "Remove from bookmarks" : "Save for later"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6 pt-2">
      <p className="text-sm line-clamp-3 leading-relaxed text-[#888] group-hover:text-[#a0a0a0] transition-colors">
        {job.description}
      </p>
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {job.requiredSkills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-[#0d0d0d] text-[#f5f0e8] text-[10px] font-medium border-none px-2 py-0.5">
              {skill}
            </Badge>
          ))}
          {job.requiredSkills.length > 5 && (
            <span className="text-[10px] text-[#555] font-bold self-center">+{job.requiredSkills.length - 5} MORE</span>
          )}
        </div>
      )}
    </CardContent>
    <CardFooter className="p-6 pt-0 border-t border-[#2a2a2a]/30 mt-2 flex justify-between items-center bg-[#0d0d0d]/30">
      <div className="flex items-center text-[11px] text-[#555] font-mono">
        <Globe className="w-3 h-3 mr-1" />
        JSEARCH NETWORK
      </div>
      <div className="flex gap-4 items-center mt-auto">
        <Button
          asChild
          variant="outline"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent hover:bg-white/10 border-[#2a2a2a] hover:border-[#f5c842] text-[#a0a0a0] hover:text-[#f5f0e8] transition-all duration-300 font-bold text-[11px] uppercase tracking-widest h-12 rounded-xl whitespace-nowrap px-0 overflow-hidden"
        >
          <Link href={`/jobs/${job.id}`} className="flex items-center justify-center w-full h-full px-6">
            View Details
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-[#f5c842]/30 hover:border-[#f5c842] text-[#f5c842] hover:bg-[#f5c842]/10 transition-all duration-300 font-bold text-[11px] uppercase tracking-widest h-12 rounded-xl whitespace-nowrap px-0 overflow-hidden shadow-[0_0_15px_rgba(245,200,66,0.05)] hover:shadow-[0_0_25px_rgba(245,200,66,0.2)]"
        >
          <a 
            href={job.jobUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full h-full px-6 group"
          >
            Direct Apply <ExternalLink className="ml-2 w-3.5 h-3.5 text-[#f5c842] shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
          </a>
        </Button>
      </div>
    </CardFooter>
    </Card>
  );
};

export function JobsContainer() {
  const { isAuthenticated } = useAuth();
  const { filters } = useJobFiltersStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"explore" | "saved">("explore");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [savedJobsData, setSavedJobsData] = useState<SavedJob[]>([]);
  const [itCount, setItCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);
  
  // Memoized metadata to keep filters visible
  const [memoizedLocations, setMemoizedLocations] = useState<string[]>([]);
  const [memoizedCompanies, setMemoizedCompanies] = useState<string[]>([]);
  const [memoizedJobTypes, setMemoizedJobTypes] = useState<string[]>([]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ jobs: Job[]; total: number; itCount: number; otherCount: number }>(
        "/jobs",
        {
          params: {
            limit: JOBS_PER_PAGE,
            offset: (currentPage - 1) * JOBS_PER_PAGE,
            search: filters.search || undefined,
            companies: filters.filterCompany.length > 0 ? filters.filterCompany : undefined,
            locations: filters.filterLocation.length > 0 ? filters.filterLocation : undefined,
            jobTypes: filters.jobType.length > 0 ? filters.jobType : undefined,
            salaryMin: filters.salaryMin > 0 ? filters.salaryMin : undefined,
            experienceMin: filters.experienceMin !== -1 ? filters.experienceMin : undefined,
            experienceMax: filters.experienceMax < 15 ? filters.experienceMax : undefined,
            country: filters.country || undefined,
            role: filters.role || undefined,
            days: filters.days || undefined,
          },
        },
      );
      const allJobs = response.data.jobs || [];
      setJobs(allJobs);
      setTotalPages(Math.ceil((response.data.total || 0) / JOBS_PER_PAGE));
      
      const itKeywords = ['developer', 'qa', 'sde', 'software', 'front end', 'backend', 'full stack', 'devops', 'architect', 'programmer', 'coding', 'web', 'app', 'react', 'node', 'python', 'java', 'typescript', 'javascript', 'c#', 'dotnet', 'scientist', 'computing', 'ios', 'android'];
      const excludeKeywords = ['electrical', 'instrumentation', 'civil', 'mechanical', 'structural', 'construction', 'medical', 'nursing', 'marketing', 'sales'];

      const itJobsCount = allJobs.filter((j: Job) => {
        const lowTitle = j.title.toLowerCase();
        return itKeywords.some(kw => lowTitle.includes(kw)) && !excludeKeywords.some(kw => lowTitle.includes(kw));
      }).length;

      setItCount(itJobsCount);
      setOtherCount(allJobs.length - itJobsCount);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs. Please try again later.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  const fetchSavedJobs = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await apiClient.get<{
        items: SavedJob[];
        total: number;
      }>("/jobs/saved");
      const savedIds = new Set(response.data.items.map((item) => item.jobId));
      setSavedJobs(savedIds);
      setSavedJobsData(response.data.items);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated) {
      fetchSavedJobs();
    }
  }, [fetchJobs, fetchSavedJobs, isAuthenticated]);

  const handleSaveJob = async (jobId: string) => {
    try {
      if (savedJobs.has(jobId)) {
        await apiClient.delete(`/jobs/saved/job/${jobId}`);
        setSavedJobs((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      } else {
        await apiClient.post("/jobs/saved", { jobId });
        setSavedJobs((prev) => new Set(prev).add(jobId));
      }
      fetchSavedJobs();
    } catch (err) {
      console.error("Failed to toggle save job:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getJobTypeLabel = (type: string) => {
    return type.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const { itJobs, otherJobs } = useMemo(() => {
    const itKeywords = ['developer', 'qa', 'sde', 'software', 'front end', 'backend', 'full stack', 'devops', 'architect', 'programmer', 'coding', 'web', 'app', 'react', 'node', 'python', 'java', 'typescript', 'javascript', 'c#', 'dotnet', 'scientist', 'computing', 'ios', 'android'];
    const excludeKeywords = ['electrical', 'instrumentation', 'civil', 'mechanical', 'structural', 'construction', 'medical', 'nursing', 'marketing', 'sales'];

    const it = jobs.filter(j => {
      const title = j.title?.toLowerCase() || '';
      const containsIT = itKeywords.some(kw => title.includes(kw));
      const containsExclude = excludeKeywords.some(kw => title.includes(kw));
      return containsIT && !containsExclude;
    });
    const other = jobs.filter(j => !it.some(itJob => itJob.id === j.id));
    return { itJobs: it, otherJobs: other };
  }, [jobs]);

  const locations = useMemo(() => 
    Array.from(new Set(jobs.map(j => j.location).filter(Boolean))),
    [jobs]
  );
  
  const companies = useMemo(() => 
    Array.from(new Set(jobs.map(j => j.company).filter(Boolean))),
    [jobs]
  );

  const jobTypesMetadata = useMemo(() => 
    Array.from(new Set(jobs.map(j => j.jobType).filter(Boolean))),
    [jobs]
  );

  useEffect(() => {
    const hasNoFilters = (
      filters.filterLocation.length === 0 && 
      filters.filterCompany.length === 0 && 
      filters.jobType.length === 0 &&
      !filters.search
    );
    
    if (hasNoFilters && jobs.length > 0) {
      setMemoizedLocations(locations);
      setMemoizedCompanies(companies);
      setMemoizedJobTypes(jobTypesMetadata);
    }
  }, [jobs, locations, companies, jobTypesMetadata, filters]);

  const handleQuickFilter = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>
            {viewMode === "explore" ? "Market Intelligence" : "Saved Opportunities"}
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#a0a0a0" }}>
            {viewMode === "explore" ? "Analyzing real-time roles and market trends" : "Your curated selection of high-match roles"}
          </p>
        </div>
        {isAuthenticated && (
          <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a] shadow-lg">
            <Button
              variant="ghost"
              onClick={() => setViewMode("explore")}
              className={`px-6 py-2 rounded-lg transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                viewMode === "explore" ? "bg-[#f5c842] text-[#0d0d0d]" : "text-[#888] hover:text-[#f5f0e8] hover:bg-white/5"
              }`}
            >
              Explore
            </Button>
            <Button
              variant="ghost"
              onClick={() => setViewMode("saved")}
              className={`px-6 py-2 rounded-lg transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                viewMode === "saved" ? "bg-[#f5c842] text-[#0d0d0d]" : "text-[#888] hover:text-[#f5f0e8] hover:bg-white/5"
              }`}
            >
              Saved
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <JobFilters 
            locations={memoizedLocations.length > 0 ? memoizedLocations : locations}
            companies={memoizedCompanies.length > 0 ? memoizedCompanies : companies}
            jobTypes={memoizedJobTypes.length > 0 ? memoizedJobTypes : jobTypesMetadata}
            onQuickFilter={handleQuickFilter}
            isLoading={isLoading}
          />
        </aside>

        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl text-center font-bold">
              {error}
              <Button variant="link" onClick={() => fetchJobs()} className="text-red-500 underline ml-2">Retry</Button>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-[#2a2a2a] bg-[#1a1a1a] p-6 space-y-4">
                  <Skeleton className="h-8 w-1/2 bg-[#2a2a2a]" />
                  <Skeleton className="h-4 w-3/4 bg-[#2a2a2a]" />
                  <Skeleton className="h-20 w-full bg-[#2a2a2a]" />
                </Card>
              ))}
            </div>
          ) : viewMode === "explore" ? (
            <Tabs defaultValue="it" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <TabsList className="bg-transparent border-none p-0 h-auto gap-4">
                  <TabsTrigger 
                    value="it" 
                    className="rounded-xl px-6 py-3 data-[state=active]:bg-[#f5c842] data-[state=active]:text-[#0d0d0d] bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] transition-all"
                  >
                    Tech Hub <Badge className="ml-2 bg-black/20 text-inherit border-none">{itCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="other" 
                    className="rounded-xl px-6 py-3 data-[state=active]:bg-[#f5c842] data-[state=active]:text-[#0d0d0d] bg-[#1a1a1a] text-[#888] border border-[#2a2a2a] transition-all"
                  >
                    General Market <Badge className="ml-2 bg-black/20 text-inherit border-none">{otherCount}</Badge>
                  </TabsTrigger>
                </TabsList>

                {totalPages > 1 && (
                  <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-[#2a2a2a]">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="text-[#888] hover:text-[#f5f0e8] hover:bg-white/5"
                    >
                      Prev
                    </Button>
                    <div className="px-4 flex items-center text-[10px] font-bold text-[#f5c842] uppercase tracking-widest border-x border-[#2a2a2a]">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="text-[#888] hover:text-[#f5f0e8] hover:bg-white/5"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>

              <TabsContent value="it" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {itJobs.map((job) => (
                  <JobCard key={job.id} job={job} handleSaveJob={handleSaveJob} savedJobs={savedJobs} formatDate={formatDate} getJobTypeLabel={getJobTypeLabel} />
                ))}
                {itJobs.length === 0 && <EmptyState message="No developer or CS roles found on this page." />}
              </TabsContent>

              <TabsContent value="other" className="space-y-4 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {otherJobs.map((job) => (
                  <JobCard key={job.id} job={job} handleSaveJob={handleSaveJob} savedJobs={savedJobs} formatDate={formatDate} getJobTypeLabel={getJobTypeLabel} />
                ))}
                {otherJobs.length === 0 && <EmptyState message="No general market roles found on this page." />}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {savedJobsData.map((item) => (
                <JobCard key={item.id} job={item.job} handleSaveJob={handleSaveJob} savedJobs={savedJobs} formatDate={formatDate} getJobTypeLabel={getJobTypeLabel} />
              ))}
              {savedJobsData.length === 0 && (
                <div className="text-center py-32 px-4 bg-[#1a1a1a] rounded-3xl border border-[#2a2a2a] border-dashed">
                  <Bookmark className="w-16 h-16 text-[#2a2a2a] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#f5f0e8]">No saved bookmarks</h3>
                  <p className="mt-2 text-[#666] max-w-sm mx-auto">Explore the Market Intelligence hub to start curating your professional growth.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
