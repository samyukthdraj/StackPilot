"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state from localStorage
    if (typeof window === "undefined") return null;

    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });
  const [isLoading] = useState(false);
  const router = useRouter();

  const requireAuth = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    return !!token && !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    requireAuth,
    logout,
  };
}
