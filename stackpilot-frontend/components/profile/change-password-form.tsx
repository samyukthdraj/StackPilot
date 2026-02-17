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
          {/* Current Password */}
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

          {/* New Password */}
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

            {/* Password Requirements */}
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

          {/* Confirm Password */}
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
            className="w-full bg-orange-500 hover:bg-orange-600"
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
