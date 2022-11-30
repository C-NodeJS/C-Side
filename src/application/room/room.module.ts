import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';
import { RoomController } from './room.controller';
import { ManageRoomServiceImpl } from './manage_room.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomModel]), UserModule],
  controllers: [RoomController],
  providers: [ManageRoomServiceImpl],
  exports: [],
})
export class RoomModule {}
