import { SetMetadata } from '@nestjs/common';
import { UsageAction } from '../entities/usage-log.entity';

export const UsageLimit = (
  action: UsageAction,
  limit: number,
  timeframe: 'day' | 'week' | 'month' = 'day',
) => SetMetadata('usageLimit', { action, limit, timeframe });
