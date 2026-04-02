import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Briefcase, Target } from "lucide-react";

export interface DashboardStats {
  resumeScore: number;
  totalJobs: number;
  matches: number;
}

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card 
        className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
        style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
            Resume Score
          </CardTitle>
          <FileText className="h-5 w-5" style={{ color: "#f5c842" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
            {stats.resumeScore}%
          </div>
          <Progress value={stats.resumeScore} className="mt-2" />
          <p className="text-xs mt-2" style={{ color: "#666" }}>ATS Optimized</p>
        </CardContent>
      </Card>

      <Card 
        className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
        style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
            Job Matches
          </CardTitle>
          <Target className="h-5 w-5" style={{ color: "#f5c842" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
            {stats.matches}
          </div>
          <p className="text-xs mt-2" style={{ color: "#666" }}>Based on your profile</p>
        </CardContent>
      </Card>

      <Card 
        className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
        style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
            Total Jobs
          </CardTitle>
          <Briefcase className="h-5 w-5" style={{ color: "#f5c842" }} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
            {stats.totalJobs}
          </div>
          <p className="text-xs mt-2" style={{ color: "#666" }}>Available positions</p>
        </CardContent>
      </Card>
    </div>
  );
}
