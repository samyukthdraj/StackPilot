"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

export default function LandingPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (data: LoginForm) => {
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
        throw new Error(errorData.message || "Invalid credentials");
      }

      const { access_token } = await response.json();

      // Store token
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("token", access_token);

      // Fetch user profile
      const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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

      // Close the modal and show success message
      setShowRegister(false);
      setError(null);

      // Show login modal after successful registration
      setTimeout(() => {
        setShowLogin(true);
      }, 300);
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
    <div className="min-h-screen bg-white">
      <Header
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      {showLogin && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowLogin(false)}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
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
                    src="/images/stackpilot_logo.svg"
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
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
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
                    src="/images/stackpilot_logo.svg"
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-50/50 via-white to-blue-50/30" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg border border-orange-100 mb-10 animate-bounce-in hover:scale-105 transition-transform duration-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
              </span>
              <span className="text-sm font-bold text-orange-900 tracking-wide">
                🚀 AI-Powered Job Matching Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-navy mb-8 leading-[1.1] animate-fade-in-up">
              Land your dream job
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-orange-600 to-orange-500 bg-200% animate-gradient-shift">
                with confidence
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-xl lg:text-3xl text-gray-700 mb-14 leading-relaxed max-w-4xl mx-auto font-light animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              StackPilot uses{" "}
              <span className="font-semibold text-orange-600">advanced AI</span>{" "}
              to analyze your resume and match you with the{" "}
              <span className="font-semibold text-blue-600">
                perfect opportunities
              </span>
              .
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                size="lg"
                className="cursor-pointer text-xl px-12 py-8 rounded-2xl shadow-2xl bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 group"
                onClick={() => setShowRegister(true)}
              >
                <span className="flex items-center gap-3">
                  Start Free Trial
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="cursor-pointer text-xl px-12 py-8 rounded-2xl border-3 border-navy hover:bg-navy hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
                onClick={() => setShowLogin(true)}
              >
                <span className="flex items-center gap-3">Watch Demo</span>
              </Button>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl lg:text-5xl font-black text-navy mb-2 group-hover:text-orange-500 transition-colors">
                  10K+
                </div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">
                  Active Users
                </div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl lg:text-5xl font-black text-navy mb-2 group-hover:text-orange-500 transition-colors">
                  95%
                </div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">
                  Success Rate
                </div>
              </div>
              <div className="text-center group hover:scale-110 transition-transform duration-300">
                <div className="text-4xl lg:text-5xl font-black text-navy mb-2 group-hover:text-orange-500 transition-colors">
                  50K+
                </div>
                <div className="text-sm lg:text-base text-gray-600 font-medium">
                  Jobs Matched
                </div>
              </div>
            </div>
          </div>

          {/* Floating Dashboard Preview */}
          <div
            className="mt-20 relative animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 bg-linear-to-r from-orange-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
              <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-gray-200 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-linear-to-r from-navy to-navy-dark p-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-white font-semibold">
                    StackPilot Dashboard
                  </div>
                </div>
                <div className="p-8 bg-linear-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="h-3 bg-gray-200 rounded mb-3 animate-shimmer" />
                        <div className="h-8 bg-orange-100 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 animate-fade-in"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          <div className="w-12 h-12 rounded-full bg-orange-100" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-3/4" />
                            <div className="h-2 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 lg:py-40 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-b from-white via-gray-50 to-white" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100 border border-orange-200 mb-6">
              <LordiconWrapper
                icon={animations.flash}
                size={20}
                color="#FF6B35"
                state="loop"
              />
              <span className="text-sm font-bold text-orange-900 uppercase tracking-wider">
                Powerful Features
              </span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-navy mb-8 leading-tight">
              Everything you need to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-600">
                succeed
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Powerful features designed to accelerate your job search journey
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: animations.resume,
                title: "Smart Resume Analysis",
                description:
                  "Upload your resume and receive instant AI-powered insights with detailed ATS scoring and improvement suggestions.",
                color: "#FF6B35",
                gradient: "from-orange-500 to-orange-600",
              },
              {
                icon: animations.match,
                title: "Perfect Job Matching",
                description:
                  "Our advanced AI matches your skills with relevant opportunities, ensuring you never miss the perfect role.",
                color: "#3B82F6",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: animations.chart,
                title: "Detailed Analytics",
                description:
                  "Track your progress with comprehensive analytics and insights into your job search performance.",
                color: "#10B981",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: animations.save,
                title: "Application Tracking",
                description:
                  "Save jobs, add notes, tag them, and track your application progress all in one organized dashboard.",
                color: "#8B5CF6",
                gradient: "from-purple-500 to-purple-600",
              },
              {
                icon: animations.search,
                title: "Skill Gap Analysis",
                description:
                  "Identify missing skills and get personalized recommendations to improve your job match scores.",
                color: "#F59E0B",
                gradient: "from-yellow-500 to-yellow-600",
              },
              {
                icon: animations.email,
                title: "Smart Notifications",
                description:
                  "Get email notifications with new matches, application reminders, and personalized job recommendations.",
                color: "#EC4899",
                gradient: "from-pink-500 to-pink-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 stagger-item overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Border on Hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                  style={{ padding: "2px" }}
                >
                  <div className="absolute inset-[2px] bg-white rounded-3xl" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <div className="mb-8 relative">
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-10 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-500`}
                    />
                    <div
                      className={`relative inline-flex w-20 h-20 rounded-2xl bg-linear-to-br ${feature.gradient} items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                    >
                      <LordiconWrapper
                        icon={feature.icon}
                        size={40}
                        color="#FFFFFF"
                        state="hover"
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-6 flex items-center gap-2 text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    Learn more
                    <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-linear-to-br from-navy via-navy-dark to-navy" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Icons */}
            <div className="flex justify-center gap-8 mb-12 animate-fade-in-up">
              {[animations.resume, animations.match, animations.chart].map(
                (icon, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:bg-white/20 animate-bounce-in"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <LordiconWrapper
                      icon={icon}
                      size={32}
                      color="#FF6B35"
                      state="loop"
                    />
                  </div>
                ),
              )}
            </div>

            {/* Heading */}
            <h2
              className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Ready to transform your
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-orange-600 bg-200% animate-gradient-shift">
                job search?
              </span>
            </h2>

            {/* Subheading */}
            <p
              className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Join <span className="font-bold text-white">10,000+</span>{" "}
              professionals who have found their dream jobs with StackPilot
            </p>

            {/* CTA Button */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                size="lg"
                className="cursor-pointer text-xl px-16 py-8 rounded-2xl shadow-2xl bg-white text-navy hover:bg-gray-100 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 group font-bold"
                onClick={() => setShowRegister(true)}
              >
                <span className="flex items-center gap-3">
                  Get Started for Free
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center gap-2 text-white/80">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Free forever plan</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
