import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserModel } from '../../infrastructure/data-access/typeorm/user.entity';
import { RoleModel } from '../../infrastructure/data-access/typeorm/role.entity';
import { UserController } from './user.controller';
import { UserServiceImpl } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, RoleModel])],
  controllers: [UserController],
  providers: [UserServiceImpl],
  exports: [UserServiceImpl],
})
export class UserModule {}
