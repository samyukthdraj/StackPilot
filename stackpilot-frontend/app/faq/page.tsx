"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";

export default function FAQPage() {
  const faqs = [
    { q: "How accurate is the ATS scoring?", a: "Our system explicitly uses Google's Gemini AI arrayed against industry-standard Application Tracking Systems rules. It extracts structure with high-precision to feedback exactly what recruiters see." },
    { q: "Is StackPilot truly free?", a: "Currently, our core parsing, dashboard tracking, and matching features are 100% free while we scale the infrastructure. A premium Pro tier will be introduced soon via Stripe for automated cover-letter and resume tailoring generation." },
    { q: "How do you source your jobs?", a: "We utilize robust integrations with global job boards like the Adzuna API to provide live, dynamic job postings strictly relevant to developers and software engineers." },
    { q: "Can I use multiple resumes?", a: "Absolutely. You can upload multiple base resumes and target them individually toward different job profiles inside your matching dashboard." },
    { q: "Are my resumes private?", a: "Yes. All resumes are securely stored on our cloud infrastructure and we adhere strictly to enterprise-grade OAuth security to make sure your PII is never compromised." }
  ];

  return (
    <PremiumPageLayout>
      <section className="pt-4 md:pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto relative z-10 text-white flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#f5f0e8]">Frequently Asked Questions</h1>
        <div className="w-full space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#111] border border-white/10 p-6 rounded-xl text-left hover:border-white/20 transition-colors">
              <h3 className="text-xl font-bold text-[#f5c842] mb-3">{faq.q}</h3>
              <p className="text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </PremiumPageLayout>
  );
}
