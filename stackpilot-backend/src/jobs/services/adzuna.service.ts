import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpWrapperService } from './http-wrapper.service';

export interface AdzunaJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  description: string;
  location: {
    display_name: string;
    area?: string[];
  };
  salary_min: number;
  salary_max: number;
  salary_is_predicted: number;
  contract_type?: string;
  contract_time?: string;
  created: string;
  redirect_url: string;
  category: {
    label: string;
    tag: string;
  };
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
  mean: number;
}

@Injectable()
export class AdzunaService {
  private readonly logger = new Logger(AdzunaService.name);
  private readonly baseUrl = 'https://api.adzuna.com/v1/api/jobs';
  private readonly appId: string;
  private readonly appKey: string;

  constructor(
    private configService: ConfigService,
    private readonly httpWrapper: HttpWrapperService,
  ) {
    this.appId = this.configService.get<string>('ADZUNA_APP_ID') || '';
    this.appKey = this.configService.get<string>('ADZUNA_APP_KEY') || '';
  }

  async fetchJobs(
    country: string = 'us',
    page: number = 1,
    resultsPerPage: number = 50,
  ): Promise<AdzunaJob[]> {
    try {
      const url = `${this.baseUrl}/${country}/search/${page}`;

      const response = await this.httpWrapper.get<AdzunaResponse>(url, {
        params: {
          app_id: this.appId,
          app_key: this.appKey,
          results_per_page: resultsPerPage,
          'content-type': 'application/json',
        },
      });

      return response.data.results || [];
    } catch (error) {
      this.logger.error('Error fetching jobs from Adzuna:', error);
      return [];
    }
  }

  async searchJobs(
    country: string = 'us',
    what?: string,
    where?: string,
    options?: {
      maxDaysOld?: number;
      salaryMin?: number;
      salaryMax?: number;
      fullTime?: boolean;
      permanent?: boolean;
      contract?: boolean;
      partTime?: boolean;
    },
  ): Promise<AdzunaJob[]> {
    try {
      const url = `${this.baseUrl}/${country}/search/1`;

      const params: Record<string, string | number> = {
        app_id: this.appId,
        app_key: this.appKey,
        results_per_page: 50,
        'content-type': 'application/json',
      };

      if (what) {
        params.what = what;
      }

      if (where) {
        params.where = where;
      }

      if (options?.maxDaysOld) {
        params.max_days_old = options.maxDaysOld;
      }

      if (options?.salaryMin) {
        params.salary_min = options.salaryMin;
      }

      if (options?.salaryMax) {
        params.salary_max = options.salaryMax;
      }

      if (options?.fullTime) {
        params.full_time = 1;
      }

      if (options?.partTime) {
        params.part_time = 1;
      }

      if (options?.contract) {
        params.contract = 1;
      }

      if (options?.permanent) {
        params.permanent = 1;
      }

      const response = await this.httpWrapper.get<AdzunaResponse>(url, {
        params,
      });

      return response.data.results || [];
    } catch (error) {
      this.logger.error('Error searching jobs from Adzuna:', error);
      return [];
    }
  }
}
