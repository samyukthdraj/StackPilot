"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios"; // Added AxiosError type

interface ResumeUploaderProps {
  onSuccess?: (resumeId: string) => void;
}

// Define error response type
interface ErrorResponse {
  message?: string;
}

export function ResumeUploader({ onSuccess }: ResumeUploaderProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [setAsPrimary, setSetAsPrimary] = useState(true);

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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("setAsPrimary", String(setAsPrimary));

    try {
      // Simulate progress (since axios doesn't support upload progress by default)
      const interval = setInterval(() => {
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
        router.push(`/resumes/${response.data.id}`);
      }
    } catch (error) {
      // Properly typed error handling
      let errorMessage = "Failed to upload resume";

      if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data as ErrorResponse;
        errorMessage = data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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

            <div className="flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isUploading ? "Uploading..." : "Upload Resume"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setFile(null)}
                disabled={isUploading}
                className="flex-1"
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
