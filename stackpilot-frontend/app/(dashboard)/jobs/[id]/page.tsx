"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useJob, useJobMatch } from "@/lib/hooks/use-jobs";
import { useAuth } from "@/lib/hooks/use-auth";
import { useResumes } from "@/lib/hooks/use-resumes";
import { apiClient } from "@/lib/api/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: job, isLoading: jobLoading } = useJob(params.id as string);
  const { data: resumes } = useResumes();
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const primaryResume = resumes?.find((r) => r.isPrimary);

  const { data: match, isLoading: matchLoading } = useJobMatch(
    params.id as string,
    selectedResume || primaryResume?.id,
  );

  useEffect(() => {
    if (primaryResume) {
      setSelectedResume(primaryResume.id);
    }
  }, [primaryResume]);

  const checkIfSaved = useCallback(async () => {
    if (!job?.id) return;
    try {
      const response = await apiClient.get(`/jobs/saved/check/${job.id}`);
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error("Error checking saved status:", error);
    }
  }, [job?.id]);

  useEffect(() => {
    if (isAuthenticated && job) {
      checkIfSaved();
    }
  }, [isAuthenticated, job, checkIfSaved]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save jobs",
      });
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await apiClient.delete(`/jobs/saved/${job?.id}`);
        toast({
          title: "Job removed",
          description: "Job removed from saved list",
        });
      } else {
        await apiClient.post(`/jobs/saved/${job?.id}`, {});
        toast({
          title: "Job saved",
          description: "Job added to your saved list",
        });
      }
      setIsSaved(!isSaved);
    } catch {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (jobLoading) {
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

  if (!job) {
    return (
      <div className="text-center py-12">
        <LordiconWrapper
          icon={animations.notFound}
          size={96}
          color="#94A3B8"
          state="loop"
        />
        <h2 className="text-2xl font-bold text-navy mt-6">Job not found</h2>
        <p className="text-gray-600 mt-2">
          The job you&apos;re looking for doesn&apos;t exist or has expired.
        </p>
        <Link href="/jobs">
          <Button className="mt-6 bg-orange-500 hover:bg-orange-600">
            Browse Jobs
          </Button>
        </Link>
      </div>
    );
  }

  const matchData = match
    ? [
        { category: "Skill Match", score: match.breakdown.skillMatch },
        { category: "Keyword Match", score: match.breakdown.keywordScore },
        { category: "Experience", score: match.breakdown.experienceScore },
        { category: "Recency", score: match.breakdown.recencyScore },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/jobs"
            className="text-orange-500 hover:text-orange-600 inline-flex items-center gap-2 mb-4"
          >
            <LordiconWrapper
              icon={animations.arrow}
              size={18}
              color="#FF6B35"
              state="hover"
            />
            Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-navy">{job.title}</h1>
          <p className="text-xl text-gray-600 mt-2">{job.company}</p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className={cn(isSaved && "text-orange-500 border-orange-500")}
          >
            <LordiconWrapper
              icon={isSaved ? animations.heartFilled : animations.heart}
              size={20}
              color={isSaved ? "#FF6B35" : "#0A1929"}
              state="hover"
              className="mr-2"
            />
            {isSaved ? "Saved" : "Save Job"}
          </Button>
          {job.jobUrl && (
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => window.open(job.jobUrl, "_blank")}
            >
              <LordiconWrapper
                icon={animations.external}
                size={20}
                color="#FFFFFF"
                state="hover"
                className="mr-2"
              />
              Apply Now
            </Button>
          )}
        </div>
      </div>

      {/* Match Score Section - with loading state */}
      {isAuthenticated && (
        <>
          {matchLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8">
                  <LordiconWrapper
                    icon={animations.loading}
                    size={48}
                    color="#FF6B35"
                    state="loop"
                  />
                  <span className="ml-3 text-gray-600">
                    Calculating match score...
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : match ? (
            <Card className="bg-linear-to-r from-orange-50 to-orange-100/50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Score Circle */}
                  <div className="shrink-0">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200 stroke-current"
                          strokeWidth="10"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-orange-500 stroke-current"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - match.score / 100)}`}
                          transform="rotate(-90 50 50)"
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dy="0.3em"
                          className="text-2xl font-bold fill-navy"
                        >
                          {match.score}%
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy mb-3">
                      Match Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Skill Match</span>
                          <span className="font-semibold text-navy">
                            {match.breakdown.skillMatch}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{ width: `${match.breakdown.skillMatch}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Keyword Match</span>
                          <span className="font-semibold text-navy">
                            {match.breakdown.keywordScore}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{
                              width: `${match.breakdown.keywordScore}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {job.location && (
                  <div className="flex items-center gap-3">
                    <LordiconWrapper
                      icon={animations.location}
                      size={24}
                      color="#64748B"
                      state="morph"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-navy">{job.location}</p>
                    </div>
                  </div>
                )}
                {job.country && (
                  <div className="flex items-center gap-3">
                    <LordiconWrapper
                      icon={animations.globe}
                      size={24}
                      color="#64748B"
                      state="morph"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium text-navy uppercase">
                        {job.country}
                      </p>
                    </div>
                  </div>
                )}
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center gap-3">
                    <LordiconWrapper
                      icon={animations.salary}
                      size={24}
                      color="#64748B"
                      state="morph"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium text-navy">
                        ${job.salaryMin.toLocaleString()} - $
                        {job.salaryMax.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center gap-3">
                    <LordiconWrapper
                      icon={animations.clock}
                      size={24}
                      color="#64748B"
                      state="morph"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Job Type</p>
                      <p className="font-medium text-navy capitalize">
                        {job.jobType.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                )}
                {job.postedAt && (
                  <div className="flex items-center gap-3">
                    <LordiconWrapper
                      icon={animations.calendar}
                      size={24}
                      color="#64748B"
                      state="morph"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-medium text-navy">
                        {formatDistanceToNow(new Date(job.postedAt))} ago
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                {job.description?.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Skills & Match */}
        <div className="space-y-6">
          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
              <CardDescription>
                {job.requiredSkills?.length || 0} skills required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, index) => {
                  const isMatched = match?.matchedSkills.includes(skill);
                  const isMissing = match?.missingSkills.includes(skill);

                  return (
                    <Badge
                      key={index}
                      className={cn(
                        "px-3 py-1 text-sm",
                        isMatched &&
                          "bg-green-100 text-green-700 border-green-200",
                        isMissing && "bg-red-100 text-red-700 border-red-200",
                        !isMatched && !isMissing && "bg-gray-100 text-gray-700",
                      )}
                    >
                      {skill}
                      {isMatched && (
                        <LordiconWrapper
                          icon={animations.check}
                          size={14}
                          color="#10B981"
                          state="loop"
                          className="ml-1"
                        />
                      )}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Match Radar Chart */}
          {match && !matchLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Match Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={matchData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Match"
                        dataKey="score"
                        stroke="#FF6B35"
                        fill="#FF6B35"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  {match.matchedSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-2">
                        ✓ Matched Skills ({match.matchedSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedSkills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-green-50 text-green-700"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {match.missingSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600 mb-2">
                        ✗ Missing Skills ({match.missingSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {match.missingSkills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-red-50 text-red-700"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resume Selector */}
          {isAuthenticated && resumes && resumes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Compare with Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedResume || ""}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.fileName} ({resume.atsScore}% ATS)
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
