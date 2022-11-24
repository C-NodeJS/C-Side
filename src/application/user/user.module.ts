import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UserModel } from '../../infrastructure/data-access/typeorm/user.entity';
import { RoleModel } from '../../infrastructure/data-access/typeorm/role.entity';
import { UserController } from './user.controller';
import { UserServiceImpl } from './user.service';
import { CaslModule } from '../casl/casl.module';
import { AbilityFactory } from '../casl/casl-ability.factory';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, RoleModel])],
  controllers: [UserController],
  providers: [UserServiceImpl, AbilityFactory],
  exports: [UserServiceImpl],
})
export class UserModule {}
