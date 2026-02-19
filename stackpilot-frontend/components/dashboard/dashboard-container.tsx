"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import {
  WelcomeSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
  GettingStarted,
  type DashboardStats,
  type ActivityItem,
} from "@/components/dashboard";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

export function DashboardContainer() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        // Set default values on error
        setStats({
          resumeScore: 0,
          totalJobs: 0,
          matches: 0,
          applications: 0,
        });
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LordiconWrapper
          icon={animations.loading}
          size={64}
          color="#FF6B35"
          state="loop"
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WelcomeSection userName={user?.name} userEmail={user?.email} />

      <StatsGrid stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <RecentActivity activities={activities} />
      </div>

      <GettingStarted />
    </div>
  );
}
