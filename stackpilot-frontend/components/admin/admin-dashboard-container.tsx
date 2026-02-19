"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import {
  useAdminStats,
  useSyncJobs,
  useCleanupJobs,
} from "@/lib/hooks/use-admin";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COLORS = ["#FF6B35", "#0A1929", "#10B981", "#F59E0B", "#8B5CF6"];

export function AdminDashboardContainer() {
  const { data: stats, isLoading } = useAdminStats();
  const syncJobs = useSyncJobs();
  const cleanupJobs = useCleanupJobs();
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [cleanupDays, setCleanupDays] = useState(30);
  const { user } = useAuth();

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

  if (!stats) return null;

  const userPlanData = [
    { name: "Free", value: stats.users.byPlan.free },
    { name: "Pro", value: stats.users.byPlan.pro },
    { name: "Enterprise", value: stats.users.byPlan.enterprise },
  ];

  const jobsByCountryData = Object.entries(stats.jobs.byCountry).map(
    ([country, count]) => ({
      name: country.toUpperCase(),
      value: count,
    }),
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {format(new Date(stats.timestamp), "PPpp")}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <LordiconWrapper
              icon={animations.users}
              size={24}
              color="#FF6B35"
              state="loop"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {stats.users.total}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.users.activeToday} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Jobs
            </CardTitle>
            <LordiconWrapper
              icon={animations.job}
              size={24}
              color="#FF6B35"
              state="loop"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {stats.jobs.total}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              +{stats.jobs.addedToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Scans
            </CardTitle>
            <LordiconWrapper
              icon={animations.scan}
              size={24}
              color="#FF6B35"
              state="loop"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {stats.usage.totalScans}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Avg {stats.usage.averageScansPerUser} per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue (MRR)
            </CardTitle>
            <LordiconWrapper
              icon={animations.revenue}
              size={24}
              color="#FF6B35"
              state="loop"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              ${stats.revenue.monthly.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.revenue.activeSubscriptions} active subs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userPlanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userPlanData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jobs by Country</CardTitle>
            <CardDescription>
              Distribution of jobs across countries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobsByCountryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent ? `${name} ${(percent * 100).toFixed(0)}%` : name
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobsByCountryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Manage jobs and system operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-navy">Sync Jobs</h4>
              <p className="text-sm text-gray-600">
                Manually trigger job sync from Adzuna
              </p>
            </div>
            <Button
              onClick={() => syncJobs.mutate()}
              disabled={syncJobs.isPending}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {syncJobs.isPending ? (
                <div className="flex items-center gap-2">
                  <LordiconWrapper
                    icon={animations.loading}
                    size={20}
                    color="#FFFFFF"
                    state="loop"
                  />
                  <span>Syncing...</span>
                </div>
              ) : (
                "Sync Now"
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-navy">Cleanup Old Jobs</h4>
              <p className="text-sm text-gray-600">
                Remove jobs older than specified days
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCleanupDialog(true)}
            >
              Cleanup
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cleanup Old Jobs</DialogTitle>
            <DialogDescription>
              Remove jobs older than the specified number of days.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="days">Days to keep</Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="365"
              value={cleanupDays}
              onChange={(e) => setCleanupDays(parseInt(e.target.value))}
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCleanupDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                cleanupJobs.mutate(cleanupDays);
                setShowCleanupDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Cleanup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
