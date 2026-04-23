import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BsBuilding, BsGeoAlt, BsClockHistory, BsArrowRight } from "react-icons/bs";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useMatches } from "@/lib/hooks/use-matches";
import { apiClient } from "@/lib/api/client";
import { Job } from "@/lib/types/api";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

interface RecommendedJobsProps {
  resumeId?: string;
}

export function RecommendedJobs({ resumeId }: RecommendedJobsProps) {
  const router = useRouter();
  const { data: matches, isLoading: matchesLoading } = useMatches(resumeId);
  const [jobDetails, setJobDetails] = useState<Record<string, Job>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!matches) {
      setIsLoading(matchesLoading);
      return;
    }

    const fetchDetails = async () => {
      const validMatches = matches.filter(m => m.score > 60);
      const topMatches = validMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const details: Record<string, Job> = {};
      try {
        await Promise.all(
          topMatches.map(async (match) => {
            try {
              const res = await apiClient.get<Job>(`/jobs/${match.jobId}`);
              details[match.jobId] = res.data;
            } catch (err) {
              console.error("Error fetching job:", err);
            }
          })
        );
        setJobDetails(details);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [matches, matchesLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>
            Top Matches for You
          </h2>
          <p className="text-sm mt-1" style={{ color: "#a0a0a0" }}>
            Based on your primary resume and profile settings
          </p>
        </div>
        <Link href="/matches">
          <Button variant="ghost" className="hidden md:flex items-center gap-2 group transition-all">
            View all matches 
            <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {isLoading || matchesLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[280px] w-full rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="h-10 w-full rounded-md mt-4" />
            </div>
          ))}
        </div>
      ) : matches && matches.filter(m => m.score > 60).length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {matches
            .filter(m => m.score > 60)
            .sort((a, b) => b.score - a.score)
            .slice(0, 6)
            .map((match) => {
              const job = jobDetails[match.jobId];
              if (!job) return null;
              
              return (
                <Card 
                  key={match.jobId} 
                  className="border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                  style={{ 
                    backgroundColor: "#1a1a1a", 
                    borderColor: "#2a2a2a",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                  }}
                >
                    <CardHeader className="pb-3">
                      <TooltipProvider>
                        <div className="flex justify-between items-start mb-2">
                          <Badge 
                            className="bg-[#f5c842] text-[#0d0d0d] font-bold shadow-[0_0_10px_rgba(245,200,66,0.3)] border-none"
                          >
                            {match.score}% Match
                          </Badge>
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                            style={{ backgroundColor: "#0d0d0d", color: "#f5c842", border: "1px solid #2a2a2a" }}
                          >
                            {job.company?.[0] || "C"}
                          </div>
                        </div>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CardTitle className="text-lg line-clamp-1 cursor-help" style={{ color: "#f5f0e8" }}>
                              {job.title}
                            </CardTitle>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {job.title}
                          </TooltipContent>
                        </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardDescription className="line-clamp-1 cursor-help" style={{ color: "#f5c842" }}>
                            {job.company}
                          </CardDescription>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="border-[#f5c842]/30">
                          {job.company}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {job.location && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#a0a0a0" }}>
                          <BsGeoAlt className="shrink-0" />
                          <span className="line-clamp-1">{job.location}</span>
                        </div>
                      )}
                      {job.jobType && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#a0a0a0" }}>
                          <BsBuilding className="shrink-0" />
                          <span className="capitalize">{job.jobType.replace('_', ' ')}</span>
                        </div>
                      )}
                      {!!(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#a0a0a0" }}>
                          <BsClockHistory className="shrink-0" />
                          <span>
                            ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-[#f5c842]">
                         <LordiconWrapper 
                            icon={animations.match} 
                            size={14} 
                            color="#f5c842" 
                            state="hover"
                          />
                         <span className="font-bold uppercase text-xs tracking-wider">
                            {job.experienceRequiredMin !== undefined && job.experienceRequiredMin !== null ? (
                               job.experienceRequiredMin === 0 && !job.experienceRequiredMax ? (
                                   "No Experience Required"
                               ) : (
                                   `${job.experienceRequiredMin}${job.experienceRequiredMax ? `-${job.experienceRequiredMax}` : "+"} Yrs Exp`
                               )
                            ) : "Experience Not Specified"}
                         </span>
                      </div>
                    </div>
                    
                    <Link href={`/jobs/${job.id}`}>
                      <Button 
                        variant="outline" 
                        className="w-full border transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                        style={{ 
                          backgroundColor: "#f5c842", 
                          borderColor: "#f5c842", 
                          color: "#0d0d0d",
                          fontWeight: "semibold"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#d4a832";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5c842";
                        }}
                      >
                        View Job & Apply
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
          })}
        </div>
      ) : (
        <EmptyState
          title="No High-Quality Matches"
          description="We couldn't find any roles matching more than 60% of your profile. Try optimizing your resume or exploring all jobs."
          actionLabel="Optimize Resume"
          onAction={() => router.push("/resumes")}
          icon={animations.search}
        />
      )}
    </div>
  );
}
