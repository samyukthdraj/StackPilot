import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpWrapperService } from './http-wrapper.service';
import { ExternalJob } from '../interfaces/external-job.interface';
import { AdzunaQuota } from '../../usage/entities/adzuna-quota.entity';

interface AdzunaJob {
  id: string | number;
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string };
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
}

@Injectable()
export class AdzunaService {
  private readonly logger = new Logger(AdzunaService.name);
  private readonly appId: string;
  private readonly appKey: string;
  private readonly baseUrl = 'https://api.adzuna.com/v1/api/jobs';

  constructor(
    private configService: ConfigService,
    private readonly httpWrapper: HttpWrapperService,
    @InjectRepository(AdzunaQuota)
    private quotaRepository: Repository<AdzunaQuota>,
  ) {
    this.appId = this.configService.get<string>('ADZUNA_APP_ID') || '';
    this.appKey = this.configService.get<string>('ADZUNA_APP_KEY') || '';
  }

  async searchJobs(
    query: string,
    country: string = 'us',
    page: number = 1,
  ): Promise<ExternalJob[]> {
    if (!this.appId || !this.appKey) {
      this.logger.warn('Adzuna API credentials missing');
      return [];
    }

    try {
      // Adzuna requires country in the URL
      // Adzuna countries: gb, us, au, ca, in, ae, za, fr, de, br, nl, it, pl, es, sg, ro, ru, mx, be, nz
      const countryCode = country.toLowerCase();
      const adzunaCountry =
        countryCode === 'in'
          ? 'in'
          : countryCode === 'ae'
            ? 'ae'
            : countryCode === 'us'
              ? 'us'
              : countryCode === 'gb'
                ? 'gb'
                : 'us';

      const url = `${this.baseUrl}/${adzunaCountry}/search/${page}`;

      this.logger.log(`Searching Adzuna for: ${query} in ${adzunaCountry}`);

      const response = await this.httpWrapper.get<{ results: AdzunaJob[] }>(
        url,
        {
          params: {
            app_id: this.appId,
            app_key: this.appKey,
            what: query,
            results_per_page: 20,
            max_days_old: 7,
          },
          headers: {
            Accept: 'application/json',
          },
        },
      );

      const results = response.data?.results || [];

      // Update quota info (Adzuna monthly 2500)
      await this.updateQuota();

      return results.map((job) => ({
        sourceId: job.id?.toString() || Math.random().toString(36).substr(2, 9),
        source: 'adzuna',
        title: job.title,
        company: job.company?.display_name || 'Unknown Company',
        description: job.description,
        location: job.location?.display_name || 'Remote',
        url: job.redirect_url,
        postedAt: new Date(job.created),
        salaryMin: job.salary_min || 0,
        salaryMax: job.salary_max || 0,
        salaryCurrency: 'USD', // Adzuna provides local currency usually, but for simplicity...
        jobType: job.contract_type || 'full_time',
        country: adzunaCountry,
      }));
    } catch (error) {
      this.logger.error('Error searching jobs from Adzuna:', error);
      return [];
    }
  }

  private async updateQuota() {
    try {
      let quota = await this.quotaRepository.findOne({
        where: { id: 'singleton' },
      });

      const now = new Date();
      if (!quota) {
        quota = this.quotaRepository.create({
          id: 'singleton',
          requestsLimit: 2500,
          requestsRemaining: 2499,
          // Month-long window from now
          requestsReset: Math.floor(
            (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
          ),
          lastCallAt: now,
        });
      } else {
        // If we are past the reset date, reset the counter
        if (
          quota.requestsReset &&
          Date.now() > Number(quota.requestsReset) * 1000
        ) {
          quota.requestsRemaining = 2499;
          quota.requestsReset = Math.floor(
            (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
          );
        } else {
          quota.requestsRemaining = Math.max(0, quota.requestsRemaining - 1);
        }
        quota.lastCallAt = now;
      }

      await this.quotaRepository.save(quota);
    } catch (error) {
      this.logger.error('Failed to update Adzuna quota:', error);
    }
  }
}
