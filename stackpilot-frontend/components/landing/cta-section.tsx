"use client";

import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 bg-navy">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to find your dream job?
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Join 10,000+ professionals using StackPilot
        </p>
        <Button
          size="lg"
          className="cursor-pointer px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          onClick={onGetStarted}
        >
          Get Started Free
        </Button>
        <p className="text-sm text-gray-400 mt-4">
          No credit card required • Free forever plan
        </p>
      </div>
    </section>
  );
}
