import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';
import { RoomController } from './room.controller';
import { ManageRoomServiceImpl } from './manage_room.service';
import { UserModule } from '../user/user.module';
import { TypeOrmCustomRepositoryModule } from 'src/infrastructure/data-access/typeorm-custom/typeorm-custom.module';
import { ManageRoomRepository } from './room.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomModel]),
    TypeOrmCustomRepositoryModule.forCustomRepository([ManageRoomRepository]),
    UserModule,
  ],
  controllers: [RoomController],
  providers: [ManageRoomServiceImpl],
  exports: [],
})
export class RoomModule {}
