"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Added Image import
import { useAuth } from "@/lib/hooks/use-auth";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: animations.dashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: animations.users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: animations.chart,
  },
  {
    title: "Jobs",
    href: "/admin/jobs",
    icon: animations.job,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: animations.settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LordiconWrapper
          icon={animations.loading}
          size={64}
          color="#FF6B35"
          state="loop"
        />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-navy text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <Image
                  src="/images/logo-white.svg"
                  alt="StackPilot"
                  width={96}
                  height={32}
                  className="h-28 w-auto"
                  priority
                />
                <span className="text-sm bg-orange-500 px-2 py-1 rounded">
                  Admin
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                      pathname === item.href
                        ? "bg-orange-500 text-white"
                        : "hover:bg-white/10",
                    )}
                  >
                    <LordiconWrapper
                      icon={item.icon}
                      size={20}
                      color={pathname === item.href ? "#FFFFFF" : "#FFFFFF"}
                      state="hover"
                    />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-white/80">{user?.email}</span>
              <Link
                href="/dashboard"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Exit Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b overflow-x-auto">
        <div className="flex px-4 py-2 gap-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors",
                pathname === item.href
                  ? "bg-orange-500 text-white"
                  : "hover:bg-gray-100",
              )}
            >
              <LordiconWrapper
                icon={item.icon}
                size={18}
                color={pathname === item.href ? "#FFFFFF" : "#0A1929"}
                state="hover"
              />
              <span className="text-sm">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
