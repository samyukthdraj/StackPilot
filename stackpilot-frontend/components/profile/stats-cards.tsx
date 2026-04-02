"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useProfileStats } from "@/lib/hooks/use-profile";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const statItems = [
  {
    key: "totalResumes",
    icon: animations.resume,
    label: "Resumes",
    color: "#f5c842",
    bgColor: "bg-[#f5c842]/5",
  },
  {
    key: "savedJobs",
    icon: animations.bookmark,
    label: "Saved Jobs",
    color: "#f5c842",
    bgColor: "bg-[#f5c842]/5",
  },
];

export function StatsCards() {
  const { data: stats, isLoading } = useProfileStats();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {statItems.map((_, i) => (
          <Card key={i} className="border-[#2a2a2a] bg-[#1a1a1a]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-24 bg-[#333]" />
                  <Skeleton className="h-10 w-16 bg-[#333]" />
                </div>
                <Skeleton className="w-14 h-14 rounded-xl bg-[#333]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {statItems.map((item, index) => {
        const value = stats[item.key as keyof typeof stats];

        return (
          <Card
            key={item.key}
            className="group card-hover border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#f5c842]/50 stagger-item overflow-hidden relative"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#f5c842]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-4xl font-bold text-[#f5f0e8] group-hover:text-[#f5c842] transition-colors duration-300">
                    {typeof value === "number" ? value : 0}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-4 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md",
                    item.bgColor,
                  )}
                >
                  <LordiconWrapper
                    icon={item.icon}
                    size={36}
                    color={item.color}
                    state="loop"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
