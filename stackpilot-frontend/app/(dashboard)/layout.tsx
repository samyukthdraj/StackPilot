"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/lib/hooks/use-auth";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-6 animate-bounce-in">
          <LordiconWrapper
            icon={animations.loading}
            size={80}
            color="#f5c842"
            state="loop"
          />
          <p className="text-[#f5f0e8] text-lg font-medium animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent text-[#f5f0e8] transition-colors duration-300">
      <div className="w-full">
        <Header />
        <main className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
