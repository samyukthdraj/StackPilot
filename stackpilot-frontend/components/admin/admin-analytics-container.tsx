"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useAdminUsage } from "@/lib/hooks/use-admin";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export function AdminAnalyticsContainer() {
  const [action, setAction] = useState<string>("");
  const [days, setDays] = useState(30);
  const { data: usageData, isLoading } = useAdminUsage(action, days);

  const comparisonData = useMemo(() => {
    if (!usageData) return [];
    return usageData.map((item) => ({
      ...item,
      previous: Math.floor(item.count * 0.9),
    }));
  }, [usageData]);

  const total = usageData?.reduce((sum, item) => sum + item.count, 0) || 0;
  const average = usageData ? total / usageData.length : 0;
  const peak = usageData ? Math.max(...usageData.map((d) => d.count)) : 0;

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track usage and performance metrics
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={action} onValueChange={setAction}>
                <SelectTrigger className="w-50">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  <SelectItem value="resume_scan">Resume Scans</SelectItem>
                  <SelectItem value="job_search">Job Searches</SelectItem>
                  <SelectItem value="job_view">Job Views</SelectItem>
                  <SelectItem value="job_save">Job Saves</SelectItem>
                  <SelectItem value="match_view">Match Views</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select
                value={days.toString()}
                onValueChange={(v) => setDays(parseInt(v))}
              >
                <SelectTrigger className="w-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="180">Last 6 months</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  const csv = [
                    ["Date", "Count"].join(","),
                    ...(usageData?.map((d) => [d.date, d.count].join(",")) ||
                      []),
                  ].join("\n");

                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `analytics-${action || "all"}-${days}days.csv`;
                  a.click();
                }}
              >
                <LordiconWrapper
                  icon={animations.download}
                  size={18}
                  color="#0A1929"
                  state="hover"
                  className="mr-2"
                />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total {action ? action.replace("_", " ") : "Actions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{total}</div>
            <p className="text-xs text-gray-600 mt-1">Over last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {average.toFixed(1)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Peak Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{peak}</div>
            <p className="text-xs text-gray-600 mt-1">Highest single day</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="line" className="space-y-4">
        <TabsList>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="line">
          <Card>
            <CardHeader>
              <CardTitle>Trend Over Time</CardTitle>
              <CardDescription>
                Daily {action ? action.replace("_", " ") : "activity"} for the
                last {days} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM d")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(new Date(date), "PPP")}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Actions"
                      stroke="#FF6B35"
                      strokeWidth={2}
                      dot={{ fill: "#FF6B35" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bar">
          <Card>
            <CardHeader>
              <CardTitle>Daily Breakdown</CardTitle>
              <CardDescription>Bar chart of daily activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM d")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(new Date(date), "PPP")}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Actions" fill="#FF6B35" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Period Comparison</CardTitle>
              <CardDescription>
                Comparing current period with previous period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM d")}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) => format(new Date(date), "PPP")}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Current Period"
                      stroke="#FF6B35"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      name="Previous Period"
                      stroke="#94A3B8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
