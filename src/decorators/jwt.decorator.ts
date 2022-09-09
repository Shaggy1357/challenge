import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Jwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const gettingAssignedToken = request.rawHeaders[1].split(' ');
    const assignedToken = gettingAssignedToken[1];
    return assignedToken;
  },
);
