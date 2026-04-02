"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProfileStats } from "@/lib/hooks/use-profile";
import { Skeleton } from "@/components/ui/skeleton";

export function ActivityChart() {
  const { data: stats, isLoading } = useProfileStats();

  if (isLoading) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2 h-[200px] pt-4">
            {[40, 70, 45, 90, 65, 30, 80, 55, 95, 75, 40, 60].map((height, i) => (
              <Skeleton 
                key={i} 
                className="flex-1" 
                style={{ height: `${height}%` }} 
              />
            ))}
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
      <CardHeader>
        <CardTitle className="text-[#f5f0e8] font-playfair">Activity Overview</CardTitle>
        <CardDescription className="text-gray-400">Your activity over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats.activityData}
              margin={{ top: 10, right: 30, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d0d0d",
                  border: "1px solid #2a2a2a",
                  borderRadius: "8px",
                  color: "#f5f0e8"
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="matches"
                name="Job Matches"
                stackId="1"
                stroke="#f5c842"
                fill="#f5c842"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="scans"
                name="Resume Scans"
                stackId="1"
                stroke="#f5f0e8"
                fill="#f5f0e8"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="saves"
                name="Jobs Saved"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
