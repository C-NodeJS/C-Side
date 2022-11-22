import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserModel } from 'src/infrastructure/data-access/typeorm/user.entity';
import { RoleModel } from 'src/infrastructure/data-access/typeorm/role.entity';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { ObjectModel } from 'src/infrastructure/data-access/typeorm/object.entity';
import { PermissionModel } from 'src/infrastructure/data-access/typeorm/permission.entity';
import { PermissionAction } from './casl/action.constant';

@Injectable()
export class AppService {
  constructor(private entityManager: EntityManager) {}
  getHello(): string {
    return 'C-Side Project';
  }

  async seed() {
    try {
      const objUser = new ObjectModel();
      objUser.name = 'UserModel';
      const objRoom = new ObjectModel();
      objRoom.name = 'RoomModel';
      const rsa = new RoleModel();
      rsa.name = 'Super Admin';
      const rha = new RoleModel();
      rha.name = 'Hotel Admin';
      const rcl = new RoleModel();
      rcl.name = 'Client';
      const res = await Promise.all([
        this.entityManager.save(objUser),
        this.entityManager.save(objRoom),
        this.entityManager.save(rsa),
        this.entityManager.save(rha),
        this.entityManager.save(rcl),
      ]);
      objUser.id = res[0].id;
      objRoom.id = res[1].id;
      rsa.id = res[2].id;
      rha.id = res[3].id;
      rcl.id = res[4].id;

      //Super Admin can manage User
      const permission1 = new PermissionModel();
      permission1.roles = [rsa];
      permission1.action = PermissionAction.MANAGE;
      // permission1.condition = JSON.stringify({ role_code: rsa.id });
      permission1.objectId = objUser.id;
      permission1.object = objUser;
      await this.entityManager.save(permission1);

      //Super Admin can manage Room
      const permission2 = new PermissionModel();
      permission2.roles = [rsa];
      permission2.action = PermissionAction.MANAGE;
      // permission2.condition = JSON.stringify({ role_code: rsa.id });
      permission2.objectId = objRoom.id;
      permission2.object = objRoom;
      await this.entityManager.save(permission2);

      //Hotel Admin can manage Room
      const permission3 = new PermissionModel();
      permission3.roles = [rha];
      permission3.action = PermissionAction.MANAGE;
      // permission3.condition = JSON.stringify({ role_code: rha.id });
      permission3.objectId = objRoom.id;
      permission3.object = objRoom;
      await this.entityManager.save(permission3);

      //Save Role Permission
      rsa.permissions = [permission1, permission2];
      rha.permissions = [permission3];
      await Promise.all([
        this.entityManager.save(rsa),
        this.entityManager.save(rha),
      ]);

      //Add Super Admin
      const usa = new UserModel();
      usa.name = 'Super Admin';
      usa.userName = 'admin';
      usa.email = 'admin@cside.com';
      usa.password =
        '$2y$10$OHU7ObPm1yj/szOyCCy0EuiooQVCGqAuuVzZkHHRDzG.8eUhWlwLS';
      usa.role = rsa;
      usa.roleId = rsa.id;
      await this.entityManager.save(usa);

      //Add Hotel Admin
      const uha = new UserModel();
      uha.name = 'Hotel Admin';
      uha.userName = 'manager';
      uha.email = 'manager@cside.com';
      uha.password =
        '$2y$10$OHU7ObPm1yj/szOyCCy0EuiooQVCGqAuuVzZkHHRDzG.8eUhWlwLS';
      uha.role = rha;
      uha.roleId = rha.id;
      await this.entityManager.save(uha);
      // rsa.users = [usa];
      // await this.entityManager.save(rsa);
      return 'init data success';
    } catch (err) {
      console.log(err);
    }
  }
}
