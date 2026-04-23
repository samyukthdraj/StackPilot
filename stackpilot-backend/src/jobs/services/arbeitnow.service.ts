import { Injectable, Logger } from '@nestjs/common';
import { HttpWrapperService } from './http-wrapper.service';
import { ExternalJob } from '../interfaces/external-job.interface';

interface ArbeitnowJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

@Injectable()
export class ArbeitnowService {
  private readonly logger = new Logger(ArbeitnowService.name);
  private readonly baseUrl = 'https://www.arbeitnow.com/api/job-board-api';

  constructor(private readonly httpWrapper: HttpWrapperService) {}

  async searchJobs(query: string): Promise<ExternalJob[]> {
    try {
      this.logger.log(`Searching Arbeitnow as ultimate fallback for: ${query}`);

      const response = await this.httpWrapper.get<{ data: ArbeitnowJob[] }>(
        this.baseUrl,
      );

      const allJobs = response.data?.data || [];

      // Arbeitnow doesn't have a direct search query parameter in the free API usually,
      // it returns a list of recent jobs. We filter them locally.
      const filteredJobs = allJobs.filter(
        (job) =>
          job.title?.toLowerCase().includes(query.toLowerCase()) ||
          job.description?.toLowerCase().includes(query.toLowerCase()),
      );

      return filteredJobs.map((job) => ({
        sourceId: job.slug,
        source: 'arbeitnow',
        title: job.title,
        company: job.company_name,
        description: job.description,
        location: job.location || (job.remote ? 'Remote' : 'Unknown'),
        url: job.url,
        postedAt: new Date(job.created_at * 1000), // Created at is usually unix timestamp
        jobType: job.job_types?.[0] || 'full_time',
      }));
    } catch (error) {
      this.logger.error('Error searching jobs from Arbeitnow:', error);
      return [];
    }
  }
}
