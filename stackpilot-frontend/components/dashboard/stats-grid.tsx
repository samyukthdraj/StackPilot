import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Briefcase, Target, Zap, Activity, Search } from "lucide-react";

export interface DashboardStats {
  resumeScore: number;
  totalJobs: number;
  matches: number;
  geminiUsage?: {
    used: number;
    limit: number;
  };
  globalJSearch?: {
    used: number;
    limit: number;
    remaining: number;
    resetAt: string | null;
  } | null;
  adzunaQuota?: {
    remaining: number;
    limit: number;
    resetAt: string | null;
  } | null;
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

      {stats.geminiUsage && (
        <Card 
          className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
              AI Analysis (Daily)
            </CardTitle>
            <Zap className="h-5 w-5" style={{ color: "#f5c842" }} />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-1">
              <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
                {stats.geminiUsage.used} <span className="text-sm font-normal text-[#666]">/ {stats.geminiUsage.limit}</span>
              </div>
              <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-tighter">Gemini 2.0</span>
            </div>
            <Progress value={(stats.geminiUsage.used / stats.geminiUsage.limit) * 100} className="h-1.5" />
            <p className="text-[10px] mt-2" style={{ color: "#666" }}>Daily resume scans</p>
          </CardContent>
        </Card>
      )}

      {stats.globalJSearch && (
        <Card 
          className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
              JSearch Quota
            </CardTitle>
            <Search className="h-5 w-5" style={{ color: "#f5c842" }} />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-1">
              <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
                {stats.globalJSearch.remaining} <span className="text-sm font-normal text-[#666]">Units</span>
              </div>
              <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-tighter">JSearch</span>
            </div>
            <Progress 
              value={(stats.globalJSearch.remaining / stats.globalJSearch.limit) * 100} 
              className="h-1.5" 
            />
            <p className="text-[10px] mt-2" style={{ color: "#666" }}>JSearch API capacity</p>
          </CardContent>
        </Card>
      )}

      {stats.adzunaQuota && (
        <Card 
          className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
              Adzuna Quota
            </CardTitle>
            <Activity className="h-5 w-5" style={{ color: "#f5c842" }} />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-1">
              <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
                {stats.adzunaQuota.remaining} <span className="text-sm font-normal text-[#666]">Units</span>
              </div>
              <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-tighter">Adzuna</span>
            </div>
            <Progress 
              value={(stats.adzunaQuota.remaining / stats.adzunaQuota.limit) * 100} 
              className="h-1.5" 
            />
            <p className="text-[10px] mt-2" style={{ color: "#666" }}>Adzuna API capacity</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
