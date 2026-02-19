"use client";

import { ResumeUploader } from "@/components/resumes/resume-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import Link from "next/link";

export function ResumeUploadContainer() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">Upload Your Resume</h1>
        <p className="text-gray-600 mt-2">
          Upload your resume in PDF format. We&apos;ll analyze it and provide
          detailed ATS scoring.
        </p>
      </div>

      <ResumeUploader />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <LordiconWrapper
                icon={animations.check}
                size={32}
                color="#10B981"
                state="loop"
              />
              <CardTitle className="text-sm">ATS Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get detailed breakdown of your resume with scores for skills,
              experience, and more.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <LordiconWrapper
                icon={animations.match}
                size={32}
                color="#10B981"
                state="loop"
              />
              <CardTitle className="text-sm">Job Matching</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Find jobs that perfectly match your skills and experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <LordiconWrapper
                icon={animations.save}
                size={32}
                color="#10B981"
                state="loop"
              />
              <CardTitle className="text-sm">Track Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Save jobs, add notes, and track your applications.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-600">
        Already have resumes?{" "}
        <Link
          href="/resumes"
          className="text-orange-500 hover:text-orange-600 font-medium"
        >
          View all resumes →
        </Link>
      </div>
    </div>
  );
}
