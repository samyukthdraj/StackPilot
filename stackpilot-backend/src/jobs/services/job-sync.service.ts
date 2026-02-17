import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm'; // Remove MoreThan
import { Cron, CronExpression } from '@nestjs/schedule';
import { Job } from '../entities/job.entity';
import { AdzunaService, AdzunaJob } from './adzuna.service';

@Injectable()
export class JobSyncService {
  private readonly logger = new Logger(JobSyncService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private adzunaService: AdzunaService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async syncJobs() {
    this.logger.log('Starting job sync...');

    try {
      // Sync jobs for different countries
      const countries = ['us', 'gb', 'au', 'de', 'fr', 'ca'];

      for (const country of countries) {
        await this.syncJobsForCountry(country);
      }

      // Clean up old jobs (older than 30 days)
      await this.cleanupOldJobs();

      this.logger.log('Job sync completed successfully');
    } catch (error) {
      this.logger.error('Error during job sync:', error);
    }
  }

  private async syncJobsForCountry(country: string) {
    try {
      const jobs = await this.adzunaService.fetchJobs(country);

      for (const adzunaJob of jobs) {
        await this.saveJob(adzunaJob, country);
      }

      this.logger.log(`Synced ${jobs.length} jobs for ${country}`);
    } catch (error) {
      this.logger.error(`Error syncing jobs for ${country}:`, error);
    }
  }

  private async saveJob(adzunaJob: AdzunaJob, country: string) {
    try {
      // Check if job already exists
      const existingJob = await this.jobRepository.findOne({
        where: {
          sourceId: adzunaJob.id,
          source: 'adzuna',
        },
      });

      // Extract skills from description (simplified)
      const skills = this.extractSkillsFromDescription(adzunaJob.description);

      const jobData = {
        title: adzunaJob.title,
        company: adzunaJob.company.display_name,
        description: adzunaJob.description,
        requiredSkills: skills,
        location: adzunaJob.location.display_name,
        country,
        salaryMin: adzunaJob.salary_min,
        salaryMax: adzunaJob.salary_max,
        salaryCurrency: 'USD',
        jobType: adzunaJob.contract_time || 'full_time',
        source: 'adzuna',
        sourceId: adzunaJob.id,
        jobUrl: adzunaJob.redirect_url,
        postedAt: new Date(adzunaJob.created),
      };

      if (existingJob) {
        // Update existing job
        await this.jobRepository.update(existingJob.id, jobData);
      } else {
        // Create new job
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

    await this.jobRepository.delete({
      postedAt: LessThan(thirtyDaysAgo),
    });
  }
}
