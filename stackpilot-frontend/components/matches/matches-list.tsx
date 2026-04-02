import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchCard } from "@/components/matches/match-card";
import { MatchStats } from "@/components/matches/match-stats";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { animations } from "@/public/icons/lordicon";
import { Job, JobMatch } from "@/lib/types/api";

interface MatchesListProps {
  matches: JobMatch[];
  jobDetails: Record<string, Job>;
  savedJobs: Set<string>;
  isLoading: boolean;
  onSave: () => void;
  resumeId?: string;
}

export function MatchesList({
  matches,
  jobDetails,
  savedJobs,
  isLoading,
  onSave,
  resumeId,
}: MatchesListProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a] p-1 h-11 rounded-xl">
          <TabsTrigger 
            value="list"
            className="data-[state=active]:!bg-[#f5c842] data-[state=active]:!text-[#0d0d0d] data-[state=active]:font-bold transition-all duration-300 px-6 text-[10px] uppercase tracking-widest text-[#a0a0a0] font-bold"
          >
            List View
          </TabsTrigger>
          <TabsTrigger 
            value="stats"
            className="data-[state=active]:!bg-[#f5c842] data-[state=active]:!text-[#0d0d0d] data-[state=active]:font-bold transition-all duration-300 px-6 text-[10px] uppercase tracking-widest text-[#a0a0a0] font-bold"
          >
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found{" "}
              <span className="font-semibold text-navy">
                {isLoading ? "..." : (matches?.length || 0)}
              </span>{" "}
              matches
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : matches?.length === 0 ? (
            <EmptyState
              title="No matches found"
              description="We couldn't find any jobs matching your criteria. Try adjusting your filters or uploading a more detailed resume."
              icon={animations.search}
            />
          ) : (
            <div className="grid gap-4">
              {matches?.map((match) => (
                <MatchCard
                  key={match.jobId}
                  match={match}
                  job={jobDetails[match.jobId]}
                  isSaved={savedJobs.has(match.jobId)}
                  onSave={onSave}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats">
          <MatchStats resumeId={resumeId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
