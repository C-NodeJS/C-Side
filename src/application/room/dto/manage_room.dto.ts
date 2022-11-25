import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomStatus } from 'src/infrastructure/data-access/typeorm/enum';

export class GetQueryDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pageSize: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pageNumber: number;
}

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
    @Type(() => Location)
    location: Location[];

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

export class Location {
    @ApiProperty()
    @IsNumber()
    lng: number;

    @ApiProperty()
    @IsNumber()
    lat: number;
}

export class RoomReponsDTO {
    name: string;
    address: string;
    capacity: number;
    price: number;
    location: string;
    status: RoomStatus;
    description?: string;
    image: string;
    rating?: number;
    isActive: boolean;
}

export class RoomResponseDTO {
    data: RoomReponsDTO[];
    count: number;
}

export class RoomIdResponseDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    room_id: number;
}
