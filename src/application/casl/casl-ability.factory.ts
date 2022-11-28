import {
  InferSubjects,
  AbilityBuilder,
  Ability,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { UserModel } from 'src/infrastructure/data-access/typeorm/user.entity';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { Injectable } from '@nestjs/common';
import { UserServiceImpl } from '../user/user.service';
import { PermissionAction } from './action.constant';

export type Subjects =
  | InferSubjects<typeof UserModel | typeof RoomModel>
  | 'all';
export type AppAbility = Ability<[PermissionAction, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(private userService: UserServiceImpl) {}
  async defineAbility(user: Partial<UserModel>) {
    const { can, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );
    const permissions = await this.userService.findAllPermissionOfUser(user);
    permissions.forEach((permission) => {
      let type;
      if (permission.object.name === 'UserModel') type = UserModel;
      else type = RoomModel;
      can(permission.action, type, permission.condition);
    });
    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
