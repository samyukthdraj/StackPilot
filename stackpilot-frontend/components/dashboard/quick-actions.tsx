import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Briefcase, Target } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with your job search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/resumes">
          <Button className="w-full justify-start" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </Link>
        <Link href="/jobs">
          <Button className="w-full justify-start" variant="outline">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse Jobs
          </Button>
        </Link>
        <Link href="/matches">
          <Button className="w-full justify-start" variant="outline">
            <Target className="mr-2 h-4 w-4" />
            View Matches
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
