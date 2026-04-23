"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useResumes, useUpdatePrimaryResume } from "@/lib/hooks/use-resumes";
import { WelcomeSection } from "./welcome-section";
import { StatsGrid } from "./stats-grid";
import { QuickActions } from "./quick-actions";
import { RecommendedJobs } from "./recommended-jobs";
import { RecentActivity } from "./recent-activity";
import { GettingStarted } from "./getting-started";
import { useProfileStats } from "@/lib/hooks/use-profile";
import { useUsage } from "@/lib/hooks/use-usage";
import { ResumeUploadBanner } from "./resume-upload-banner";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export function DashboardContainer() {
  const { user, isLoading: userLoading } = useAuth();
  const { data: resumes, isLoading: resumesLoading } = useResumes();
  const updatePrimaryMutation = useUpdatePrimaryResume();

  const { data: profileStats, isLoading: statsLoading } = useProfileStats();
  const { data: usage, isLoading: usageLoading } = useUsage();

  const primaryResume = useMemo(() => {
    if (!resumes) return null;
    return resumes.find((r) => r.isPrimary) || resumes[0] || null;
  }, [resumes]);

  const handleSelectResume = (resumeId: string) => {
    updatePrimaryMutation.mutate(resumeId);
  };

  const isLoading = userLoading || resumesLoading || statsLoading || usageLoading;

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64 bg-[#1a1a1a]" />
            <Skeleton className="h-6 w-96 bg-[#1a1a1a]" />
          </div>
          <Skeleton className="h-12 w-48 bg-[#1a1a1a]" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-[#1a1a1a] rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] bg-[#1a1a1a] rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[200px] bg-[#1a1a1a] rounded-xl" />
            <Skeleton className="h-[200px] bg-[#1a1a1a] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = {
    resumeScore: primaryResume?.atsScore || 0,
    totalJobs: profileStats?.savedJobs || 0,
    matches: profileStats?.savedMatches || 0,
    geminiUsage: usage?.resumeScans,
    globalJSearch: usage?.globalJSearch,
    adzunaQuota: usage?.adzunaQuota || null,
  };

  return (
    <div className="space-y-10">
      {resumes && resumes.length === 0 && <ResumeUploadBanner />}

      <WelcomeSection
        userName={user?.name}
        userEmail={user?.email}
        resumes={resumes || []}
        primaryResume={primaryResume}
        onSelectResume={handleSelectResume}
      />

      <StatsGrid stats={dashboardStats} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <RecommendedJobs resumeId={primaryResume?.id} />
          <GettingStarted />
        </div>

        <div className="space-y-10">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
