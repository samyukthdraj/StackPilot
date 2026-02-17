"use client";

import { Card } from "@/components/ui/card";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

const features = [
  {
    title: "Smart Resume Analysis",
    description:
      "Get detailed ATS scoring with breakdown of skills, experience, and project strength.",
    icon: animations.resume,
    color: "#FF6B35",
  },
  {
    title: "Intelligent Job Matching",
    description:
      "Find jobs that match your skills with 60% skill match weight and detailed comparisons.",
    icon: animations.match,
    color: "#FF6B35",
  },
  {
    title: "Application Tracking",
    description:
      "Save jobs, add notes, tag them, and track your application progress.",
    icon: animations.save,
    color: "#FF6B35",
  },
  {
    title: "Usage Analytics",
    description:
      "Monitor your daily usage with clear limits and upgrade suggestions.",
    icon: animations.chart,
    color: "#FF6B35",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and get recommendations to improve your matches.",
    icon: animations.search,
    color: "#FF6B35",
  },
  {
    title: "Daily Digest",
    description:
      "Get email notifications with new matches and application reminders.",
    icon: animations.email,
    color: "#FF6B35",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-linear-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-navy/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6 leading-tight">
            Everything You Need to{" "}
            <span className="gradient-text-orange">Level Up</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
            Powerful features designed specifically for developers to optimize
            their job search
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 card-hover group stagger-item border-2 border-gray-200 hover:border-orange-500/50 bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-orange-500/5 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <LordiconWrapper
                    icon={feature.icon}
                    size={72}
                    color={feature.color}
                    stroke="#0A1929"
                    state="hover"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-orange-500 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
