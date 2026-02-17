"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import {
  WelcomeSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
  GettingStarted,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data for demonstration
  const stats = {
    resumeScore: 85,
    totalJobs: 24,
    matches: 12,
    applications: 5,
  };

  return (
    <div className="space-y-8">
      <WelcomeSection userName={user?.name} userEmail={user?.email} />

      <StatsGrid stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>

      <GettingStarted />
    </div>
  );
}
