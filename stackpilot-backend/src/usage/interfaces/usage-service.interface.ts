import { UsageAction } from '../entities/usage-log.entity';

export interface IUsageService {
  getCurrentUsage(
    userId: string,
    action: UsageAction,
    timeframe: 'day' | 'week' | 'month',
  ): Promise<number>;

  trackUsage(
    userId: string,
    action: UsageAction,
    metadata?: Record<string, unknown>,
  ): Promise<void>;

  getUsageSummary(userId: string): Promise<{
    resumeScans: { used: number; limit: number };
    jobSearches: { used: number; limit: number };
    remaining: { resumeScans: number; jobSearches: number };
  }>;
}
