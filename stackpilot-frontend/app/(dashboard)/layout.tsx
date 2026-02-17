"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-navy via-navy-light to-navy">
        <div className="text-center space-y-6 animate-bounce-in">
          <LordiconWrapper
            icon={animations.loading}
            size={80}
            color="#FF6B35"
            state="loop"
          />
          <p className="text-white text-lg font-medium animate-pulse">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
