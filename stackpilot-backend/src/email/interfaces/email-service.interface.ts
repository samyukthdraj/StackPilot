import { Job } from '../../jobs/entities/job.entity';
import { MatchScore } from '../../jobs/services/job-matching.service';

export interface JobMatchEmailData {
  job: Job;
  match: MatchScore;
}

export interface DailyDigestData {
  newJobs: number;
  topMatches: Array<{ job: Job; score: number }>;
  savedJobs: number;
}

export interface IEmailService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendJobMatchesEmail(
    email: string,
    name: string,
    matches: JobMatchEmailData[],
  ): Promise<void>;
  sendDailyDigestEmail(
    email: string,
    name: string,
    data: DailyDigestData,
  ): Promise<void>;
  sendLimitWarningEmail(
    email: string,
    name: string,
    limitType: 'resume_scans' | 'job_searches',
    currentUsage: number,
    limit: number,
  ): Promise<void>;
}
