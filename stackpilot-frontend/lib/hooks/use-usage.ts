import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

export interface UsageSummary {
  resumeScans: {
    used: number;
    limit: number;
    resetAt: string | null;
  };
  jobSearches: {
    used: number;
    limit: number;
    resetAt: string | null;
  };
  globalJSearch: {
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
  remaining: {
    resumeScans: number;
    jobSearches: number;
  };
}

export function useUsage() {
  return useQuery<UsageSummary>({
    queryKey: ["usage", "summary"],
    queryFn: async () => {
      const response = await apiClient.get<UsageSummary>("/usage/summary");
      return response.data;
    },
    // Refresh usage info periodically or when the window focuses
    staleTime: 60000, // 1 minute
  });
}
