import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsageService } from '../services/usage.service';
import { UsageAction } from '../entities/usage-log.entity';
import { Request } from 'express';

// Extend the Express Request interface
interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    subscriptionType: string;
  };
}

export interface UsageLimitOptions {
  action: UsageAction;
  limit: number;
  timeframe: 'day' | 'week' | 'month';
}

@Injectable()
export class UsageLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usageService: UsageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const options = this.reflector.get<UsageLimitOptions>(
        'usageLimit',
        context.getHandler(),
      );

      if (!options) {
        return true;
      }

      // Get the request with proper typing
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const userId = request.user?.id;

      if (!userId) {
        return true;
      }

      const currentUsage = await this.usageService.getCurrentUsage(
        userId,
        options.action,
        options.timeframe,
      );

      if (currentUsage >= options.limit) {
        throw new ForbiddenException(
          `Daily limit of ${options.limit} ${options.action} exceeded. Please upgrade to continue.`,
        );
      }

      // Create metadata with proper type checking
      const metadata: Record<string, unknown> = {};

      // Safely copy body properties if they exist
      if (request.body && typeof request.body === 'object') {
        Object.assign(metadata, request.body);
      }

      // Safely copy query properties if they exist
      if (request.query && typeof request.query === 'object') {
        Object.assign(metadata, request.query);
      }

      await this.usageService.trackUsage(userId, options.action, metadata);

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Usage limit guard error:', error);
      return true;
    }
  }
}
