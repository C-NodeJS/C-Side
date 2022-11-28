import { AbilityFactory } from './casl-ability.factory';
import { UserServiceImpl } from './../user/user.service';
import { ObjectModel } from './../../infrastructure/data-access/typeorm/object.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { PermissionModel } from 'src/infrastructure/data-access/typeorm/permission.entity';
import { RoleModel } from 'src/infrastructure/data-access/typeorm/role.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectModel, PermissionModel, RoleModel]),
    UserModule,
  ],
  controllers: [],
  providers: [AbilityFactory],
  exports: [],
})
export class CaslModule {}
