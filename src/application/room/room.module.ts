import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { RoomModel } from '../../infrastructure/data-access/typeorm/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomModel])],
  controllers: [],
  providers: [],
  exports: [],
})
export class RoomModule {}
