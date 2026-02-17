import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { Resume } from "@/lib/types/api";

interface MatchesHeaderProps {
  resumes: Resume[];
  selectedResume: string | null;
  primaryResumeId?: string;
  showFilters: boolean;
  onResumeChange: (resumeId: string) => void;
  onFiltersChange: (show: boolean) => void;
  filtersComponent: React.ReactNode;
}

export function MatchesHeader({
  resumes,
  selectedResume,
  primaryResumeId,
  showFilters,
  onResumeChange,
  onFiltersChange,
  filtersComponent,
}: MatchesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-navy">Job Matches</h1>
        <p className="text-gray-600 mt-2">
          Find your perfect job based on your skills
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={selectedResume || primaryResumeId}
          onValueChange={onResumeChange}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select resume" />
          </SelectTrigger>
          <SelectContent>
            {resumes.map((resume: Resume) => (
              <SelectItem key={resume.id} value={resume.id}>
                {resume.fileName} ({resume.atsScore}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet open={showFilters} onOpenChange={onFiltersChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <LordiconWrapper
                icon={animations.filter}
                size={20}
                color="#0A1929"
                state="hover"
                className="mr-2"
              />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            {filtersComponent}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
