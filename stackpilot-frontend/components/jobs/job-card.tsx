"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { Job, JobMatch } from "@/lib/types/api";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";

interface JobCardProps {
  job: Job;
  match?: JobMatch;
  onSave?: () => void;
  isSaved?: boolean;
  className?: string;
}

export function JobCard({
  job,
  match,
  onSave,
  isSaved,
  className,
}: JobCardProps) {
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save jobs",
      });
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await apiClient.delete(`/jobs/saved/${job.id}`);
        toast({
          title: "Job removed",
          description: "Job removed from saved list",
        });
      } else {
        await apiClient.post(`/jobs/saved/${job.id}`, {});
        toast({
          title: "Job saved",
          description: "Job added to your saved list",
        });
      }
      onSave?.();
    } catch {
      // Removed unused error parameter
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <Link href={`/jobs/${job.id}`}>
      <Card
        className={cn(
          "group card-hover overflow-hidden relative",
          "border-2 border-gray-200 hover:border-orange-500/50",
          "bg-white hover:bg-linear-to-br hover:from-white hover:to-orange-50/30",
          className,
        )}
      >
        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-navy group-hover:text-orange-500 transition-all duration-300 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>

            {/* Save Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={saving}
              className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 hover:scale-110"
            >
              <LordiconWrapper
                icon={isSaved ? animations.heartFilled : animations.heart}
                size={24}
                color={isSaved ? "#FF6B35" : "#94A3B8"}
                state={isSaved ? "loop" : "hover"}
              />
            </Button>
          </div>

          {/* Match Score */}
          {match && (
            <div className="mb-5">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm",
                  "transition-all duration-300 hover:scale-105",
                  getMatchColor(match.score),
                )}
              >
                <span className="text-sm font-bold">{match.score}% Match</span>
                <LordiconWrapper
                  icon={animations.flash}
                  size={18}
                  color={
                    match.score >= 80
                      ? "#10B981"
                      : match.score >= 60
                        ? "#F59E0B"
                        : "#EF4444"
                  }
                  state="loop"
                />
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {/* Location */}
            {job.location && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 group/item">
                <div className="transition-transform duration-300 group-hover/item:scale-110">
                  <LordiconWrapper
                    icon={animations.location}
                    size={20}
                    color="#FF6B35"
                    state="morph"
                  />
                </div>
                <span className="truncate font-medium">{job.location}</span>
              </div>
            )}

            {/* Salary */}
            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 group/item">
                <div className="transition-transform duration-300 group-hover/item:scale-110">
                  <LordiconWrapper
                    icon={animations.salary}
                    size={20}
                    color="#10B981"
                    state="morph"
                  />
                </div>
                <span className="font-semibold">
                  ${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax.toLocaleString()}
                </span>
              </div>
            )}

            {/* Job Type */}
            {job.jobType && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 group/item">
                <div className="transition-transform duration-300 group-hover/item:scale-110">
                  <LordiconWrapper
                    icon={animations.clock}
                    size={20}
                    color="#3B82F6"
                    state="morph"
                  />
                </div>
                <span className="capitalize font-medium">
                  {job.jobType.replace("_", " ")}
                </span>
              </div>
            )}

            {/* Posted Date */}
            {job.postedAt && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 group/item">
                <div className="transition-transform duration-300 group-hover/item:scale-110">
                  <LordiconWrapper
                    icon={animations.calendar}
                    size={20}
                    color="#F59E0B"
                    state="morph"
                  />
                </div>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(job.postedAt))} ago
                </span>
              </div>
            )}
          </div>

          {/* Skills Preview */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.slice(0, 5).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={cn(
                      "text-xs font-medium px-3 py-1 transition-all duration-300 hover:scale-105",
                      match?.matchedSkills?.includes(skill)
                        ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200 shadow-sm"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
                    )}
                  >
                    {skill}
                  </Badge>
                ))}
                {job.requiredSkills.length > 5 && (
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium px-3 py-1 bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200 transition-all duration-300 hover:scale-105"
                  >
                    +{job.requiredSkills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 bg-linear-to-r from-gray-50 to-orange-50/30 border-t border-gray-200 group-hover:from-orange-50/50 group-hover:to-orange-100/50 transition-all duration-300">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-500 font-medium">
              {job.source && `via ${job.source}`}
            </span>
            <span className="text-sm text-orange-500 font-bold group-hover:text-orange-600 flex items-center gap-1 transition-all duration-300 group-hover:gap-2">
              View Details
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
