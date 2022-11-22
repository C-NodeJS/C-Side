import {
  CreateRoomReponseDTO,
  RoomReponseDTO,
  CreateRoomRequestDTO,
  IdRoomReponseDTO,
} from './dto/manage_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ManageRoomServiceImpl {
  constructor(
    @InjectRepository(RoomModel) private roomRepository: Repository<RoomModel>,
  ) {}

  async createRoom(Room: CreateRoomRequestDTO): Promise<RoomModel> {
    const room = await this.roomRepository.create(Room);
    return await this.roomRepository.save(room);
  }
  async updateRoom(
    Room: CreateRoomRequestDTO,
    { room_id }: IdRoomReponseDTO,
  ): Promise<CreateRoomReponseDTO> {
    const room = await this.roomRepository.findOneBy({
      room_id,
    });
    if (!room) {
      throw new BadRequestException('data not found');
    }
    Room = { ...Room, ...{ room_id: room_id } };
    return await this.roomRepository.save(Room);
  }
  async getAllRoom(): Promise<RoomReponseDTO> {
    const [data, total] = await this.roomRepository.findAndCount({});
    return {
      data: data,
      count: total,
    };
  }
  async getRoomDetail({ room_id }: IdRoomReponseDTO): Promise<RoomModel> {
    const data = await this.roomRepository.findOneBy({ room_id });
    if (!data) throw new BadRequestException('data not found');
    return data;
  }
  async removeRoom({ room_id }: IdRoomReponseDTO): Promise<boolean> {
    const room = await this.roomRepository.findOneBy({
      room_id,
    });
    if (!room) {
      throw new BadRequestException('data not found');
    }
    await this.roomRepository.remove(room);
    return true;
  }
}
