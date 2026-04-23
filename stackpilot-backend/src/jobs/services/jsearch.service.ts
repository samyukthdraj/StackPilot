import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpWrapperService } from './http-wrapper.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JSearchQuota } from '../../usage/entities/jsearch-quota.entity';
import { ExternalJob } from '../interfaces/external-job.interface';

export interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_description: string;
  job_city?: string;
  job_country: string;
  job_employment_type?: string;
  job_apply_link: string;
  job_posted_at_datetime_utc: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_required_experience?: {
    no_experience_required?: boolean;
    required_experience_in_months?: number;
    experience_mentioned?: boolean;
    experience_preferred?: boolean;
  };
}

interface JSearchResponse {
  data: JSearchJob[];
}

@Injectable()
export class JSearchService {
  private readonly logger = new Logger(JSearchService.name);
  private readonly baseUrl = 'https://jsearch.p.rapidapi.com/search';
  private readonly apiKey: string;
  private readonly apiHost: string;

  constructor(
    private configService: ConfigService,
    private readonly httpWrapper: HttpWrapperService,
    @InjectRepository(JSearchQuota)
    private quotaRepository: Repository<JSearchQuota>,
  ) {
    this.apiKey = this.configService.get<string>('JSEARCH_API_KEY') || '';
    this.apiHost =
      this.configService.get<string>('JSEARCH_API_HOST') ||
      'jsearch.p.rapidapi.com';
  }

  async searchJobs(
    query: string,
    country: string = 'us',
    jobTypes: string = 'FULLTIME',
    page: number = 1,
  ): Promise<ExternalJob[]> {
    try {
      // Append expansion as per user request
      const fullQuery = `${query} (computer science OR software engineer OR developer)`;

      let countryQuery = '';
      const lowerQuery = query.toLowerCase();
      const locationHints = [
        'india',
        'uae',
        'dubai',
        'abu dhabi',
        'sharjah',
        'bangalore',
        'mumbai',
        'delhi',
        'hyderabad',
        'pune',
        'chennai',
      ];
      const hasLocationHint = locationHints.some((hint) =>
        lowerQuery.includes(hint),
      );

      if (!hasLocationHint) {
        if (country.toLowerCase() === 'in') countryQuery = 'in India';
        else if (country.toLowerCase() === 'ae') countryQuery = 'in UAE';
        else if (country.toLowerCase() === 'us')
          countryQuery = 'in United States';
      }

      const q = [fullQuery, countryQuery].filter(Boolean).join(' ');
      this.logger.log(`Searching JSearch with query: ${q}`);

      const response = await this.httpWrapper.get<JSearchResponse>(
        this.baseUrl,
        {
          params: {
            query: q,
            page: page.toString(),
            num_pages: '1',
            job_types: jobTypes,
            date_posted: 'today',
          },
          headers: {
            'x-rapidapi-key': this.apiKey,
            'x-rapidapi-host': this.apiHost,
          },
        },
      );

      // Capture quota from headers
      await this.updateQuota(response.headers as Record<string, string>);

      const results = response.data.data || [];
      return results.map((job: JSearchJob) => ({
        sourceId: job.job_id,
        source: 'jsearch',
        title: job.job_title,
        company: job.employer_name,
        description: job.job_description,
        location: `${job.job_city || 'Remote'}, ${job.job_country}`,
        url: job.job_apply_link,
        postedAt: job.job_posted_at_datetime_utc
          ? new Date(job.job_posted_at_datetime_utc)
          : new Date(),
        salaryMin: job.job_min_salary || 0,
        salaryMax: job.job_max_salary || 0,
        jobType: job.job_employment_type?.toLowerCase() || 'full_time',
        experienceMin: job.job_required_experience?.no_experience_required
          ? 0
          : job.job_required_experience?.required_experience_in_months
            ? Math.round(
                job.job_required_experience.required_experience_in_months / 12,
              )
            : undefined,
        country: job.job_country,
      }));
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response: { headers: Record<string, string>; status?: number };
        };
        if (axiosError?.response?.headers) {
          await this.updateQuota(axiosError.response.headers);
        }
        // If it's a 429 or 403, it's definitely a quota issue
        if (
          axiosError?.response?.status === 429 ||
          axiosError?.response?.status === 403
        ) {
          this.logger.warn('JSearch quota exceeded or forbidden');
          throw err;
        }
      }
      this.logger.error('Error searching jobs from JSearch:', err);
      throw err;
    }
  }

  private async updateQuota(headers: Record<string, string>) {
    try {
      const remaining = headers['x-ratelimit-requests-remaining'];
      const reset = headers['x-ratelimit-requests-reset'];
      const limit = headers['x-ratelimit-requests-limit'];

      if (remaining !== undefined || reset !== undefined) {
        let quota = await this.quotaRepository.findOne({
          where: { id: 'singleton' },
        });

        if (!quota) {
          quota = this.quotaRepository.create({
            id: 'singleton',
          });
        }

        if (remaining !== undefined) {
          quota.requestsRemaining = parseInt(remaining, 10);
        }
        if (limit !== undefined) {
          quota.requestsLimit = parseInt(limit, 10);
        }
        if (reset !== undefined) {
          quota.requestsReset = Number(reset);
        }

        // Calculate requests used
        quota.requestsUsed = quota.requestsLimit - quota.requestsRemaining;

        await this.quotaRepository.save(quota);
      }
    } catch (err) {
      this.logger.error('Failed to update JSearch quota:', err);
    }
  }
}
