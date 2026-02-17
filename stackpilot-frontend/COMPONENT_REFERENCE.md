# Component Reference Guide

Quick reference for all modularized components in StackPilot.

## Dashboard Components

### WelcomeSection

**Path:** `components/dashboard/welcome-section.tsx`

```typescript
interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
}
```

**Usage:**

```tsx
<WelcomeSection userName={user?.name} userEmail={user?.email} />
```

---

### StatsGrid

**Path:** `components/dashboard/stats-grid.tsx`

```typescript
interface DashboardStats {
  resumeScore: number;
  totalJobs: number;
  matches: number;
  applications: number;
}

interface StatsGridProps {
  stats: DashboardStats;
}
```

**Usage:**

```tsx
<StatsGrid
  stats={{ resumeScore: 85, totalJobs: 24, matches: 12, applications: 5 }}
/>
```

---

### QuickActions

**Path:** `components/dashboard/quick-actions.tsx`

No props required. Renders navigation buttons to key pages.

**Usage:**

```tsx
<QuickActions />
```

---

### RecentActivity

**Path:** `components/dashboard/recent-activity.tsx`

```typescript
interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  color: "orange" | "blue" | "green" | "purple";
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}
```

**Usage:**

```tsx
<RecentActivity activities={customActivities} />
// Or use default activities
<RecentActivity />
```

---

### GettingStarted

**Path:** `components/dashboard/getting-started.tsx`

```typescript
interface GettingStartedStep {
  number: number;
  text: string;
}

interface GettingStartedProps {
  steps?: GettingStartedStep[];
}
```

**Usage:**

```tsx
<GettingStarted steps={customSteps} />
// Or use default steps
<GettingStarted />
```

---

## Matches Components

### MatchesHeader

**Path:** `components/matches/matches-header.tsx`

```typescript
interface MatchesHeaderProps {
  resumes: Resume[];
  selectedResume: string | null;
  primaryResumeId?: string;
  showFilters: boolean;
  onResumeChange: (resumeId: string) => void;
  onFiltersChange: (show: boolean) => void;
  filtersComponent: React.ReactNode;
}
```

**Usage:**

```tsx
<MatchesHeader
  resumes={resumes}
  selectedResume={selectedResume}
  primaryResumeId={primaryResume?.id}
  showFilters={showFilters}
  onResumeChange={setSelectedResume}
  onFiltersChange={setShowFilters}
  filtersComponent={<MatchFilters className="border-0 shadow-none" />}
/>
```

---

### MatchesList

**Path:** `components/matches/matches-list.tsx`

```typescript
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
```

**Usage:**

```tsx
<MatchesList
  matches={sortedMatches}
  jobDetails={jobDetails}
  savedJobs={savedJobs}
  isLoading={isLoading}
  onSave={fetchSavedStatus}
/>
```

---

### NoResumeState

**Path:** `components/matches/no-resume-state.tsx`

```typescript
interface NoResumeStateProps {
  onUploadClick: () => void;
}
```

**Usage:**

```tsx
<NoResumeState onUploadClick={() => router.push("/resumes/upload")} />
```

---

## Resume Components

### ResumeHeader

**Path:** `components/resumes/resume-header.tsx`

```typescript
interface ResumeHeaderProps {
  fileName: string;
  createdAt: string;
  version: number;
  resumeId: string;
  onBack: () => void;
  onFindMatches: () => void;
}
```

**Usage:**

```tsx
<ResumeHeader
  fileName={resume.fileName}
  createdAt={resume.createdAt}
  version={resume.version}
  resumeId={resume.id}
  onBack={() => router.push("/resumes")}
  onFindMatches={() => router.push(`/jobs/matches?resumeId=${resume.id}`)}
/>
```

---

### ATSScoreOverview

**Path:** `components/resumes/ats-score-overview.tsx`

```typescript
interface ScoreBreakdown {
  skillMatch: number;
  projectStrength: number;
  experienceRelevance: number;
  resumeStructure: number;
  keywordDensity: number;
  actionVerbs: number;
}

interface ATSScoreOverviewProps {
  atsScore: number;
  scoreBreakdown?: ScoreBreakdown;
}
```

