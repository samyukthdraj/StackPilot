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
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

export function ActivityChart() {
  const { data: stats, isLoading } = useProfileStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <LordiconWrapper
              icon={animations.loading}
              size={32}
              color="#FF6B35"
              state="loop"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>Your activity over the last 30 days</CardDescription>
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
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="matches"
                name="Job Matches"
                stackId="1"
                stroke="#FF6B35"
                fill="#FF6B35"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="scans"
                name="Resume Scans"
                stackId="1"
                stroke="#0A1929"
                fill="#0A1929"
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
