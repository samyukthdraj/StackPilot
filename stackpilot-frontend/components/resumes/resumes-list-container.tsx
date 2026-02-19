"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { apiClient } from "@/lib/api/client";
import { Resume } from "@/lib/types/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

export function ResumesListContainer() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await apiClient.get("/resumes");
      setResumes(response.data);
    } catch {
      console.error("Error fetching resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await apiClient.patch(`/resumes/${id}`, { isPrimary: true });
      toast({
        title: "Success",
        description: "Primary resume updated",
      });
      fetchResumes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update primary resume",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(`/resumes/${deleteId}`);
      toast({
        title: "Success",
        description: "Resume deleted successfully",
      });
      fetchResumes();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LordiconWrapper
          icon={animations.loading}
          size={64}
          color="#FF6B35"
          state="loop"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Your Resumes</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all your uploaded resumes
          </p>
        </div>
      </div>

      {resumes.length === 0 ? (
        <Card className="p-12 text-center">
          <LordiconWrapper
            icon={animations.empty}
            size={96}
            color="#94A3B8"
            state="loop"
          />
          <h3 className="text-xl font-semibold text-navy mt-6">
            No resumes yet
          </h3>
          <p className="text-gray-600 mt-2">
            Upload your first resume to get started with ATS analysis and job
            matching.
          </p>
          <Link href="/resumes/upload">
            <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
              Upload Resume
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <LordiconWrapper
                      icon={animations.resume}
                      size={40}
                      color="#0A1929"
                      state="morph"
                    />
                    <div>
                      <CardTitle className="text-lg truncate max-w-37.5">
                        {resume.fileName}
                      </CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(new Date(resume.createdAt))} ago
                      </CardDescription>
                    </div>
                  </div>
                  {resume.isPrimary && (
                    <Badge className="bg-orange-500">Primary</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">ATS Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${resume.atsScore || 0}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-navy">
                        {resume.atsScore || 0}%
                      </span>
                    </div>
                  </div>

                  {resume.structuredData?.skills && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Top Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {resume.structuredData.skills
                          .slice(0, 3)
                          .map((skill, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {resume.structuredData.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resume.structuredData.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-600">
                    Version {resume.version} • Updated{" "}
                    {formatDistanceToNow(new Date(resume.updatedAt))} ago
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/resumes/${resume.id}`)}
                >
                  View
                </Button>
                {!resume.isPrimary && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleSetPrimary(resume.id)}
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setDeleteId(resume.id)}
                >
                  <LordiconWrapper
                    icon={animations.delete}
                    size={20}
                    color="#EF4444"
                    state="hover"
                  />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
