import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Job } from '../entities/job.entity';
import { JSearchService } from './jsearch.service';
import { AdzunaService } from './adzuna.service';
import { ArbeitnowService } from './arbeitnow.service';
import { ExternalJob } from '../interfaces/external-job.interface';
import { JSearchQuota } from '../../usage/entities/jsearch-quota.entity';
import { AdzunaQuota } from '../../usage/entities/adzuna-quota.entity';

@Injectable()
export class JobSyncService {
  private readonly logger = new Logger(JobSyncService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private jsearchService: JSearchService,
    private adzunaService: AdzunaService,
    private arbeitnowService: ArbeitnowService,
    @InjectRepository(JSearchQuota)
    private jsearchQuotaRepository: Repository<JSearchQuota>,
    @InjectRepository(AdzunaQuota)
    private adzunaQuotaRepository: Repository<AdzunaQuota>,
  ) {}

  @Cron('0 0 * * *')
  async syncJobs() {
    this.logger.log('Starting daily job sync across countries...');
    const countries = ['us', 'in', 'ae', 'gb'];

    for (const country of countries) {
      try {
        await this.syncJobsForCountry(country);
      } catch (error) {
        this.logger.error(`Failed to sync jobs for ${country}:`, error);
      }
    }
  }

  public async syncJobsForCountry(country: string) {
    try {
      this.logger.log(`Syncing jobs for ${country}...`);
      await this.fetchAndSaveJobs('Software Engineer', country);
      this.logger.log(`Sync complete for ${country}`);
    } catch (error) {
      this.logger.error(`Error syncing jobs for ${country}:`, error);
    }
  }

