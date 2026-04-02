import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";

interface MatchesHeaderProps {
  showFilters: boolean;
  onFiltersChange: (show: boolean) => void;
  filtersComponent: React.ReactNode;
}

export function MatchesHeader({
  showFilters,
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
