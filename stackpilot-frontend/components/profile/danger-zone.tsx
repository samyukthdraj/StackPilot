"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export function DangerZone() {
  const router = useRouter();
  const { logout } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      await apiClient.delete("/user/account");
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      logout();
      router.push("/");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <LordiconWrapper
              icon={animations.warning}
              size={24}
              color="#EF4444"
              state="loop"
            />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-red-700">Delete Account</h4>
              <p className="text-sm text-red-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="confirm">
              Type <span className="font-bold">DELETE</span> to confirm
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <LordiconWrapper
                    icon={animations.loading}
                    size={20}
                    color="#FFFFFF"
                    state="loop"
                  />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
