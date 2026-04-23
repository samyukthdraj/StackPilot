"use client";

import { AlertTriangle, RefreshCw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Quota {
  remaining: number;
  resetAt: string | null;
}

interface FallbackBannerProps {
  activeProvider: string;
  jsearchQuota: Quota | null;
  adzunaQuota: Quota | null;
}

export function FallbackBanner({
  activeProvider,
  jsearchQuota,
  adzunaQuota,
}: FallbackBannerProps) {
  if (activeProvider === "local" || activeProvider === "jsearch") return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "the start of the next cycle";
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isAdzuna = activeProvider === "adzuna";
  const isArbeitnow = activeProvider === "arbeitnow";
  const isNone = activeProvider === "none" || activeProvider === "error";

  return (
    <div className="bg-[#f5c842]/5 border border-[#f5c842]/20 rounded-2xl p-4 sm:p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#f5c842]/10 flex items-center justify-center shrink-0">
          {isAdzuna ? (
            <Zap className="w-6 h-6 text-[#f5c842]" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-[#f5c842]" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4
              className="text-[#f5f0e8] font-bold text-lg"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isAdzuna ? "Quota Escalation: Adzuna Active" : 
               isArbeitnow ? "Secondary Fallback: Arbeitnow Active" : 
               "System Capacity: All Providers Exhausted"}
            </h4>
            <Badge variant="outline" className="border-[#f5c842]/30 text-[#f5c842] bg-transparent uppercase text-[10px] tracking-widest font-bold">
              Fallback Tier {isAdzuna ? "1" : "2"}
            </Badge>
          </div>

          <div className="space-y-3 text-sm text-[#a0a0a0] leading-relaxed">
            {isAdzuna && (
              <p>
                JSearch quota has been exhausted. We are currently sourcing high-quality aggregated roles from <span className="text-[#f5c842] font-bold">Adzuna</span>. 
                While Adzuna provides excellent global coverage, some technical metadata might be less granular than our primary source.
              </p>
            )}

            {isArbeitnow && (
              <p>
                Both JSearch and Adzuna quotas have been exceeded. We are now fetching results from <span className="text-[#f5c842] font-bold">Arbeitnow</span>.
                Arbeitnow specializes in developer-centric and remote-friendly roles, though overall volume may be lower during this period.
              </p>
            )}

            {isNone && (
              <p>
                All available job discovery quotas (JSearch, Adzuna, and Arbeitnow) have been exceeded for this cycle. 
                Live marketplace updates are temporarily suspended, but you can still access your <span className="text-[#f5c842] font-bold">Saved Jobs</span> and local results.
              </p>
            )}

            <div className="flex flex-col gap-2 p-3 bg-black/20 rounded-xl border border-white/5 mt-4">
              <div className="flex items-center gap-2 text-[12px]">
                <RefreshCw className="w-3.5 h-3.5 text-[#f5c842]/60" />
                <span>
                  JSearch resets on: <span className="text-[#f5f0e8] font-mono font-bold">{formatDate(jsearchQuota?.resetAt || null)}</span>
                </span>
              </div>
              {isArbeitnow && (
                <div className="flex items-center gap-2 text-[12px]">
                  <RefreshCw className="w-3.5 h-3.5 text-[#f5c842]/60" />
                  <span>
                    Adzuna resets on: <span className="text-[#f5f0e8] font-mono font-bold">{formatDate(adzunaQuota?.resetAt || null)}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
