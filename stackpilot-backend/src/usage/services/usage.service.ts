import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UsageLog, UsageAction } from '../entities/usage-log.entity';
import { IUsageService } from '../interfaces/usage-service.interface';

export interface UsageMetadata {
  resumeId?: string;
  jobId?: string;
  searchQuery?: string;
  resultsCount?: number;
  [key: string]: unknown;
}

@Injectable()
export class UsageService implements IUsageService {
  private readonly logger = new Logger(UsageService.name);

  constructor(
    @InjectRepository(UsageLog)
    private usageRepository: Repository<UsageLog>,
  ) {}

  async trackUsage(
    userId: string,
    action: UsageAction,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const usage = this.usageRepository.create({
        userId,
        action,
        metadata: metadata || {},
      });
      await this.usageRepository.save(usage);
    } catch (error) {
      this.logger.error('Error tracking usage:', error);
    }
  }

  async getCurrentUsage(
    userId: string,
    action: UsageAction,
    timeframe: 'day' | 'week' | 'month',
  ): Promise<number> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case 'day':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(now.setHours(0, 0, 0, 0));
      }

      return await this.usageRepository.count({
        where: {
          userId,
          action,
          createdAt: Between(startDate, new Date()),
        },
      });
    } catch (error) {
      this.logger.error('Error getting current usage:', error);
      return 0;
    }
  }

  async getUsageSummary(userId: string): Promise<{
    resumeScans: { used: number; limit: number };
    jobSearches: { used: number; limit: number };
    remaining: {
      resumeScans: number;
      jobSearches: number;
    };
  }> {
    const [resumeScans, jobSearches] = await Promise.all([
      this.getCurrentUsage(userId, UsageAction.RESUME_SCAN, 'day'),
      this.getCurrentUsage(userId, UsageAction.JOB_SEARCH, 'day'),
    ]);

    const FREE_TIER_LIMITS = {
      resumeScans: 3,
      jobSearches: 5,
    };

    return {
      resumeScans: {
        used: resumeScans,
        limit: FREE_TIER_LIMITS.resumeScans,
      },
      jobSearches: {
        used: jobSearches,
        limit: FREE_TIER_LIMITS.jobSearches,
      },
      remaining: {
        resumeScans: Math.max(0, FREE_TIER_LIMITS.resumeScans - resumeScans),
        jobSearches: Math.max(0, FREE_TIER_LIMITS.jobSearches - jobSearches),
      },
    };
  }
}
