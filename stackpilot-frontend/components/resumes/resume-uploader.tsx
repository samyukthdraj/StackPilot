"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { extractErrorMessage } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { Resume } from "@/lib/types/api";
import { useRouter } from "next/navigation";
import { useUsage } from "@/lib/hooks/use-usage";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { ATSScoreOverview } from "@/components/resumes/ats-score-overview";

interface ResumeUploaderProps {
  onSuccess?: (resumeId: string) => void;
}

// Define error response type
interface ErrorResponse {
  message?: string | string[];
  resetAt?: string;
}

export function ResumeUploader({ onSuccess }: ResumeUploaderProps) {
  const router = useRouter();
  const { data: usage, isLoading: isUsageLoading } = useUsage();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [setAsPrimary, setSetAsPrimary] = useState(true);
  const [targetJobDescription, setTargetJobDescription] = useState("");
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("setAsPrimary", String(setAsPrimary));
    if (targetJobDescription.trim()) {
      formData.append("targetJobDescription", targetJobDescription.trim());
    }

    let interval: NodeJS.Timeout | undefined;

    try {
      // Simulate progress (since axios doesn't support upload progress by default)
      interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiClient.post("/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(interval);
      setUploadProgress(100);

      toast({
        title: "Success!",
        description: "Your resume has been uploaded and analyzed.",
      });

      if (onSuccess) {
        onSuccess(response.data.id);
      } else {
        setUploadedResume(response.data);
      }
    } catch (error) {
      // Properly typed error handling for complex enterprise-grade feedback
      let errorMessage = "An unexpected error occurred during upload.";
      let detailedIssue = "";

      if (error instanceof AxiosError) {
        if (!error.response) {
          // Network error (server down, CORS, or offline)
          errorMessage = "Network connection failed.";
          detailedIssue = "The server could not be reached. Please check if your backend is running or your internet is stable.";
        } else {
          const status = error.response.status;
          const data = error.response.data as ErrorResponse;
          
          if (status === 413) {
            errorMessage = "File too large.";
            detailedIssue = "Your resume exceeds the maximum size allowed by the server.";
          } else if (status === 401) {
            errorMessage = "Unauthorized.";
            detailedIssue = "Your session may have expired. Please log in again.";
          } else if (status === 403) {
            errorMessage = "Daily Quota Exceeded";
            const resetAt = data.resetAt;
            if (resetAt) {
              const resetDate = new Date(resetAt);
              detailedIssue = `You have reached your daily upload limit. Your quota will reset on ${format(resetDate, "MMMM do")} at ${format(resetDate, "h:mm aa")}.`;
            } else {
              detailedIssue = extractErrorMessage(data, "Daily scan limit reached. Please upgrade to Pro.");
            }
          } else if (status >= 500) {
            errorMessage = "Server error.";
            detailedIssue = "Our analysis engine encountered a problem. Our team has been notified.";
          } else {
            errorMessage = extractErrorMessage(data, "Upload failed.");
            detailedIssue = status === 400 ? "Please check your file and try again." : "Please try again later.";
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: errorMessage,
        description: detailedIssue || "Please try again.",
        variant: "destructive",
      });
      setUploadError(detailedIssue || errorMessage);
    } finally {
      setIsUploading(false);
      clearInterval(interval);
    }
  };

  if (uploadedResume) {
    return (
      <div className="space-y-6">
        <Card className="p-12 text-center space-y-6">
          <LordiconWrapper
            icon={animations.success}
            size={96}
            color="#10B981"
            state="loop"
          />
          <h2 className="text-3xl font-bold text-navy">
            Resume Uploaded Successfully!
          </h2>
          <p className="text-gray-600 text-lg">
            Your resume has been successfully parsed and scored.
          </p>
          {uploadedResume.atsScore !== undefined && (
            <div className="text-left w-full max-w-4xl mx-auto py-4">
              <ATSScoreOverview 
                atsScore={uploadedResume.atsScore || 0} 
                scoreBreakdown={uploadedResume.scoreBreakdown}
              />
            </div>
          )}
          <Button
            className="mt-6 bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-bold text-lg py-6 px-8 border-none"
            onClick={() =>
              router.push(`/matches?resumeId=${uploadedResume.id}`)
            }
          >
            Find Matching Jobs
          </Button>
        </Card>
      </div>
    );
  }

  // Quota blocking logic
  const quotaReached = 
    usage?.resumeScans && 
    usage.resumeScans.used >= usage.resumeScans.limit;

  if (!isUsageLoading && quotaReached) {
    const resetDate = usage.resumeScans.resetAt ? new Date(usage.resumeScans.resetAt) : null;
    
    return (
      <Card className="p-12 text-center space-y-8 bg-[#111] border-[#222] shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-b from-[#f5c842]/5 to-transparent opacity-50" />
        
        <div className="relative z-10 space-y-6">
          <div className="inline-flex p-4 rounded-full bg-[#f5c842]/10 border border-[#f5c842]/20 mb-2">
            <LordiconWrapper
              icon={animations.error}
              size={64}
              color="#f5c842"
              state="loop"
            />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-[#f5f0e8] font-playfair">
              Daily Limit Reached
            </h2>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
              You&apos;ve used all {usage.resumeScans.limit} daily scans included in your current plan. 
              Our AI engines are cooling down!
            </p>
          </div>

          {resetDate && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl py-4 px-6 inline-block">
              <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-widest text-[10px]">
                Next Upload Window
              </p>
              <p className="text-[#f5f0e8] font-semibold">
                {format(resetDate, "MMMM do")} at {format(resetDate, "h:mm aa")}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              className="bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-bold py-6 px-8 rounded-full border-none shadow-[0_0_20px_rgba(245,200,66,0.2)] transition-all hover:scale-105"
              onClick={() => router.push("/premium")}
            >
              Upgrade to Pro for Unlimited Scans
            </Button>
            <Button
              variant="outline"
              className="border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-white/5 py-6 px-8 rounded-full transition-all"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all
          ${isDragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-400"}
          ${file ? "bg-green-50 border-green-500" : ""}`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <LordiconWrapper
            icon={file ? animations.success : animations.upload}
            size={80}
            color={file ? "#10B981" : "#FF6B35"}
            state={file ? "loop" : "hover"}
          />

          {file ? (
            <>
              <p className="text-lg font-semibold text-green-600">
                {file.name}
              </p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Choose Different File
              </Button>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-navy">
                {isDragActive
                  ? "Drop your resume here"
                  : "Drag & drop your resume here"}
              </p>
              <p className="text-sm text-gray-600">
                or click to browse (PDF only, max 5MB)
              </p>
            </>
          )}
        </div>
      </Card>

      {file && (
        <Card className="p-6">
          <h3 className="font-semibold text-navy mb-4">Upload Options</h3>

          <div className="space-y-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Job Description (Optional)
            </label>
            <textarea
              value={targetJobDescription}
              onChange={(e) => setTargetJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a customized ATS score for this specific role..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 resize-y bg-white text-sm"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={setAsPrimary}
                onChange={(e) => setSetAsPrimary(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">Set as primary resume</span>
            </label>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {uploadError && (
              <div className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                Failed: {uploadError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className={`flex-1 font-semibold border-none ${uploadError ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#f5c842] text-[#0d0d0d] hover:bg-[#d4a832]"}`}
              >
                {isUploading ? "Uploading..." : uploadError ? "Retry Upload" : "Generate ATS Score & Matches"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setUploadError(null);
                }}
                disabled={isUploading}
                className="flex-1 text-[#f5f0e8] border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
