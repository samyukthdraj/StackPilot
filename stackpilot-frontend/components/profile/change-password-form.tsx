"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useChangePassword } from "@/lib/hooks/use-profile";
import { useAuth } from "@/lib/hooks/use-auth";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa6";
import { ShieldAlert, ShieldCheck } from "lucide-react";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const { user } = useAuth();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      await changePassword.mutateAsync(data);
      reset();
    } catch {
      // Error is handled by the mutation
    }
  };

  const isOAuthUser =
    user?.authProvider && user.authProvider !== "local";

  if (isOAuthUser) {
    const providerNames = {
      google: "Google",
      github: "GitHub",
      microsoft: "Microsoft",
    };

    const ProviderIcon = {
      google: FaGoogle,
      github: FaGithub,
      microsoft: FaMicrosoft,
    }[user.authProvider as keyof typeof providerNames] || ShieldCheck;

    const providerColor = {
      google: "#4285F4",
      github: "#ffffff",
      microsoft: "#00A4EF",
    }[user.authProvider as keyof typeof providerNames] || "#f5c842";

    return (
      <Card className="border-[#f5c842]/20 bg-linear-to-br from-[#1a1a1a] to-[#0d0d0d] overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
          <ProviderIcon size={160} />
        </div>
        <CardHeader className="relative z-10 pt-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
            <ShieldAlert className="text-accent h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
          <CardDescription className="text-[#a0a0a0] text-base max-w-md">
            You are currently signed in via{" "}
            <span className="text-[#f5c842] font-semibold">
              {providerNames[user.authProvider as keyof typeof providerNames]}
            </span>
            . Password management is handled by your identity provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6 pb-12">
          <div className="p-6 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <ProviderIcon size={24} style={{ color: providerColor }} />
              </div>
              <div>
                <p className="font-bold text-[#f5f0e8]">
                  Account strictly secured by {providerNames[user.authProvider as keyof typeof providerNames]}
                </p>
                <p className="text-sm text-gray-500">
                  Authentication is managed externally for your security.
                </p>
              </div>
            </div>
            
            <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent my-6" />
            
            <p className="text-sm text-gray-400 leading-relaxed">
              To change your password or update security settings, please visit your{" "}
              {providerNames[user.authProvider as keyof typeof providerNames]} Account Settings. StackPilot does not store your password for this account.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-accent/30 text-accent hover:bg-accent/10 transition-colors"
            onClick={() => window.open(`https://www.${user.authProvider}.com`, '_blank')}
          >
            Manage {providerNames[user.authProvider as keyof typeof providerNames]} Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <LordiconWrapper
                  icon={showCurrent ? animations.eyeOff : animations.eye}
                  size={20}
                  color="#64748B"
                  state="hover"
                />
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <LordiconWrapper
                  icon={showNew ? animations.eyeOff : animations.eye}
                  size={20}
                  color="#64748B"
                  state="hover"
                />
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}

            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Password must contain:
              </p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>At least 8 characters</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>One uppercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>One lowercase letter</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>One number</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                  <span>One special character</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <LordiconWrapper
                  icon={showConfirm ? animations.eyeOff : animations.eye}
                  size={20}
                  color="#64748B"
                  state="hover"
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LordiconWrapper
                  icon={animations.loading}
                  size={20}
                  color="#FFFFFF"
                  state="loop"
                />
                <span>Updating...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
