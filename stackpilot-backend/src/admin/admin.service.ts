import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UsageLog } from '../usage/entities/usage-log.entity';
import { JobSyncService } from '../jobs/services/job-sync.service';
import { IAdminService } from './interfaces/admin-service.interface';
import { UsageAction } from '../usage/entities/usage-log.entity';

// Define local types
type DashboardStats = {
  users: { total: number; activeToday: number };
  jobs: { total: number; addedToday: number };
  usage: { totalScans: number; totalMatches: number };
  timestamp: Date;
};

type UserListResponse = {
  users: Array<{
    id: string;
    email: string;
    subscriptionType: string;
    dailyResumeScans: number;
    createdAt: Date;
  }>;
  total: number;
  page: number;
  totalPages: number;
};

type UserDetailsResponse = {
  user: {
    id: string;
    email: string;
    subscriptionType: string;
    createdAt: Date;
    resumes: number;
  };
  usage: UsageLog[];
};

type UsageStatsResponse = Array<{ date: string; count: number }>;

type JobStatsResponse = {
  total: number;
  byCountry: Record<string, number>;
  recent: { count: number; days: number };
};

interface UsageStatsResult {
  date: string;
  count: string;
}

interface JobsByCountryResult {
  country: string;
  count: string;
}

@Injectable()
export class AdminService implements IAdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(UsageLog)
    private readonly usageRepository: Repository<UsageLog>,
    private readonly jobSyncService: JobSyncService,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      activeToday,
      totalJobs,
      jobsAddedToday,
      totalScans,
      totalMatches,
    ] = await Promise.all([
      this.userRepository.count(),
      this.getActiveUsersToday(),
      this.jobRepository.count(),
      this.getJobsAddedToday(),
      this.getTotalScans(),
      this.getTotalMatches(),
    ]);

    return {
      users: {
        total: totalUsers,
        activeToday,
      },
      jobs: {
        total: totalJobs,
        addedToday: jobsAddedToday,
      },
      usage: {
        totalScans,
        totalMatches,
      },
      timestamp: new Date(),
    };
  }

  async getUsers(options: {
    page: number;
    limit: number;
  }): Promise<UserListResponse> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        subscriptionType: u.subscriptionType,
        dailyResumeScans: u.dailyResumeScans,
        createdAt: u.createdAt,
      })),
      total,
      page: options.page,
      totalPages: Math.ceil(total / options.limit),
    };
  }

  async getUserDetails(userId: string): Promise<UserDetailsResponse> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['resumes'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const usage = await this.usageRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 100,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        subscriptionType: user.subscriptionType,
        createdAt: user.createdAt,
        resumes: user.resumes?.length || 0,
      },
      usage,
    };
  }

  async getUsageStats(options: {
    days: number;
    action?: string;
  }): Promise<UsageStatsResponse> {
    const since = new Date();
    since.setDate(since.getDate() - options.days);

    const query = this.usageRepository
      .createQueryBuilder('usage')
      .select('DATE(usage.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('usage.createdAt >= :since', { since });

    if (options.action) {
      query.andWhere('usage.action = :action', { action: options.action });
    }

    query.groupBy('DATE(usage.createdAt)').orderBy('date', 'ASC');

    const results = await query.getRawMany<UsageStatsResult>();

    return results.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));
  }

  async getJobStats(): Promise<JobStatsResponse> {
    const [total, byCountry, recent] = await Promise.all([
      this.jobRepository.count(),
      this.getJobsByCountry(),
      this.getRecentJobs(7),
    ]);

    return {
      total,
      byCountry,
      recent: {
        count: recent,
        days: 7,
      },
    };
  }

  async forceJobSync(): Promise<{ message: string }> {
    await this.jobSyncService.syncJobs();
    return { message: 'Job sync triggered successfully' };
  }

  async cleanupJobs(days: number): Promise<{ message: string }> {
    const before = new Date();
    before.setDate(before.getDate() - days);

    const result = await this.jobRepository.delete({
      postedAt: before,
    });

    return {
      message: `Deleted ${result.affected} jobs older than ${days} days`,
    };
  }

  private async getActiveUsersToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.usageRepository
      .createQueryBuilder('usage')
      .select('COUNT(DISTINCT usage.userId)', 'count')
      .where('usage.createdAt >= :today', { today })
      .getRawOne<{ count: string }>();

    return result ? parseInt(result.count, 10) : 0;
  }

  private async getJobsAddedToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.jobRepository.count({
      where: {
        createdAt: today,
      },
    });
  }

  private async getTotalScans(): Promise<number> {
    return this.usageRepository.count({
      where: {
        action: UsageAction.RESUME_SCAN,
      },
    });
  }

  private async getTotalMatches(): Promise<number> {
    return this.usageRepository.count({
      where: {
        action: UsageAction.MATCH_VIEW,
      },
    });
  }

  private async getJobsByCountry(): Promise<Record<string, number>> {
    const results = await this.jobRepository
      .createQueryBuilder('job')
      .select('job.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('job.country')
      .getRawMany<JobsByCountryResult>();

    const acc: Record<string, number> = {};
    results.forEach((r) => {
      const country = r.country || 'unknown';
      acc[country] = parseInt(r.count, 10);
    });

    return acc;
  }

  private async getRecentJobs(days: number): Promise<number> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.jobRepository.count({
      where: {
        createdAt: since,
      },
    });
  }
}
