import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from 'src/infrastructure/data-access/typeorm/enum';

export class GetRoomQueryDTO {
  @ApiProperty({
    required: false,
  })
  pageSize?: number = 20;

  @ApiProperty({
    required: false,
  })
  pageNumber?: number = 1;
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

export class CreateRoomRequestDTO {
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
  isActive: boolean;
}

export class RoomsResponseDTO {
  data: RoomDetailResponseDTO[];
  count: number;
}

export class RoomIdParamRequestDTO {
  @ApiProperty()
  @IsNumber()
  room_id: number;
}
