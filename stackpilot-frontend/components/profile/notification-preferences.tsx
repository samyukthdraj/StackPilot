"use client";
// High-fidelity notification control system v1.1

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useTestEmail,
} from "@/lib/hooks/use-profile";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export function NotificationPreferences() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();
  const testEmail = useTestEmail();
  const { toast } = useToast();

  const [localPrefs, setLocalPrefs] = useState(preferences);

  // If localPrefs is still null but data has arrived, sync once
  if (preferences && !localPrefs && !isLoading) {
    setLocalPrefs(preferences);
  }

  const displayPrefs = localPrefs || preferences;

  if (isLoading || !displayPrefs) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2 bg-[#333]" />
          <Skeleton className="h-4 w-64 bg-[#333]" />
        </CardHeader>
        <CardContent className="space-y-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-[#333]" />
                  <Skeleton className="h-4 w-56 bg-[#333]" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full bg-[#333]" />
              </div>
              {i < 1 && <Separator className="bg-[#2a2a2a]" />}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const handleToggle = (category: "email" | "push", key: string) => {
    const current = displayPrefs;
    setLocalPrefs({
      ...current,
      [category]: {
        ...current[category],
        [key]: !current[category][key as keyof (typeof current)[typeof category]],
      },
    });
  };

  const handleSave = () => {
    if (displayPrefs) {
      updatePreferences.mutate(displayPrefs, {
        onSuccess: () => {
          toast({
            title: "Success! 🎉",
            description: "Preferences updated successfully.",
          });
        },
      });
    }
  };

  const handleTestNotification = () => {
    testEmail.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Test Sent! 🚀",
          description: "Check your inbox for a sample Welcome email.",
        });
      },
      onError: () => {
        toast({
          title: "Setup Needed ❌",
          description: "Email provider not configured in server.",
          variant: "destructive",
        });
      },
    });
  };

  const hasChanges =
    preferences &&
    displayPrefs &&
    JSON.stringify(preferences) !== JSON.stringify(displayPrefs);

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a] shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#f5c842] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <CardHeader>
        <CardTitle className="text-[#f5f0e8] font-playfair flex items-center gap-3">
          Notification Control Hub
        </CardTitle>
        <CardDescription className="text-gray-400">
          Tailor how StackPilot&apos;s AI insights reach you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Email Notifications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#f5f0e8] flex items-center gap-2">
              <LordiconWrapper
                icon={animations.email}
                size={28}
                color="#f5c842"
                state="loop"
              />
              Email Delivery Channels
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              className="border-[#f5c842]/30 text-[#f5c842] hover:bg-[#f5c842]/10 transition-all duration-300 rounded-full px-4"
              disabled={testEmail.isPending}
            >
              {testEmail.isPending ? "Sending..." : "Test Now"}
            </Button>
          </div>

          <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="email-digest"
                  className="text-base text-[#f5f0e8]"
                >
                  Daily Performance Digest
                </Label>
                <p className="text-sm text-gray-500 max-w-md">
                  A comprehensive summary of new matches, resume ATS performance,
                  and market activity.
                </p>
              </div>
              <Switch
                id="email-digest"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.email.dailyDigest}
                onCheckedChange={() => handleToggle("email", "dailyDigest")}
              />
            </div>

            <Separator className="bg-white/5" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor="email-matches"
                  className="text-base text-[#f5f0e8]"
                >
                  Instant Match Alerts
                </Label>
                <p className="text-sm text-gray-400 max-w-md">
                  Get high-fidelity notifications precisely when a 90%+ match is
                  discovered in the market.
                </p>
              </div>
              <Switch
                id="email-matches"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.email.newMatches}
                onCheckedChange={() => handleToggle("email", "newMatches")}
              />
            </div>
          </div>
        </div>

        {/* Global Hub Action */}
        <div className="pt-2">
          {hasChanges ? (
            <Button
              onClick={handleSave}
              className="w-full bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-bold h-12 shadow-lg shadow-[#f5c842]/10 transition-all duration-300"
              disabled={updatePreferences.isPending}
            >
              {updatePreferences.isPending
                ? "Saving configuration..."
                : "Commit Configuration"}
            </Button>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs text-gray-600 font-medium uppercase tracking-[0.2em]">
                Verified Configuration Active
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
