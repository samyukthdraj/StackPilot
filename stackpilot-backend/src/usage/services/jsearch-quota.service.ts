import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JSearchQuota } from '../entities/jsearch-quota.entity';

/**
 * Tracks JSearch / RapidAPI quota from live response headers.
 *
 * RapidAPI headers (returned with every response):
 *   x-ratelimit-requests-limit    — total allowed this billing period (e.g. 200)
 *   x-ratelimit-requests-remaining — how many are left
 *   x-ratelimit-requests-reset    — seconds until reset (epoch or duration depending on plan)
 *
 * BASIC plan: 200 requests / MONTH  (not per day).
 * The cron sync runs every 6 hours × 5 countries = 20 requests/day = 600/month.
 * So we MUST guard before each sync call.
 */
@Injectable()
export class JSearchQuotaService {
  private readonly logger = new Logger(JSearchQuotaService.name);

  // In-memory cache for fast reads (avoids DB round-trip on every check)
  private cachedQuota: {
    limit: number;
    remaining: number;
    reset: number | null;
    used: number;
    lastUpdated: Date | null;
  } = {
    limit: 200,
    remaining: 200,
    reset: null,
    used: 0,
    lastUpdated: null,
  };

  constructor(
    @InjectRepository(JSearchQuota)
    private quotaRepository: Repository<JSearchQuota>,
  ) {}

  /**
   * Called after each successful JSearch HTTP response.
   * Extracts quota headers and persists to DB.
   */
  async updateFromHeaders(
    headers: Record<string, string | number>,
  ): Promise<void> {
    try {
      const limit =
        this.parseHeader(headers['x-ratelimit-requests-limit']) ??
        this.cachedQuota.limit;
      const remaining =
        this.parseHeader(headers['x-ratelimit-requests-remaining']) ??
        this.cachedQuota.remaining;
      const reset =
        this.parseHeader(headers['x-ratelimit-requests-reset']) ??
        this.cachedQuota.reset;
      const used = limit - remaining;

      // Update in-memory cache immediately
      this.cachedQuota = {
        limit,
        remaining,
        reset,
        used,
        lastUpdated: new Date(),
      };

      this.logger.log(
        `JSearch quota: ${remaining}/${limit} remaining | used: ${used} | resets in ${reset ? Math.round(reset / 86400) + ' days' : 'unknown'}`,
      );

      // Warn when getting low
      if (remaining <= 20) {
        this.logger.warn(
          `⚠️  JSearch quota CRITICAL: only ${remaining} requests remaining!`,
        );
      } else if (remaining <= 50) {
        this.logger.warn(
          `⚠️  JSearch quota LOW: ${remaining} requests remaining`,
        );
      }

      // Persist to DB (upsert singleton row)
      const existing = await this.quotaRepository.findOne({ where: {} });
      if (existing) {
        await this.quotaRepository.update(existing.id, {
          requestsLimit: limit,
          requestsRemaining: remaining,
          requestsReset: reset,
          requestsUsed: used,
        });
      } else {
        const quota = this.quotaRepository.create({
          requestsLimit: limit,
          requestsRemaining: remaining,
          requestsReset: reset,
          requestsUsed: used,
        });
        await this.quotaRepository.save(quota);
      }
    } catch (err) {
      this.logger.error('Failed to update JSearch quota from headers:', err);
    }
  }

  /**
   * Check if we have enough quota remaining to make `count` requests.
   * Defaults to requiring at least 10 remaining (safety buffer).
   */
  async hasQuota(requiredRequests: number = 1): Promise<boolean> {
    const remaining = await this.getRemaining();
    return remaining >= requiredRequests;
  }

  /**
   * Get remaining quota. Uses in-memory cache if fresh (< 5 mins old),
   * otherwise reloads from DB.
   */
  async getRemaining(): Promise<number> {
    if (
      this.cachedQuota.lastUpdated &&
      Date.now() - this.cachedQuota.lastUpdated.getTime() < 5 * 60 * 1000
    ) {
      return this.cachedQuota.remaining;
    }
    // Reload from DB
    const row = await this.quotaRepository.findOne({ where: {} });
    if (row) {
      this.cachedQuota = {
        limit: row.requestsLimit,
        remaining: row.requestsRemaining,
        reset: row.requestsReset,
        used: row.requestsUsed,
        lastUpdated: row.lastCallAt,
      };
      return row.requestsRemaining;
    }
    return this.cachedQuota.remaining;
  }

  /** Get full quota snapshot for the API endpoint */
  async getQuotaSnapshot(): Promise<{
    limit: number;
    remaining: number;
    used: number;
    usedPercent: number;
    resetInDays: number | null;
    resetDate: string | null;
    lastCallAt: string | null;
    status: 'ok' | 'low' | 'critical' | 'exhausted';
  }> {
    const row = await this.quotaRepository.findOne({ where: {} });

    const limit = row?.requestsLimit ?? this.cachedQuota.limit;
    const remaining = row?.requestsRemaining ?? this.cachedQuota.remaining;
    const used = row?.requestsUsed ?? this.cachedQuota.used;
    const reset = row?.requestsReset ?? this.cachedQuota.reset;
    const lastCallAt = row?.lastCallAt ?? null;

    const usedPercent = limit > 0 ? Math.round((used / limit) * 100) : 0;
    const resetInDays = reset ? Math.ceil(reset / 86400) : null;
    const resetDate = reset
      ? new Date(Date.now() + reset * 1000).toISOString()
      : null;

    let status: 'ok' | 'low' | 'critical' | 'exhausted' = 'ok';
    if (remaining === 0) status = 'exhausted';
    else if (remaining <= 10) status = 'critical';
    else if (remaining <= 40) status = 'low';

    return {
      limit,
      remaining,
      used,
      usedPercent,
      resetInDays,
      resetDate,
      lastCallAt: lastCallAt ? lastCallAt.toISOString() : null,
      status,
    };
  }

  private parseHeader(val: string | number | undefined): number | null {
    if (val === undefined || val === null) return null;
    const n = typeof val === 'number' ? val : parseInt(String(val), 10);
    return isNaN(n) ? null : n;
  }
}
