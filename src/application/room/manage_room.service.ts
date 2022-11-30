import {
  RoomReponsDTO,
  RoomResponseDTO,
  CreateRoomRequestDTO,
  RoomIdResponseDTO,
  GetQueryDTO,
} from './dto/manage_room.dto';
import { UserServiceImpl } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from 'src/infrastructure/data-access/typeorm/user.entity';

@Injectable()
export class ManageRoomServiceImpl {
  constructor(
    private readonly userService: UserServiceImpl,
    @InjectRepository(RoomModel)
    private roomRepository: Repository<RoomModel>,
  ) {}

  async createRoom(Room: CreateRoomRequestDTO, user) {
    try {
      const userId = await this.userService.findUserByEmail(user.email);
      const room = new RoomModel();
      room.name = Room.name;
      room.capacity = Room.capacity;
      room.price = Room.price;
      room.status = Room.status;
      room.description = Room.description;
      room.image = Room.image;
      room.rating = Room.rating;
      room.address = Room.address;
      room.user = userId;
      room.location = `${Room?.location?.lat},${Room?.location?.lng}`;
      return await this.roomRepository.save(room);
    } catch (error) {
      throw new BadRequestException('error');
    }
  }

  async updateRoom(
    Room: CreateRoomRequestDTO,
    { room_id }: RoomIdResponseDTO,
  ): Promise<RoomReponsDTO> {
    const room = await this.roomRepository.findOneBy({
      roomId: room_id,
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
    room.isActive = Room.is_active;
    room.location = `${Room?.location?.lat},${Room?.location?.lng}`;
    const data = await this.roomRepository.save(room);
    return data;
  }

  async getAllRoom(
    { pageSize, pageNumber }: GetQueryDTO,
    user,
  ): Promise<RoomResponseDTO> {
    const take = pageSize || 25;
    const userId = await this.userService.findUserByEmail(user.email);
    const skip = (pageNumber || 1 - 1) * take;
    const [data, total] = await this.roomRepository.findAndCount({
      where: { user: { userId: userId.userId } },
      take,
      skip,
    });
    return {
      data: data,
      count: total,
    };
  }

  async getRoomDetail({ room_id }: RoomIdResponseDTO): Promise<RoomReponsDTO> {
    const data = await this.roomRepository.findOneBy({ roomId: room_id });
    if (!data) throw new BadRequestException('data not found');
    return data;
  }

  async removeRoom({ room_id }: RoomIdResponseDTO): Promise<boolean> {
    const room = await this.roomRepository.findOneBy({
      roomId: room_id,
    });
    if (!room) {
      throw new BadRequestException('data not found');
    }
    await this.roomRepository.remove(room);
    return true;
  }
}
