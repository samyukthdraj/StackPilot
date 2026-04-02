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
      await apiClient.delete("/auth/account");
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
      <Card className="border-[#2a2a2a] bg-[#1a1a1a] shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#f5f0e8] font-playfair flex items-center gap-2">
            <LordiconWrapper
              icon={animations.warning}
              size={24}
              color="#f5c842"
              state="loop"
            />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-gray-400">
            Irreversible actions that will affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-6 bg-[#0d0d0d] border border-red-900/20 rounded-xl shadow-inner">
            <div>
              <h4 className="font-semibold text-red-500 text-lg">Delete Account</h4>
              <p className="text-sm text-gray-400 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              className="bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-bold px-6"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-playfair text-[#f5f0e8]">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400 text-base">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-6 space-y-3">
            <Label htmlFor="confirm" className="text-[#f5f0e8]">
              Type <span className="font-bold text-[#f5c842]">DELETE</span> to confirm
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] focus:border-[#f5c842]/50 placeholder:text-gray-600"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-transparent border-[#2a2a2a] text-[#f5f0e8] hover:bg-[#2a2a2a]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
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
