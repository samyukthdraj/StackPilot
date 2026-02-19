"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  AppearanceSettings,
  LanguageRegionSettings,
  PreferencesSettings,
} from "@/components/settings";

export function SettingsContainer() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("utc");
  const [compactView, setCompactView] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">Settings</h1>
        <p className="text-gray-600 mt-2">
          Customize your StackPilot experience
        </p>
      </div>

      <div className="grid gap-6">
        <AppearanceSettings
          theme={theme || "system"}
          compactView={compactView}
          onThemeChange={setTheme}
          onCompactViewChange={setCompactView}
        />

        <LanguageRegionSettings
          language={language}
          timezone={timezone}
          onLanguageChange={setLanguage}
          onTimezoneChange={setTimezone}
        />

        <PreferencesSettings
          autoSave={autoSave}
          onAutoSaveChange={setAutoSave}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
