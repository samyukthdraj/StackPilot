import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UsageLog, UsageAction } from '../entities/usage-log.entity';
import { JSearchQuota } from '../entities/jsearch-quota.entity';
import { AdzunaQuota } from '../entities/adzuna-quota.entity';
import { IUsageService } from '../interfaces/usage-service.interface';
import { SYSTEM_LIMITS } from '../../common/constants';

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
    @InjectRepository(JSearchQuota)
    private quotaRepository: Repository<JSearchQuota>,
    @InjectRepository(AdzunaQuota)
    private adzunaQuotaRepository: Repository<AdzunaQuota>,
  ) {}

  async trackUsage(
    userId: string,
    action: UsageAction,
    metadata?: UsageMetadata,
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
    resumeScans: { used: number; limit: number; resetAt: Date };
    jobSearches: { used: number; limit: number; resetAt: Date };
    globalJSearch: {
      used: number;
      limit: number;
      remaining: number;
      resetAt: Date | null;
    } | null;
    adzunaQuota: {
      remaining: number;
      limit: number;
      resetAt: Date | null;
    } | null;
    remaining: {
      resumeScans: number;
      jobSearches: number;
    };
  }> {
    const [resumeScans, jobSearches] = await Promise.all([
      this.getCurrentUsage(userId, UsageAction.RESUME_SCAN, 'day'),
      this.getCurrentUsage(userId, UsageAction.JOB_SEARCH, 'day'),
    ]);

    const nextReset = new Date();
    nextReset.setHours(24, 0, 0, 0); // Next midnight

    const quota = await this.quotaRepository.findOne({
      where: { id: 'singleton' },
    });

    const adzunaRow = await this.adzunaQuotaRepository.findOne({
      where: { id: 'singleton' },
    });

    return {
      resumeScans: {
        used: resumeScans,
        limit: SYSTEM_LIMITS.DAILY_RESUME_SCANS,
        resetAt: nextReset,
      },
      jobSearches: {
        used: jobSearches,
        limit: SYSTEM_LIMITS.DAILY_RESUME_SCANS, // Using same daily limit config
        resetAt: nextReset,
      },
      globalJSearch: quota
        ? {
            used: quota.requestsUsed,
            limit: quota.requestsLimit,
            remaining: Math.max(0, quota.requestsRemaining),
            resetAt: quota.requestsReset
              ? quota.requestsReset < 100000000
                ? new Date(Date.now() + quota.requestsReset * 1000)
                : new Date(quota.requestsReset * 1000)
              : null,
          }
        : null,
      adzunaQuota: adzunaRow
        ? {
            remaining: Math.max(0, adzunaRow.requestsRemaining),
            limit: adzunaRow.requestsLimit,
            resetAt: adzunaRow.requestsReset
              ? new Date(Number(adzunaRow.requestsReset) * 1000)
              : null,
          }
        : null,
      remaining: {
        resumeScans: Math.max(
          0,
          SYSTEM_LIMITS.DAILY_RESUME_SCANS - resumeScans,
        ),
        jobSearches: Math.max(
          0,
          SYSTEM_LIMITS.DAILY_RESUME_SCANS - jobSearches,
        ),
      },
    };
  }
}
