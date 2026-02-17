import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { User } from '../../auth/user.decorator';
import { JobsService } from '../services/jobs.service';
import { JobMatchingService } from '../services/job-matching.service';
import { ResumeService } from '../../resumes/services/resume.service';
import { UserFromJwt } from '../../auth/user-id.decorator';
import { Resume } from '../../resumes/entities/resume.entity';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(
    private readonly jobsService: JobsService,
    private readonly matchingService: JobMatchingService,
    private readonly resumeService: ResumeService,
  ) {}

  @Get()
  async getJobs(
    @User() user: UserFromJwt,
    @Query('country') country?: string,
    @Query('role') role?: string,
    @Query('days') days?: string,
    @Query('search') search?: string,
  ) {
    const filters: {
      country?: string;
      title?: string;
      postedAt?: Date;
      search?: string;
    } = {};

    if (country) filters.country = country;
    if (role) filters.title = role;
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days, 10));
      filters.postedAt = daysAgo;
    }
    if (search) filters.search = search;

    return this.jobsService.findJobs(filters);
  }

  @Get('matches')
  async getMatches(
    @User() user: UserFromJwt,
    @Query('resumeId') resumeId?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const userId = user.id;

      // Get resume to match against - explicitly type as Resume or null
      let resume: Resume | null = null;

      if (resumeId) {
        resume = await this.resumeService.getResumeById(resumeId, userId);
      } else {
        resume = await this.resumeService.getPrimaryResume(userId);
      }

      if (!resume) {
        // Return empty array instead of throwing error
        return [];
      }

      const matches = await this.matchingService.findMatchesForResume(
        resume,
        limit ? parseInt(limit, 10) : 20,
      );

      // Save matches for history
      for (const match of matches) {
        await this.matchingService.saveMatch(userId, match);
      }

      return matches;
    } catch (error) {
      this.logger.error('Error getting matches:', error);
      return [];
    }
  }

  @Get(':id/match')
  async getJobMatch(
    @User() user: UserFromJwt,
    @Param('id') jobId: string,
    @Query('resumeId') resumeId?: string,
  ) {
    const userId = user.id;

    // Get resume to match against - explicitly type as Resume or null
    let resume: Resume | null = null;

    if (resumeId) {
      resume = await this.resumeService.getResumeById(resumeId, userId);
    } else {
      resume = await this.resumeService.getPrimaryResume(userId);
    }

    if (!resume) {
      throw new BadRequestException(
        'No resume found. Please upload a resume first.',
      );
    }

    const job = await this.jobsService.findJobById(jobId);
    if (!job) {
      throw new BadRequestException('Job not found');
    }

    const match = this.matchingService.calculateMatchScore(resume, job);
    await this.matchingService.saveMatch(userId, match);

    return match;
  }

  @Get(':id')
  async getJob(@User() user: UserFromJwt, @Param('id') id: string) {
    return this.jobsService.findJobById(id);
  }
}
