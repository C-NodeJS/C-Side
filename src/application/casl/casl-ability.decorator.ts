import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from './action.constant';
import { Subjects } from './casl-ability.factory';

export interface requireRule {
  action: PermissionAction;
  object: Subjects;
}

export const CHECK_ABILITY = 'check_ability';
export const checkAbility = (...require: requireRule[]) =>
  SetMetadata(CHECK_ABILITY, require);
