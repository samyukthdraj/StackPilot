import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "./use-auth";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios"; // Added for better error typing

interface ProfileStats {
  totalResumes: number;
  totalScans: number;
  totalMatches: number;
  totalSaved: number;
  totalApplied: number;
  successRate: number;
  activityData: Array<{
    date: string;
    scans: number;
    matches: number;
    saves: number;
  }>;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationPreferences {
  email: {
    dailyDigest: boolean;
    newMatches: boolean;
    applicationReminders: boolean;
    marketing: boolean;
  };
  push: {
    newMatches: boolean;
    applicationUpdates: boolean;
  };
}

interface ErrorResponse {
  message?: string;
}

export function useProfileStats() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["profile-stats"],
    queryFn: async () => {
      // Fetch all relevant data
      const [resumes, usage, matches, saved, activityChart] = await Promise.all(
        [
          apiClient.get("/resumes"),
          apiClient.get("/usage/summary"),
          apiClient.get("/jobs/matches?limit=100"),
          apiClient.get("/jobs/saved"),
          apiClient.get("/users/activity-chart?days=30"),
        ],
      );

      const totalScans = usage.data.resumeScans.used;
      const totalMatches = matches.data.length;
      const totalSaved = saved.data.items.length;

      // Properly typed filter
      const totalApplied = saved.data.items.filter(
        (item: { applied?: boolean }) => item.applied,
      ).length;

      // Calculate success rate
      const successRate =
        totalApplied > 0 ? Math.round((totalApplied / totalSaved) * 100) : 0;

      return {
        totalResumes: resumes.data.length,
        totalScans,
        totalMatches,
        totalSaved,
        totalApplied,
        successRate,
        activityData: activityChart.data,
      } as ProfileStats;
    },
    enabled: isAuthenticated,
  });
}

// Removed generateActivityData function - now using real data from backend

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      await apiClient.post("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to change password";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        errorMessage = data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

export function useNotificationPreferences() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      // This would come from your backend - using defaults for now
      try {
        const response = await apiClient.get("/user/notifications");
        return response.data as NotificationPreferences;
      } catch {
        // Return default preferences on error
        return {
          email: {
            dailyDigest: true,
            newMatches: true,
            applicationReminders: true,
            marketing: false,
          },
          push: {
            newMatches: true,
            applicationUpdates: true,
          },
        } as NotificationPreferences;
      }
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: NotificationPreferences) => {
      await apiClient.put("/user/notifications", preferences);
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
    onError: (error: unknown) => {
      let errorMessage = "Failed to update preferences";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        errorMessage = data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}
