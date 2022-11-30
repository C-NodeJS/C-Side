import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from 'src/infrastructure/data-access/typeorm/enum';
import { RoomModel } from '../../../infrastructure/data-access/typeorm/room.entity';

export class GetRoomQueryDTO {
  @ApiProperty({
    required: false,
  })
  pageSize?: number;

  @ApiProperty({
    required: false,
  })
  pageNumber?: number;
}

export class Location {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  lng: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  lat: number;
}
export class RoomDetailRequestDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  address?: string;

  @ApiProperty()
  @IsNumber()
  capacity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @Type(() => Location)
  location: Location;

  @ApiProperty()
  @IsEnum(RoomStatus)
  status: RoomStatus;

  @ApiProperty({
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  image?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  rating?: number;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  is_active = true;
}

export class RoomDetailResponseDTO {
  roomId: number;
  name: string;
  address?: string;
  capacity: number;
  price: number;
  location: string;
  status: RoomStatus;
  description?: string;
  image?: string;
  rating?: number;
  is_active: boolean;

  constructor(roomModel: RoomModel) {
    this.roomId = roomModel.roomId;
    this.name = roomModel.name;
    this.address = roomModel.address;
    this.capacity = roomModel.capacity;
    this.description = roomModel.description;
    this.image = roomModel.image;
    this.is_active = roomModel.isActive;
    this.location = roomModel.location;
    this.price = roomModel.price;
    this.rating = roomModel.rating;
    this.status = roomModel.status;
  }
}

export class RoomsResponseDTO {
  data: RoomDetailResponseDTO[];
  count: number;
}

export class RoomIdParamRequestDTO {
  @ApiProperty()
  room_id: number;
}

export class GetRoomsByLocationDTO {
  name: string;
  address: string;
  capacity: number;
  price: number;
  location: object;
  status: RoomStatus;
  description?: string;
  image: string;
  rating?: number;
  is_active: boolean;
  owner: string;
  distance: number;
}

export class GetRoomsByLocationResponseDTO {
  rooms: GetRoomsByLocationDTO[];
  count: number;
}

export class QueryGetRoomsByLocation {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  lng: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number = 10;
}
