import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Briefcase, Target, TrendingUp } from "lucide-react";

export interface DashboardStats {
  resumeScore: number;
  totalJobs: number;
  matches: number;
  applications: number;
}

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
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
            {stats.resumeScore}%
          </div>
          <Progress value={stats.resumeScore} className="mt-2" />
          <p className="text-xs text-gray-500 mt-2">ATS Optimized</p>
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
            {stats.matches}
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
            {stats.totalJobs}
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
            {stats.applications}
          </div>
          <p className="text-xs text-gray-500 mt-2">In progress</p>
        </CardContent>
      </Card>
    </div>
  );
}
