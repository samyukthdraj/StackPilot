import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";
import Link from "next/link";

interface ResumeHeaderProps {
  fileName: string;
  createdAt: string;
  version: number;
  resumeId: string;
  onFindMatches: () => void;
  onViewPdf: () => void;
}

export function ResumeHeader({
  fileName,
  createdAt,
  version,
  onFindMatches,
  onViewPdf,
}: ResumeHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <Link
          href="/resumes"
          className="text-[#f5c842] hover:text-[#d4a832] inline-flex items-center gap-2 mb-4 font-medium"
        >
          <LordiconWrapper
            icon={animations.arrow}
            size={18}
            color="#f5c842"
            state="hover"
          />
          Back to Resumes
        </Link>
        <h1 className="text-3xl font-bold text-[#f5f0e8] font-playfair">{fileName}</h1>
        <p className="text-[#a0a0a0] mt-2">
          Uploaded {formatDistanceToNow(new Date(createdAt))} ago • Version{" "}
          {version}
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onViewPdf}
          className="border-[#2a2a2a] bg-transparent hover:bg-[#1a1a1a] hover:border-[#f5c842] text-[#f5f0e8] hover:text-[#f5c842]"
        >
          <FileText className="w-4 h-4 mr-2" />
          View PDF
        </Button>
        <Button
          className="bg-[#f5c842] hover:bg-[#d4a832] text-[#0d0d0d] font-semibold border-none"
          onClick={onFindMatches}
        >
          <LordiconWrapper
            icon="https://cdn.lordicon.com/msoeawqm.json" // Verified Search
            size={20}
            color="#0d0d0d"
            state="hover"
            className="mr-2"
          />
          Find Matches
        </Button>
      </div>
    </div>
  );
}
