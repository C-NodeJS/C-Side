import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ForbiddenError } from '@casl/ability';
import { Reflector } from '@nestjs/core';
import {
  requireRule,
  CHECK_ABILITY,
} from 'src/application/casl/casl-ability.decorator';
import {
  AbilityFactory,
  AppAbility,
} from 'src/application/casl/casl-ability.factory';
import { HttpPresenter } from 'src/application/http-presenters';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<requireRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const user = req.user;
    const ability = await this.abilityFactory.defineAbility(user);

    const allowed = rules.every((permission) =>
      this.isAllow(ability, permission),
    );
    if (!allowed)
      new HttpPresenter(res)
        .reject(new ForbiddenException('You cannot access!!'))
        .render();
    return allowed;
  }

  private isAllow(ability: AppAbility, permission: requireRule) {
    return ability.can(permission.action, permission.object);
  }
}
