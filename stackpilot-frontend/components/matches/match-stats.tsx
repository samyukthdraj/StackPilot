"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useMatchStats } from "@/lib/hooks/use-matches";
import { cn } from "@/lib/utils";

interface MatchStatsProps {
  resumeId?: string;
}

export function MatchStats({ resumeId }: MatchStatsProps) {
  const { data: stats, isLoading } = useMatchStats(resumeId);

  if (isLoading) {
    return (
      <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
        <CardHeader>
          <CardTitle className="text-[#f5f0e8] font-playfair">Match Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const getScoreColor = (type: string) => {
    switch (type) {
      case "excellent":
        return "text-[#f5f0e8] bg-[#f5c842]/20 border-[#f5c842]/30";
      case "good":
        return "text-[#f5f0e8] bg-blue-500/20 border-blue-500/30";
      case "fair":
        return "text-[#f5f0e8] bg-orange-500/20 border-orange-500/30";
      case "poor":
        return "text-[#f5f0e8] bg-red-500/20 border-red-500/30";
      default:
        return "text-gray-400 bg-gray-800/50 border-gray-700";
    }
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#2a2a2a] shadow-2xl">
      <CardHeader>
        <CardTitle className="text-[#f5f0e8] font-playfair text-2xl">Match Analytics</CardTitle>
        <CardDescription className="text-[#a0a0a0]">Real-time performance across your job search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-6 bg-[#0d0d0d] rounded-xl border border-[#2a2a2a] group hover:border-[#f5c842]/40 transition-colors">
            <p className="text-4xl font-bold text-[#f5c842] mb-1">{stats.total}</p>
            <p className="text-xs uppercase tracking-widest text-[#666] font-semibold">Quality Matches</p>
          </div>
          <div className="text-center p-6 bg-[#0d0d0d] rounded-xl border border-[#2a2a2a] group hover:border-[#f5c842]/40 transition-colors">
            <p className="text-4xl font-bold text-[#f5c842] mb-1">{stats.averageScore}%</p>
            <p className="text-xs uppercase tracking-widest text-[#666] font-semibold">Avg. Quality Match</p>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest">Full Score Distribution</p>

          <div className="space-y-4">
            {/* Excellent Row */}
            <div className="flex items-center gap-4 group">
              <div className={cn(
                "w-24 text-center text-[10px] uppercase font-bold py-1.5 rounded-md border",
                getScoreColor("excellent")
              )}>
                Excellent
              </div>
              <div className="flex-1">
                <Progress
                  value={stats.allTotal > 0 ? (stats.byScore.excellent / stats.allTotal) * 100 : 0}
                  className="h-2 bg-[#0d0d0d]"
                />
              </div>
              <div className="w-8 text-right text-sm font-mono text-[#f5f0e8]">
                {stats.byScore.excellent}
              </div>
            </div>

            {/* Good Row */}
            <div className="flex items-center gap-4 group">
              <div className={cn(
                "w-24 text-center text-[10px] uppercase font-bold py-1.5 rounded-md border",
                getScoreColor("good")
              )}>
                Good
              </div>
              <div className="flex-1">
                <Progress
                  value={stats.allTotal > 0 ? (stats.byScore.good / stats.allTotal) * 100 : 0}
                  className="h-2 bg-[#0d0d0d]"
                />
              </div>
              <div className="w-8 text-right text-sm font-mono text-[#f5f0e8]">
                {stats.byScore.good}
              </div>
            </div>

            {/* Fair Row */}
            <div className="flex items-center gap-4 group">
              <div className={cn(
                "w-24 text-center text-[10px] uppercase font-bold py-1.5 rounded-md border",
                getScoreColor("fair")
              )}>
                Fair
              </div>
              <div className="flex-1">
                <Progress
                  value={stats.allTotal > 0 ? (stats.byScore.fair / stats.allTotal) * 100 : 0}
                  className="h-2 bg-[#0d0d0d]"
                />
              </div>
              <div className="w-8 text-right text-sm font-mono text-[#f5f0e8]">
                {stats.byScore.fair}
              </div>
            </div>

            {/* Poor Row */}
            <div className="flex items-center gap-4 group">
              <div className={cn(
                "w-24 text-center text-[10px] uppercase font-bold py-1.5 rounded-md border",
                getScoreColor("poor")
              )}>
                Poor
              </div>
              <div className="flex-1">
                <Progress
                  value={stats.allTotal > 0 ? (stats.byScore.poor / stats.allTotal) * 100 : 0}
                  className="h-2 bg-[#0d0d0d]"
                />
              </div>
              <div className="w-8 text-right text-sm font-mono text-[#f5f0e8]">
                {stats.byScore.poor}
              </div>
            </div>
          </div>
        </div>

        {/* Top Matched Skills - Vertical List with aligned counts */}
        {stats.topSkills.length > 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest">Top Profile Strengths</p>
            <div className="space-y-3">
              {stats.topSkills.slice(0, 8).map((item) => (
                <div key={item.skill} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f5c842]" />
                    <span className="text-sm text-[#f5f0e8] group-hover:text-[#f5c842] transition-colors">{item.skill}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#666] bg-[#0d0d0d] px-2 py-0.5 rounded border border-[#2a2a2a]">
                    {item.count} MATCHES
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Missing Skills */}
        {stats.commonMissingSkills.length > 0 && (
          <div className="space-y-4 pt-2">
            <p className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest">Skill Gaps to Close</p>
            <div className="flex flex-wrap gap-2">
              {stats.commonMissingSkills.slice(0, 10).map((item) => (
                <div
                  key={item.skill}
                  className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs flex items-center gap-2 hover:bg-red-500/20 transition-all cursor-default"
                >
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-[9px] bg-red-500/20 px-1.5 py-0.5 rounded-full">
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
