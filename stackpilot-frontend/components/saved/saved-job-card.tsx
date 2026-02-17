"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { SavedJob } from "@/lib/types/api";
import { cn } from "@/lib/utils";
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
import {
  useDeleteSavedJob,
  useUpdateSavedJob,
} from "@/lib/hooks/use-saved-jobs";
import { toast } from "@/components/ui/use-toast";

interface SavedJobCardProps {
  savedJob: SavedJob;
  onUpdate?: () => void;
  className?: string;
}

export function SavedJobCard({
  savedJob,
  onUpdate,
  className,
}: SavedJobCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const deleteMutation = useDeleteSavedJob();
  const updateMutation = useUpdateSavedJob();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(savedJob.id);
    setShowDeleteDialog(false);
    onUpdate?.();
  };

  const handleToggleApplied = async () => {
    setIsUpdating(true);
    try {
      await updateMutation.mutateAsync({
        id: savedJob.id,
        data: { applied: !savedJob.applied },
      });
      toast({
        title: savedJob.applied ? "Marked as not applied" : "Marked as applied",
        description: savedJob.applied
          ? "Job moved back to pending"
          : "Good luck with your application!",
      });
      onUpdate?.();
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (applied?: boolean) => {
    return applied
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <>
      <Card
        className={cn(
          "group card-hover border-2 border-gray-200 hover:border-orange-500/50 overflow-hidden relative",
          className,
        )}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-orange-500/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1">
              <Link
                href={`/jobs/${savedJob.job.id}`}
                className="hover:underline"
              >
                <h3 className="text-xl font-bold text-navy group-hover:text-orange-500 transition-colors duration-300 mb-2">
                  {savedJob.job.title}
                </h3>
              </Link>
              <p className="text-gray-600 font-medium">
                {savedJob.job.company}
              </p>
            </div>

            {/* Status Badge */}
            <Badge
              className={cn(
                "ml-2 px-3 py-1 font-semibold transition-all duration-300 hover:scale-105",
                getStatusColor(savedJob.applied),
              )}
            >
              {savedJob.applied ? "✓ Applied" : "⏳ Pending"}
            </Badge>
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {savedJob.job.location && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 group/item">
                <div className="transition-transform duration-300 group-hover/item:scale-110">
                  <LordiconWrapper
                    icon={animations.location}
                    size={18}
                    color="#FF6B35"
                    state="morph"
                  />
                </div>
                <span className="truncate font-medium">
                  {savedJob.job.location}
                </span>
              </div>
            )}
            {savedJob.job.salaryMin && savedJob.job.salaryMax && (
              <div className="flex items-center gap-2.5 text-sm text-gray-700 group/item">
                <div className="transition-transform duration-300 group-hover/item:scale-110">
                  <LordiconWrapper
                    icon={animations.salary}
                    size={18}
                    color="#10B981"
                    state="morph"
                  />
                </div>
                <span className="font-semibold">
                  ${savedJob.job.salaryMin.toLocaleString()}-$
                  {savedJob.job.salaryMax.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Notes Preview */}
          {savedJob.notes && (
            <div className="mb-5 p-4 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-md">
              <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                <span className="font-bold text-navy">💭 Notes:</span>{" "}
                {savedJob.notes}
              </p>
            </div>
          )}

          {/* Tags */}
          {savedJob.tags && savedJob.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {savedJob.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-medium px-3 py-1 bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200 transition-all duration-300 hover:scale-105"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Saved{" "}
              {savedJob.createdAt
                ? formatDistanceToNow(new Date(savedJob.createdAt))
                : "recently"}{" "}
              ago
            </span>
            {savedJob.appliedAt && (
              <span>
                Applied {formatDistanceToNow(new Date(savedJob.appliedAt))} ago
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-linear-to-r from-gray-50 to-orange-50/30 border-t border-gray-200 flex gap-3">
          <Link href={`/saved/${savedJob.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full font-semibold hover:bg-orange-50 hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
            >
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleToggleApplied}
            disabled={isUpdating}
            className={cn(
              "flex-1 font-semibold transition-all duration-300",
              savedJob.applied
                ? "text-green-600 border-green-600 hover:bg-green-50"
                : "hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600",
            )}
          >
            {isUpdating ? (
              <LordiconWrapper
                icon={animations.loading}
                size={18}
                color="#0A1929"
                state="loop"
              />
            ) : savedJob.applied ? (
              "✓ Applied"
            ) : (
              "Mark Applied"
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:scale-110"
          >
            <LordiconWrapper
              icon={animations.delete}
              size={22}
              color="#EF4444"
              state="hover"
            />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove saved job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the job from your saved list. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
