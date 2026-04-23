"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { extractErrorMessage } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authUtil } from "@/lib/api/auth";
import { PremiumWrapper } from "./premium-wrapper";
import { PremiumNavbar } from "./premium-navbar";
import { PremiumFooter } from "./premium-footer";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa6";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface PremiumPageLayoutProps {
  children: ReactNode;
}

export function PremiumPageLayout({ children }: PremiumPageLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
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
    const handleOpenLogin = () => setShowLogin(true);
    const handleOpenRegister = () => setShowRegister(true);

    window.addEventListener("open-login", handleOpenLogin);
    window.addEventListener("open-register", handleOpenRegister);

    return () => {
      window.removeEventListener("open-login", handleOpenLogin);
      window.removeEventListener("open-register", handleOpenRegister);
    };
  }, []);

  // Auto-prompt login on landing page if not authenticated
  useEffect(() => {
    if (pathname === "/" && !authUtil.isAuthenticated()) {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 1000); // 1 second delay for visual smoothness
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    if (!authUtil.isAuthenticated()) {
      authUtil.clearAuth();
    } else {
      // Redirect authenticated users away from public pages to dashboard
      router.replace("/dashboard");
    }
  }, [router]);

  const handleOAuth = (provider: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

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
        throw new Error(extractErrorMessage(errorData, "Invalid credentials"));
      }

      const jsonResponse = await response.json();
      const access_token = jsonResponse.data?.access_token || jsonResponse.access_token;
      authUtil.setToken(access_token);

      const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (profileResponse.ok) {
        const profileJson = await profileResponse.json();
        const userData = profileJson.data || profileJson;
        authUtil.setUser(userData);
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
        throw new Error(extractErrorMessage(errorData, "Registration failed"));
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

  const triggerLogin = () => {
    if (authUtil.isAuthenticated()) router.push("/dashboard");
    else {
      authUtil.clearAuth();
      setShowLogin(true);
    }
  };

  const triggerRegister = () => {
    if (authUtil.isAuthenticated()) router.push("/dashboard");
    else {
      authUtil.clearAuth();
      setShowRegister(true);
    }
  };

  return (
    <PremiumWrapper>
      <PremiumNavbar
        onLoginClick={triggerLogin}
        onRegisterClick={triggerRegister}
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
            className="w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                          onClick={() => handleOAuth("google")}
                          type="button"
                          aria-label="Sign in with Google"
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
                          onClick={() => handleOAuth("github")}
                          type="button"
                          aria-label="Sign in with GitHub"
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
                          onClick={() => handleOAuth("microsoft")}
                          type="button"
                          aria-label="Sign in with Microsoft"
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
                      {...loginForm.register("email", {
                        onChange: () => setError(null),
                      })}
                      type="text"
                      placeholder="you@example.com"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
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
                      {...loginForm.register("password", {
                        onChange: () => setError(null),
                      })}
                      type="password"
                      placeholder="••••••••"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
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
                        onClick={() => handleOAuth("google")}
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
                        onClick={() => handleOAuth("github")}
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
                        onClick={() => handleOAuth("microsoft")}
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
                      {...registerForm.register("name", {
                        onChange: () => setError(null),
                      })}
                      type="text"
                      placeholder="John Doe"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
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
                      {...registerForm.register("email", {
                        onChange: () => setError(null),
                      })}
                      type="text"
                      placeholder="you@example.com"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
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
                      {...registerForm.register("password", {
                        onChange: () => setError(null),
                      })}
                      type="password"
                      placeholder="••••••••"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
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
                      {...registerForm.register("confirmPassword", {
                        onChange: () => setError(null),
                      })}
                      type="password"
                      placeholder="••••••••"
                      className="cursor-text"
                      autoComplete="new-password"
                      data-form-type="other"
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

      {/* Main Content Rendered within Navbar and Footer bounds */}
      <main className="flex-1 w-full flex flex-col relative">
          {pathname !== "/" && (
            <div className="relative md:absolute top-0 md:top-24 left-0 md:left-12 z-50 px-4 pt-16 pb-2 md:pt-0 md:pb-0 md:px-0">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-gray-400 hover:text-[#f5c842] transition-colors bg-[#111]/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur w-fit"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          )}
          {children}
      </main>

      <PremiumFooter />
    </PremiumWrapper>
  );
}
