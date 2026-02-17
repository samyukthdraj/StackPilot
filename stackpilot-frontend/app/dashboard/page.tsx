"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { FileText, Briefcase, Target, TrendingUp } from "lucide-react";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

interface DashboardStats {
  resumeScore: number;
  totalMatches: number;
  totalJobs: number;
  applications: number;
  savedJobs: number;
}

interface Activity {
  type: string;
  message: string;
  timestamp: string;
  color: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          apiClient.get<DashboardStats>("/users/dashboard-stats"),
          apiClient.get<Activity[]>("/users/recent-activity"),
        ]);
        setStats(statsResponse.data);
        setActivities(activityResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set default values on error
        setStats({
          resumeScore: 0,
          totalMatches: 0,
          totalJobs: 0,
          applications: 0,
          savedJobs: 0,
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
      <div className="flex items-center justify-center min-h-[400px]">
        <LordiconWrapper
          icon={animations.loading}
          size={64}
          color="#FF6B35"
          state="loop"
        />
      </div>
    );
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.email?.split("@")[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s what&apos;s happening with your job search today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Resume Score
            </CardTitle>
            <FileText className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.resumeScore || 0}%
            </div>
            <Progress value={stats?.resumeScore || 0} className="mt-2" />
            <p className="text-xs text-gray-500 mt-2">
              {stats?.resumeScore === 0
                ? "Upload a resume to get scored"
                : "ATS Optimized"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Job Matches
            </CardTitle>
            <Target className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalMatches || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">Based on your profile</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Jobs
            </CardTitle>
            <Briefcase className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.totalJobs || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">Available positions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Applications
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats?.applications || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your job search</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/resumes">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
            </Link>
            <Link href="/jobs">
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/matches">
              <Button className="w-full justify-start" variant="outline">
                <Target className="mr-2 h-4 w-4" />
                View Matches
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest job search updates</CardDescription>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  No recent activity yet. Start by uploading a resume!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}
                      style={{
                        backgroundColor:
                          activity.color === "orange"
                            ? "#FF6B35"
                            : activity.color === "blue"
                              ? "#3B82F6"
                              : activity.color === "green"
                                ? "#10B981"
                                : "#A855F7",
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {stats?.resumeScore === 0 && (
        <Card className="bg-linear-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-900">
              Get the most out of StackPilot
            </CardTitle>
            <CardDescription className="text-orange-700">
              Follow these steps to optimize your job search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  Upload your resume and get an ATS score
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  Browse jobs that match your skills
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  Apply with confidence using AI-powered insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
