"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/lib/data/blog";

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  return (
    <PremiumPageLayout>
      <section className="pt-4 md:pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto relative z-10 text-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#f5f0e8]">Open Source Log</h1>
          <p className="text-gray-400 text-lg">Insights on open source engineering, career scale, and the StackPilot journey.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <Link href={`/blog/${post.slug}`} key={i}>
              <div className="group cursor-pointer bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-[#f5c842]/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(245,200,66,0.15)] hover:-translate-y-1 h-full flex flex-col">
                <div className="h-48 bg-[url('https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center relative border-b border-white/5">
                   <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                   <div className="absolute inset-0 opacity-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#f5c842]/20 to-transparent group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-[#f5c842] uppercase tracking-widest bg-[#f5c842]/10 px-2 py-1 rounded">{post.category}</span>
                    <span className="text-[11px] text-gray-500 font-medium">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#f5c842] transition-colors line-clamp-2">{post.title}</h3>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                     <span className="text-xs text-gray-400">{post.date}</span>
                     <span className="text-xs font-semibold text-white group-hover:text-[#f5c842] flex items-center transition-colors">
                       Read Post <ArrowRight className="w-3 h-3 ml-1" />
                     </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PremiumPageLayout>
  );
}
