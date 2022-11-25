import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';
import { ManageRoomController } from './manage_room.controller';
import { ManageRoomServiceImpl } from './manage_room.service';
import { UserModule } from '../user/user.module';
import { AbilityFactory } from '../casl/casl-ability.factory';

@Module({
    imports: [TypeOrmModule.forFeature([RoomModel]), UserModule],
    controllers: [ManageRoomController],
    providers: [ManageRoomServiceImpl, AbilityFactory],
    exports: [],
})
export class RoomModule {}
