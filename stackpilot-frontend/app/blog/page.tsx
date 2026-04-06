"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    { title: "Defeating the ATS Filter in 2026", date: "April 2, 2026", category: "Guides", readTime: "5 min read" },
    { title: "Why Cover Letters Still Hack The System", date: "March 28, 2026", category: "Insights", readTime: "4 min read" },
    { title: "StackPilot 1.0 is Live Worldwide", date: "March 15, 2026", category: "Company Updates", readTime: "2 min read" },
    { title: "Gemini AI vs OpenAI for Resume Parsing", date: "March 10, 2026", category: "Engineering", readTime: "8 min read" },
    { title: "Optimizing PostgreSQL for Deep Text Searching", date: "March 1, 2026", category: "Engineering", readTime: "6 min read" },
    { title: "The End of the Software Engineering Interview?", date: "February 20, 2026", category: "Opinion", readTime: "7 min read" }
  ];

  return (
    <PremiumPageLayout>
      <section className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto relative z-10 text-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#f5f0e8]">The Flight Log</h1>
          <p className="text-gray-400 text-lg">Insights on engineering careers, tech scale, and the StackPilot journey.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <div key={i} className="group cursor-pointer bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#f5c842]/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(245,200,66,0.15)] hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] relative border-b border-white/5">
                 <div className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f5c842]/20 to-transparent group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-widest bg-[#f5c842]/10 px-2 py-1 rounded">{post.category}</span>
                  <span className="text-[11px] text-gray-500 font-medium">{post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#f5c842] transition-colors line-clamp-2">{post.title}</h3>
                
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                   <span className="text-xs text-gray-400">{post.date}</span>
                   <span className="text-xs font-semibold text-white group-hover:text-[#f5c842] flex items-center transition-colors">
                     Read Post <ArrowRight className="w-3 h-3 ml-1" />
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PremiumPageLayout>
  );
}
