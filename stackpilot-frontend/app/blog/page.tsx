import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { blogPosts } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Blog | StackPilot",
  description: "Explore the latest insights on AI career intelligence, ATS optimization, and modern developer career growth on the StackPilot blog.",
  keywords: ["StackPilot blog", "developer career tips", "ATS filter guide", "AI job matching insights", "software engineering career"],
  openGraph: {
    title: "StackPilot Blog - AI Career Intelligence Insights",
    description: "Expert guides and insights for modern software engineers navigating the AI-driven job market.",
    images: ["/images/og-image.png"],
  },
};

export default function BlogPage() {
  return <BlogClient posts={blogPosts} />;
}
