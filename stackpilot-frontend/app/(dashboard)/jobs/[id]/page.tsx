import { JobDetailContainer } from "@/components/jobs/job-detail-container";
import { apiClient } from "@/lib/api/client";
import { Job } from "@/lib/types/api";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    const job = response.data;
    
    return {
      title: `${job.title} at ${job.company}`,
      description: `Apply for ${job.title} at ${job.company}. ${job.location ? `Location: ${job.location}.` : ""} Join StackPilot to see how well your resume matches this role.`,
      openGraph: {
        title: `${job.title} | ${job.company}`,
        description: `Exciting job opportunity for a ${job.title}. Check your match score on StackPilot.`,
        images: ["/images/og-image.png"],
      },
    };
  } catch {
    return {
      title: "Job Details | StackPilot",
      description: "View job details and match scores on StackPilot.",
    };
  }
}

export default async function JobDetailPage() {
  return <JobDetailContainer />;
}
