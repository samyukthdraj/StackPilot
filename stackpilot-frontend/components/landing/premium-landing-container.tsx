"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Clear forms when modals are opened
  useEffect(() => {
    if (showLogin) {
      // Use setTimeout to ensure form is cleared after browser autofill
      setTimeout(() => {
        loginForm.reset({
          email: "",
          password: "",
        });
      }, 0);
      setError(null);
    }
  }, [showLogin, loginForm]);

  useEffect(() => {
    if (showRegister) {
      // Use setTimeout to ensure form is cleared after browser autofill
      setTimeout(() => {
        registerForm.reset({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 0);
      setError(null);
    }
  }, [showRegister, registerForm]);

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
      localStorage.setItem("login_timestamp", Date.now().toString());

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
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 modal-overlay"
          style={{ cursor: "auto !important" }}
          onClick={() => setShowLogin(false)}
        >
          <div className="modal-background-effects">
            <div className="modal-glow modal-glow-1" />
            <div className="modal-glow modal-glow-2" />
          </div>
          <div
            className="w-full max-w-md"
            style={{ cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-2 relative modal-card animate-in">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 p-1 hover:bg-gray-800 rounded-full z-50 text-gray-400 hover:text-gray-200 transition-colors"
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
              <CardHeader className="space-y-4 pb-8">
                <div className="flex justify-center mb-2">
                  <div
                    className="premium-logo"
                    style={{
                      fontSize: "32px",
                      fontWeight: 900,
                      color: "#f5f0e8",
                    }}
                  >
                    StackPilot
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">
                  Welcome back
                </CardTitle>
                <CardDescription className="text-center pb-2">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                autoComplete="new-password"
              >
                <CardContent className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...loginForm.register("email")}
                      type="text"
                      placeholder="you@example.com"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
                      onChange={() => setError(null)}
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
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
                      onChange={() => setError(null)}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.password.message}
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
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <p className="text-sm text-center text-gray-400">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                      }}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      )}

      {showRegister && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 modal-overlay"
          style={{ cursor: "auto" }}
          onClick={() => setShowRegister(false)}
        >
          <div className="modal-background-effects">
            <div className="modal-glow modal-glow-1" />
            <div className="modal-glow modal-glow-2" />
          </div>
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-2 relative modal-card animate-in">
              <button
                onClick={() => setShowRegister(false)}
                className="absolute top-6 right-6 p-1 hover:bg-gray-800 rounded-full z-50 text-gray-400 hover:text-gray-200 transition-colors"
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
              <CardHeader className="space-y-4 pb-8">
                <div className="flex justify-center mb-2">
                  <div
                    className="premium-logo"
                    style={{
                      fontSize: "32px",
                      fontWeight: 900,
                      color: "#f5f0e8",
                    }}
                  >
                    StackPilot
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">
                  Create an account
                </CardTitle>
                <CardDescription className="text-center pb-2">
                  Enter your details to get started with StackPilot
                </CardDescription>
              </CardHeader>
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                autoComplete="new-password"
              >
                <CardContent className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      {...registerForm.register("name")}
                      type="text"
                      placeholder="John Doe"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
                      onChange={() => setError(null)}
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
                      type="text"
                      placeholder="you@example.com"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
                      onChange={() => setError(null)}
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
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
                      onChange={() => setError(null)}
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
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
                      onChange={() => setError(null)}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
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
                    {isLoading ? "Creating..." : "Create Account"}
                  </Button>
                  <p className="text-sm text-center text-gray-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                      }}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      Login
                    </button>
                  </p>
                </CardFooter>
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
