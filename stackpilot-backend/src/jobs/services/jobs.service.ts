import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JSearchService } from './jsearch.service';
import { AdzunaService } from './adzuna.service';
import { ArbeitnowService } from './arbeitnow.service';
import { JobSyncService } from './job-sync.service';
import { UsageService } from '../../usage/services/usage.service';
import { UsageAction } from '../../usage/entities/usage-log.entity';
import { JSearchQuota } from '../../usage/entities/jsearch-quota.entity';
import { AdzunaQuota } from '../../usage/entities/adzuna-quota.entity';
import {
  EXCLUDE_KEYWORDS,
  IT_KEYWORDS,
  SENIOR_KEYWORDS,
} from '../jobs.constants';

export interface JobFilters {
  country?: string;
  title?: string;
  postedAt?: Date;
  search?: string;
  companies?: string[];
  locations?: string[];
  jobTypes?: string[];
  salaryMin?: number;
  experienceMin?: number;
  experienceMax?: number;
  limit?: number;
  offset?: number;
}

export interface FilteredJob extends Job {
  _excludeFromResults?: boolean;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(JSearchQuota)
    private quotaRepository: Repository<JSearchQuota>,
    @InjectRepository(AdzunaQuota)
    private adzunaQuotaRepository: Repository<AdzunaQuota>,
    private jsearchService: JSearchService,
    private adzunaService: AdzunaService,
    private arbeitnowService: ArbeitnowService,
    private jobSyncService: JobSyncService,
    private usageService: UsageService,
  ) {}

  async findJobs(
    filters: JobFilters,
    userId?: string,
  ): Promise<{
    jobs: Job[];
    total: number;
    itCount: number;
    otherCount: number;
    activeProvider?: string;
    quota?: { remaining: number; resetAt: Date | null } | null;
    adzunaQuota?: { remaining: number; resetAt: Date | null } | null;
  }> {
    try {
      // Track usage if it's a search action and we have a userId
      if (userId && (filters.search || filters.title)) {
        await this.usageService.trackUsage(userId, UsageAction.JOB_SEARCH, {
          query: filters.search || filters.title,
        });
      }

      const queryBuilder = this.jobRepository.createQueryBuilder('job');

      if (filters.country) {
        queryBuilder.andWhere('job.country = :country', {
          country: filters.country,
        });
      }

      if (filters.title) {
        queryBuilder.andWhere('job.title ILIKE :title', {
          title: `%${filters.title}%`,
        });
      }

      if (filters.postedAt) {
        queryBuilder.andWhere('job.postedAt >= :postedAt', {
          postedAt: filters.postedAt,
        });
      }

      if (filters.search) {
        queryBuilder.andWhere(
          '(job.title ILIKE :search OR job.company ILIKE :search OR job.description ILIKE :search)',
          { search: `%${filters.search}%` },
        );
      }

      // 1. Fetch quota info early to determine active provider
      const [quota, adzunaQuota] = await Promise.all([
        this.quotaRepository.findOne({ where: { id: 'singleton' } }),
        this.adzunaQuotaRepository.findOne({ where: { id: 'singleton' } }),
      ]);

      // 2. Identify initial active provider based on quota
      let activeProvider = 'jsearch';
      if (quota && quota.requestsRemaining <= 0) {
        activeProvider = 'adzuna';
        if (adzunaQuota && adzunaQuota.requestsRemaining <= 0) {
          activeProvider = 'arbeitnow';
        }
      }

      // 3. Trigger live search/fallback if results are low
      // Even if NO keyword is provided, we use a default niche query to populate the country's dashboard.
      const existingCount = await queryBuilder.getCount();
      const limit = filters.limit || 20;

      if (existingCount < limit) {
        const fallbackQuery =
          filters.search || filters.title || 'Software Engineer';
        this.logger.log(
          `Low local results (${existingCount}) for "${fallbackQuery}" in ${filters.country || 'us'}. Triggering external search via ${activeProvider}...`,
        );

        const actualProvider = await this.jobSyncService.fetchAndSaveJobs(
          fallbackQuery,
          filters.country || 'us',
        );

        // Even if actualProvider is 'none' (meaning no jobs found), 
        // it still tells us which provider was attempted last.
        if (actualProvider !== 'error' && actualProvider !== 'local') {
          activeProvider = actualProvider;
        }

        this.logger.debug(
          `Effective activeProvider after sync: ${activeProvider}`,
        );
      }

      // 4. Double check: If the primary quota is dead, we MUST be in a fallback state
      // This is a safety net for when a sync wasn't even triggered.
      if (
        activeProvider === 'jsearch' &&
        quota &&
        quota.requestsRemaining <= 0
      ) {
        activeProvider = 'adzuna';
        if (adzunaQuota && adzunaQuota.requestsRemaining <= 0) {
          activeProvider = 'arbeitnow';
        }
      }

      if (filters.companies && filters.companies.length > 0) {
        queryBuilder.andWhere('job.company IN (:...companies)', {
          companies: filters.companies,
        });
      }

      if (filters.locations && filters.locations.length > 0) {
        queryBuilder.andWhere('job.location IN (:...locations)', {
          locations: filters.locations,
        });
      }

      if (filters.jobTypes && filters.jobTypes.length > 0) {
        queryBuilder.andWhere('job.jobType IN (:...jobTypes)', {
          jobTypes: filters.jobTypes,
        });
      }

      if (filters.salaryMin) {
        queryBuilder.andWhere('job.salaryMin >= :salaryMin', {
          salaryMin: filters.salaryMin,
        });
      }

      if (filters.experienceMin !== undefined && filters.experienceMin !== -1) {
        this.logger.debug(
          `Filtering by experience: <= ${filters.experienceMin} years`,
        );
        // If user says "I have X years", show jobs where requirement <= X
        if (filters.experienceMin === 0) {
          queryBuilder.andWhere(
            '(job.experienceRequiredMin <= 0 OR job.experienceRequiredMin IS NULL)',
          );
        } else {
          queryBuilder.andWhere(
            '(job.experienceRequiredMin <= :expVal OR job.experienceRequiredMin IS NULL)',
            {
              expVal: filters.experienceMin,
            },
          );
        }

        // Extra protection: if user is looking for entry level (0-1 yrs),
        // exclude obvious senior/lead roles even if experience is NULL/unspecified.
        if (filters.experienceMin <= 1) {
          SENIOR_KEYWORDS.forEach((kw, i) => {
            queryBuilder.andWhere(`job.title NOT ILIKE :skw${i}`, {
              [`skw${i}`]: `%${kw}%`,
            });
          });
        }
      }

      queryBuilder.orderBy('job.postedAt', 'DESC');

      const [jobs, total] = await queryBuilder
        .skip(filters.offset || 0)
        .take(filters.limit || 20)
        .getManyAndCount();

      // Self-healing: try to re-extract experience for any job in the list that is missing it
      this.selfHealJobs(jobs, filters);

      // Filter out jobs that were discovered to be over-qualified after extraction
      const filteredJobs = jobs.filter(
        (j: Job & { _excludeFromResults?: boolean }) => !j._excludeFromResults,
      );
      this.logger.debug(
        `[DIAGNOSTICS] jobs after filtering: ${filteredJobs.length}`,
      );

      // Update result count if we removed jobs
      const adjustedJobs = filteredJobs;

      // Categorical total counts across all pages
      const itSql = `(${IT_KEYWORDS.map((_, i) => `job.title ILIKE :itkw${i}`).join(' OR ')})`;
      const exSql = `NOT (${EXCLUDE_KEYWORDS.map((_, i) => `job.title ILIKE :exkw${i}`).join(' OR ')})`;

      const itParams = IT_KEYWORDS.reduce(
        (acc, kw, i) => ({ ...acc, [`itkw${i}`]: `%${kw}%` }),
        {},
      );
      const exParams = EXCLUDE_KEYWORDS.reduce(
        (acc, kw, i) => ({ ...acc, [`exkw${i}`]: `%${kw}%` }),
        {},
      );

      // Helper to build count queries with base filters
      const buildBaseCountQuery = () => {
        const qb = this.jobRepository.createQueryBuilder('job');
        if (filters.country)
          qb.andWhere('job.country = :country', { country: filters.country });

        if (filters.postedAt) {
          qb.andWhere('job.postedAt >= :postedAt', {
            postedAt: filters.postedAt,
          });
        }

        if (filters.companies?.length)
          qb.andWhere('job.company IN (:...companies)', {
            companies: filters.companies,
          });
        if (filters.locations?.length)
          qb.andWhere('job.location IN (:...locations)', {
            locations: filters.locations,
          });
        if (filters.jobTypes?.length)
          qb.andWhere('job.jobType IN (:...jobTypes)', {
            jobTypes: filters.jobTypes,
          });
        if (filters.salaryMin)
          qb.andWhere('job.salaryMin >= :salaryMin', {
            salaryMin: filters.salaryMin,
          });

        if (
          filters.experienceMin !== undefined &&
          filters.experienceMin !== -1
        ) {
          if (filters.experienceMin === 0) {
            qb.andWhere(
              '(job.experienceRequiredMin <= 0 OR job.experienceRequiredMin IS NULL)',
            );
          } else {
            qb.andWhere(
              '(job.experienceRequiredMin <= :expVal OR job.experienceRequiredMin IS NULL)',
              {
                expVal: filters.experienceMin,
              },
            );
          }

          if (filters.experienceMin <= 1) {
            SENIOR_KEYWORDS.forEach((kw, i) => {
              qb.andWhere(`job.title NOT ILIKE :skw_c_${i}`, {
                [`skw_c_${i}`]: `%${kw}%`,
              });
            });
          }
        }

        if (filters.search)
          qb.andWhere(
            '(job.title ILIKE :search OR job.company ILIKE :search OR job.description ILIKE :search)',
            { search: `%${filters.search}%` },
          );
        return qb;
      };

      const itCount = await buildBaseCountQuery()
        .andWhere(`${itSql} AND ${exSql}`)
        .setParameters({ ...itParams, ...exParams })
        .getCount();

      const otherCount = await buildBaseCountQuery()
        .andWhere(`NOT (${itSql} AND ${exSql})`)
        .setParameters({ ...itParams, ...exParams })
        .getCount();

      this.logger.debug(
        `Categorization: Total=${total}, IT=${itCount}, Other=${otherCount}`,
      );

      // Update: Quotas are already fetched at the start of the method.

      return {
        jobs: adjustedJobs,
        total,
        itCount,
        otherCount,
        activeProvider,
        quota: quota
          ? {
              remaining: quota.requestsRemaining,
              resetAt: quota.requestsReset
                ? quota.requestsReset < 100000000
                  ? new Date(Date.now() + quota.requestsReset * 1000)
                  : new Date(Number(quota.requestsReset) * 1000)
                : null,
            }
          : null,
        adzunaQuota: adzunaQuota
          ? {
              remaining: adzunaQuota.requestsRemaining,
              resetAt: adzunaQuota.requestsReset
                ? new Date(Number(adzunaQuota.requestsReset) * 1000)
                : null,
            }
          : null,
      };
    } catch (error) {
      this.logger.error('Error finding jobs:', error);
      return { jobs: [], total: 0, itCount: 0, otherCount: 0 };
    }
  }

  async findJobById(id: string): Promise<Job> {
    try {
      const job = await this.jobRepository.findOne({ where: { id } });

      if (!job) {
        throw new NotFoundException('Job not found');
      }

      // Self-healing: if experience is missing, try to re-extract it from the stored description
      if (
        job.experienceRequiredMin === null ||
        job.experienceRequiredMin === undefined
      ) {
        const extracted = this.jobSyncService.extractExperienceFromDescription(
          job.description || '',
          job.title,
        );
        if (extracted.min !== undefined) {
          this.logger.log(`Self-healing local job data for "${job.title}"...`);
          job.experienceRequiredMin = extracted.min;
          job.experienceRequiredMax = extracted.max;
          // Save back to DB asynchronously
          this.jobRepository
            .save(job)
            .catch((err) =>
              this.logger.error(
                `Self-heal failed in findJobById for job ${id}`,
                err,
              ),
            );
        }
      }

      return job;
    } catch (error) {
      this.logger.error(`Error finding job by id ${id}:`, error);
      throw error;
    }
  }

  async getRecentJobs(days: number = 7): Promise<Job[]> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      return this.jobRepository.find({
        where: {
          postedAt: LessThan(date),
        },
        order: {
          postedAt: 'DESC',
        },
        take: 50,
      });
    } catch (error) {
      this.logger.error('Error getting recent jobs:', error);
      return [];
    }
  }

  /**
   * Internal helper to fix missing experience data in job records on-the-fly.
   * This maintains compatibility with the legacy "self-healing" behavior
   * while isolating the logic for better readability.
   */
  private selfHealJobs(jobs: FilteredJob[], filters: JobFilters): void {
    this.logger.debug(
      `[DIAGNOSTICS] jobs initially fetched: ${jobs.length}. experienceMin filter: ${filters.experienceMin}`,
    );

    for (const job of jobs) {
      if (
        job.experienceRequiredMin === null ||
        job.experienceRequiredMin === undefined ||
        job.experienceRequiredMin === 0
      ) {
        const extracted = this.jobSyncService.extractExperienceFromDescription(
          job.description || '',
          job.title,
        );

        if (
          extracted.min !== undefined &&
          extracted.min !== job.experienceRequiredMin
        ) {
          this.logger.debug(
            `[DIAGNOSTICS] Self-healing "${job.title}": Corrected ${job.experienceRequiredMin} -> ${extracted.min} years`,
          );
          job.experienceRequiredMin = extracted.min;
          job.experienceRequiredMax = extracted.max;

          // Asynchronous update to DB
          // POST-FETCH FILTERING: If it no longer matches the user's filter, mark it for exclusion
          if (
            filters.experienceMin !== undefined &&
            filters.experienceMin !== -1
          ) {
            if (extracted.min > filters.experienceMin) {
              job._excludeFromResults = true;
            }
          }
        }
      } else {
        if (
          filters.experienceMin !== undefined &&
          filters.experienceMin !== -1
        ) {
          if (job.experienceRequiredMin > filters.experienceMin) {
            job._excludeFromResults = true;
          }
        }
      }
    }
  }
}
