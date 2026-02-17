"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { LordiconWrapper } from "@/components/shared/lordicon-wrapper";
import { animations } from "@/public/icons/lordicon";
import { useJobFiltersStore } from "@/lib/store/job-filters-store";
import { cn } from "@/lib/utils";

const countries = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "in", label: "India" },
];

const jobTypes = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "permanent", label: "Permanent" },
];

const timeRanges = [
  { value: 12, label: "Last 12 hours" },
  { value: 24, label: "Last 24 hours" },
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
];

interface JobFiltersProps {
  className?: string;
}

export function JobFilters({ className }: JobFiltersProps) {
  const { filters, setFilter, resetFilters, hasActiveFilters } =
    useJobFiltersStore();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Filters</CardTitle>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-orange-500 hover:text-orange-600"
            >
              Reset All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <LordiconWrapper
              icon={isExpanded ? animations.chevronUp : animations.chevronDown}
              size={20}
              color="#0A1929"
              state="hover"
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        className={cn("space-y-6", !isExpanded && "hidden lg:block")}
      >
        {/* Search */}
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LordiconWrapper
                icon={animations.search}
                size={18}
                color="#94A3B8"
                state="morph"
              />
            </div>
            <Input
              placeholder="Job title, keywords..."
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Separator />

        {/* Country */}
        <div className="space-y-2">
          <Label>Country</Label>
          <Select
            value={filters.country}
            onValueChange={(value) => setFilter("country", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Range */}
        <div className="space-y-2">
          <Label>Posted Within</Label>
          <Select
            value={filters.days.toString()}
            onValueChange={(value) => setFilter("days", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value.toString()}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <Label>Job Type</Label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.jobType.includes(type.value)}
                  onCheckedChange={(checked) => {
                    const newTypes = checked
                      ? [...filters.jobType, type.value]
                      : filters.jobType.filter((t) => t !== type.value);
                    setFilter("jobType", newTypes);
                  }}
                />
                <label
                  htmlFor={type.value}
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Remote */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remote"
            checked={filters.remote}
            onCheckedChange={(checked) => setFilter("remote", !!checked)}
          />
          <Label htmlFor="remote">Remote Only</Label>
        </div>

        <Separator />

        {/* Salary Range */}
        <div className="space-y-4">
          <Label>Salary Range (USD)</Label>
          <Slider
            min={0}
            max={200000}
            step={10000}
            value={[filters.salaryMin, filters.salaryMax]}
            onValueChange={([min, max]) => {
              setFilter("salaryMin", min);
              setFilter("salaryMax", max);
            }}
            className="mt-6"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.salaryMin.toLocaleString()}</span>
            <span>${filters.salaryMax.toLocaleString()}+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
