import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from '../entities/job.entity';
import { JSearchService, JSearchJob } from './jsearch.service';

@Injectable()
export class JobSyncService {
  private readonly logger = new Logger(JobSyncService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private jsearchService: JSearchService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async syncJobs() {
    this.logger.log('Starting job sync via JSearch...');

    try {
      // Sync jobs for strategic tech hubs
      const countries = ['us', 'in', 'ae', 'gb', 'ca'];

      for (const country of countries) {
        await this.syncJobsForCountry(country);
      }

      await this.cleanupOldJobs();
      this.logger.log('Job sync completed successfully');
    } catch (error) {
      this.logger.error('Error during job sync:', error);
    }
  }

  private async syncJobsForCountry(country: string) {
    try {
      // Perform a broad search for software roles in the target country
      const jobs = await this.jsearchService.searchJobs(
        'Software Engineer',
        country,
      );

      for (const jSearchJob of jobs) {
        await this.saveJob(jSearchJob, country);
      }

      this.logger.log(`Synced ${jobs.length} jobs for ${country} via JSearch`);
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
    let m;
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

  public async saveJob(jSearchJob: JSearchJob, country: string) {
    try {
      // 1. Try native JSearch metadata first (Highest precision)
      let minExp: number | undefined;
      let maxExp: number | undefined;

      const jExp = jSearchJob.job_required_experience;
      if (jExp?.no_experience_required) {
        minExp = 0;
      } else if (jExp?.required_experience_in_months) {
        minExp = Math.round(jExp.required_experience_in_months / 12);
      }

      // 2. Fallback to extracting from description/highlights (Regex & Heuristics)
      const qualifications =
        jSearchJob.job_highlights?.Qualifications?.join('\n') || '';
      const combinedText = `${jSearchJob.job_description}\n${qualifications}`;

      const extracted = this.extractExperienceFromDescription(
        combinedText,
        jSearchJob.job_title,
      );

      // Merge: Native data takes priority over extracted regex data
      minExp = minExp ?? extracted.min;
      maxExp = maxExp ?? extracted.max;

      if (minExp !== undefined) {
        this.logger.log(
          `Verified Experience for "${jSearchJob.job_title}": ${minExp} years`,
        );
      }

      const existingJob = await this.jobRepository.findOne({
        where: {
          sourceId: jSearchJob.job_id,
          source: 'jsearch',
        },
      });

      const skills = this.extractSkillsFromDescription(
        jSearchJob.job_description,
      );

      const jobData = {
        title: jSearchJob.job_title,
        company: jSearchJob.employer_name,
        description: jSearchJob.job_description,
        requiredSkills: skills,
        location: `${jSearchJob.job_city || 'Remote'}, ${jSearchJob.job_country}`,
        country,
        salaryMin: jSearchJob.job_min_salary || 0,
        salaryMax: jSearchJob.job_max_salary || 0,
        salaryCurrency: 'USD',
        jobType: jSearchJob.job_employment_type?.toLowerCase() || 'full_time',
        experienceRequiredMin: minExp,
        experienceRequiredMax: maxExp,
        source: 'jsearch',
        sourceId: jSearchJob.job_id,
        jobUrl: jSearchJob.job_apply_link,
        postedAt: jSearchJob.job_posted_at_datetime_utc
          ? new Date(jSearchJob.job_posted_at_datetime_utc)
          : new Date(),
      };

      if (existingJob) {
        // Use save() instead of update() to ensure TypeORM properly handles the entity state and triggers
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

    // Run a manual query to delete old jobs ONLY if they are not saved or matched by users.
    // This prevents cascading deletes from wiping out user data.
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
