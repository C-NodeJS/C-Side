import {
  GetRoomQueryDTO,
  RoomDetailRequestDTO,
  RoomDetailResponseDTO,
  RoomIdParamRequestDTO,
  RoomsResponseDTO,
  QueryGetRoomsByLocation,
  GetRoomsByLocationResponseDTO,
  RoomApprovalDTO,
} from './dto/manage-room.dto';
import { UserServiceImpl } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomModel } from 'src/infrastructure/data-access/typeorm/room.entity';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { RoomUtil } from './room.util';
import { ManageRoomRepository } from './room.repository';
import { RoomDoesNotExists } from 'src/infrastructure/data-access/constants/status.constants';
import { RoomStatus } from 'src/infrastructure/data-access/typeorm/enum';
import { UserModel } from 'src/infrastructure/data-access/typeorm';
import { AdminRoleName } from '../../constants/constant';

@Injectable()
export class ManageRoomServiceImpl {
  constructor(
    private readonly manageRoomRepository: ManageRoomRepository,
    private readonly userService: UserServiceImpl,
    @InjectRepository(RoomModel)
    private roomRepository: Repository<RoomModel>,
  ) {}

  async createRoom(room: RoomDetailRequestDTO, user) {
    try {
      const currentUser = await this.userService.findUserByEmail(user.email);
      const roomModel = RoomUtil.getRoomModel(room);
      roomModel.user = currentUser;
      roomModel.userId = currentUser.userId;
      const roomResponse = await this.roomRepository.save(roomModel);
      return roomResponse;
    } catch (error) {
      throw new BadRequestException('error');
    }
  }

  async updateRoom(
    room: RoomDetailRequestDTO,
    { room_id }: RoomIdParamRequestDTO,
    user: Partial<UserModel>,
  ): Promise<boolean> {
    const currentUser = await this.userService.findUserByEmail(user.email);
    const oldRoom = await this.getRoomByUser(currentUser, {
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

  async removeRoom(
    { room_id }: RoomIdParamRequestDTO,
    user: Partial<UserModel>,
  ): Promise<boolean> {
    const currentUser = await this.userService.findUserByEmail(user.email);
    const room = await this.getRoomByUser(currentUser, {
      roomId: room_id,
    });

    if (!room) {
      throw new BadRequestException('Room does not exist!'); // TODO handle later
    }
    await this.roomRepository.remove(room, {});
    return true; // TODO handle later
  }

  async getRoomsByLocation({
    lng,
    lat,
    distance,
  }: QueryGetRoomsByLocation): Promise<GetRoomsByLocationResponseDTO> {
    try {
      const rooms = await this.manageRoomRepository.getRoomsByLocation({
        lng,
        lat,
        distance,
      });
      return { rooms, count: rooms.length };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async roomApproval(
    { room_id },
    { status_id, reason }: RoomApprovalDTO,
  ): Promise<RoomDetailResponseDTO> {
    const oldRoom = await this.roomRepository.findOneBy({
      roomId: room_id,
      status: RoomStatus.PENDING,
    });

    if (!oldRoom) throw new RoomDoesNotExists();
    return this.manageRoomRepository.getRoomAndUpdate({ status_id, room_id });
  }

  async getRoomByUser(
    user: Partial<UserModel>,
    query: object,
  ): Promise<RoomModel> {
    if (user?.role?.name !== AdminRoleName) query['userId'] = user.userId;
    const room = await this.roomRepository.findOne({
      where: {
        ...query,
      },
    });
    return room;
  }
  async getPendingRooms({
    pageSize,
    pageNumber,
  }: GetRoomQueryDTO): Promise<any> {
    try {
      const rooms = await this.manageRoomRepository.getManyRooms({
        pageNumber,
        pageSize,
      });

      return { rooms, count: rooms.length };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async importRoomsWithExcel(
    buffer: Buffer,
    userId: Number,
  ): Promise<Boolean> {
    let wb = await XLSX.read(buffer, { type: 'buffer' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws);

    const rooms = await this.manageRoomRepository.getAllLocationOfRooms();
    const cloneRooms = rooms.reduce((init, currentValue) => {
      init[JSON.stringify(currentValue.location)] = currentValue;
      return init;
    }, {});

    const arrSatisfyCondition = [];
    data.forEach(item => {
      const location = convertStringToObject(item['location']);
      
      if (
        !cloneRooms[JSON.stringify(location)]
        && Object.values(RoomStatus).includes(item['status'])
        && typeof item['is_active'] === 'boolean'
        && String(location['x']) !== 'NaN'
        && String(location['y']) !== 'NaN'
        && item['capacity'] > 0
        ) {
        item['location'] = {
          lng: location['y'],
          lat: location['x'],
        };
        item = RoomUtil.getRoomModel(item)
        item['userId'] = userId;
        arrSatisfyCondition.push(item);;
      }
    });

    this.roomRepository.save(arrSatisfyCondition);
    return true;
  }
}

function convertStringToObject(string: string) {
  return string
    .split(',')
    .map(keyVal => {
      return keyVal
        .split(':')
        .map(_ => _.trim())
    })
    .reduce((accumulator, currentValue) => {
      accumulator[currentValue[0]] = Number(currentValue[1])
      return accumulator
    }, {})
}
