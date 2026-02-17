import { Button } from "@/components/ui/button";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

interface NoResumeStateProps {
  onUploadClick: () => void;
}

export function NoResumeState({ onUploadClick }: NoResumeStateProps) {
  return (
    <div className="text-center py-12">
      <LordiconWrapper
        icon={animations.empty}
        size={96}
        color="#94A3B8"
        state="loop"
      />
      <h2 className="text-2xl font-bold text-navy mt-6">No Resume Found</h2>
      <p className="text-gray-600 mt-2">
        Upload a resume first to see your job matches
      </p>
      <Button
        onClick={onUploadClick}
        className="mt-6 bg-orange-500 hover:bg-orange-600"
      >
        Upload Resume
      </Button>
    </div>
  );
}
