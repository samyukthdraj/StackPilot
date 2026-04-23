"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileStats } from "@/lib/hooks/use-profile";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Zap } from "lucide-react";

export function GeminiUsageCard() {
  const { data: stats, isLoading, isError } = useProfileStats();

  if (isLoading) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-48 bg-[#333]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-24 bg-[#333]" />
          <Skeleton className="h-2 w-full bg-[#333]" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !stats) {
    return (
      <Card className="border border-[#2a2a2a] bg-[#1a1a1a] p-6 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#333]/20 flex items-center justify-center">
          <Zap className="w-6 h-6 text-[#444]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[#a0a0a0] uppercase tracking-wider">AI Scanner Quota</h3>
          <p className="text-xs text-[#555]">Usage data temporarily unavailable</p>
        </div>
      </Card>
    );
  }

  const used = stats.totalScans;
  const limit = stats.scanLimit || 3;
  const remaining = stats.remainingScans;
  const usedPercent = Math.round((used / limit) * 100);

  let status: "ok" | "low" | "critical" = "ok";
  if (remaining === 0) status = "critical";
  else if (remaining === 1) status = "low";

  const statusConfig = {
    ok: {
      label: "Ready",
      color: "#22c55e",
      bgColor: "bg-emerald-500/10",
      icon: CheckCircle2,
      barColor: "bg-emerald-500",
    },
    low: {
      label: "Running Low",
      color: "#f59e0b",
      bgColor: "bg-amber-500/10",
      icon: AlertTriangle,
      barColor: "bg-amber-500",
    },
    critical: {
      label: "Limit Reached",
      color: "#ef4444",
      bgColor: "bg-red-500/10",
      icon: AlertTriangle,
      barColor: "bg-red-500",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="border border-[#2a2a2a] bg-[#1a1a1a] relative overflow-hidden group transition-all duration-300 hover:border-[#f5c842]/30 shadow-lg">
      {/* Decorative pulse for Gemini "AI" feel */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f5c842]/5 rounded-full blur-3xl group-hover:bg-[#f5c842]/10 transition-all duration-500" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[#a0a0a0] uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#f5c842]" />
            AI Scanner Quota (Gemini)
          </CardTitle>
          <span
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
              config.bgColor,
            )}
            style={{ color: config.color }}
          >
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-[#f5f0e8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {remaining}
          </span>
          <span className="text-[#555] text-sm mb-1.5">/ {limit} scans left today</span>
        </div>

        <div className="space-y-1.5">
          <div className="h-2 w-full rounded-full bg-[#0d0d0d] border border-[#2a2a2a] overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700 ease-out", config.barColor)}
              style={{ width: `${Math.min(usedPercent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#555] font-mono uppercase tracking-wider">
            <span>{used} used today</span>
            <span>{remaining} remaining</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#2a2a2a]">
          <p className="text-[10px] text-[#666] leading-relaxed">
            <span className="text-[#a0a0a0] font-semibold">Free Tier:</span> Your Gemini AI scanner resets every 24 hours. Each resume scan or ATS optimization uses 1 unit of your daily quota.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
