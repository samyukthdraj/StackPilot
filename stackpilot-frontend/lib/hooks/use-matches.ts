import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { JobMatch } from "@/lib/types/api";
import { useAuth } from "./use-auth";

export function useMatches(resumeId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["matches", resumeId],
    queryFn: async () => {
      const resumeParam = resumeId ? `resumeId=${resumeId}` : "";
      const limitParam = "limit=100";
      const params = [resumeParam, limitParam].filter(Boolean).join("&");
      const response = await apiClient.get(`/jobs/matches?${params}`);
      return response.data as JobMatch[];
    },
    enabled: isAuthenticated,
  });
}

export function useMatchDetails(jobId: string, resumeId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["match-details", jobId, resumeId],
    queryFn: async () => {
      const params = resumeId ? `?resumeId=${resumeId}` : "";
      const response = await apiClient.get(`/jobs/${jobId}/match${params}`);
      return response.data as JobMatch;
    },
    enabled: isAuthenticated && !!jobId,
  });
}

export function useMatchStats(resumeId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["match-stats", resumeId],
    queryFn: async () => {
      // Get all matches for comprehensive stats
      const resumeParam = resumeId ? `resumeId=${resumeId}` : "";
      const limitParam = "limit=100";
      const params = [resumeParam, limitParam].filter(Boolean).join("&");
      
      const response = await apiClient.get(`/jobs/matches?${params}`);
      const allData = response.data as JobMatch[];
      
      // Filter for primary data metrics (Score > 60%)
      const data = allData.filter(m => m.score > 60);

      const stats = {
        total: data.length, // Matches above 60%
        allTotal: allData.length, // Total pool of 100 jobs scanned
        averageScore: data.length > 0
          ? Math.round(data.reduce((acc, m) => acc + m.score, 0) / data.length)
          : 0,
        byScore: {
          excellent: allData.filter((m) => m.score >= 80).length,
          good: allData.filter((m) => m.score >= 60 && m.score < 80).length,
          fair: allData.filter((m) => m.score >= 40 && m.score < 60).length,
          poor: allData.filter((m) => m.score < 40).length,
        },
        topSkills: getTopSkills(data),
        commonMissingSkills: getCommonMissingSkills(data),
      };

      return stats;
    },
    enabled: isAuthenticated,
  });
}

function getTopSkills(
  matches: JobMatch[],
): Array<{ skill: string; count: number }> {
  const skillCount: Record<string, number> = {};

  matches.forEach((match) => {
    match.matchedSkills.forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCount)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getCommonMissingSkills(
  matches: JobMatch[],
): Array<{ skill: string; count: number }> {
  const skillCount: Record<string, number> = {};

  matches.forEach((match) => {
    match.missingSkills.forEach((skill) => {
      skillCount[skill] = (skillCount[skill] || 0) + 1;
    });
  });

  return Object.entries(skillCount)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
