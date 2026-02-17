import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "./use-auth";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios"; // Added for better error typing

interface AdminStats {
  users: {
    total: number;
    activeToday: number;
    byPlan: {
      free: number;
      pro: number;
      enterprise: number;
    };
  };
  jobs: {
    total: number;
    addedToday: number;
    byCountry: Record<string, number>;
    byType: Record<string, number>;
  };
  usage: {
    totalScans: number;
    totalMatches: number;
    averageScansPerUser: number;
    peakHour: number;
  };
  revenue: {
    monthly: number;
    annual: number;
    activeSubscriptions: number;
  };
  timestamp: string;
}

interface User {
  id: string;
  email: string;
  subscriptionType: string;
  dailyResumeScans: number;
  createdAt: string;
  role: string;
  lastActive?: string;
}

interface UsageDataPoint {
  date: string;
  count: number;
}

// Response types for API calls
interface SyncResponse {
  message: string;
}

interface CleanupResponse {
  message: string;
}

interface ErrorResponse {
  message?: string;
}

export function useAdminStats() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/dashboard");
      return response.data as AdminStats;
    },
    enabled: isAuthenticated && user?.role === "admin",
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useAdminUsers(page: number = 1, limit: number = 20) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["admin-users", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(
        `/admin/users?page=${page}&limit=${limit}`,
      );
      return response.data as {
        users: User[];
        total: number;
        page: number;
        totalPages: number;
      };
    },
    enabled: isAuthenticated && user?.role === "admin",
  });
}

export function useAdminUserDetails(userId: string) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["admin-user", userId],
    queryFn: async () => {
      const response = await apiClient.get(`/admin/users/${userId}`);
      return response.data;
    },
    enabled: isAuthenticated && user?.role === "admin" && !!userId,
  });
}

export function useAdminUsage(action?: string, days: number = 30) {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["admin-usage", action, days],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (action) params.append("action", action);
      params.append("days", days.toString());

      const response = await apiClient.get(`/admin/usage?${params}`);
      return response.data as UsageDataPoint[];
    },
    enabled: isAuthenticated && user?.role === "admin",
  });
}

export function useAdminJobStats() {
  const { isAuthenticated, user } = useAuth();

  return useQuery({
    queryKey: ["admin-job-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/jobs/stats");
      return response.data;
    },
    enabled: isAuthenticated && user?.role === "admin",
  });
}

export function useSyncJobs() {
  const queryClient = useQueryClient();
  // Removed unused isAuthenticated and user variables
  useAuth(); // Still call the hook, but don't destructure unused variables

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<SyncResponse>("/admin/jobs/sync");
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Sync triggered",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-job-stats"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to trigger job sync";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        errorMessage = data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Sync failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

export function useCleanupJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: number = 30) => {
      const response = await apiClient.delete<CleanupResponse>(
        `/admin/jobs/old?days=${days}`,
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Cleanup completed",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-job-stats"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to cleanup jobs";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        errorMessage = data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Cleanup failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiClient.patch(`/admin/users/${userId}/role`, { role });
    },
    onSuccess: () => {
      toast({
        title: "User updated",
        description: "User role has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to update user role";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        errorMessage = data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}
