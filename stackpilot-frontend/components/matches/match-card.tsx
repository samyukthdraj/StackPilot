"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed unused Progress import
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { JobMatch, Job } from "@/lib/types/api"; // Added Job type
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";

interface MatchCardProps {
  match: JobMatch;
  job: Job; // Changed from any to Job type
  onSave?: () => void;
  isSaved?: boolean;
  className?: string;
}

export function MatchCard({
  match,
  job,
  onSave,
  isSaved,
  className,
}: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Removed unused getScoreBg function

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      // Removed unused error variable
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className={cn("group hover:shadow-lg transition-all", className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link href={`/jobs/${job?.id}`} className="hover:underline">
              <h3 className="text-lg font-semibold text-navy group-hover:text-orange-500 transition-colors">
                {job?.title || "Loading..."}
              </h3>
            </Link>
            <p className="text-gray-600 mt-1">{job?.company}</p>
          </div>

          {/* Score Circle */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-gray-200 stroke-current"
                strokeWidth="8"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className={cn(
                  "stroke-current transition-all duration-1000",
                  match.score >= 80
                    ? "text-green-500"
                    : match.score >= 60
                      ? "text-yellow-500"
                      : match.score >= 40
                        ? "text-orange-500"
                        : "text-red-500",
                )}
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - match.score / 100)}`}
                transform="rotate(-90 50 50)"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dy="0.3em"
                className="text-lg font-bold fill-navy"
              >
                {match.score}
              </text>
            </svg>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Skill Match</p>
            <p
              className={cn(
                "text-lg font-semibold",
                getScoreColor(match.breakdown.skillMatch),
              )}
            >
              {match.breakdown.skillMatch}%
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Keyword</p>
            <p
              className={cn(
                "text-lg font-semibold",
                getScoreColor(match.breakdown.keywordScore),
              )}
            >
              {match.breakdown.keywordScore}%
            </p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Experience</p>
            <p
              className={cn(
                "text-lg font-semibold",
                getScoreColor(match.breakdown.experienceScore),
              )}
            >
              {match.breakdown.experienceScore}%
            </p>
          </div>
        </div>

        {/* Skills Preview */}
        <div className="space-y-3">
          {/* Matched Skills */}
          {match.matchedSkills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-green-600 mb-2 flex items-center gap-1">
                <LordiconWrapper
                  icon={animations.check}
                  size={14}
                  color="#10B981"
                  state="loop"
                />
                Matched Skills ({match.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {match.matchedSkills
                  .slice(0, expanded ? undefined : 3)
                  .map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-green-50 text-green-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                {!expanded && match.matchedSkills.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 cursor-pointer"
                    onClick={() => setExpanded(true)}
                  >
                    +{match.matchedSkills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {match.missingSkills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                <LordiconWrapper
                  icon={animations.close}
                  size={14}
                  color="#EF4444"
                  state="loop"
                />
                Missing Skills ({match.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {match.missingSkills
                  .slice(0, expanded ? undefined : 3)
                  .map((skill, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-red-50 text-red-700"
                    >
                      {skill}
                    </Badge>
                  ))}
                {!expanded && match.missingSkills.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 cursor-pointer"
                    onClick={() => setExpanded(true)}
                  >
                    +{match.missingSkills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Link href={`/jobs/${job?.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSave}
            disabled={saving}
            className={cn(isSaved && "text-orange-500 border-orange-500")}
          >
            <LordiconWrapper
              icon={isSaved ? animations.heartFilled : animations.heart}
              size={20}
              color={isSaved ? "#FF6B35" : "#0A1929"}
              state="hover"
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
