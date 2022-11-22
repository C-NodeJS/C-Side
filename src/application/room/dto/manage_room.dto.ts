import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { RoomStatus } from 'src/infrastructure/data-access/typeorm/enum';

export class CreateRoomRequestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsEnum(RoomStatus)
  status: RoomStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty()
  @IsNumber()
  rating?: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}
export class CreateRoomReponseDTO {
  name: string;
  address: string;
  capacity: number;
  price: number;
  location: string;
  status: RoomStatus;
  description?: string;
  image: string;
  rating?: number;
  is_active: boolean;
}
export class RoomReponseDTO {
  data: CreateRoomReponseDTO[];
  count: number;
}
export class IdRoomReponseDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  room_id: number;
}