**Usage:**

```tsx
<ATSScoreOverview
  atsScore={resume.atsScore}
  scoreBreakdown={resume.scoreBreakdown}
/>
```

---

### ResumeDetailsTabs

**Path:** `components/resumes/resume-details-tabs.tsx`

```typescript
interface ResumeDetailsTabsProps {
  skills?: string[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
}
```

**Usage:**

```tsx
<ResumeDetailsTabs
  skills={resume.structuredData?.skills}
  experience={resume.structuredData?.experience}
  projects={resume.structuredData?.projects}
  education={resume.structuredData?.education}
/>
```

---

## Settings Components

### AppearanceSettings

**Path:** `components/settings/appearance-settings.tsx`

```typescript
interface AppearanceSettingsProps {
  theme: string;
  compactView: boolean;
  onThemeChange: (theme: string) => void;
  onCompactViewChange: (compact: boolean) => void;
}
```

**Usage:**

```tsx
<AppearanceSettings
  theme={theme}
  compactView={compactView}
  onThemeChange={setTheme}
  onCompactViewChange={setCompactView}
/>
```

---

### LanguageRegionSettings

**Path:** `components/settings/language-region-settings.tsx`

```typescript
interface LanguageRegionSettingsProps {
  language: string;
  timezone: string;
  onLanguageChange: (language: string) => void;
  onTimezoneChange: (timezone: string) => void;
}
```

**Usage:**

```tsx
<LanguageRegionSettings
  language={language}
  timezone={timezone}
  onLanguageChange={setLanguage}
  onTimezoneChange={setTimezone}
/>
```

---

### PreferencesSettings

**Path:** `components/settings/preferences-settings.tsx`

```typescript
interface PreferencesSettingsProps {
  autoSave: boolean;
  onAutoSaveChange: (autoSave: boolean) => void;
}
```

**Usage:**

```tsx
<PreferencesSettings autoSave={autoSave} onAutoSaveChange={setAutoSave} />
```

---

## Import Patterns

### Using Barrel Exports

```typescript
// Dashboard components
import {
  WelcomeSection,
  StatsGrid,
  QuickActions,
  RecentActivity,
  GettingStarted,
} from "@/components/dashboard";

// Settings components
import {
  AppearanceSettings,
  LanguageRegionSettings,
  PreferencesSettings,
} from "@/components/settings";

// Resume components
import {
  ResumeHeader,
  ATSScoreOverview,
  ResumeDetailsTabs,
} from "@/components/resumes";

// Matches components
import {
  MatchesHeader,
  MatchesList,
  NoResumeState,
} from "@/components/matches";
```

---

## Component Design Principles

### 1. Single Responsibility

Each component handles one specific section or feature.

### 2. Props Over State

Components receive data via props rather than fetching internally.

### 3. Callbacks for Actions

Parent components handle state changes via callback props.

### 4. TypeScript First

All components have explicit interfaces for props.

### 5. Default Values

Optional props have sensible defaults when appropriate.

### 6. Composition

Complex UIs are built by composing simple components.

---

## Testing Components

### Example Test Structure

```typescript
import { render, screen } from "@testing-library/react";
import { WelcomeSection } from "@/components/dashboard/welcome-section";

describe("WelcomeSection", () => {
  it("displays user name when provided", () => {
    render(<WelcomeSection userName="John" />);
    expect(screen.getByText(/Welcome back, John/)).toBeInTheDocument();
  });

  it("displays email when name not provided", () => {
    render(<WelcomeSection userEmail="john@example.com" />);
    expect(screen.getByText(/Welcome back, john/)).toBeInTheDocument();
  });
});
```

---

## Styling Guidelines

### Tailwind Classes

All components use Tailwind CSS for styling.

### Consistent Spacing

- Use `space-y-*` for vertical spacing
- Use `gap-*` for flex/grid spacing
- Use `p-*` and `px-*`/`py-*` for padding

### Color Palette

- Primary: `orange-500`, `orange-600`
- Navy: `navy` (custom color)
- Gray: `gray-600`, `gray-900`
- Success: `green-500`
- Error: `red-500`

---

_Last Updated: 2026-02-17_
