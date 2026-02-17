import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { formatDistanceToNow } from "date-fns";

interface ResumeHeaderProps {
  fileName: string;
  createdAt: string;
  version: number;
  resumeId: string;
  onBack: () => void;
  onFindMatches: () => void;
}

export function ResumeHeader({
  fileName,
  createdAt,
  version,
  onBack,
  onFindMatches,
}: ResumeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-navy">{fileName}</h1>
        <p className="text-gray-600 mt-2">
          Uploaded {formatDistanceToNow(new Date(createdAt))} ago • Version{" "}
          {version}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={onFindMatches}
        >
          <LordiconWrapper
            icon={animations.match}
            size={20}
            color="#FFFFFF"
            state="hover"
            className="mr-2"
          />
          Find Matches
        </Button>
      </div>
    </div>
  );
}
