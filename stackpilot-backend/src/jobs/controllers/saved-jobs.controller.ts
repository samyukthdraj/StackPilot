import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UserId } from '../../auth/user-id.decorator';
import { SavedJobsService } from '../services/saved-jobs.service';
import { SaveJobDto, UpdateSavedJobDto } from '../dto/save-job.dto';

@Controller('jobs/saved')
@UseGuards(JwtAuthGuard)
export class SavedJobsController {
  constructor(private readonly savedJobsService: SavedJobsService) {}

  @Post(':jobId')
  async saveJob(
    @UserId() userId: string,
    @Param('jobId') jobId: string,
    @Body() saveJobDto: SaveJobDto,
  ) {
    const savedJob = await this.savedJobsService.saveJob(
      userId,
      jobId,
      saveJobDto,
    );
    return {
      message: 'Job saved successfully',
      savedJob,
    };
  }

  @Get()
  async getSavedJobs(
    @UserId() userId: string,
    @Query('applied') applied?: string,
    @Query('tags') tags?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: {
      applied?: boolean;
      tags?: string[];
      page?: number;
      limit?: number;
    } = {};

    if (applied !== undefined) {
      filters.applied = applied === 'true';
    }

    if (tags) {
      filters.tags = tags.split(',');
    }

    if (page) {
      filters.page = parseInt(page, 10);
    }

    if (limit) {
      filters.limit = parseInt(limit, 10);
    }

    const result = await this.savedJobsService.getSavedJobs(userId, filters);
    return result;
  }

  @Get('stats')
  async getStats(@UserId() userId: string) {
    return this.savedJobsService.getSavedJobStats(userId);
  }

  @Get('check/:jobId')
  async checkIfSaved(@UserId() userId: string, @Param('jobId') jobId: string) {
    const isSaved = await this.savedJobsService.checkIfSaved(userId, jobId);
    return { isSaved };
  }

  @Get(':id')
  async getSavedJob(@UserId() userId: string, @Param('id') id: string) {
    return this.savedJobsService.getSavedJobById(userId, id);
  }

  @Patch(':id')
  async updateSavedJob(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updateDto: UpdateSavedJobDto,
  ) {
    const savedJob = await this.savedJobsService.updateSavedJob(
      userId,
      id,
      updateDto,
    );
    return {
      message: 'Saved job updated successfully',
      savedJob,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSavedJob(@UserId() userId: string, @Param('id') id: string) {
    await this.savedJobsService.deleteSavedJob(userId, id);
  }
}
