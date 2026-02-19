"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PremiumWrapper } from "./premium-wrapper";
import { PremiumCursor } from "./premium-cursor";
import { PremiumNavbar } from "./premium-navbar";
import { PremiumHero } from "./premium-hero";
import { PremiumMarquee } from "./premium-marquee";
import { PremiumFeatures } from "./premium-features";
import { PremiumStats } from "./premium-stats";
import { PremiumHowItWorks } from "./premium-how-it-works";
import { PremiumCTA } from "./premium-cta";
import { PremiumFooter } from "./premium-footer";
import Image from "next/image";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function PremiumLandingContainer() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    const loginTimestamp = localStorage.getItem("login_timestamp");

    if (token && loginTimestamp) {
      const now = Date.now();
      const loginTime = parseInt(loginTimestamp, 10);
      const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

      if (now - loginTime <= SESSION_TIMEOUT) {
        router.replace("/dashboard");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_timestamp");
      }
    }
  }, [router]);

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const { access_token } = await response.json();
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("token", access_token);

      const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (profileResponse.ok) {
        const userData = await profileResponse.json();
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

  const handleRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setShowRegister(false);
      setError(null);
      setTimeout(() => setShowLogin(true), 300);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PremiumWrapper>
      <PremiumCursor />
      <PremiumNavbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      {showLogin && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          style={{ cursor: "auto !important" }}
          onClick={() => setShowLogin(false)}
        >
          <div
            className="w-full max-w-md"
            style={{ cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-2 relative">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 cursor-pointer p-1 hover:bg-gray-100 rounded-full z-50"
              >
                <svg
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
              </button>
              <CardHeader>
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/stackpilot_logo_bg_removed_upscaled.png"
                    alt="StackPilot"
                    width={180}
                    height={60}
                    className="h-32 w-auto"
                  />
                </div>
                <CardTitle className="text-2xl text-center">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials
                </CardDescription>
              </CardHeader>
              <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...loginForm.register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className="cursor-text bg-white"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      {...loginForm.register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="cursor-text bg-white"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <p className="text-sm text-center">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                      }}
                      className="text-orange-500 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </p>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      )}

      {showRegister && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          style={{ cursor: "auto" }}
          onClick={() => setShowRegister(false)}
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-2 relative">
              <button
                onClick={() => setShowRegister(false)}
                className="absolute top-6 right-6 cursor-pointer p-1 hover:bg-gray-100 rounded-full z-50"
              >
                <svg
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
              </button>
              <CardHeader>
                <div className="flex justify-center mb-6">
                  <Image
                    src="/images/stackpilot_logo_bg_removed_upscaled.png"
                    alt="StackPilot"
                    width={180}
                    height={60}
                    className="h-32 w-auto"
                  />
                </div>
                <CardTitle className="text-2xl text-center">
                  Create an account
                </CardTitle>
                <CardDescription className="text-center">
                  Get started with StackPilot
                </CardDescription>
              </CardHeader>
              <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                <CardContent className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      {...registerForm.register("name")}
                      placeholder="John Doe"
                      className="cursor-text bg-white"
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...registerForm.register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className="cursor-text bg-white"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      {...registerForm.register("password")}
                      type="password"
                      placeholder="••••••••"
                      className="cursor-text bg-white"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Confirm Password
                    </label>
                    <Input
                      {...registerForm.register("confirmPassword")}
                      type="password"
                      placeholder="••••••••"
                      className="cursor-text bg-white"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                  <p className="text-sm text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                      }}
                      className="text-orange-500 cursor-pointer"
                    >
                      Login
                    </button>
                  </p>
                </CardContent>
              </form>
            </Card>
          </div>
        </div>
      )}

      <PremiumHero
        onGetStarted={() => setShowRegister(true)}
        onWatchDemo={() => setShowLogin(true)}
      />
      <PremiumMarquee />
      <PremiumFeatures />
      <PremiumStats />
      <PremiumHowItWorks />
      <PremiumCTA onGetStarted={() => setShowRegister(true)} />
      <PremiumFooter />
    </PremiumWrapper>
  );
}
