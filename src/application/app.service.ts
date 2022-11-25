import { Injectable } from '@nestjs/common';
import { EntityManager, getMetadataArgsStorage } from 'typeorm';
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
      const entities = getMetadataArgsStorage().tables;
      for (const entity of entities) {
        const name = entity.name;
        const repo = this.entityManager.getRepository(name);
        await repo.query(`TRUNCATE ${name} RESTART IDENTITY CASCADE;`);
      }
      const objUser = new ObjectModel();
      objUser.name = 'UserModel';
      const objRoom = new ObjectModel();
      objRoom.name = 'RoomModel';
      const rsa = new RoleModel();
      rsa.name = 'System Admin';
      const rha = new RoleModel();
      rha.name = 'Host';
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

      //System Admin can manage User
      const permission1 = new PermissionModel();
      permission1.id = 1;
      permission1.roles = rsa;
      permission1.action = PermissionAction.MANAGE;
      permission1.objectId = objUser.id;
      permission1.object = objUser;
      await this.entityManager.save(permission1);

      // System Admin can manage Room
      const permission2 = new PermissionModel();
      permission2.id = 2;
      permission2.roles = rsa;
      permission2.action = PermissionAction.MANAGE;
      permission2.objectId = objRoom.id;
      permission2.object = objRoom;
      await this.entityManager.save(permission2);

      // Host can manage Room
      const permission3 = new PermissionModel();
      permission3.id = 3;
      permission3.roles = rha;
      permission3.action = PermissionAction.MANAGE;
      permission3.condition = JSON.stringify({ owner: 'id' });
      permission3.objectId = objRoom.id;
      permission3.object = objRoom;
      await this.entityManager.save(permission3);

      // Client can read Room
      const permission4 = new PermissionModel();
      permission4.id = 4;
      permission4.roles = rcl;
      permission4.action = PermissionAction.READ;
      permission4.objectId = objRoom.id;
      permission4.object = objRoom;
      await this.entityManager.save(permission4);

      //Save Role Permission
      rsa.permissions = [permission1, permission2];
      rha.permissions = [permission3];
      rcl.permissions = [permission4];
      await Promise.all([
        this.entityManager.save(rsa),
        this.entityManager.save(rha),
        this.entityManager.save(rcl),
      ]);

      //Add System Admin
      const usa = new UserModel();
      usa.name = 'System Admin';
      usa.userName = 'admin';
      usa.email = 'admin@cside.com';
      usa.password =
        '$2y$10$OHU7ObPm1yj/szOyCCy0EuiooQVCGqAuuVzZkHHRDzG.8eUhWlwLS';
      usa.role = rsa;
      usa.roleId = rsa.id;
      await this.entityManager.save(usa);

      //Add Host
      const uha = new UserModel();
      uha.name = 'Host';
      uha.userName = 'host';
      uha.email = 'host@cside.com';
      uha.password =
        '$2y$10$OHU7ObPm1yj/szOyCCy0EuiooQVCGqAuuVzZkHHRDzG.8eUhWlwLS';
      uha.role = rha;
      uha.roleId = rha.id;
      await this.entityManager.save(uha);
      // Add Client
      const ucl = new UserModel();
      ucl.name = 'Client';
      ucl.userName = 'client';
      ucl.email = 'client@cside.com';
      ucl.password =
        '$2y$10$OHU7ObPm1yj/szOyCCy0EuiooQVCGqAuuVzZkHHRDzG.8eUhWlwLS';
      ucl.role = rcl;
      ucl.roleId = rcl.id;
      await this.entityManager.save(ucl);

      return 'init data success';
    } catch (err) {
      console.log(err);
    }
  }
}
