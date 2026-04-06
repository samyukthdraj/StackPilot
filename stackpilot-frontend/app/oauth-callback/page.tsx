"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PremiumWrapper } from "@/components/landing/premium-wrapper";
import { PremiumCursor } from "@/components/landing/premium-cursor";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("Authentication failed. No token received.");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // Save token
      localStorage.setItem("access_token", token);
      localStorage.setItem("token", token);
      localStorage.setItem("login_timestamp", Date.now().toString());

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const profileResponse = await fetch(`${apiUrl}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          localStorage.setItem("user", JSON.stringify(userData));
          router.push("/dashboard");
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch {
        setError("Error completing authentication. Please try again.");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0d0d0d]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f5c842] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f5c842] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="z-10 flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/2 border border-white/5 backdrop-blur-xl shadow-2xl">
        {error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <LordiconWrapper
                icon={animations.error}
                size={32}
                color="#ef4444"
                state="loop"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">
                Authentication Error
              </h2>
              <p className="text-gray-400">{error}</p>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting you back...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#f5c842]/10 flex items-center justify-center border border-[#f5c842]/20">
              <LordiconWrapper
                icon={animations.loading}
                size={32}
                color="#f5c842"
                state="loop"
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#f5f0e8] mb-2 font-playfair tracking-tight">
                Authenticating
              </h2>
              <p className="text-[#a0a0a0]">
                Securely completing your sign in...
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <PremiumWrapper>
      <PremiumCursor />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
            <LordiconWrapper
              icon={animations.loading}
              size={32}
              color="#f5c842"
              state="loop"
            />
          </div>
        }
      >
        <OAuthCallbackContent />
      </Suspense>
    </PremiumWrapper>
  );
}
