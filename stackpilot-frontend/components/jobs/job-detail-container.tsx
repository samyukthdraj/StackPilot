"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
  MapPin, 
  Globe, 
  Briefcase, 
  Clock, 
  Trophy, 
  DollarSign
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

export function JobDetailContainer() {
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
        await apiClient.delete(`/jobs/saved/job/${job?.id}`);
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

  const matchData = useMemo(() => {
    return match
      ? [
          { category: "Skill Match", score: match.breakdown.skillMatch },
          { category: "Keyword Match", score: match.breakdown.keywordScore },
          { category: "Experience", score: match.breakdown.experienceScore },
          { category: "Recency", score: match.breakdown.recencyScore },
        ]
      : [];
  }, [match]);

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

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/jobs"
            className="text-[#f5c842] hover:text-[#d4a832] inline-flex items-center gap-2 mb-4 font-medium"
          >
            <LordiconWrapper
              icon={animations.arrow}
              size={18}
              color="#f5c842"
              state="hover"
            />
            Back to Jobs
          </Link>
          <h1 className="text-3xl font-bold text-[#f5f0e8] font-playfair">{job.title}</h1>
          <p className="text-xl text-[#a0a0a0] mt-2">{job.company}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className={cn("flex-1 justify-center items-center bg-[#f5c842] text-[#0d0d0d] hover:bg-[#d4a832] font-semibold border-none whitespace-nowrap", isSaved && "opacity-80")}
          >
            <LordiconWrapper
              icon="https://cdn.lordicon.com/ulnswmkk.json" // Verified Heart
              size={20}
              color="#0d0d0d"
              state={isSaved ? "morph" : "hover"}
              className="mr-2"
            />
            {isSaved ? "Saved" : "Save Job"}
          </Button>
          {job.jobUrl && (
            <Button
              className="flex-1 justify-center items-center bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-semibold whitespace-nowrap"
              onClick={() => window.open(job.jobUrl, "_blank")}
            >
              <LordiconWrapper
                icon="https://cdn.lordicon.com/wkvacbiw.json" // Verified Build/Tool
                size={20}
                color="#0d0d0d"
                state="hover"
                className="mr-2"
              />
              Apply Now
            </Button>
          )}
        </div>
      </div>

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
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="shrink-0">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-800 stroke-current"
                          strokeWidth="10"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-[#f5c842] stroke-current"
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
                          className="text-2xl font-bold fill-white"
                        >
                          {match.score}%
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Match Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Skill Match</span>
                          <span className="font-semibold text-white">
                            {match.breakdown.skillMatch}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#f5c842]"
                            style={{ width: `${match.breakdown.skillMatch}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Keyword Match</span>
                          <span className="font-semibold text-white">
                            {match.breakdown.keywordScore}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#f5c842]"
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-[#f5f0e8] font-playfair">Job Details</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Row 1: Location & Country */}
                {job.location && (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-[#f5c842]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Location</p>
                      <p className="font-semibold text-[#f5f0e8]">{job.location}</p>
                    </div>
                  </div>
                )}
                {job.country && (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-[#f5c842]">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Country</p>
                      <p className="font-semibold text-[#f5f0e8] uppercase">
                        {job.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Row 2: Job Type & Posted */}
                {job.jobType && (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-[#f5c842]">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Engagement</p>
                      <p className="font-semibold text-[#f5f0e8] capitalize">
                        {job.jobType.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                )}
                {job.postedAt && (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-[#f5c842]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Posted</p>
                      <p className="font-semibold text-[#f5f0e8]">
                        {formatDistanceToNow(new Date(job.postedAt))} ago
                      </p>
                    </div>
                  </div>
                )}

                {/* Row 3: Experience & Salary */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-[#f5c842]">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Experience</p>
                    <p className="font-semibold text-[#f5f0e8]">
                      {job.experienceRequiredMin !== undefined && job.experienceRequiredMin !== null
                        ? `${job.experienceRequiredMin}${job.experienceRequiredMax ? `-${job.experienceRequiredMax}` : "+"} Years`
                        : "Not Specified"}
                    </p>
                  </div>
                </div>

                {(job.salaryMin !== undefined && job.salaryMax !== undefined && (job.salaryMin > 0 || job.salaryMax > 0)) && (
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-[#f5c842]/10 flex items-center justify-center text-[#f5c842]">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-[#666] font-bold">Salary Range</p>
                      <p className="font-semibold text-[#f5f0e8]">
                        ${job.salaryMin?.toLocaleString()} - $
                        {job.salaryMax?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardHeader>
              <CardTitle className="text-[#f5f0e8] font-playfair">Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                {job.description?.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-[#a0a0a0] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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

          {match && !matchLoading && (
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardHeader>
                <CardTitle className="text-white">Match Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      cx="50%" 
                      cy="50%" 
                      outerRadius="65%" 
                      data={matchData}
                      margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                    >
                      <PolarGrid stroke="#2a2a2a" />
                      <PolarAngleAxis 
                        dataKey="category" 
                        tick={{ fill: "#a0a0a0", fontSize: 10, fontWeight: 500 }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: "#666", fontSize: 8 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Radar
                        name="Match"
                        dataKey="score"
                        stroke="#f5c842"
                        fill="#f5c842"
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
