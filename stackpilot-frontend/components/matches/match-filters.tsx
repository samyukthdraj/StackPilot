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

interface MatchFiltersProps {
  className?: string;
}

// Define the sort by type to match the store
type SortBy = "score" | "date" | "company";
type SortOrder = "asc" | "desc";

export function MatchFilters({ className }: MatchFiltersProps) {
  const { filters, setFilter, resetFilters } = useMatchesStore();

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Filter Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Range */}
        <div className="space-y-4">
          <Label>Score Range</Label>
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
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.minScore}%</span>
            <span>{filters.maxScore}%</span>
          </div>
        </div>

        <Separator />

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: SortBy) => setFilter("sortBy", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Match Score</SelectItem>
              <SelectItem value="date">Date Posted</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Select
            value={filters.sortOrder}
            onValueChange={(value: SortOrder) => setFilter("sortOrder", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Highest First</SelectItem>
              <SelectItem value="asc">Lowest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Display Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-matched">Show Matched Skills</Label>
            <Switch
              id="show-matched"
              checked={filters.showMatchedSkills}
              onCheckedChange={(checked) =>
                setFilter("showMatchedSkills", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-missing">Show Missing Skills</Label>
            <Switch
              id="show-missing"
              checked={filters.showMissingSkills}
              onCheckedChange={(checked) =>
                setFilter("showMissingSkills", checked)
              }
            />
          </div>
        </div>

        <Separator />

        {/* Reset Button */}
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
