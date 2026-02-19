"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Resume } from "@/lib/types/api";
import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";
import { ResumeHeader } from "@/components/resumes/resume-header";
import { ATSScoreOverview } from "@/components/resumes/ats-score-overview";
import { ResumeDetailsTabs } from "@/components/resumes/resume-details-tabs";

export function ResumeDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResume = useCallback(async () => {
    try {
      const response = await apiClient.get(`/resumes/${params.id}`);
      setResume(response.data);
    } catch (error) {
      console.error("Error fetching resume:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LordiconWrapper
          icon={animations.loading}
          size={64}
          color="#FF6B35"
          state="loop"
        />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-12">
        <LordiconWrapper
          icon={animations.notFound}
          size={96}
          color="#94A3B8"
          state="loop"
        />
        <h2 className="text-2xl font-bold text-navy mt-6">Resume not found</h2>
        <p className="text-gray-600 mt-2">
          The resume you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
        <Link href="/resumes">
          <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
            Back to Resumes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ResumeHeader
        fileName={resume.fileName}
        createdAt={resume.createdAt}
        version={resume.version}
        resumeId={resume.id}
        onBack={() => router.push("/resumes")}
        onFindMatches={() => router.push(`/jobs/matches?resumeId=${resume.id}`)}
      />

      <ATSScoreOverview
        atsScore={resume.atsScore || 0}
        scoreBreakdown={resume.scoreBreakdown}
      />

      <ResumeDetailsTabs
        skills={resume.structuredData?.skills}
        experience={resume.structuredData?.experience}
        projects={resume.structuredData?.projects}
        education={resume.structuredData?.education}
      />
    </div>
  );
}
