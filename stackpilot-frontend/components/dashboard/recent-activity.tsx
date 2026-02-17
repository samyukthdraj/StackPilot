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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest job search updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
