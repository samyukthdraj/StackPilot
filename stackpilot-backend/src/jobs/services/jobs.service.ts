import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Job } from '../entities/job.entity';
import { JSearchService } from './jsearch.service';
import { JobSyncService } from './job-sync.service';

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

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private jsearchService: JSearchService,
    private jobSyncService: JobSyncService,
  ) {}

  async findJobs(filters: JobFilters): Promise<{ jobs: Job[]; total: number; itCount: number; otherCount: number }> {
    try {
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

      const needsLiveSearch = filters.search || filters.title || filters.country || (filters.companies?.length) || (filters.locations?.length);
      
      if (needsLiveSearch) {
        let searchTerm = filters.search || filters.title || '';
        
        if (!searchTerm && filters.companies?.length) {
          searchTerm = filters.companies.join(' ');
        } else if (!searchTerm && filters.locations?.length) {
          searchTerm = filters.locations.join(' ');
        } else if (!searchTerm) {
          searchTerm = 'software engineer';
        }

        try {
          const jJobs = await this.jsearchService.searchJobs(
            searchTerm,
            filters.country || 'us',
          );
          
          if (jJobs && jJobs.length > 0) {
            for (const jj of jJobs.slice(0, 15)) {
              await this.jobSyncService.saveJob(jj as any, filters.country || 'us');
            }
          }
        } catch (e) {
          this.logger.error('Error fetching live jobs:', e);
        }
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
        this.logger.debug(`Filtering by experience: <= ${filters.experienceMin} years`);
        // If user says "I have X years", show jobs where requirement <= X
        if (filters.experienceMin === 0) {
           queryBuilder.andWhere('(job.experienceRequiredMin <= 0 OR job.experienceRequiredMin IS NULL)');
        } else {
           queryBuilder.andWhere('(job.experienceRequiredMin <= :expVal OR job.experienceRequiredMin IS NULL)', {
             expVal: filters.experienceMin,
           });
        }
        
        // Extra protection: if user is looking for entry level (0-1 yrs), 
        // exclude obvious senior/lead roles even if experience is NULL/unspecified.
        if (filters.experienceMin <= 1) {
          const seniorKeywords = ['Senior', 'Lead', 'Architect', 'Principal', 'Staff', 'VP', 'Manager', 'Expert', 'Head', 'Director'];
          seniorKeywords.forEach((kw, i) => {
            queryBuilder.andWhere(`job.title NOT ILIKE :skw${i}`, { [`skw${i}`]: `%${kw}%` });
          });
        }
      }

      queryBuilder.orderBy('job.postedAt', 'DESC');

      const [jobs, total] = await queryBuilder
        .skip(filters.offset || 0)
        .take(filters.limit || 20)
        .getManyAndCount();

      // Self-healing: try to re-extract experience for any job in the list that is missing it
      // This ensures cards show the data immediately without needing to click view details
      this.logger.debug(`[DIAGNOSTICS] jobs initially fetched: ${jobs.length}. experienceMin filter: ${filters.experienceMin}`);
      const finalJobs = [...jobs];
      for (const job of finalJobs) {
        if (
          job.experienceRequiredMin === null ||
          job.experienceRequiredMin === undefined ||
          job.experienceRequiredMin === 0 // Force re-check for 0s as they are often defaults
        ) {
          const extracted = this.jobSyncService.extractExperienceFromDescription(
            job.description || '',
            job.title,
          );
          if (extracted.min !== undefined && extracted.min !== job.experienceRequiredMin) {
            this.logger.debug(`[DIAGNOSTICS] Self-healing "${job.title}": Corrected ${job.experienceRequiredMin} -> ${extracted.min} years`);
            job.experienceRequiredMin = extracted.min;
            job.experienceRequiredMax = extracted.max;
            
            // Asynchronous update to DB
            this.jobRepository
              .update(job.id, {
                experienceRequiredMin: extracted.min,
                experienceRequiredMax: extracted.max,
              })
              .catch((err) =>
                this.logger.error(`Self-heal update failed for job ${job.id}`, err),
              );

            // POST-FETCH FILTERING: If it no longer matches the user's filter, mark it for exclusion
            if (filters.experienceMin !== undefined && filters.experienceMin !== -1) {
                if (extracted.min > filters.experienceMin) {
                    this.logger.debug(`[DIAGNOSTICS] Excluded job "${job.title}": Extracted ${extracted.min} > Filter ${filters.experienceMin}`);
                    (job as any)._excludeFromResults = true;
                }
            }
          }
        } else {
             // If the job already has a valid experience required in the database > 0
             // and the query SOMEHOW matched it (e.g. it was a null check)
             if (filters.experienceMin !== undefined && filters.experienceMin !== -1) {
                if (job.experienceRequiredMin > filters.experienceMin) {
                    this.logger.debug(`[DIAGNOSTICS] Overqualified job matched by query?! ${job.title}: DB ${job.experienceRequiredMin} > Filter ${filters.experienceMin}`);
                    (job as any)._excludeFromResults = true;
                }
             }
        }
      }

      // Filter out jobs that were discovered to be over-qualified after extraction
      const filteredJobs = finalJobs.filter(j => !(j as any)._excludeFromResults);
      this.logger.debug(`[DIAGNOSTICS] jobs after filtering: ${filteredJobs.length}`);
      
      // Update result count if we removed jobs
      const adjustedJobs = filteredJobs;


      // Categorical total counts across all pages
      const itKeywords = ['developer', 'qa', 'sde', 'software', 'front end', 'backend', 'full stack', 'devops', 'architect', 'programmer', 'coding', 'web', 'app', 'react', 'node', 'python', 'java', 'typescript', 'javascript', 'c#', 'dotnet', 'scientist', 'computing', 'ios', 'android'];
      const excludeKeywords = ['electrical', 'instrumentation', 'civil', 'mechanical', 'structural', 'construction', 'medical', 'nursing', 'marketing', 'sales'];

      const itSql = `(${itKeywords.map((_, i) => `job.title ILIKE :itkw${i}`).join(' OR ')})`;
      const exSql = `NOT (${excludeKeywords.map((_, i) => `job.title ILIKE :exkw${i}`).join(' OR ')})`;
      
      const itParams = itKeywords.reduce((acc, kw, i) => ({ ...acc, [`itkw${i}`]: `%${kw}%` }), {});
      const exParams = excludeKeywords.reduce((acc, kw, i) => ({ ...acc, [`exkw${i}`]: `%${kw}%` }), {});

      // Helper to build count queries with base filters
      const buildBaseCountQuery = () => {
        const qb = this.jobRepository.createQueryBuilder('job');
        if (filters.country) qb.andWhere('job.country = :country', { country: filters.country });
        if (filters.companies?.length) qb.andWhere('job.company IN (:...companies)', { companies: filters.companies });
        if (filters.locations?.length) qb.andWhere('job.location IN (:...locations)', { locations: filters.locations });
        if (filters.jobTypes?.length) qb.andWhere('job.jobType IN (:...jobTypes)', { jobTypes: filters.jobTypes });
        if (filters.salaryMin) qb.andWhere('job.salaryMin >= :salaryMin', { salaryMin: filters.salaryMin });
        
        if (filters.experienceMin !== undefined) {
          if (filters.experienceMin === 0) {
            qb.andWhere('(job.experienceRequiredMin <= 0 OR job.experienceRequiredMin IS NULL)');
          } else {
            qb.andWhere('job.experienceRequiredMin <= :expVal', { expVal: filters.experienceMin });
          }
        }

        if (filters.search) qb.andWhere('(job.title ILIKE :search OR job.company ILIKE :search OR job.description ILIKE :search)', { search: `%${filters.search}%` });
        return qb;
      };

      const itCount = await buildBaseCountQuery()
        .where(`${itSql} AND ${exSql}`)
        .setParameters({ ...itParams, ...exParams })
        .getCount();

      const otherCount = await buildBaseCountQuery()
        .where(`NOT (${itSql} AND ${exSql})`)
        .setParameters({ ...itParams, ...exParams })
        .getCount();

      this.logger.debug(`Categorization: Total=${total}, IT=${itCount}, Other=${otherCount}`);

      return { jobs: adjustedJobs, total, itCount, otherCount };
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
              this.logger.error(`Self-heal failed in findJobById for job ${id}`, err),
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
}
