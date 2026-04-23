"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollableTabs } from "@/components/ui/scrollable-tabs";
import { StatsCards } from "@/components/profile/stats-cards";
import { ActivityChart } from "@/components/profile/activity-chart";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { NotificationPreferences } from "@/components/profile/notification-preferences";
import { DangerZone } from "@/components/profile/danger-zone";
import { ProfileUsageStats } from "@/components/profile/profile-usage-stats";
import { useAuth } from "@/lib/hooks/use-auth";
import { User } from "@/lib/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useUpdateName } from "@/lib/hooks/use-profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileContainer() {
  const { user, isLoading } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const updateNameMutation = useUpdateName();

  const handleUpdateName = () => {
    if (!newName.trim() || newName === user?.name) {
      setIsEditingName(false);
      return;
    }
    updateNameMutation.mutate(newName, {
      onSuccess: () => setIsEditingName(false),
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#f5f0e8] font-playfair">Profile</h1>
        <p className="text-[#a0a0a0] mt-2 text-base sm:text-lg">
          Manage your account settings and preferences
        </p>
      </div>

      {isLoading ? (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-lg">
          <div className="flex items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(245,200,66,0.15)] transition-transform duration-500 hover:scale-105 shrink-0"
              style={{ backgroundColor: "#f5c842", color: "#0d0d0d" }}
            >
              <span className="text-3xl sm:text-4xl font-bold font-playfair">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="h-10 w-full sm:w-80 bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] text-xl sm:text-3xl font-playfair font-bold px-0 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-700"
                        placeholder="Type your name..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateName();
                          if (e.key === "Escape") setIsEditingName(false);
                        }}
                      />
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 text-emerald-500 hover:bg-emerald-500/10"
                          onClick={handleUpdateName}
                          disabled={updateNameMutation.isPending}
                        >
                          <Check className="h-5 w-5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 text-red-500 hover:bg-red-500/10"
                          onClick={() => {
                            setIsEditingName(false);
                            setNewName(user?.name || "");
                          }}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl sm:text-3xl font-bold font-playfair tracking-tight text-[#f5f0e8] break-all">
                            {user?.name || user?.email}
                          </h2>
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="p-1.5 rounded-md text-[#f5c842] hover:bg-[#2a2a2a] transition-all"
                            title="Update Display Name"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                        {user?.name && (
                          <p className="text-gray-400 font-medium text-sm sm:text-lg break-all">
                            {user?.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-4 py-1.5 bg-[#0d0d0d] border border-[#f5c842]/30 text-[#f5c842] rounded-full text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(245,200,66,0.1)]">
                  {(user as User)?.subscriptionType || "Free"} Plan Active
                </span>
                <span className="px-4 py-1.5 bg-[#2a2a2a] text-[#a0a0a0] rounded-full text-xs font-medium border border-transparent">
                  Member since {new Date().getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <ScrollableTabs>
          <TabsList className="flex min-w-full w-max sm:w-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm flex-shrink-0">Overview</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm flex-shrink-0">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm flex-shrink-0">Notifications</TabsTrigger>
            <TabsTrigger value="danger" className="text-xs sm:text-sm flex-shrink-0">Danger Zone</TabsTrigger>
          </TabsList>
        </ScrollableTabs>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />
          <ProfileUsageStats />
          <ActivityChart />
        </TabsContent>

        <TabsContent value="security">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}
