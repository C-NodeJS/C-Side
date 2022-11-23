import { ObjectModel } from './../../infrastructure/data-access/typeorm/object.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';
import { PermissionModel } from 'src/infrastructure/data-access/typeorm/permission.entity';
import { RoleModel } from 'src/infrastructure/data-access/typeorm/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectModel, PermissionModel, RoleModel]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CaslModule {}
