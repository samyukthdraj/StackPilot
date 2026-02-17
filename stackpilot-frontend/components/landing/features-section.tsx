"use client";

import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

const features = [
  {
    icon: animations.resume,
    title: "Smart Resume Analysis",
    description:
      "Upload your resume and receive instant AI-powered insights with detailed ATS scoring.",
  },
  {
    icon: animations.match,
    title: "Perfect Job Matching",
    description:
      "Our AI matches your skills with relevant opportunities tailored to your experience.",
  },
  {
    icon: animations.chart,
    title: "Detailed Analytics",
    description:
      "Track your progress with comprehensive analytics and insights into your job search.",
  },
  {
    icon: animations.save,
    title: "Application Tracking",
    description:
      "Save jobs, add notes, and track your application progress in one organized dashboard.",
  },
  {
    icon: animations.search,
    title: "Skill Gap Analysis",
    description:
      "Identify missing skills and get personalized recommendations to improve your matches.",
  },
  {
    icon: animations.email,
    title: "Smart Notifications",
    description:
      "Get email notifications with new matches and personalized job recommendations.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-4">
            Everything you need
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features for your job search
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                <LordiconWrapper
                  icon={feature.icon}
                  size={24}
                  color="#FF6B35"
                  state="hover"
                />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
