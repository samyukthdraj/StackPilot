import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserFromJwt } from './user-id.decorator'; // Make sure this path is correct

interface RequestWithUser extends Request {
  user: UserFromJwt;
}

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    if (!request.user) {
      throw new Error(
        'User not found in request. Make sure JwtAuthGuard is applied.',
      );
    }

    return request.user;
  },
);
