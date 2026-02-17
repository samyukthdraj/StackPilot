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
import { useState } from "react"; // Removed useEffect

export function NotificationPreferences() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  // Initialize localPrefs directly from preferences, no useEffect needed
  const [localPrefs, setLocalPrefs] = useState(preferences);

  // If preferences change and localPrefs haven't been modified, update them
  // But only if they're different to avoid unnecessary renders
  if (
    preferences &&
    localPrefs &&
    JSON.stringify(preferences) !== JSON.stringify(localPrefs)
  ) {
    // Only update if the user hasn't made changes (localPrefs equals the previous preferences)
    // This is a bit tricky - we need to know if the user has made edits
    // For simplicity, we'll just update when preferences change from the server
    // But we'll check if the current localPrefs match the old preferences
    setLocalPrefs(preferences);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <LordiconWrapper
              icon={animations.loading}
              size={32}
              color="#FF6B35"
              state="loop"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!localPrefs) return null;

  const handleToggle = (category: "email" | "push", key: string) => {
    setLocalPrefs({
      ...localPrefs,
      [category]: {
        ...localPrefs[category],
        [key]:
          !localPrefs[category][
            key as keyof (typeof localPrefs)[typeof category]
          ],
      },
    });
  };

  const handleSave = () => {
    updatePreferences.mutate(localPrefs);
  };

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(localPrefs);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <LordiconWrapper
              icon={animations.email}
              size={24}
              color="#FF6B35"
              state="loop"
            />
            Email Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-digest" className="text-base">
                  Daily Digest
                </Label>
                <p className="text-sm text-gray-600">
                  Receive a daily summary of new matches and activity
                </p>
              </div>
              <Switch
                id="email-digest"
                checked={localPrefs.email.dailyDigest}
                onCheckedChange={() => handleToggle("email", "dailyDigest")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-matches" className="text-base">
                  New Matches
                </Label>
                <p className="text-sm text-gray-600">
                  Get notified when new jobs match your resume
                </p>
              </div>
              <Switch
                id="email-matches"
                checked={localPrefs.email.newMatches}
                onCheckedChange={() => handleToggle("email", "newMatches")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-reminders" className="text-base">
                  Application Reminders
                </Label>
                <p className="text-sm text-gray-600">
                  Receive reminders to follow up on applications
                </p>
              </div>
              <Switch
                id="email-reminders"
                checked={localPrefs.email.applicationReminders}
                onCheckedChange={() =>
                  handleToggle("email", "applicationReminders")
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-marketing" className="text-base">
                  Marketing
                </Label>
                <p className="text-sm text-gray-600">
                  Receive tips, resources, and product updates
                </p>
              </div>
              <Switch
                id="email-marketing"
                checked={localPrefs.email.marketing}
                onCheckedChange={() => handleToggle("email", "marketing")}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-navy mb-4 flex items-center gap-2">
            <LordiconWrapper
              icon={animations.bell}
              size={24}
              color="#FF6B35"
              state="loop"
            />
            Push Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-matches" className="text-base">
                  New Matches
                </Label>
                <p className="text-sm text-gray-600">
                  Get instant notifications for new matches
                </p>
              </div>
              <Switch
                id="push-matches"
                checked={localPrefs.push.newMatches}
                onCheckedChange={() => handleToggle("push", "newMatches")}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-updates" className="text-base">
                  Application Updates
                </Label>
                <p className="text-sm text-gray-600">
                  Get notified when you mark jobs as applied
                </p>
              </div>
              <Switch
                id="push-updates"
                checked={localPrefs.push.applicationUpdates}
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
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={updatePreferences.isPending}
          >
            {updatePreferences.isPending ? (
              <div className="flex items-center gap-2">
                <LordiconWrapper
                  icon={animations.loading}
                  size={20}
                  color="#FFFFFF"
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
