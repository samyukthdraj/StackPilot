import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Extend Express Request interface
interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    subscriptionType: string;
    role?: string;
  };
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Check if user exists and has admin role
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
