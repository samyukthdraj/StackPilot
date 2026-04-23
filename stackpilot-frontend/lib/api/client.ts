import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { authUtil } from "./auth";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      });
      return searchParams.toString();
    }
  }
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = authUtil.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for automatic unwrapping and global error handling
apiClient.interceptors.response.use(
  (response) => {
    // Automatically unwrap the S-Tier backend success envelope
    if (
      response.data &&
      response.data.success === true &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        authUtil.clearAuth();
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // Extract error message from the new enterprise envelope or standard fallback
    const errorData = error.response?.data?.data || error.response?.data;
    const errorMsg =
      errorData?.message ||
      (Array.isArray(errorData?.message)
        ? errorData.message[0]
        : errorData?.message) ||
      error.message ||
      "An unexpected error occurred";

    if (error.response?.status !== 401) {
      toast({
        title: "API Error",
        description: errorMsg,
        variant: "destructive",
      });
    }

    console.error(`[API Error] ${errorMsg}`, error);
    return Promise.reject(error);
  },
);
