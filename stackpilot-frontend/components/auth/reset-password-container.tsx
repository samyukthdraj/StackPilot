"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { extractErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please check your email link or request a new one.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Failed to reset password"));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-in">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 animate-in">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center mb-2">
            <Link href="/">
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "32px",
                  fontWeight: 900,
                  color: "#f5f0e8",
                }}
              >
                StackPilot
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
          <div className="text-center text-sm text-gray-400">
            Please enter and confirm your new password below.
          </div>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-6 pb-6">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-6 py-8 rounded-lg text-center flex flex-col items-center gap-4">
              <LordiconWrapper
                icon={animations.check}
                size={48}
                color="#10B981"
                state="loop"
              />
              <div>
                <h3 className="font-bold text-lg mb-1">Password Reset Successfully</h3>
                <p className="text-sm">You can now login with your new password. Redirecting to login...</p>
              </div>
            </div>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-dark font-semibold mt-4"
              onClick={() => router.push("/login")}
            >
              Go to Login now
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-2">
                  <LordiconWrapper
                    icon={animations.error}
                    size={24}
                    color="#EF4444"
                    state="loop"
                  />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <Input
                    {...register("password", {
                      onChange: () => setError(null),
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={!token || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    disabled={!token || isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword", {
                      onChange: () => setError(null),
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={!token || isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    disabled={!token || isLoading}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 pt-2">
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-dark font-semibold"
                disabled={isLoading || !token}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LordiconWrapper
                      icon={animations.loading}
                      size={24}
                      color="#FFFFFF"
                      state="loop"
                    />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Link
                href="/login"
                className="text-sm text-center text-gray-400 hover:text-accent font-medium transition-colors"
              >
                Back to Login
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
