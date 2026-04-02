"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMatchesStore } from "@/lib/store/matches-store";
import { cn } from "@/lib/utils";

import { Resume } from "@/lib/types/api";

interface MatchFiltersProps {
  className?: string;
  resumes: Resume[];
  selectedResume: string | null;
  onResumeChange: (resumeId: string) => void;
}

// Define the sort by type to match the store
type SortBy = "score" | "date" | "company" | "role";
type SortOrder = "asc" | "desc";

export function MatchFilters({ 
  className,
  resumes,
  selectedResume,
  onResumeChange 
}: MatchFiltersProps) {
  const { filters, setFilter, resetFilters } = useMatchesStore();

  return (
    <Card className={cn("sticky top-24 border-[#2a2a2a] bg-[#1a1a1a]", className)}>
      <CardHeader>
        <CardTitle className="text-lg text-[#f5f0e8] font-playfair">Match Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resume Selection */}
        <div className="space-y-2">
          <Label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-widest">Primary Resume</Label>
          <Select
            value={selectedResume ?? undefined}
            onValueChange={onResumeChange}
          >
            <SelectTrigger className="text-[#f5f0e8] bg-[#0d0d0d] border-[#2a2a2a] hover:border-[#f5c842]/50 transition-colors">
              <SelectValue placeholder="Select profile" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] text-[#f5f0e8] border-[#2a2a2a]">
              {resumes.map((resume) => (
                <SelectItem 
                  key={resume.id} 
                  value={resume.id}
                  className="focus:bg-[#f5c842] focus:text-[#0d0d0d]"
                >
                  <span className="font-semibold">{resume.fileName}</span>
                  <span className="ml-2 text-xs opacity-70">({resume.atsScore}%)</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-[#2a2a2a]" />

        {/* Filter Title */}
        <div className="pt-2">
          <p className="text-xs font-bold text-[#a0a0a0] uppercase tracking-widest mb-4">Refine Results</p>
        </div>
        {/* Score Range */}
        <div className="space-y-6">
          <Label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-widest block mb-1">Score Range</Label>
          <div className="pt-2">
            <Slider
              min={0}
              max={100}
              step={5}
              value={[filters.minScore, filters.maxScore]}
              onValueChange={([min, max]) => {
                setFilter("minScore", min);
                setFilter("maxScore", max);
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#666] font-medium tracking-tighter">
            <span>{filters.minScore}%</span>
            <span>{filters.maxScore}%</span>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-widest block mb-1">Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: SortBy) => setFilter("sortBy", value)}
          >
            <SelectTrigger className="text-[#f5f0e8] bg-[#0d0d0d] border-[#2a2a2a] hover:border-[#f5c842]/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] text-[#f5f0e8] border-[#2a2a2a]">
              <SelectItem value="score">Match Score</SelectItem>
              <SelectItem value="date">Date Posted</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="role">Role</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label className="text-[#a0a0a0] text-xs font-bold uppercase tracking-widest block mb-1">Sort Order</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value: SortOrder) => setFilter("sortOrder", value)}
          >
            <SelectTrigger className="text-[#f5f0e8] bg-[#0d0d0d] border-[#2a2a2a] hover:border-[#f5c842]/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] text-[#f5f0e8] border-[#2a2a2a]">
              <SelectItem value="desc">
                {filters.sortBy === 'score' ? 'Highest First' : 
                 filters.sortBy === 'date' ? 'Latest First' : 
                 'Descending (Z-A)'}
              </SelectItem>
              <SelectItem value="asc">
                {filters.sortBy === 'score' ? 'Lowest First' : 
                 filters.sortBy === 'date' ? 'Earliest First' : 
                 'Ascending (A-Z)'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Display Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-matched" className="text-[#f5f0e8] text-sm">Show Matched Skills</Label>
            <Switch
              id="show-matched"
              className="data-[state=checked]:bg-[#f5c842]"
              checked={filters.showMatchedSkills}
              onCheckedChange={(checked) =>
                setFilter("showMatchedSkills", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-missing" className="text-[#f5f0e8] text-sm">Show Missing Skills</Label>
            <Switch
              id="show-missing"
              className="data-[state=checked]:bg-[#f5c842]"
              checked={filters.showMissingSkills}
              onCheckedChange={(checked) =>
                setFilter("showMissingSkills", checked)
              }
            />
          </div>
        </div>

        <Separator />

        {/* Reset Button */}
        <Button variant="outline" className="w-full bg-[#f5c842] text-[#0d0d0d] hover:bg-[#d4a832] font-semibold border-none" onClick={resetFilters}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
