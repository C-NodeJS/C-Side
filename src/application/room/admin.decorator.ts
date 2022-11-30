import { UserModel } from 'src/infrastructure/data-access/typeorm/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const User = createParamDecorator<UserModel>(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
