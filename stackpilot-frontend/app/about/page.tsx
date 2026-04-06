"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function AboutPage() {
  return (
    <PremiumPageLayout>
      <section className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto relative z-10 text-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#f5f0e8]">
            About StackPilot
          </h1>
          <p className="text-xl text-gray-400">
            Giving developers an unfair advantage in the job market.
          </p>
        </div>
        <div className="prose prose-invert max-w-none text-gray-300 space-y-6 text-lg bg-[#111] p-10 rounded-2xl border border-white/10 leading-relaxed shadow-xl">
          <p>
            StackPilot was born out of a simple observation: the modern
            job-hunting process is fundamentally broken for engineering talent.
          </p>
          <p>
            Our architecture was designed to bridge the severe disconnect
            between what Applicant Tracking Systems natively filter out, and
            what talented engineers actually bring to the table. We believe that
            no brilliant developer should get rejected by an automated system
            before a human ever sees their code.
          </p>
          <p>
            By combining extremely fast PostgreSQL arrays, intelligent AI
            parsing through the Gemini API, and a clean, accessible UX,
            StackPilot has evolved into a premier toolsuite explicitly designed
            to flip the odds back into the job-seeker&apos;s favor.
          </p>
          <p className="pt-4 font-bold text-[#f5c842] text-xl border-t border-white/10 mt-8">
            Mission: To make algorithmic ATS rejection obsolete.
          </p>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10 text-[#f5f0e8]">
            The Team
          </h2>
          <div className="flex flex-col items-center justify-center p-8 bg-[#111] border border-white/10 rounded-2xl max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-[#f5c842] to-yellow-600 rounded-full mb-6 flex items-center justify-center text-3xl font-black text-[#111] shadow-lg">
              SD
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Samyukth Dharmarajan
            </h3>
            <p className="text-[#f5c842] font-medium text-sm mb-6">
              Founder & Architect
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/samyukthdraj"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/samyukth-dharmarajan"
                className="text-gray-400 hover:text-[#f5c842] transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PremiumPageLayout>
  );
}
