"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/profile/stats-cards";
import { ActivityChart } from "@/components/profile/activity-chart";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { NotificationPreferences } from "@/components/profile/notification-preferences";
import { DangerZone } from "@/components/profile/danger-zone";
import { useAuth } from "@/lib/hooks/use-auth";
import { User } from "@/lib/types/api";

export function ProfileContainer() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-linear-to-r from-navy to-navy-light rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.email}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs capitalize">
                {(user as User)?.subscriptionType || "Free"} Plan
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                Member since {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </div>

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
