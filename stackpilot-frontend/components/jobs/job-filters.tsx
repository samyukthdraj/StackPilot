"use client";

import { useState, useEffect, useRef } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
  { value: "ae", label: "UAE" },
];

// Static definitions moved to dynamic props inside component


const timeRanges = [
  { value: 0.5, label: "Last 12 hours" },
  { value: 1, label: "Last 24 hours" },
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
];

interface JobFiltersProps {
  className?: string;
  locations?: string[];
  companies?: string[];
  jobTypes?: string[];
  onQuickFilter?: (type: "location" | "company", value: string, action: "add" | "remove" | "clear") => void;
  isLoading?: boolean;
}

export function JobFilters({ 
  className, 
  locations = [], 
  companies = [],
  jobTypes = [],
  onQuickFilter,
  isLoading = false 
}: JobFiltersProps) {
  const { filters, setFilter, resetFilters, hasActiveFilters } =
    useJobFiltersStore();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Debounced search: local state that syncs to store after delay
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync local search from store when store changes externally (e.g., reset)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);
  
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilter("search", value);
    }, 500);
  };
  
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'fulltime': 'Full Time',
      'full_time': 'Full Time',
      'parttime': 'Part Time',
      'part_time': 'Part Time',
      'contract': 'Contract',
      'contractor': 'Contractor',
      'permanent': 'Permanent',
      'intern': 'Internship',
      'internship': 'Internship'
    };
    return labels[type.toLowerCase()] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <Card className={cn("sticky top-24 border-[#2a2a2a] bg-[#1a1a1a]", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold tracking-tight text-[#f5f0e8]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Intelligence Hub
        </CardTitle>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-[#f5c842] hover:text-[#d4a832] text-[10px] font-bold uppercase tracking-widest px-0 h-auto"
            >
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden text-[#a0a0a0]"
          >
            <LordiconWrapper
              icon={isExpanded ? animations.chevronUp : animations.chevronDown}
              size={20}
              color="#a0a0a0"
              state="hover"
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        className={cn("space-y-6 custom-scrollbar max-h-[75vh] overflow-y-auto pb-8", !isExpanded && "hidden lg:block")}
      >
        {/* Search */}
        <div className="space-y-2 text-[#a0a0a0]">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">Market Search</Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <LordiconWrapper
                icon={animations.search}
                size={18}
                color="#666"
                state="morph"
              />
            </div>
            <Input
              placeholder="software engineer"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] focus:border-[#f5c842] rounded-xl h-11"
            />
          </div>
        </div>

        <Separator className="bg-[#2a2a2a]" />

        {/* Global Market */}
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">Global Market</Label>
          <Select
            value={filters.country}
            onValueChange={(value) => setFilter("country", value)}
          >
            <SelectTrigger className="bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] rounded-xl h-11">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8]">
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value} className="focus:bg-[#f5c842] focus:text-[#0d0d0d]">
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Regional Tags */}
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f5c842]">Regional Insight</Label>
          {isLoading ? (
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-7 w-16 bg-[#2a2a2a] rounded-lg" />
              ))}
            </div>
          ) : locations.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              <button 
                onClick={() => {
                  setFilter("filterLocation", []);
                  if (onQuickFilter) onQuickFilter("location", "all", "clear");
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${filters.filterLocation.length === 0 ? 'bg-[#f5c842] text-[#0d0d0d] border-[#f5c842]' : 'bg-[#0d0d0d] border-[#2a2a2a] text-[#888] hover:border-[#f5c842]/50'}`}
              >
                Global
              </button>
              {locations.slice(0, 10).map(loc => (
                <button 
                  key={loc}
                  onClick={() => {
                    const isSelected = filters.filterLocation.includes(loc);
                    const newValue = isSelected 
                      ? filters.filterLocation.filter(l => l !== loc)
                      : [...filters.filterLocation, loc];
                    setFilter("filterLocation", newValue);
                    if (onQuickFilter) onQuickFilter("location", loc, isSelected ? "remove" : "add");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${filters.filterLocation.includes(loc) ? 'bg-[#f5c842] text-[#0d0d0d] border-[#f5c842]' : 'bg-[#0d0d0d] border-[#2a2a2a] text-[#888] hover:border-[#f5c842]/50'}`}
                >
                  {loc.split(',')[0].trim()}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-[10px] text-gray-600 font-mono italic">No regional metadata detected</div>
          )}
        </div>

        <Separator className="bg-[#2a2a2a]" />

        {/* Recency */}
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">Time to Hire</Label>
          <Select
            value={filters.days.toString()}
            onValueChange={(value) => setFilter("days", parseFloat(value))}
          >
            <SelectTrigger className="bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] rounded-xl h-11">
              <SelectValue placeholder="Threshold" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8]">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value.toString()} className="focus:bg-[#f5c842] focus:text-[#0d0d0d]">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dynamic Job Type Grid */}
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">Engagement Mode</Label>
          {jobTypes.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 text-center">
              {jobTypes.map((typeValue) => (
                <button
                  key={typeValue}
                  onClick={() => {
                    const newTypes = filters.jobType.includes(typeValue)
                      ? filters.jobType.filter((t) => t !== typeValue)
                      : [...filters.jobType, typeValue];
                    setFilter("jobType", newTypes);
                  }}
                  className={cn(
                    "p-2 rounded-xl text-[9px] font-bold uppercase transition-all border",
                    filters.jobType.includes(typeValue) 
                      ? 'bg-[#f5c842]/10 border-[#f5c842] text-[#f5c842]' 
                      : 'bg-[#0d0d0d] border-[#2a2a2a] text-[#666] hover:border-[#f5c842]/30'
                  )}
                >
                  {getJobTypeLabel(typeValue)}
                </button>
              ))}
            </div>
          ) : (
             <div className="text-[10px] text-gray-600 font-mono italic">Detecting hire types...</div>
          )}
        </div>

        <Separator className="bg-[#2a2a2a]" />

        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">Professional Tenure</Label>
          <Select
            value={(filters.experienceMin ?? -1).toString()}
            onValueChange={(value) => setFilter("experienceMin", parseInt(value))}
          >
            <SelectTrigger className="bg-[#0d0d0d] border-[#2a2a2a] text-[#f5f0e8] rounded-xl h-11">
              <SelectValue placeholder="Professional Tenure" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a] text-[#f5f0e8] rounded-xl">
              {[-1, 0, 1, 2, 3, 4, 5, 8, 10, 12, 15].map((years) => (
                <SelectItem key={years} value={years.toString()} className="focus:bg-[#f5c842] focus:text-[#0d0d0d] rounded-lg">
                  {years === -1 ? "Any Experience" : years === 0 ? "Entry Level" : `${years} ${years === 1 ? 'Year' : 'Years'}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-[#2a2a2a]" />

        {/* Industry Leaders */}
        <div className="space-y-3 border-t border-[#2a2a2a] pt-6">
          <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#f5c842]">Top Employers</Label>
          {isLoading ? (
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-7 w-16 bg-[#2a2a2a] rounded-lg" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {companies.slice(0, 8).map(comp => (
                <button 
                  key={comp}
                  onClick={() => {
                    const isSelected = filters.filterCompany.includes(comp);
                    const newValue = isSelected 
                      ? filters.filterCompany.filter(c => c !== comp)
                      : [...filters.filterCompany, comp];
                    setFilter("filterCompany", newValue);
                    if (onQuickFilter) onQuickFilter("company", comp, isSelected ? "remove" : "add");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${filters.filterCompany.includes(comp) ? 'bg-[#f5c842] text-[#0d0d0d] border-[#f5c842]' : 'bg-[#0d0d0d] border-[#2a2a2a] text-[#888] hover:border-[#f5c842]/50'}`}
                >
                  {comp}
                </button>
              ))}
            </div>
          ) : (
             <div className="text-[10px] text-gray-600 font-mono italic">No hiring data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
