export interface ExternalJob {
  sourceId: string;
  source: string;
  title: string;
  company: string;
  description: string;
  location: string;
  url: string;
  postedAt: Date;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobType?: string;
  experienceMin?: number;
  experienceMax?: number;
  country?: string;
}
