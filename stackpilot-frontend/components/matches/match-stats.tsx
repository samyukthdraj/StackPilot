"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useMatchStats } from "@/lib/hooks/use-matches";
import { cn } from "@/lib/utils";

export function MatchStats() {
  const { data: stats, isLoading } = useMatchStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LordiconWrapper
              icon={animations.loading}
              size={32}
              color="#FF6B35"
              state="loop"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const getScoreColor = (type: string) => {
    switch (type) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-yellow-600 bg-yellow-100";
      case "fair":
        return "text-orange-600 bg-orange-100";
      case "poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Statistics</CardTitle>
        <CardDescription>Overview of your job matches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-navy">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Matches</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-navy">
              {stats.averageScore}%
            </p>
            <p className="text-sm text-gray-600">Average Score</p>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">
            Score Distribution
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getScoreColor("excellent"),
                )}
              >
                Excellent
              </span>
              <Progress
                value={(stats.byScore.excellent / stats.total) * 100}
                className="h-2"
              />
              <span className="text-xs text-gray-600">
                {stats.byScore.excellent}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getScoreColor("good"),
                )}
              >
                Good
              </span>
              <Progress
                value={(stats.byScore.good / stats.total) * 100}
                className="h-2"
              />
              <span className="text-xs text-gray-600">
                {stats.byScore.good}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getScoreColor("fair"),
                )}
              >
                Fair
              </span>
              <Progress
                value={(stats.byScore.fair / stats.total) * 100}
                className="h-2"
              />
              <span className="text-xs text-gray-600">
                {stats.byScore.fair}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getScoreColor("poor"),
                )}
              >
                Poor
              </span>
              <Progress
                value={(stats.byScore.poor / stats.total) * 100}
                className="h-2"
              />
              <span className="text-xs text-gray-600">
                {stats.byScore.poor}
              </span>
            </div>
          </div>
        </div>

        {/* Top Matched Skills */}
        {stats.topSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">
              Top Matched Skills
            </p>
            <div className="space-y-2">
              {stats.topSkills.map(
                (
                  item, // Removed unused index parameter
                ) => (
                  <div
                    key={item.skill}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-navy">{item.skill}</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(item.count / stats.total) * 100}
                        className="w-24 h-1"
                      />
                      <span className="text-xs text-gray-600">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Common Missing Skills */}
        {stats.commonMissingSkills.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Skills to Learn</p>
            <div className="flex flex-wrap gap-2">
              {stats.commonMissingSkills.map((item) => (
                <div
                  key={item.skill}
                  className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm flex items-center gap-1"
                >
                  <span>{item.skill}</span>
                  <span className="text-xs bg-red-200 px-1.5 rounded-full">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
