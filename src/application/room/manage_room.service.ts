import {
  GetRoomQueryDTO,
  RoomDetailRequestDTO,
  RoomDetailResponseDTO,
  RoomIdParamRequestDTO,
  RoomsResponseDTO,
} from './dto/manage_room.dto';
import { UserServiceImpl } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomStatus } from '../../infrastructure/data-access/typeorm/enum';

@Injectable()
export class ManageRoomServiceImpl {
  constructor(
    private readonly userService: UserServiceImpl,
    @InjectRepository(RoomModel)
    private roomRepository: Repository<RoomModel>,
  ) {}

  async createRoom(room: RoomDetailRequestDTO, user) {
    try {
      const currentUser = await this.userService.findUserByEmail(user.email);
      const roomModel = new RoomModel();
      roomModel.name = room.name;
      roomModel.address = room.address;
      roomModel.capacity = room.capacity;
      roomModel.description = room.description;
      roomModel.image = room.image;
      roomModel.isActive = room.is_active;
      roomModel.location = `${room.location.lat},${room.location.lng}`;
      roomModel.price = room.price;
      roomModel.rating = room.rating;
      roomModel.status = RoomStatus.PENDING;
      roomModel.user = currentUser;

      return await this.roomRepository.save(roomModel);
    } catch (error) {
      throw new BadRequestException('error');
    }
  }

  async updateRoom(
    room: RoomDetailRequestDTO,
    { room_id }: RoomIdParamRequestDTO,
  ): Promise<boolean> {
    const oldRoom = await this.roomRepository.findOneBy({
      roomId: room_id,
    });
    if (!oldRoom) {
      throw new BadRequestException('Room does not exist!'); // TODO handle later
    }

    const roomModel = new RoomModel();
    roomModel.name = room.name || roomModel.name;
    roomModel.address = room.address || roomModel.address;
    roomModel.capacity = room.capacity || roomModel.capacity;
    roomModel.description = room.description || roomModel.description;
    roomModel.image = room.image || roomModel.image;
    roomModel.isActive = room.is_active || roomModel.isActive;
    roomModel.location =
      `${room.location.lat},${room.location.lng}` || roomModel.location;
    console.log(`roomModel.location: ${roomModel.location}`);
    console.log(`room.location: ${room.location.lng}`);
    roomModel.price = room.price || roomModel.price;
    roomModel.rating = room.rating || roomModel.rating;
    roomModel.status = RoomStatus.PENDING || roomModel.status;
    const updateResult = await this.roomRepository.update(
      { roomId: room_id },
      { ...roomModel },
    );
    console.log(updateResult);
    return true;
  }

  async getAllRoom(
    getRoomQueryDTO: GetRoomQueryDTO,
    user,
  ): Promise<RoomsResponseDTO> {
    const pageSize = getRoomQueryDTO.pageSize;
    const pageNumber = 1;
    const take = pageSize;
    const userId = await this.userService.findUserByEmail(user.email);
    const skip = (pageNumber - 1) * pageSize;
    const [data, total] = await this.roomRepository.findAndCount({
      where: { user: { userId: userId.userId } },
      take,
      skip,
    });

    return {
      data: data.map<RoomDetailResponseDTO>((value) => {
        return new RoomDetailResponseDTO(value);
      }),
      count: total,
    };
  }

  async getRoomDetail({
    room_id,
  }: RoomIdParamRequestDTO): Promise<RoomDetailResponseDTO> {
    const data: RoomModel = await this.roomRepository.findOneBy({
      roomId: room_id,
    });
    if (!data)
      throw new BadRequestException(`Not found room with roomId ${room_id}`);

    return new RoomDetailResponseDTO(data);
  }

  async removeRoom({ room_id }: RoomIdParamRequestDTO): Promise<boolean> {
    const room = await this.roomRepository.findOneBy({
      roomId: room_id,
    });
    if (!room) {
      throw new BadRequestException('data not found');
    }
    await this.roomRepository.remove(room, {});
    return true; // TODO handle later
  }
}
