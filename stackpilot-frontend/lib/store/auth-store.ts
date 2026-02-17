import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/lib/api/client";
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/lib/types/api";
import { AxiosError } from "axios"; // Added for better error typing

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  clearError: () => void;
}

// Define error response type
interface ErrorResponse {
  message?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<AuthResponse>(
            "/auth/login",
            data,
          );
          const { access_token } = response.data;

          localStorage.setItem("access_token", access_token);
          set({ token: access_token });

          // Fetch user profile
          await get().getProfile();
        } catch (error) {
          let errorMessage = "Login failed. Please try again.";

          if (error instanceof AxiosError && error.response?.data) {
            const data = error.response.data as ErrorResponse;
            errorMessage = data.message || errorMessage;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post("/auth/register", data);
          // Auto login after registration
          await get().login(data);
        } catch (error) {
          let errorMessage = "Registration failed. Please try again.";

          if (error instanceof AxiosError && error.response?.data) {
            const data = error.response.data as ErrorResponse;
            errorMessage = data.message || errorMessage;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("auth-storage");
        set({ user: null, token: null, error: null });
      },

      getProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await apiClient.get<User>("/auth/profile");
          set({ user: response.data });
        } catch {
          // Removed unused error parameter
          set({ error: "Failed to fetch user profile" });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
