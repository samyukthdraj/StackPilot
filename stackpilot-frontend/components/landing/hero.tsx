"use client";

import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy to-navy-dark py-20 lg:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-sm text-white/90">
                Career Intelligence for Developers
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Elevate Your{" "}
              <span className="gradient-text-orange">Developer Career</span>
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Optimize your resume with AI-powered ATS scoring, find perfect job
              matches, and track your applications all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-2 border-white"
                  />
                ))}
              </div>
              <div>
                <p className="text-white font-bold">1,000+</p>
                <p className="text-white/60 text-sm">Developers trust us</p>
              </div>
            </div>
          </div>

          {/* Right content - Animated illustration */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              <LordiconWrapper
                icon={animations.upload}
                size={400}
                color="#FF6B35"
                stroke="#FFFFFF"
                state="loop"
              />
            </div>

            {/* Floating cards */}
            <div className="absolute top-20 -right-10 glass-dark p-4 rounded-xl animate-float">
              <p className="text-white font-semibold">ATS Score: 92%</p>
              <p className="text-white/60 text-sm">Top 5% of resumes</p>
            </div>

            <div className="absolute bottom-20 -left-10 glass-dark p-4 rounded-xl animate-float delay-1000">
              <p className="text-white font-semibold">124 matches found</p>
              <p className="text-white/60 text-sm">Updated just now</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
