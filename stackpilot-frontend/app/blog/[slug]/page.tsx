import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogContent } from "@/lib/data/blog";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogContent[slug];

  if (!post) {
    return {
      title: "Post Not Found | StackPilot",
    };
  }

  return {
    title: `${post.title} | StackPilot Blog`,
    description: post.excerpt,
    keywords: [post.category, "StackPilot", "career intelligence", post.title.toLowerCase()],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: ["/images/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/images/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogContent[slug];

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}
