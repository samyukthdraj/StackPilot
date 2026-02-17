"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, DollarSign, Clock, Search, Bookmark } from "lucide-react";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import Link from "next/link";
import { SavedJob } from "@/lib/types/api";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary?: string;
  description: string;
  requiredSkills: string[];
  postedAt: Date;
  url?: string;
}

export default function JobsPage() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<{ jobs: Job[]; total: number }>(
        "/jobs",
        {
          params: {
            limit: 20,
            search: searchQuery || undefined,
          },
        },
      );
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Failed to load jobs. Please try again later.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await apiClient.get<{
        items: SavedJob[];
        total: number;
      }>("/jobs/saved");
      const savedIds = new Set(response.data.items.map((item) => item.jobId));
      setSavedJobs(savedIds);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (isAuthenticated) {
      fetchSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSaveJob = async (jobId: string) => {
    try {
      await apiClient.post(`/jobs/saved/${jobId}`, {});
      setSavedJobs((prev) => new Set([...prev, jobId]));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to save job";
      alert(errorMessage || "Failed to save job");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LordiconWrapper
          icon={animations.loading}
          size={64}
          color="#FF6B35"
          state="loop"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Explorer</h1>
        <p className="text-gray-600 mt-2">Discover your next opportunity</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search jobs by title, company, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          Search
        </Button>
      </form>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Login to see
            personalized match scores and save jobs!
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-12">
          <LordiconWrapper
            icon={animations.empty}
            size={96}
            color="#94A3B8"
            state="loop"
          />
          <h2 className="text-2xl font-bold text-navy mt-6">No Jobs Found</h2>
          <p className="text-gray-600 mt-2">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "No jobs available at the moment. Check back later!"}
          </p>
        </div>
      )}

      {/* Job List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {job.company}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location || job.country}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(job.postedAt)}</span>
                </div>
              </div>

              {job.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {job.description}
                </p>
              )}

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.slice(0, 6).map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                    {job.requiredSkills.length > 6 && (
                      <Badge variant="outline">
                        +{job.requiredSkills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      View Details
                    </Button>
                  </a>
                ) : (
                  <Link href={`/jobs/${job.id}`} className="flex-1">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      View Details
                    </Button>
                  </Link>
                )}
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    onClick={() => handleSaveJob(job.id)}
                    disabled={savedJobs.has(job.id)}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${savedJobs.has(job.id) ? "fill-current" : ""}`}
                    />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
