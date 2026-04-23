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
import { NotificationSchedulerService } from '../services/notification-scheduler.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Jobs')
@ApiBearerAuth()
@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(
    private readonly jobsService: JobsService,
    private readonly matchingService: JobMatchingService,
    private readonly resumeService: ResumeService,
    private readonly notificationSchedulerService: NotificationSchedulerService,
  ) {}

  @ApiTags('Jobs')
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get jobs with filtering and categorization' })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Filter by country code (e.g., US, IN)',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter by job title',
  })
  @ApiQuery({
    name: 'days',
    required: false,
    description: 'Find jobs posted within last X days',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'General keyword search',
  })
  @ApiQuery({ name: 'salaryMin', required: false, type: Number })
  @ApiQuery({ name: 'experienceMin', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20 })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0 })
  @ApiResponse({
    status: 200,
    description:
      'Returns filtered jobs, categorization counts, and API quota status',
  })
  async getJobs(
    @User() user: UserFromJwt,
    @Query('country') country?: string,
    @Query('role') role?: string,
    @Query('days') days?: string,
    @Query('search') search?: string,
    @Query('companies') companies?: string | string[],
    @Query('locations') locations?: string | string[],
    @Query('jobTypes') jobTypes?: string | string[],
    @Query('salaryMin') salaryMin?: string,
    @Query('experienceMin') experienceMin?: string,
    @Query('experienceMax') experienceMax?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const filters: {
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
    } = {};

    if (country) filters.country = country;
    if (role) filters.title = role;
    if (days) {
      const daysAgo = new Date();
      const daysValue = parseFloat(days);
      daysAgo.setTime(daysAgo.getTime() - daysValue * 24 * 60 * 60 * 1000);
      filters.postedAt = daysAgo;
    }
    if (search) filters.search = search;

    if (companies) {
      filters.companies = Array.isArray(companies) ? companies : [companies];
    }
    if (locations) {
      filters.locations = Array.isArray(locations) ? locations : [locations];
    }
    if (jobTypes) {
      filters.jobTypes = Array.isArray(jobTypes) ? jobTypes : [jobTypes];
    }
    if (salaryMin) {
      filters.salaryMin = parseInt(salaryMin, 10);
    }
    if (experienceMin) {
      filters.experienceMin = parseInt(experienceMin, 10);
    }
    if (experienceMax) {
      filters.experienceMax = parseInt(experienceMax, 10);
    }

    if (limit) filters.limit = parseInt(limit, 10);
    if (offset) filters.offset = parseInt(offset, 10);

    const result = await this.jobsService.findJobs(filters, user?.id);
    this.logger.debug(
      `[DEBUG] findJobs activeProvider: ${result.activeProvider}`,
    );
    return result;
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
  @ApiOperation({ summary: 'Get job details by ID' })
  @ApiResponse({ status: 200, description: 'Returns full job details' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getJob(@User() user: UserFromJwt, @Param('id') id: string) {
    return this.jobsService.findJobById(id);
  }

  @Get('debug/trigger-daily-digest')
  async triggerDailyDigest(@User() user: UserFromJwt) {
    // Only allow for admin or for testing
    this.logger.log(`Manual daily digest trigger requested by ${user.email}`);
    await this.notificationSchedulerService.sendDailyDigests();
    return { message: 'Daily digest cycle triggered' };
  }
}
