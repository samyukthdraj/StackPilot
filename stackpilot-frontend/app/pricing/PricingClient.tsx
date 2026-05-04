"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { Check, Sparkles } from "lucide-react";

export default function PricingClient() {
  return (
    <PremiumPageLayout>
      <section className="pt-4 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-[#f5c842]/10 border border-[#f5c842]/20 text-[#f5c842] text-sm font-semibold mb-2">
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#f5f0e8]">
            Supercharge your job search
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to optimize your resume and land your dream job. Currently accessible for free while we build the ultimate premium toolset.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="p-px rounded-2xl bg-linear-to-br from-white/10 to-transparent">
            <div className="h-full bg-[#111111] rounded-2xl p-8 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Basic Access</h3>
              <p className="text-gray-400 mb-6">Everything you need to get started right now.</p>
              <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Basic AI Resume Parsing', 'Standard ATS Scoring Algorithm', 'Live Job Search Engine', 'Job Application Tracking Console'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-[#f5c842] mr-3 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-register'))} 
                className="w-full py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white font-medium"
              >
                Get Started Free
              </button>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="p-px rounded-2xl bg-linear-to-br from-[#f5c842]/50 to-[#f5c842]/10 relative shadow-[0_0_50px_-12px_rgba(245,200,66,0.2)] transform md:-translate-y-4">
            <div className="h-full bg-linear-to-b from-[#1a1814] to-[#111111] rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="bg-[#f5c842] text-[#111] text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  COMING SOON
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#f5c842] mb-2">Pro Copilot</h3>
              <p className="text-gray-400 mb-6">Advanced AI generation capabilities via Stripe payments.</p>
              <div className="text-4xl font-bold text-white mb-6">$19<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Everything in Basic', 'AI Auto-Generated Cover Letters', 'Resume tailored to specific Job Descriptions', 'Unlimited ATS Deep Scans', 'Priority Adzuna Job Matching'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-[#f5c842] mr-3 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full py-3 rounded-lg bg-[#f5c842]/50 text-[#111] font-medium cursor-not-allowed">
                Waitlist Opening Soon
              </button>
            </div>
          </div>
        </div>
      </section>
    </PremiumPageLayout>
  );
}
