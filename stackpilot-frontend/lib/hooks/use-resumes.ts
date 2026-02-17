"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Resume } from "@/lib/types/api";

export function useResumes() {
  const query = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const response = await apiClient.get<Resume[]>("/resumes");
      return response.data;
    },
  });

  const resumes = query.data || [];
  const primaryResume = resumes.find((r) => r.isPrimary) || null;

  return {
    ...query,
    resumes,
    primaryResume,
  };
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ["resumes", id],
    queryFn: async () => {
      const response = await apiClient.get<Resume>(`/resumes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiClient.post<Resume>("/resumes", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}
