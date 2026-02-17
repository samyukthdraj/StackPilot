import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

interface AppearanceSettingsProps {
  theme: string;
  compactView: boolean;
  onThemeChange: (theme: string) => void;
  onCompactViewChange: (compact: boolean) => void;
}

export function AppearanceSettings({
  theme,
  compactView,
  onThemeChange,
  onCompactViewChange,
}: AppearanceSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LordiconWrapper
            icon={animations.theme}
            size={24}
            color="#FF6B35"
            state="loop"
          />
          Appearance
        </CardTitle>
        <CardDescription>Customize how StackPilot looks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Theme</Label>
            <p className="text-sm text-gray-600">Choose your preferred theme</p>
          </div>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label>Compact View</Label>
            <p className="text-sm text-gray-600">Show more items per page</p>
          </div>
          <Switch checked={compactView} onCheckedChange={onCompactViewChange} />
        </div>
      </CardContent>
    </Card>
  );
}
