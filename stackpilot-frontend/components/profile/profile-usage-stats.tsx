"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, Search, Activity } from "lucide-react";
import { useUsage } from "@/lib/hooks/use-usage";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileUsageStats() {
  const { data: usage, isLoading } = useUsage();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl" />
        ))}
      </div>
    );
  }

  if (!usage) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Gemini Usage */}
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
              {usage.resumeScans.used} <span className="text-sm font-normal text-[#666]">/ {usage.resumeScans.limit}</span>
            </div>
            <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-tighter">Gemini 2.0</span>
          </div>
          <Progress value={(usage.resumeScans.used / usage.resumeScans.limit) * 100} className="h-1.5" />
          <p className="text-[10px] mt-2" style={{ color: "#666" }}>Daily resume scans</p>
        </CardContent>
      </Card>

      {/* JSearch Usage */}
      {usage.globalJSearch && (
        <Card 
          className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
              JSearch Units
            </CardTitle>
            <Search className="h-5 w-5" style={{ color: "#f5c842" }} />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-1">
              <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
                {usage.globalJSearch.remaining} <span className="text-sm font-normal text-[#666]">Units</span>
              </div>
              <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-tighter">JSearch</span>
            </div>
            <Progress 
              value={(usage.globalJSearch.remaining / usage.globalJSearch.limit) * 100} 
              className="h-1.5" 
            />
            <p className="text-[10px] mt-2" style={{ color: "#666" }}>System-wide JSearch quota</p>
          </CardContent>
        </Card>
      )}

      {/* Adzuna Usage */}
      {usage.adzunaQuota && (
        <Card 
          className="transition-all duration-300 border hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#f5c842]/10"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#a0a0a0" }}>
              Adzuna Units
            </CardTitle>
            <Activity className="h-5 w-5" style={{ color: "#f5c842" }} />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-1">
              <div className="text-2xl font-bold" style={{ color: "#f5f0e8" }}>
                {usage.adzunaQuota.remaining} <span className="text-sm font-normal text-[#666]">Units</span>
              </div>
              <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-tighter">Adzuna</span>
            </div>
            <Progress 
              value={(usage.adzunaQuota.remaining / usage.adzunaQuota.limit) * 100} 
              className="h-1.5" 
            />
            <p className="text-[10px] mt-2" style={{ color: "#666" }}>Fallback Adzuna quota</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
