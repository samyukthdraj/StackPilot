import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { JobMatch } from "@/lib/types/api";
import { useAuth } from "./use-auth";

export function useMatches(resumeId?: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["matches", resumeId],
    queryFn: async () => {
      const params = resumeId ? `?resumeId=${resumeId}` : "";
      const response = await apiClient.get(`/jobs/matches${params}`);
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

export function useMatchStats() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["match-stats"],
    queryFn: async () => {
      const matches = await apiClient.get("/jobs/matches?limit=100");
      const data = matches.data as JobMatch[];

      const stats = {
        total: data.length,
        averageScore: Math.round(
          data.reduce((acc, m) => acc + m.score, 0) / data.length,
        ),
        byScore: {
          excellent: data.filter((m) => m.score >= 80).length,
          good: data.filter((m) => m.score >= 60 && m.score < 80).length,
          fair: data.filter((m) => m.score >= 40 && m.score < 60).length,
          poor: data.filter((m) => m.score < 40).length,
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
