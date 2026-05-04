"use client";
import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { BlogPost } from "@/lib/data/blog";

export default function BlogPostClient({ post }: { post: BlogPost }) {
  return (
    <PremiumPageLayout>
      <article className="pt-4 md:pt-32 pb-24 px-4 md:px-8 max-w-3xl mx-auto relative z-10 text-white">

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-[#f5c842] hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>

        {/* Header */}
        <header className="mb-12 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold text-[#f5c842] uppercase tracking-widest bg-[#f5c842]/10 px-3 py-1.5 rounded flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> {post.category}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f5c842]/20 flex items-center justify-center text-[#f5c842] font-bold text-sm shrink-0">
              {post.author[0]}
            </div>
            <span className="text-sm text-gray-300 font-medium">{post.author}</span>
          </div>
        </header>

        {/* Article Body */}
        <div className="space-y-10">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-2xl font-bold text-white mb-4 mt-2">{section.heading}</h2>
              )}
              <div
                className="text-[17px] leading-[1.9] text-gray-300"
                dangerouslySetInnerHTML={{ __html: section.body }}
              />
              {section.quote && (
                <blockquote className="mt-7 border-l-4 border-[#f5c842] pl-5 py-1 italic text-gray-400 text-[17px] leading-relaxed">
                  {section.quote}
                </blockquote>
              )}
              {section.code && (
                <pre className="mt-6 bg-black border border-white/10 rounded-xl p-5 text-sm text-green-400 overflow-x-auto font-mono leading-relaxed">
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>

        <div className="mt-20 p-8 bg-[#111] border border-[#f5c842]/20 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-white mb-3">See how your resume actually scores</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Upload your resume, get an instant ATS score, and match against live developer jobs — for free.
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event("open-register"))}
            className="inline-block bg-black text-white font-bold px-8 py-3 rounded-full border border-white/20 hover:border-[#f5c842] hover:text-[#f5c842] transition-all duration-300"
          >
            Try StackPilot Free
          </button>
        </div>

      </article>
    </PremiumPageLayout>
  );
}
