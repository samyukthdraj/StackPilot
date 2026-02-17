"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import {
  useAdminJobStats,
  useSyncJobs,
  useCleanupJobs,
} from "@/lib/hooks/use-admin";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#FF6B35",
  "#0A1929",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

export default function AdminJobsPage() {
  const { data: stats, isLoading } = useAdminJobStats();
  const syncJobs = useSyncJobs();
  const cleanupJobs = useCleanupJobs();

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

  const jobsByCountryData = Object.entries(stats.byCountry).map(
    ([country, count]) => ({
      name: country.toUpperCase(),
      value: count,
    }),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy">Job Management</h1>
        <p className="text-gray-600 mt-2">Monitor and manage job listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <div className="text-3xl font-bold text-navy">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Recent Jobs (7d)
            </CardTitle>
            <LordiconWrapper
              icon={animations.calendar}
              size={24}
              color="#FF6B35"
              state="loop"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">
              {stats.recent.count}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Added in last {stats.recent.days} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Countries
            </CardTitle>
            <LordiconWrapper
              icon={animations.globe}
              size={24}
              color="#FF6B35"
              state="loop"
            />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">
              {Object.keys(stats.byCountry).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Active job markets</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Jobs by Country */}
        <Card>
          <CardHeader>
            <CardTitle>Jobs by Country</CardTitle>
            <CardDescription>
              Distribution of jobs across countries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
                    {jobsByCountryData.map((entry, index) => (
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

        {/* Top Countries Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Countries with most job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={jobsByCountryData.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF6B35" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Job Sources</CardTitle>
          <CardDescription>Distribution of jobs by source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className="bg-orange-100 text-orange-700">Adzuna</Badge>
              <Progress value={100} className="flex-1 h-2" />
              <span className="text-sm font-medium text-navy">
                {stats.total}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Other Sources</Badge>
              <Progress value={0} className="flex-1 h-2" />
              <span className="text-sm font-medium text-navy">0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Job Operations</CardTitle>
          <CardDescription>Manage job listings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-navy">Sync Jobs</h4>
              <p className="text-sm text-gray-600">
                Fetch latest jobs from Adzuna API
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
                Remove jobs older than 30 days
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => cleanupJobs.mutate(30)}
              disabled={cleanupJobs.isPending}
            >
              {cleanupJobs.isPending ? "Cleaning..." : "Cleanup"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
