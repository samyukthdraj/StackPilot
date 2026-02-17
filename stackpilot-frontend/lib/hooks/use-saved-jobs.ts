import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { SavedJob, UpdateSavedJobRequest } from "@/lib/types/api";
import { useAuth } from "./use-auth";
import { toast } from "@/components/ui/use-toast";

export function useSavedJobs(filters?: { applied?: boolean; tags?: string[] }) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["saved-jobs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.applied !== undefined) {
        params.append("applied", String(filters.applied));
      }
      if (filters?.tags?.length) {
        params.append("tags", filters.tags.join(","));
      }

      const response = await apiClient.get(`/jobs/saved?${params}`);
      return response.data as { items: SavedJob[]; total: number };
    },
    enabled: isAuthenticated,
  });
}

export function useSavedJob(id: string) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["saved-job", id],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/saved/${id}`);
      return response.data as SavedJob;
    },
    enabled: isAuthenticated && !!id,
  });
}

export function useSavedJobStats() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["saved-job-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/jobs/saved/stats");
      return response.data as {
        total: number;
        applied: number;
        pending: number;
        topTags: Array<{ tag: string; count: number }>;
      };
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateSavedJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSavedJobRequest;
    }) => {
      const response = await apiClient.patch(`/jobs/saved/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-job-stats"] });
    },
  });
}

export function useDeleteSavedJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/jobs/saved/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["saved-job-stats"] });
      toast({
        title: "Job removed",
        description: "Job removed from saved list",
      });
    },
  });
}