  public extractExperienceFromDescription(
    description: string,
    title: string,
  ): { min: number | undefined; max: number | undefined } {
    if (!description && !title) return { min: undefined, max: undefined };

    const cleanDesc = (description || '')
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ');

    // Strategy 1: Look for "X-Y years" or "X to Y years" (Range)
    const rangeMatch = cleanDesc.match(
      /(\d+)\s*(?:-|to)\s*(\d+)\s*(?:years|yrs|year|yr)\b/i,
    );
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1], 10);
      const max = parseInt(rangeMatch[2], 10);
      if (min < 25) return { min, max };
    }

    // Strategy 2: Look for "X+ years"
    const plusMatch = cleanDesc.match(
      /(\d+)\s*(?:\+|(?:plus))\s*(?:years|yrs|year|yr)\b/i,
    );
    if (plusMatch) {
      const min = parseInt(plusMatch[1], 10);
      if (min < 25) return { min, max: undefined };
    }

    // Strategy 3: Look for "minimum of X", "at least X", "required X"
    const minMatch = cleanDesc.match(
      /(?:minimum|at least|required|needs|preferred|expecting|require|should have)\s*(?:of\s*)?(\d+)\s*(?:years|yrs|year|yr)\b/i,
    );
    if (minMatch) {
      const min = parseInt(minMatch[1], 10);
      if (min < 25) return { min, max: undefined };
    }

    // Strategy 4: Look for "X years experience" specifically
    const expMatch = cleanDesc.match(
      /(\d+)\s*(?:years|yrs|year|yr)\s*(?:of\s*)?(?:professional\s*)?(?:experience|exp|background|industry)/i,
    );
    if (expMatch) {
      const min = parseInt(expMatch[1], 10);
      if (min < 25) return { min, max: undefined };
    }

    // Strategy 5: Broad contextual search (Number + Years within 50 chars of "experience")
    const broadRegex = /\b(\d+)\b\s*(?:years|yrs|year|yr)\b/gi;
    let m: RegExpExecArray | null;
    while ((m = broadRegex.exec(cleanDesc)) !== null) {
      const val = parseInt(m[1], 10);
      const start = Math.max(0, m.index - 70);
      const end = Math.min(cleanDesc.length, m.index + 120);
      const context = cleanDesc.substring(start, end).toLowerCase();
      if (
        context.includes('exp') ||
        context.includes('background') ||
        context.includes('professional') ||
        context.includes('work') ||
        context.includes('software')
      ) {
        if (val > 0 && val < 20) return { min: val, max: undefined };
      }
    }

    // Strategy 6: Heuristics based on title
    const lowTitle = title?.toLowerCase() || '';
    const seniorKeywords = [
      'senior',
      'lead',
      'architect',
      'principal',
      'staff',
      'vp',
      'manager',
      'expert',
      'head',
      'director',
    ];
    const juniorKeywords = [
      'junior',
      'entry',
      'intern',
      'associate',
      'graduate',
      'trainee',
    ];

    if (seniorKeywords.some((kw) => lowTitle.includes(kw)))
      return { min: 5, max: undefined };
    if (juniorKeywords.some((kw) => lowTitle.includes(kw)))
      return { min: 0, max: 2 };

    return { min: undefined, max: undefined };
  }

  /**
   * Central fallback mechanism to fetch jobs from multiple providers
   * and save them to the database.
   */
  public async fetchAndSaveJobs(
    query: string,
    country: string,
  ): Promise<string> {
    try {
      this.logger.log(
        `Attempting multi-provider fetch for: ${query} in ${country}`,
      );

      // Chain 1: JSearch (Primary)
      try {
        const quota = await this.jsearchQuotaRepository.findOne({
          where: { id: 'singleton' },
        });
        if (quota && quota.requestsRemaining <= 0) {
          throw new Error('Pre-flight: JSearch quota exhausted');
        }

        const jSearchJobs = await this.jsearchService.searchJobs(
          query,
          country,
        );
        if (jSearchJobs.length > 0) {
          this.logger.log(`Found ${jSearchJobs.length} jobs via JSearch`);
          await this.saveExternalJobs(jSearchJobs, country);
        }
        return 'jsearch'; // Return jsearch if quota was OK, even if 0 results
      } catch (err) {
        this.logger.warn(
          `JSearch skipped/failed: ${err instanceof Error ? err.message : 'Unknown error'}. Trying Adzuna...`,
        );
      }

      // Chain 2: Adzuna (Secondary)
      try {
        const quota = await this.adzunaQuotaRepository.findOne({
          where: { id: 'singleton' },
        });
        if (quota && quota.requestsRemaining <= 0) {
          throw new Error('Pre-flight: Adzuna quota exhausted');
        }

        const adzunaJobs = await this.adzunaService.searchJobs(query, country);
        if (adzunaJobs.length > 0) {
          this.logger.log(`Found ${adzunaJobs.length} jobs via Adzuna`);
          await this.saveExternalJobs(adzunaJobs, country);
        }
        return 'adzuna'; // Return adzuna if JSearch failed, even if 0 results
      } catch (err) {
        this.logger.warn(
          `Adzuna skipped/failed: ${err instanceof Error ? err.message : 'Unknown error'}. Trying Arbeitnow...`,
        );
      }

      // Chain 3: Arbeitnow (Last Resort)
      try {
        const arbeitnowJobs = await this.arbeitnowService.searchJobs(query);
        if (arbeitnowJobs.length > 0) {
          this.logger.log(`Found ${arbeitnowJobs.length} jobs via Arbeitnow`);
          await this.saveExternalJobs(arbeitnowJobs, country);
        }
        return 'arbeitnow';
      } catch (err) {
        this.logger.error('Arbeitnow fallback also failed', err);
      }

      return 'none';
    } catch (error) {
      this.logger.error('Global external search logic failed:', error);
      return 'error';
    }
  }

  private async saveExternalJobs(
    externalJobs: ExternalJob[],
    country: string,
  ): Promise<void> {
    this.logger.log(`Saving ${externalJobs.length} jobs to database...`);
    await Promise.all(
      externalJobs.map((job) => this.saveJob(job, country)),
    ).catch((err) => this.logger.error('Error in background job saving:', err));
  }

  public async saveJob(externalJob: ExternalJob, country: string) {
    try {
      // 1. Try to extract experience if not provided (use internal logic)
      let minExp = externalJob.experienceMin;
      let maxExp = externalJob.experienceMax;

      if (minExp === undefined) {
        const extracted = this.extractExperienceFromDescription(
          externalJob.description,
          externalJob.title,
        );
        minExp = extracted.min;
        maxExp = extracted.max;
      }

      if (minExp !== undefined) {
        this.logger.debug(
          `Verified Experience for "${externalJob.title}": ${minExp} years`,
        );
      }

      const existingJob = await this.jobRepository.findOne({
        where: {
          sourceId: externalJob.sourceId,
          source: externalJob.source,
        },
      });

      const skills = this.extractSkillsFromDescription(externalJob.description);

      const jobData = {
        title: externalJob.title,
        company: externalJob.company,
        description: externalJob.description,
        requiredSkills: skills,
        location: externalJob.location,
        country: country || externalJob.country || 'us',
        salaryMin: externalJob.salaryMin || 0,
        salaryMax: externalJob.salaryMax || 0,
        salaryCurrency: externalJob.salaryCurrency || 'USD',
        jobType: externalJob.jobType || 'full_time',
        experienceRequiredMin: minExp,
        experienceRequiredMax: maxExp,
        source: externalJob.source,
        sourceId: externalJob.sourceId,
        jobUrl: externalJob.url,
        postedAt: externalJob.postedAt || new Date(),
      };

      if (existingJob) {
        const updatedJob = { ...existingJob, ...jobData };
        await this.jobRepository.save(updatedJob);
      } else {
        const job = this.jobRepository.create(jobData);
        await this.jobRepository.save(job);
      }
    } catch (error) {
      this.logger.error('Error saving job:', error);
    }
  }

  private extractSkillsFromDescription(description: string): string[] {
    const commonSkills = [
      'javascript',
      'typescript',
      'python',
      'java',
      'c#',
      'c++',
      'ruby',
      'php',
      'react',
      'angular',
      'vue',
      'node.js',
      'express',
      'django',
      'flask',
      'html',
      'css',
      'sass',
      'tailwind',
      'bootstrap',
      'redux',
      'graphql',
      'sql',
      'postgresql',
      'mysql',
      'mongodb',
      'firebase',
      'aws',
      'azure',
      'docker',
      'kubernetes',
      'git',
      'jenkins',
      'jest',
      'cypress',
      'figma',
    ];

    const foundSkills = commonSkills.filter((skill) =>
      description.toLowerCase().includes(skill.toLowerCase()),
    );

    return foundSkills;
  }

  private async cleanupOldJobs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Strict deletion of jobs older than 30 days,
    // but excluding those that are still needed for user history (saved/matched)
    // to avoid foreign key constraint errors.
    await this.jobRepository.query(
      `
      DELETE FROM jobs
      WHERE "posted_at" < $1
      AND id NOT IN (SELECT job_id FROM saved_jobs)
      AND id NOT IN (SELECT job_id FROM job_matches)
      `,
      [thirtyDaysAgo],
    );
  }
}
