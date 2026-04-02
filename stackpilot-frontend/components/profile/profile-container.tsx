"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/profile/stats-cards";
import { ActivityChart } from "@/components/profile/activity-chart";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { NotificationPreferences } from "@/components/profile/notification-preferences";
import { DangerZone } from "@/components/profile/danger-zone";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#f5f0e8] font-playfair">Profile</h1>
        <p className="text-[#a0a0a0] mt-2 text-lg">
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
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 text-[#f5f0e8] shadow-lg">
          <div className="flex items-start gap-8">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(245,200,66,0.15)] transition-transform duration-500 hover:scale-105"
              style={{ backgroundColor: "#f5c842", color: "#0d0d0d" }}
            >
              <span className="text-4xl font-bold font-playfair">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {isEditingName ? (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="h-12 w-80 bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] text-3xl font-playfair font-bold px-0 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-700"
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
                          <h2 className="text-3xl font-bold font-playfair tracking-tight text-[#f5f0e8]">
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
                          <p className="text-gray-400 font-medium text-lg">
                            {user?.email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
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
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards />
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
