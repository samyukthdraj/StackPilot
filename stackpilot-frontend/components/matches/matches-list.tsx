import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchCard } from "@/components/matches/match-card";
import { MatchStats } from "@/components/matches/match-stats";
import { LearningRecommendations } from "@/components/matches/learning-recommendations";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { Job } from "@/lib/types/api";

interface Match {
  jobId: string;
  score: number;
}

interface MatchesListProps {
  matches: Match[];
  jobDetails: Record<string, Job>;
  savedJobs: Set<string>;
  isLoading: boolean;
  onSave: () => void;
}

export function MatchesList({
  matches,
  jobDetails,
  savedJobs,
  isLoading,
  onSave,
}: MatchesListProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found{" "}
              <span className="font-semibold text-navy">
                {matches?.length || 0}
              </span>{" "}
              matches
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LordiconWrapper
                icon={animations.loading}
                size={48}
                color="#FF6B35"
                state="loop"
              />
            </div>
          ) : matches?.length === 0 ? (
            <div className="text-center py-12">
              <LordiconWrapper
                icon={animations.empty}
                size={64}
                color="#94A3B8"
                state="loop"
              />
              <h3 className="text-lg font-semibold text-navy mt-4">
                No matches found
              </h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
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
          <MatchStats />
        </TabsContent>

        <TabsContent value="learning">
          <LearningRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
