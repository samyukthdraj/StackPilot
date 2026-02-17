"use client";

import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

export function HeroSection({ onGetStarted, onWatchDemo }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 bg-linear-to-b from-orange-50/30 via-white to-white" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-orange-900">
              AI-Powered Job Matching
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-navy mb-6 leading-tight animate-fade-in-up">
            Land your dream job
            <br />
            <span className="text-orange-500">with confidence</span>
          </h1>

          <p
            className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            StackPilot uses advanced AI to analyze your resume and match you
            with the perfect opportunities.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              size="lg"
              className="cursor-pointer text-base px-8 py-6 rounded-xl bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={onGetStarted}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer text-base px-8 py-6 rounded-xl border-2 border-gray-300 hover:border-navy hover:bg-gray-50 transition-all duration-300"
              onClick={onWatchDemo}
            >
              Watch Demo
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-navy mb-1">10K+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy mb-1">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-navy mb-1">50K+</div>
              <div className="text-sm text-gray-600">Jobs Matched</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
