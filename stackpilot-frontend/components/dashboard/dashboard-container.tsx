"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  WelcomeSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
  GettingStarted,
  RecommendedJobs,
  type DashboardStats,
  type ActivityItem,
} from "@/components/dashboard";
import { useResumes } from "@/lib/hooks/use-resumes";
import { useMatches } from "@/lib/hooks/use-matches";

export function DashboardContainer() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resumes, primaryResume } = useResumes();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  
  const { data: matches, isLoading: matchesLoading } = useMatches(selectedResumeId || primaryResume?.id);

  // Update selected resume when primary resume is loaded
  // Use primaryId as dependency to prevent object-reference based loops
  const primaryId = primaryResume?.id;
  useEffect(() => {
    if (primaryId && !selectedResumeId) {
      setSelectedResumeId(primaryId);
    }
  }, [primaryId, selectedResumeId]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        apiClient.get<DashboardStats>("/users/dashboard-stats"),
        apiClient.get<ActivityItem[]>("/users/recent-activity"),
      ]);
      setStats(statsResponse.data);
      setActivities(activityResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setStats({
        resumeScore: 0,
        totalJobs: 0,
        matches: 0,
      });
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSelectResume = async (resumeId: string) => {
    setSelectedResumeId(resumeId);
    try {
      // Set as primary on backend
      await apiClient.patch(`/resumes/${resumeId}`, { isPrimary: true });
      // Refresh stats to reflect new primary data
      await fetchDashboardData();
    } catch (err) {
      console.error("Failed to update primary resume:", err);
    }
  };

  if (isLoading || matchesLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-full w-full rounded-xl min-h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <EmptyState
          title="Dashboard Unavailable"
          description="We're having trouble loading your dashboard data. Please check back in a few moments."
          actionLabel="Retry Now"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  // Calculate dynamic stats based on selected resume
  const currentResume = resumes.find(r => r.id === (selectedResumeId || primaryResume?.id));
  const dashboardStats: DashboardStats = {
    ...stats,
    resumeScore: currentResume?.atsScore || stats.resumeScore,
    matches: matches?.filter(m => m.score > 60).length || 0, // Match the /matches count (filtered > 60%)
  };

  return (
    <div className="space-y-8">
      <WelcomeSection 
        userName={user?.name} 
        userEmail={user?.email} 
        resumes={resumes}
        primaryResume={currentResume || null}
        onSelectResume={handleSelectResume}
      />

      <StatsGrid stats={dashboardStats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <QuickActions />
          <RecentActivity activities={activities} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <RecommendedJobs resumeId={selectedResumeId || primaryResume?.id || undefined} />
        </div>
      </div>

      <GettingStarted />
    </div>
  );
}
