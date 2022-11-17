import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';
// import { UserController } from "./user.controller";
// import { UserServiceImpl } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([RoomModel])],
  controllers: [],
  providers: [],
  exports: [],
})
export class RoomModule {}
