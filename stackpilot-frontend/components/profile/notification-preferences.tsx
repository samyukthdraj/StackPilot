"use client";

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
} from "@/lib/hooks/use-profile";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationPreferences() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [localPrefs, setLocalPrefs] = useState(preferences);

  const displayPrefs = localPrefs || preferences;

  if (isLoading || !displayPrefs) {
    return (
      <Card className="border-[#2a2a2a] bg-[#1a1a1a]">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>
              {i < 3 && <Separator className="bg-[#2a2a2a]" />}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!displayPrefs) return null;

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
      updatePreferences.mutate(displayPrefs);
    }
  };

  const hasChanges =
    preferences &&
    displayPrefs &&
    JSON.stringify(preferences) !== JSON.stringify(displayPrefs);

  return (
    <Card className="border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#f5f0e8] font-playfair">
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-gray-400">
          Choose how you want to be notified
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-[#f5f0e8] mb-4 flex items-center gap-2">
            <LordiconWrapper
              icon={animations.email}
              size={24}
              color="#f5c842"
              state="loop"
            />
            Email Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-digest"
                  className="text-base text-[#f5f0e8]"
                >
                  Daily Digest
                </Label>
                <p className="text-sm text-gray-400">
                  Receive a daily summary of new matches and activity
                </p>
              </div>
              <Switch
                id="email-digest"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.email.dailyDigest}
                onCheckedChange={() => handleToggle("email", "dailyDigest")}
              />
            </div>

            <Separator className="bg-[#2a2a2a]" />

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-matches"
                  className="text-base text-[#f5f0e8]"
                >
                  New Matches
                </Label>
                <p className="text-sm text-gray-400">
                  Get notified when new jobs match your resume
                </p>
              </div>
              <Switch
                id="email-matches"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.email.newMatches}
                onCheckedChange={() => handleToggle("email", "newMatches")}
              />
            </div>

            <Separator className="bg-[#2a2a2a]" />

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-reminders"
                  className="text-base text-[#f5f0e8]"
                >
                  Application Reminders
                </Label>
                <p className="text-sm text-gray-400">
                  Receive reminders to follow up on applications
                </p>
              </div>
              <Switch
                id="email-reminders"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.email.applicationReminders}
                onCheckedChange={() =>
                  handleToggle("email", "applicationReminders")
                }
              />
            </div>

            <Separator className="bg-[#2a2a2a]" />

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="email-marketing"
                  className="text-base text-[#f5f0e8]"
                >
                  Marketing
                </Label>
                <p className="text-sm text-gray-400">
                  Receive tips, resources, and product updates
                </p>
              </div>
              <Switch
                id="email-marketing"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.email.marketing}
                onCheckedChange={() => handleToggle("email", "marketing")}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-[#2a2a2a]" />

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-[#f5f0e8] mb-4 flex items-center gap-2">
            <LordiconWrapper
              icon={animations.bell}
              size={24}
              color="#f5c842"
              state="loop"
            />
            Push Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="push-matches"
                  className="text-base text-[#f5f0e8]"
                >
                  New Matches
                </Label>
                <p className="text-sm text-gray-400">
                  Get instant notifications for new matches
                </p>
              </div>
              <Switch
                id="push-matches"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.push.newMatches}
                onCheckedChange={() => handleToggle("push", "newMatches")}
              />
            </div>

            <Separator className="bg-[#2a2a2a]" />

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="push-updates"
                  className="text-base text-[#f5f0e8]"
                >
                  Application Updates
                </Label>
                <p className="text-sm text-gray-400">
                  Get notified when you mark jobs as applied
                </p>
              </div>
              <Switch
                id="push-updates"
                className="data-[state=checked]:bg-[#f5c842]"
                checked={displayPrefs.push.applicationUpdates}
                onCheckedChange={() =>
                  handleToggle("push", "applicationUpdates")
                }
              />
            </div>
          </div>
        </div>

        {hasChanges && (
          <Button
            onClick={handleSave}
            className="w-full bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-bold"
            disabled={updatePreferences.isPending}
          >
            {updatePreferences.isPending ? (
              <div className="flex items-center gap-2">
                <LordiconWrapper
                  icon={animations.loading}
                  size={20}
                  color="#0d0d0d"
                  state="loop"
                />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Preferences"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
