import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Job, JobMatch } from "@/lib/types/api";
import { useJobFiltersStore } from "@/lib/store/job-filters-store";
import { useDebounce } from "./use-debounce";

export function useJobs() {
  const { filters } = useJobFiltersStore();
  const debouncedSearch = useDebounce(filters.search, 500);

  return useInfiniteQuery({
    queryKey: [
      "jobs",
      filters.country,
      filters.role,
      filters.days,
      debouncedSearch,
      filters.jobType,
      filters.remote,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: "20",
        country: filters.country,
        ...(filters.role && { role: filters.role }),
        ...(filters.days && { days: filters.days.toString() }),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.jobType.length > 0 && {
          jobType: filters.jobType.join(","),
        }),
        ...(filters.remote && { remote: "true" }),
        ...(filters.salaryMin > 0 && {
          salaryMin: filters.salaryMin.toString(),
        }),
        ...(filters.salaryMax < 200000 && {
          salaryMax: filters.salaryMax.toString(),
        }),
      });

      const response = await apiClient.get(`/jobs?${params}`);
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.jobs.length < 20) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await apiClient.get(`/jobs/${id}`);
      return response.data as Job;
    },
    enabled: !!id,
  });
}

export function useJobMatch(jobId: string, resumeId?: string) {
  return useQuery({
    queryKey: ["job-match", jobId, resumeId],
    queryFn: async () => {
      const params = resumeId ? `?resumeId=${resumeId}` : "";
      const response = await apiClient.get(`/jobs/${jobId}/match${params}`);
      return response.data as JobMatch;
    },
    enabled: !!jobId,
  });
}
