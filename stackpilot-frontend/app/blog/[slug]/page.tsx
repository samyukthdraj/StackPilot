"use client";

import { PremiumPageLayout } from "@/components/landing/premium-page-layout";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

type Section = {
  heading?: string;
  body: string;
  quote?: string;
  code?: string;
};

type BlogPost = {
  title: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  excerpt: string;
  sections: Section[];
};

const blogContent: Record<string, BlogPost> = {

  // ────────────────────────────────────────────────────────────────────
  // POST 1
  // ────────────────────────────────────────────────────────────────────
  "defeating-ats-filter-oss": {
    title: "Defeating the ATS Filter in 2026: What Developers Need to Know",
    date: "April 2, 2026",
    category: "Guides",
    readTime: "5 min read",
    author: "StackPilot Engineering",
    excerpt: "75% of resumes are rejected by Applicant Tracking Systems before a single human reads them. Here's how StackPilot's AI-powered ATS scorer helps you beat that statistic.",
    sections: [
      {
        body: `If you've ever submitted a polished resume and heard nothing back, chances are you didn't fail the interview — you failed an algorithm. According to widely cited industry data, <strong>75% of resumes are filtered out by Applicant Tracking Systems (ATS)</strong> before they ever reach the desk of a recruiter or hiring manager. For developers, this is a particularly painful problem: the very people who build software are being screened out by software.`
      },
      {
        heading: "What Exactly Is an ATS?",
        body: `An Applicant Tracking System is software used by companies to manage the flood of job applications they receive. When you submit your resume through LinkedIn, Indeed, or a company's career portal, it usually gets ingested by an ATS — systems like Workday, Greenhouse, Lever, or iCIMS — which parses your PDF into structured fields and scores it against the job description.
        <br/><br/>
        The problem is that most of these parsers were built years ago using brittle rule-based logic and regular expressions. They struggle with multi-column layouts, tables, fancy fonts, text embedded inside images or headers, and non-standard section names. A resume that looks stunning in Figma can be completely unreadable to a 2015-era ATS.`
      },
      {
        heading: "How StackPilot's ATS Scorer Works",
        body: `StackPilot approaches this problem differently. When you upload a PDF resume to StackPilot, our backend uses the <strong>Gemini API</strong> — Google DeepMind's generative AI — to semantically extract structured information from your document. This means it understands context, not just keywords. It doesn't just look for the word "TypeScript" — it understands that "built a React/TS monorepo" implies TypeScript proficiency.
        <br/><br/>
        After extraction, your resume data is scored across <strong>6 weighted categories</strong>:`,
        code: `Skill Match           → 90% weight factor
Project Strength      → 75% weight factor
Experience Relevance  → 80% weight factor
Resume Structure      → 95% weight factor
Keyword Density       → 85% weight factor
Action Verbs          → 70% weight factor`
      },
      {
        heading: "What You Can Do Right Now",
        body: `Here are concrete, actionable changes to your resume that consistently improve ATS scores inside StackPilot and across most commercial ATS platforms:
        <br/><br/>
        <ul style="padding-left:24px; list-style: disc; margin-bottom: 20px; line-height: 2;">
          <li><strong>Use a single-column layout.</strong> Multi-column PDFs confuse parsers — text is extracted in random order. Clean, top-to-bottom single column is reliably parsed.</li>
          <li><strong>Use standard section headers.</strong> "Experience", "Education", "Skills", "Projects" — not "My Journey" or "What I've Built". ATS parsers look for canonical labels.</li>
          <li><strong>Mirror keywords from the JD exactly.</strong> If the job says "Kubernetes", don't write "K8s". If it says "TypeScript", not "TS". Exact string matching still matters for legacy parsers.</li>
          <li><strong>Avoid headers, footers, and text boxes.</strong> Most parsers skip content outside the main document body. Put your contact info in the body proper.</li>
          <li><strong>Lead with strong action verbs.</strong> "Architected", "Deployed", "Reduced" — not "Responsible for" or "Helped with". StackPilot's scoring engine gives significant weight to the 70 most impactful engineering action verbs.</li>
        </ul>
        Run your resume through StackPilot's free ATS scan to see your exact score breakdown across all six categories, along with the specific keywords our system detected versus those it missed.`,
        quote: `"75% of resumes are rejected before a human ever reads them. Stop submitting blind — know your score before you apply."`
      },
      {
        heading: "Skill Gap Identification",
        body: `One of StackPilot's most differentiating features is skill gap analysis. After scoring your resume against a target job, we surface which skills appear prominently in the job description that are absent or underrepresented in your resume. This tells you exactly what to highlight, add, or develop before your next application — turning a 62% match into a 89% match.`
      }
    ]
  },

  // ────────────────────────────────────────────────────────────────────
  // POST 2
  // ────────────────────────────────────────────────────────────────────
  "why-contributing-matters": {
    title: "Why Your Job Search Is Taking 11 Hours a Week — and How to Fix It",
    date: "March 28, 2026",
    category: "Insights",
    readTime: "4 min read",
    author: "StackPilot Team",
    excerpt: "The average developer spends 11 hours a week searching for relevant job opportunities. StackPilot's intelligent matching algorithm is built to change that.",
    sections: [
      {
        body: `Developer job searching in 2026 is paradoxically harder than it was a decade ago. There are more jobs, more platforms, more filters — and yet finding the <em>right</em> opportunity still takes an astonishing amount of manual effort. Research from the broader recruiting industry consistently surfaces the same number: <strong>job seekers spend approximately 11 hours per week</strong> just searching for relevant positions. For a full-time developer who is also working, that's a second job layered on top of the first.`
      },
      {
        heading: "The Problem with Generic Job Boards",
        body: `Platforms like Indeed, LinkedIn, and Glassdoor are built around a search-box model. You type a title ("Senior Backend Engineer"), pick a location, maybe set a salary range — and get back thousands of loosely ranked results. The burden of matching is entirely on you.
        <br/><br/>
        Most of those results have already been open for weeks. Many are no longer actively being filled. A significant portion require skills you don't have yet, in stacks you've never used. You spend 45 minutes reading a job description only to apply and never hear back, because your resume scored below their internal threshold for a keyword you didn't think to include.`,
        quote: `"Poor job-skill matching leads to wasted applications. StackPilot was built specifically to solve this."`
      },
      {
        heading: "How StackPilot's Matching Algorithm Works",
        body: `StackPilot pulls live jobs from the <strong>Adzuna API</strong>, one of the largest real-time job aggregators, syncing roles across countries, stacks, and experience levels. When you upload your resume, our scoring engine computes a weighted match score for every available job using the following formula:`,
        code: `Match Score Breakdown:
─────────────────────────────
  Skill Match           60%
  Keyword Relevance     25%
  Experience Level      10%
  Job Recency           5%
─────────────────────────────
Total Score:           0–100%`
      },
      {
        heading: "Real-Time, Filtered, Ranked",
        body: `You don't need to search. StackPilot's job feed shows you the matches we've already computed for your profile — ranked by match score, filterable by country, salary, role type, and date posted. Each match card shows you the score, which skills we detected in both your resume and the job description, and which skills are missing.
        <br/><br/>
        Instead of spending 11 hours browsing, you spend 11 minutes reviewing the roles where you already have a strong signal.`
      },
      {
        heading: "Application Tracking — Built In",
        body: `StackPilot also includes a lightweight job application tracker. Save roles you're interested in, mark them as Applied, and add personal notes or tags. A personal statistics dashboard tracks how many resumes you've scanned, how many jobs you've applied to, and how your match scores trend over time — giving you a clear picture of whether your resume improvements are actually paying off.`
      }
    ]
  },

  // ────────────────────────────────────────────────────────────────────
  // POST 3
  // ────────────────────────────────────────────────────────────────────
  "stackpilot-open-core": {
    title: "StackPilot 1.0: What We Built, How We Built It, and What's Next",
    date: "March 15, 2026",
    category: "Company Updates",
    readTime: "2 min read",
    author: "Samyukth Dharmarajan, Founder",
    excerpt: "A technical deep-dive into the architecture of StackPilot 1.0 — our AI-powered career intelligence platform built entirely on TypeScript.",
    sections: [
      {
        body: `StackPilot 1.0 is now live at <a href="https://stackpilot-jext.onrender.com" target="_blank" rel="noopener noreferrer" style="color:#f5c842;text-decoration:underline;">stackpilot-jext.onrender.com</a>. This post is a transparent account of what we built, the architectural decisions we made, and what's on the roadmap.`
      },
      {
        heading: "The Stack",
        body: `StackPilot is a TypeScript-first, full-stack application:`,
        code: `Frontend:
  Next.js 16 (App Router) + React 19
  TypeScript (strict mode)
  Tailwind CSS v4
  TanStack Query + Zustand (state)
  React Hook Form + Zod (validation)
  Recharts (data visualization)

Backend:
  NestJS 10 + TypeScript (strict mode)
  PostgreSQL on Neon (serverless)
  TypeORM
  JWT + Passport + OAuth (Google, GitHub, Microsoft)
  Gemini API (AI resume parsing)
  Adzuna API (live job data)
  Nodemailer + Handlebars (email)
  @nestjs/schedule (cron jobs)`
      },
      {
        heading: "What Phase 1 (MVP) Shipped",
        body: `The 1.0 release ships a complete, end-to-end career intelligence platform:
        <br/><br/>
        <ul style="padding-left:24px; list-style: disc; margin-bottom: 20px; line-height: 2.2;">
          <li><strong>Authentication</strong> — JWT-based auth with Google, GitHub, and Microsoft OAuth. Passwords hashed with bcrypt. Rate limiting and input validation via class-validator and Zod.</li>
          <li><strong>Resume parsing</strong> — PDF upload processed through the Gemini API for semantic entity extraction: skills, job titles, experience, education, projects.</li>
          <li><strong>ATS scoring</strong> — A 0–100 score across 6 categories with detailed per-category breakdowns and skill gap identification.</li>
          <li><strong>Job matching</strong> — 60/25/10/5 weighted scoring against live Adzuna jobs. Filterable by country, salary, and recency.</li>
          <li><strong>Application tracker</strong> — Save jobs, mark as applied, add notes and tags, track progress over time.</li>
          <li><strong>Email notifications</strong> — Welcome emails, job match alerts, and daily digests using Nodemailer + Handlebars templates.</li>
          <li><strong>Admin dashboard</strong> — User management, usage analytics, job sync controls, and revenue tracking.</li>
        </ul>`
      },
      {
        heading: "What's Coming in Phase 2 and Beyond",
        body: `The roadmap is public and we're committed to shipping it:
        <br/><br/>
        <strong>Phase 2 — Enhancement:</strong> End-to-end tests, Swagger API docs, performance optimizations, a React Native mobile app, and a Chrome extension for one-click job analysis.
        <br/><br/>
        <strong>Phase 3 — Monetization:</strong> Pro and Enterprise subscription tiers via Stripe. Advanced analytics, team accounts, and a white-label solution for career coaches and universities.
        <br/><br/>
        <strong>Phase 4 — Scale:</strong> Multi-language resume support, additional job sources (LinkedIn, Indeed), an AI-powered cover letter generator, interview prep tools, and salary negotiation insights.`,
        quote: `"We're building the infrastructure layer for the developer job market — starting with everything that should have always been transparent: your score, your gaps, your matches."`
      }
    ]
  }
};

export default function BlogPost() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogContent[slug];
  if (!post) notFound();

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
