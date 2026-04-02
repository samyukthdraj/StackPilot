import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpWrapperService } from './http-wrapper.service';

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
  ): Promise<JSearchJob[]> {
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

      return response.data.data || [];
    } catch (error) {
      this.logger.error('Error searching jobs from JSearch:', error);
      return [];
    }
  }
}
