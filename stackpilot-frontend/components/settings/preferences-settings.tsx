import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

interface PreferencesSettingsProps {
  autoSave: boolean;
  onAutoSaveChange: (autoSave: boolean) => void;
}

export function PreferencesSettings({
  autoSave,
  onAutoSaveChange,
}: PreferencesSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LordiconWrapper
            icon={animations.settings}
            size={24}
            color="#FF6B35"
            state="loop"
          />
          Preferences
        </CardTitle>
        <CardDescription>Additional settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Auto-save Matches</Label>
            <p className="text-sm text-gray-600">
              Automatically save new job matches
            </p>
          </div>
          <Switch checked={autoSave} onCheckedChange={onAutoSaveChange} />
        </div>
      </CardContent>
    </Card>
  );
}
