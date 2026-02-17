import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Job } from '../entities/job.entity';

export interface JobFilters {
  country?: string;
  title?: string;
  postedAt?: Date;
  search?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findJobs(filters: JobFilters): Promise<{ jobs: Job[]; total: number }> {
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

      queryBuilder.orderBy('job.postedAt', 'DESC');

      const [jobs, total] = await queryBuilder
        .skip(filters.offset || 0)
        .take(filters.limit || 20)
        .getManyAndCount();

      return { jobs, total };
    } catch (error) {
      this.logger.error('Error finding jobs:', error);
      return { jobs: [], total: 0 };
    }
  }

  async findJobById(id: string): Promise<Job> {
    try {
      const job = await this.jobRepository.findOne({ where: { id } });

      if (!job) {
        throw new NotFoundException('Job not found');
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
