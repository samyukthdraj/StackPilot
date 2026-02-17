import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedJob } from '../entities/saved-job.entity';
import { Job } from '../entities/job.entity';
import { SaveJobDto, UpdateSavedJobDto } from '../dto/save-job.dto';

@Injectable()
export class SavedJobsService {
  private readonly logger = new Logger(SavedJobsService.name);

  constructor(
    @InjectRepository(SavedJob)
    private savedJobRepository: Repository<SavedJob>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async saveJob(
    userId: string,
    jobId: string,
    saveJobDto: SaveJobDto,
  ): Promise<SavedJob> {
    try {
      // Check if job exists
      const job = await this.jobRepository.findOne({ where: { id: jobId } });
      if (!job) {
        throw new NotFoundException('Job not found');
      }

      // Check if already saved
      const existing = await this.savedJobRepository.findOne({
        where: { userId, jobId },
      });

      if (existing) {
        throw new BadRequestException('Job already saved');
      }

      // Check free tier limits (max 10 saved jobs for free users)
      const savedCount = await this.savedJobRepository.count({
        where: { userId },
      });

      // TODO: Check user subscription type from a service
      if (savedCount >= 10) {
        throw new BadRequestException(
          'Free tier limit reached (max 10 saved jobs). Please upgrade to save more.',
        );
      }

      const savedJob = this.savedJobRepository.create({
        userId,
        jobId,
        notes: saveJobDto.notes,
        tags: saveJobDto.tags,
      });

      return await this.savedJobRepository.save(savedJob);
    } catch (error) {
      this.logger.error('Error saving job:', error);
      throw error;
    }
  }

  async getSavedJobs(
    userId: string,
    options?: {
      applied?: boolean;
      tags?: string[];
      page?: number;
      limit?: number;
    },
  ): Promise<{ items: SavedJob[]; total: number }> {
    try {
      this.logger.log(`Getting saved jobs for user: ${userId}`);

      const queryBuilder = this.savedJobRepository
        .createQueryBuilder('savedJob')
        .leftJoinAndSelect('savedJob.job', 'job')
        .where('savedJob.userId = :userId', { userId });

      if (options?.applied !== undefined) {
        queryBuilder.andWhere('savedJob.applied = :applied', {
          applied: options.applied,
        });
      }

      if (options?.tags && options.tags.length > 0) {
        queryBuilder.andWhere('savedJob.tags && ARRAY[:...tags]::text[]', {
          tags: options.tags,
        });
      }

      queryBuilder.orderBy('savedJob.createdAt', 'DESC');

      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const skip = (page - 1) * limit;

      queryBuilder.skip(skip).take(limit);

      const [items, total] = await queryBuilder.getManyAndCount();

      this.logger.log(`Found ${total} saved jobs for user ${userId}`);
      return { items, total };
    } catch (error) {
      this.logger.error(`Error getting saved jobs for user ${userId}:`, error);
      throw error;
    }
  }

  async getSavedJobById(userId: string, savedJobId: string): Promise<SavedJob> {
    const savedJob = await this.savedJobRepository.findOne({
      where: { id: savedJobId, userId },
      relations: ['job'],
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    return savedJob;
  }

  async updateSavedJob(
    userId: string,
    savedJobId: string,
    updateDto: UpdateSavedJobDto,
  ): Promise<SavedJob> {
    const savedJob = await this.getSavedJobById(userId, savedJobId);

    if (updateDto.notes !== undefined) {
      savedJob.notes = updateDto.notes;
    }

    if (updateDto.tags !== undefined) {
      savedJob.tags = updateDto.tags;
    }

    if (updateDto.applied !== undefined) {
      savedJob.applied = updateDto.applied;
      savedJob.appliedAt = updateDto.applied ? new Date() : undefined;
    }

    if (updateDto.applicationNotes !== undefined) {
      savedJob.applicationNotes = updateDto.applicationNotes;
    }

    return await this.savedJobRepository.save(savedJob);
  }

  async deleteSavedJob(userId: string, savedJobId: string): Promise<void> {
    const savedJob = await this.getSavedJobById(userId, savedJobId);
    await this.savedJobRepository.remove(savedJob);
  }

  async checkIfSaved(userId: string, jobId: string): Promise<boolean> {
    const count = await this.savedJobRepository.count({
      where: { userId, jobId },
    });
    return count > 0;
  }

  async getSavedJobStats(userId: string): Promise<{
    total: number;
    applied: number;
    pending: number;
    topTags: { tag: string; count: number }[];
  }> {
    const savedJobs = await this.savedJobRepository.find({
      where: { userId },
    });

    const total = savedJobs.length;
    const applied = savedJobs.filter((j) => j.applied).length;
    const pending = total - applied;

    // Calculate top tags
    const tagCount: Record<string, number> = {};
    savedJobs.forEach((job) => {
      job.tags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { total, applied, pending, topTags };
  }
}
