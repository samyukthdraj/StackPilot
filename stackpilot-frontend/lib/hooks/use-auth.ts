"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/api";

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Storage event listeners for cross-tab sync
const authListeners = new Set<() => void>();

// Cache for snapshot to prevent infinite loops
let cachedSnapshot: { user: User | null; isAuthenticated: boolean } | null =
  null;
let lastCheckTime = 0;

function emitAuthChange() {
  cachedSnapshot = null; // Invalidate cache
  authListeners.forEach((listener) => listener());
}

function subscribeToAuth(callback: () => void) {
  authListeners.add(callback);

  // Listen for storage events from other tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "token" || e.key === "access_token" || e.key === "user") {
      cachedSnapshot = null; // Invalidate cache
      callback();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    authListeners.delete(callback);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function getAuthSnapshot(): { user: User | null; isAuthenticated: boolean } {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  // Return cached snapshot if available and recent (within 100ms)
  const now = Date.now();
  if (cachedSnapshot && now - lastCheckTime < 100) {
    return cachedSnapshot;
  }

  const token =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");
  const loginTimestamp = localStorage.getItem("login_timestamp");

  if (!token || !userStr || !loginTimestamp) {
    cachedSnapshot = { user: null, isAuthenticated: false };
    lastCheckTime = now;
    return cachedSnapshot;
  }

  const loginTime = parseInt(loginTimestamp, 10);

  // Check if session has expired
  if (now - loginTime > SESSION_TIMEOUT) {
    // Clean up expired session
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_timestamp");
    cachedSnapshot = { user: null, isAuthenticated: false };
    lastCheckTime = now;
    return cachedSnapshot;
  }

  try {
    const user = JSON.parse(userStr);
    cachedSnapshot = { user, isAuthenticated: true };
    lastCheckTime = now;
    return cachedSnapshot;
  } catch {
    // Clean up corrupted data
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_timestamp");
    cachedSnapshot = { user: null, isAuthenticated: false };
    lastCheckTime = now;
    return cachedSnapshot;
  }
}

const serverSnapshot = { user: null, isAuthenticated: false };

function getServerSnapshot() {
  return serverSnapshot;
}

export function useAuth() {
  const router = useRouter();

  const authState = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerSnapshot,
  );

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_timestamp");

    emitAuthChange();
    router.push("/");
  }, [router]);

  const requireAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    return !!token && authState.isAuthenticated;
  }, [authState.isAuthenticated]);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: false,
    requireAuth,
    logout,
  };
}
