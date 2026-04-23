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
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { animations } from "@/public/icons/lordicon";
import { apiClient } from "@/lib/api/client";
import { Resume } from "@/lib/types/api";
import Link from "next/link";
import { TruncatedText } from "@/components/shared/truncated-text";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const { user } = useAuth();
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

  // Standardized loading state with Skeletons
  const renderLoading = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-12 w-48 rounded-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );

  if (isLoading) return renderLoading();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#f5f0e8", fontFamily: "'Playfair Display', serif" }}>Your Resumes</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base" style={{ color: "#a0a0a0" }}>
            Manage and track all your uploaded resumes
          </p>
        </div>
        <Link href="/resumes/upload" className="self-start sm:self-auto">
          <Button className="bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-semibold border-none">
            Upload Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          title="No resumes yet"
          description="Upload your first resume to get started with ATS analysis and personalized job matching."
          icon={animations.resume}
          actionLabel="Upload Resume"
          actionHref="/resumes/upload"
        />
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="flex flex-col bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#f5c842]/30 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <Avatar className="h-10 w-10 border border-[#2a2a2a] bg-[#0d0d0d] group-hover:border-[#f5c842]/50 transition-colors shrink-0">
                      <AvatarFallback className="bg-transparent text-[#f5c842] font-bold">
                        {user?.name?.[0]?.toUpperCase() || resume.fileName?.[0]?.toUpperCase() || "R"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <TruncatedText 
                        text={resume.fileName} 
                        className="text-lg font-playfair text-[#f5f0e8] w-full" 
                      />
                      <CardDescription className="text-[#64748b] text-xs">
                        {formatDistanceToNow(new Date(resume.createdAt))} ago
                      </CardDescription>
                    </div>
                  </div>
                  {resume.isPrimary ? (
                    <Badge className="bg-[#f5c842] text-[#0d0d0d] font-bold border-none shrink-0 shadow-[0_0_10px_rgba(245,200,66,0.2)]">
                      Primary
                    </Badge>
                  ) : (
                    <div className="h-6 w-16" /> // Spacer to match badge height
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-5">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">ATS Score</p>
                      <span className="text-xs font-bold text-[#f5f0e8]">
                        {resume.atsScore || 0}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#0d0d0d] border border-[#2a2a2a] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${resume.atsScore || 0}%`, 
                          backgroundColor: "#f5c842",
                          boxShadow: "0 0 8px rgba(245,200,66,0.4)"
                        }}
                      />
                    </div>
                  </div>

                  {/* Skills Section with Fixed Height for Alignment */}
                  <div className="min-h-[64px]">
                    <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold mb-2">Top Skills</p>
                    {resume.structuredData?.skills && resume.structuredData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resume.structuredData.skills
                          .slice(0, 3)
                          .map((skill, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] bg-[#0d0d0d] text-[#f5f0e8] border border-[#2a2a2a] hover:border-[#f5c842]/40 transition-colors"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {resume.structuredData.skills.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] bg-[#0d0d0d] text-[#f5c842] border border-[#2a2a2a]">
                            +{resume.structuredData.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-[#444] italic">No skills extracted</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#2a2a2a]/50">
                    <p className="text-[10px] text-[#444] font-medium tracking-wide">
                      VERSION {resume.version} • UPDATED{" "}
                      {formatDistanceToNow(new Date(resume.updatedAt)).toUpperCase()} AGO
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-[#2a2a2a] flex gap-2 items-center bg-[#0d0d0d]/30 px-3 sm:px-6">
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-[10px] sm:text-xs bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8] hover:bg-[#2a2a2a] hover:text-[#f5c842] transition-all whitespace-nowrap px-1 sm:px-4"
                  onClick={() => router.push(`/resumes/${resume.id}`)}
                >
                  View Detail
                </Button>
                
                {!resume.isPrimary ? (
                  <Button
                    variant="outline"
                    className="flex-1 h-9 text-[10px] sm:text-xs bg-[#f5c842] border-none text-[#0d0d0d] font-bold hover:bg-[#d4a832] transition-all whitespace-nowrap px-1 sm:px-4"
                    onClick={() => handleSetPrimary(resume.id)}
                  >
                    Set Primary
                  </Button>
                ) : (
                  <div className="flex-1 h-9 rounded-md bg-[#0d0d0d]/50 border border-[#2a2a2a]/50 flex items-center justify-center text-[9px] sm:text-[10px] text-[#444] uppercase font-bold tracking-wider whitespace-nowrap overflow-hidden px-1">
                    Active Source
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 w-9 h-9 bg-transparent border-[#2a2a2a] hover:border-red-500/50 hover:bg-red-500/10 group/delete transition-all"
                  onClick={() => setDeleteId(resume.id)}
                >
                  <Trash2 className="w-4 h-4 text-[#666] group-hover/delete:text-red-500 transition-colors" />
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
