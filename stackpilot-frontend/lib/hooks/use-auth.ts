"use client";

import { useSyncExternalStore, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types/api";
import { authUtil } from "@/lib/api/auth";

// Storage event listeners for cross-tab sync
const authListeners = new Set<() => void>();

function emitAuthChange() {
  authListeners.forEach((listener) => listener());
}

function subscribeToAuth(callback: () => void) {
  authListeners.add(callback);

  // Listen for storage events from other tabs
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "token" || e.key === "access_token" || e.key === "user") {
      callback();
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    authListeners.delete(callback);
    window.removeEventListener("storage", handleStorageChange);
  };
}

let currentSnapshot: { user: User | null; isAuthenticated: boolean } | null = null;

function getAuthSnapshot(): { user: User | null; isAuthenticated: boolean } {
  const user = authUtil.getUser();
  const isAuthenticated = authUtil.isAuthenticated() && !!user;

  // Check if we already have a snapshot with the same values
  if (
    currentSnapshot &&
    currentSnapshot.isAuthenticated === isAuthenticated &&
    JSON.stringify(currentSnapshot.user) === JSON.stringify(user)
  ) {
    return currentSnapshot;
  }

  // Create and cache new snapshot if changed
  currentSnapshot = {
    user,
    isAuthenticated,
  };

  return currentSnapshot;
}

const serverSnapshot = { user: null, isAuthenticated: false };

function getServerSnapshot() {
  return serverSnapshot;
}

export function useAuth() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Defers state update slightly to avoid synchronous cascade warnings
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const authState = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerSnapshot,
  );

  const logout = useCallback(() => {
    authUtil.clearAuth();
    emitAuthChange();
    router.push("/");
  }, [router]);

  const requireAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    return authUtil.isAuthenticated();
  }, []);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: !isMounted,
    requireAuth,
    logout,
  };
}
