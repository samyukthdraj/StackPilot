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
          "group hover:shadow-lg transition-all hover:border-orange-500/50 hover:-translate-y-1",
          className,
        )}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-navy group-hover:text-orange-500 transition-colors">
                {job.title}
              </h3>
              <p className="text-gray-600 mt-1">{job.company}</p>
            </div>

            {/* Save Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={saving}
              className="text-gray-400 hover:text-orange-500"
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
            <div className="mb-4">
              <div
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full border",
                  getMatchColor(match.score),
                )}
              >
                <span className="text-sm font-semibold">
                  {match.score}% Match
                </span>
                <LordiconWrapper
                  icon={animations.flash}
                  size={16}
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
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Location */}
            {job.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LordiconWrapper
                  icon={animations.location}
                  size={18}
                  color="#64748B"
                  state="morph"
                />
                <span className="truncate">{job.location}</span>
              </div>
            )}

            {/* Salary */}
            {job.salaryMin && job.salaryMax && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LordiconWrapper
                  icon={animations.salary}
                  size={18}
                  color="#64748B"
                  state="morph"
                />
                <span>
                  ${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax.toLocaleString()}
                </span>
              </div>
            )}

            {/* Job Type */}
            {job.jobType && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LordiconWrapper
                  icon={animations.clock}
                  size={18}
                  color="#64748B"
                  state="morph"
                />
                <span className="capitalize">
                  {job.jobType.replace("_", " ")}
                </span>
              </div>
            )}

            {/* Posted Date */}
            {job.postedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LordiconWrapper
                  icon={animations.calendar}
                  size={18}
                  color="#64748B"
                  state="morph"
                />
                <span>{formatDistanceToNow(new Date(job.postedAt))} ago</span>
              </div>
            )}
          </div>

          {/* Skills Preview */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 5).map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      match?.matchedSkills?.includes(skill) &&
                        "bg-green-100 text-green-700 border-green-200",
                    )}
                  >
                    {skill}
                  </Badge>
                ))}
                {job.requiredSkills.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{job.requiredSkills.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-gray-500">
              {job.source && `via ${job.source}`}
            </span>
            <span className="text-sm text-orange-500 font-medium group-hover:underline">
              View Details →
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
