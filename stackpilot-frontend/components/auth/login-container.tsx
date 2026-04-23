"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { extractErrorMessage } from "@/lib/utils";
import { authUtil } from "@/lib/api/auth";
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
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa6";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

type LoginForm = z.infer<typeof loginSchema>;
type ForgotForm = z.infer<typeof forgotSchema>;

export function LoginContainer() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<"login" | "forgot_password">("login");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    reset({ email: "", password: "" });
    if (authUtil.isAuthenticated() && authUtil.getUser()) {
      router.replace("/dashboard");
    } else if (localStorage.getItem("token") || localStorage.getItem("access_token")) {
      authUtil.clearAuth();
    }
  }, [reset, router]);

  const handleOAuth = (provider: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Invalid credentials"));
      }

      const jsonResponse = await response.json();
      const access_token = jsonResponse.data?.access_token || jsonResponse.access_token;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("token", access_token);
      localStorage.setItem("login_timestamp", Date.now().toString());

      const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (profileResponse.ok) {
        const profileJson = await profileResponse.json();
        const userData = profileJson.data || profileJson;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(extractErrorMessage(errorData, "Failed to send reset email"));
      }

      setSuccessMessage("Password reset link sent to your email.");
      resetForgot();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process request. Please try again.",
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
        <Link
          href="/"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors z-20 rounded-full p-1 hover:bg-gray-800"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Link>
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
          <CardTitle className="text-2xl text-center">
            {view === "login" ? "Welcome back" : "Reset Password"}
          </CardTitle>
          {view === "login" ? (
            <>
              <div className="flex flex-col space-y-6 pt-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      Google
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-full h-12 bg-white/3 border-[#2a2a2a] hover:border-[#f5c842] hover:bg-white/8 transition-all duration-300 group"
                      onClick={() => handleOAuth('google')}
                      type="button"
                    >
                      <FaGoogle className="h-5 w-5 text-gray-400 group-hover:text-[#f5c842] transition-colors" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      GitHub
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-full h-12 bg-white/3 border-[#2a2a2a] hover:border-[#f5c842] hover:bg-white/8 transition-all duration-300 group"
                      onClick={() => handleOAuth('github')}
                      type="button"
                    >
                      <FaGithub className="h-5 w-5 text-gray-400 group-hover:text-[#f5c842] transition-colors" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      Microsoft
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-full h-12 bg-white/3 border-[#2a2a2a] hover:border-[#f5c842] hover:bg-white/8 transition-all duration-300 group"
                      onClick={() => handleOAuth('microsoft')}
                      type="button"
                    >
                      <FaMicrosoft className="h-5 w-5 text-gray-400 group-hover:text-[#f5c842] transition-colors" />
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#2a2a2a]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#1a1a1a] px-3 text-gray-500 tracking-widest font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </CardHeader>

        {view === "login" ? (
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
                <label className="text-sm font-medium">Email</label>
                <Input
                  {...register("email", {
                    onChange: () => setError(null),
                  })}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="off"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot_password");
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-accent hover:text-accent/80 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    {...register("password", {
                      onChange: () => setError(null),
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
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
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 pt-2">
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-dark font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LordiconWrapper
                      icon={animations.loading}
                      size={24}
                      color="#FFFFFF"
                      state="loop"
                    />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>

              <p className="text-sm text-center text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleSubmitForgot(onForgotSubmit)}>
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
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-2">
                  <LordiconWrapper
                    icon={animations.check}
                    size={24}
                    color="#10B981"
                    state="loop"
                  />
                  {successMessage}
                </div>
              )}

              <div className="space-y-1 text-center text-sm text-gray-400 pb-2">
                Enter your registered email address and we'll send you a link to reset your password.
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  {...registerForgot("email", {
                    onChange: () => {
                      setError(null);
                      setSuccessMessage(null);
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="off"
                />
                {forgotErrors.email && (
                  <p className="text-sm text-red-500">{forgotErrors.email.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-5 pt-2">
              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-dark font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LordiconWrapper
                      icon={animations.loading}
                      size={24}
                      color="#FFFFFF"
                      state="loop"
                    />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-sm text-center text-accent hover:text-accent/80 font-medium"
              >
                Back to Login
              </button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
