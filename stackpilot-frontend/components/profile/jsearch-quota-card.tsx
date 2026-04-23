"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJSearchQuota, JSearchQuotaData } from "@/lib/hooks/use-profile";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Search, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react";

const statusConfig = {
  ok: {
    label: "Healthy",
    color: "#22c55e",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    icon: CheckCircle2,
    barColor: "bg-emerald-500",
  },
  low: {
    label: "Low",
    color: "#f59e0b",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    icon: AlertTriangle,
    barColor: "bg-amber-500",
  },
  critical: {
    label: "Critical",
    color: "#ef4444",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: AlertTriangle,
    barColor: "bg-red-500",
  },
  exhausted: {
    label: "Exhausted",
    color: "#ef4444",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: XCircle,
    barColor: "bg-red-500",
  },
};

function QuotaBar({ percent, status }: { percent: number; status: JSearchQuotaData["status"] }) {
  const config = statusConfig[status];
  return (
    <div className="h-2 w-full rounded-full bg-[#0d0d0d] border border-[#2a2a2a] overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", config.barColor)}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

export function JSearchQuotaCard() {
  const { data: quota, isLoading } = useJSearchQuota();

  if (isLoading) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40 bg-[#333]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-24 bg-[#333]" />
          <Skeleton className="h-2 w-full bg-[#333]" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24 bg-[#333]" />
            <Skeleton className="h-4 w-20 bg-[#333]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // No data yet — quota hasn't been read from headers yet (cron not triggered)
  if (!quota) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-[#a0a0a0] uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-[#f5c842]" />
            JSearch API Quota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#555] leading-relaxed">
            Quota data will appear after the first daily job sync (scheduled for 12:00 AM UTC).
          </p>
          <div className="mt-4 p-3 rounded-lg bg-[#0d0d0d] border border-[#2a2a2a] text-[10px] text-[#444] font-mono uppercase tracking-tighter">
            Waiting for first signal...
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = statusConfig[quota.status];
  const StatusIcon = config.icon;

  return (
    <Card className={cn("border bg-[#1a1a1a] relative overflow-hidden group transition-all duration-300", config.borderColor)}>
      {/* Glow background */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${config.color}15, transparent)` }}
      />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[#a0a0a0] uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-[#f5c842]" />
            JSearch API Quota
          </CardTitle>
          <span
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
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
        {/* Big number */}
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-[#f5f0e8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {quota.remaining}
          </span>
          <span className="text-[#555] text-sm mb-1.5">/ {quota.limit} remaining</span>
        </div>

        {/* Progress bar — shows USED */}
        <div className="space-y-1.5">
          <QuotaBar percent={quota.usedPercent} status={quota.status} />
          <div className="flex justify-between text-[10px] text-[#555] font-mono uppercase tracking-wider">
            <span>{quota.used} used ({quota.usedPercent}%)</span>
            <span>{quota.remaining} left</span>
          </div>
        </div>

        {/* Reset info */}
        <div className="pt-2 border-t border-[#2a2a2a] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-[#666]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {quota.resetInDays !== null
              ? <>Resets in <span className="text-[#a0a0a0] font-semibold">{quota.resetInDays} days</span> (monthly plan)</>
              : <>Reset date not yet known — will update after next sync</>
            }
          </div>
          {quota.lastCallAt && (
            <p className="text-[10px] text-[#444] flex items-center gap-1">
              Last synced: {formatDistanceToNow(new Date(quota.lastCallAt), { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Plan note */}
        <div className="rounded-xl bg-[#0d0d0d] border border-[#2a2a2a] p-3 text-xs text-[#666] leading-relaxed">
          <span className="text-[#a0a0a0] font-semibold">BASIC plan:</span> 200 requests/month.
          Current strategy: Full sync of all 5 countries once every 24 hours (~150/month). 
          {quota.status === "exhausted"
            ? " ⚠️ Quota exhausted — job sync is paused until reset."
            : quota.status === "critical"
            ? " ⚠️ Running critically low — sync will pause below 15 remaining."
            : " Sync will auto-pause if remaining drops below 15."}
        </div>
      </CardContent>
    </Card>
  );
}
