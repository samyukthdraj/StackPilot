import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  color: "orange" | "blue" | "green" | "purple";
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const colorMap = {
  orange: "#f5c842",
  blue: "#3b82f6",
  green: "#10b981",
  purple: "#8b5cf6",
};

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    message: "Resume uploaded",
    timestamp: "2 hours ago",
    color: "orange",
  },
  {
    id: "2",
    message: "New job matches found",
    timestamp: "5 hours ago",
    color: "blue",
  },
  {
    id: "3",
    message: "Profile updated",
    timestamp: "1 day ago",
    color: "green",
  },
];

export function RecentActivity({
  activities = defaultActivities,
}: RecentActivityProps) {
  return (
    <Card className="border" style={{ backgroundColor: "#1a1a1a", borderColor: "#2a2a2a" }}>
      <CardHeader>
        <CardTitle style={{ color: "#f5f0e8" }}>Recent Activity</CardTitle>
        <CardDescription style={{ color: "#a0a0a0" }}>Your latest job search updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={`${activity.id || 'activity'}-${index}`} className="flex items-start gap-3 transition-opacity hover:opacity-80">
              <div
                className="w-2 h-2 rounded-full mt-2"
                style={{ backgroundColor: colorMap[activity.color] || colorMap.orange }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "#f5f0e8" }}>{activity.message}</p>
                <p className="text-xs mt-1" style={{ color: "#a0a0a0" }}>{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
