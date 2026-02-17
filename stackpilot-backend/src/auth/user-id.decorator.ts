import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Make sure this is exported
export interface UserFromJwt {
  id: string;
  email: string;
  subscriptionType: string;
}

// Extend Express Request interface
interface RequestWithUser extends Request {
  user: UserFromJwt;
}

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new Error(
        'User not found in request. Make sure JwtAuthGuard is applied.',
      );
    }

    return request.user.id;
  },
);
