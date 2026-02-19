"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/api";

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize state from localStorage
    if (typeof window === "undefined") return null;

    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    const loginTimestamp = localStorage.getItem("login_timestamp");

    if (token && userStr && loginTimestamp) {
      const now = Date.now();
      const loginTime = parseInt(loginTimestamp, 10);

      // Check if session has expired
      if (now - loginTime > SESSION_TIMEOUT) {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_timestamp");
        return null;
      }

      try {
        return JSON.parse(userStr);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_timestamp");
        return null;
      }
    }
    return null;
  });
  const [isLoading] = useState(false);
  const router = useRouter();

  // Check session timeout periodically
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkSession = () => {
      const loginTimestamp = localStorage.getItem("login_timestamp");
      if (loginTimestamp) {
        const now = Date.now();
        const loginTime = parseInt(loginTimestamp, 10);

        if (now - loginTime > SESSION_TIMEOUT) {
          logout();
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);

    return () => clearInterval(interval);
  }, []);

  const requireAuth = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    return !!token && !!user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_timestamp");
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
