export interface User {
  id: string;
  email: string;
  name?: string;
  role?: "user" | "admin";
  subscriptionType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string[];
  technologies?: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  duration: string;
  gpa?: string;
}

export interface Resume {
  id: string;
  fileName: string;
  atsScore?: number;
  isPrimary: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  structuredData?: {
    skills: string[];
    experience: ExperienceItem[];
    projects: ProjectItem[];
    education: EducationItem[];
  };
  scoreBreakdown?: {
    skillMatch: number;
    projectStrength: number;
    experienceRelevance: number;
    resumeStructure: number;
    keywordDensity: number;
    actionVerbs: number;
  };
}

export interface UsageSummary {
  resumeScans: { used: number; limit: number };
  jobSearches: { used: number; limit: number };
  remaining: { resumeScans: number; jobSearches: number };
}

export interface JobMatch {
  jobId: string;
  score: number;
  breakdown: {
    skillMatch: number;
    keywordScore: number;
    experienceScore: number;
    recencyScore: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  description: string;
  requirements?: string[];
  requiredSkills?: string[];
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  type?: string;
  jobType?: string;
  jobUrl?: string;
  postedAt: string;
  url?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  userId: string;
  job: Job;
  savedAt: string;
  notes?: string;
  applied?: boolean;
  appliedAt?: string;
  tags?: string[];
  createdAt?: string;
}

export interface UpdateSavedJobRequest {
  notes?: string;
  applied?: boolean;
  tags?: string[];
}
