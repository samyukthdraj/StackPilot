import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

interface LanguageRegionSettingsProps {
  language: string;
  timezone: string;
  onLanguageChange: (language: string) => void;
  onTimezoneChange: (timezone: string) => void;
}

export function LanguageRegionSettings({
  language,
  timezone,
  onLanguageChange,
  onTimezoneChange,
}: LanguageRegionSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LordiconWrapper
            icon={animations.globe}
            size={24}
            color="#FF6B35"
            state="loop"
          />
          Language & Region
        </CardTitle>
        <CardDescription>
          Set your language and regional preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Language</Label>
            <p className="text-sm text-gray-600">
              Choose your preferred language
            </p>
          </div>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <Label>Timezone</Label>
            <p className="text-sm text-gray-600">Set your local timezone</p>
          </div>
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="cst">Central Time</SelectItem>
              <SelectItem value="mst">Mountain Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
              <SelectItem value="ist">Indian Standard Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
