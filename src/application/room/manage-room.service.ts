import {
  GetRoomQueryDTO,
  RoomDetailRequestDTO,
  RoomDetailResponseDTO,
  RoomIdParamRequestDTO,
  RoomsResponseDTO,
  QueryGetRoomsByLocation,
  GetRoomsByLocationResponseDTO,
  ConfirmationBookingDTO,
} from './dto/manage-room.dto';
import { UserServiceImpl } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoomUtil } from './room.util';
import { ManageRoomRepository } from './room.repository';
import { RoomDoesNotExists } from 'src/infrastructure/data-access/constants/status.constants';

@Injectable()
export class ManageRoomServiceImpl {
  constructor(
    private readonly manageRoomRepository: ManageRoomRepository,
    private readonly userService: UserServiceImpl,
    @InjectRepository(RoomModel)
    private roomRepository: Repository<RoomModel>,
  ) { }

  async createRoom(room: RoomDetailRequestDTO, user) {
    try {
      const currentUser = await this.userService.findUserByEmail(user.email);
      const roomModel = RoomUtil.getRoomModel(room);
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

    const roomModel = RoomUtil.getRoomModel(room);
    roomModel.roomId = room_id;
    await this.roomRepository.update({ roomId: room_id }, { ...roomModel });
    return true;
  }

  async getAllRoom(
    { pageSize = 20, pageNumber = 1 }: GetRoomQueryDTO,
    user,
  ): Promise<RoomsResponseDTO> {
    const currentUser = await this.userService.findUserByEmail(user.email);
    if (!currentUser) {
      throw new BadRequestException('Somethings wrong happened!'); // TODO handle later
    }
    const skip = (pageNumber || 1 - 1) * pageSize;
    const [data, total] = await this.roomRepository.findAndCount({
      where: { user: { userId: currentUser.userId } },
      take: pageSize,
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

  async getRoomsByLocation({ lng, lat, distance }: QueryGetRoomsByLocation): Promise<GetRoomsByLocationResponseDTO> {
    try {
      const rooms = await this.manageRoomRepository.getRoomsByLocation({ lng, lat, distance });
      return { rooms, count: rooms.length };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async confirmationBooking({ room_id }, { status_id, reason }: ConfirmationBookingDTO): Promise<RoomDetailResponseDTO> {
    try {
      const oldRoom = await this.roomRepository.findOneBy({
        roomId: room_id,
      });

      if (!oldRoom) throw new RoomDoesNotExists();

      return this.manageRoomRepository.getRoomAndUpdate({ status_id, room_id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}