import {
  RoomReponsDTO,
  RoomReponseDTO,
  CreateRoomRequestDTO,
  IdRoomReponseDTO,
  GetQueryDTO,
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

  async createRoom(Room: CreateRoomRequestDTO) {
    try {
      const RoomS = new RoomModel();
      RoomS.name = Room.name;
      RoomS.capacity = Room.capacity;
      RoomS.price = Room.price;
      RoomS.status = Room.status;
      RoomS.description = Room.description;
      RoomS.image = Room.image;
      RoomS.rating = Room.rating;
      RoomS.is_active = Room.is_active;
      RoomS.location = `${Room?.location[0]?.lat},${Room?.location[0]?.lng}`;
      const room = await this.roomRepository.create(RoomS);
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new BadRequestException('error');
    }
  }
  async updateRoom(
    Room: CreateRoomRequestDTO,
    { room_id }: IdRoomReponseDTO,
  ): Promise<RoomReponsDTO> {
    const room = await this.roomRepository.findOneBy({
      room_id,
    });
    if (!room) {
      throw new BadRequestException('data not found');
    }
    room.name = Room.name;
    room.capacity = Room.capacity;
    room.price = Room.price;
    room.status = Room.status;
    room.description = Room.description;
    room.image = Room.image;
    room.rating = Room.rating;
    room.is_active = Room.is_active;
    const data = await this.roomRepository.save(room);

    return data;
  }
  async getAllRoom({ pageSize, pageNumber }: GetQueryDTO) {
    const take = pageSize;
    const skip = (pageNumber - 1) * pageSize;
    const [data, total] = await this.roomRepository.findAndCount({
      take,
      skip,
    });
    return {
      data: data,
      count: total,
    };
  }
  async getRoomDetail({ room_id }: IdRoomReponseDTO): Promise<RoomReponsDTO> {
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