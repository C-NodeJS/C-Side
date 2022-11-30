import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { User } from './admin.decorator';
import {
  RoomDetailResponseDTO,
  RoomsResponseDTO,
  RoomDetailRequestDTO,
  RoomIdParamRequestDTO,
  GetRoomQueryDTO,
} from './dto/manage_room.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  UseGuards,
  Controller,
  Post,
  Res,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { ManageRoomServiceImpl } from './manage_room.service';
import { HttpPresenter } from '../http-presenters';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/rooms')
export class RoomController {
  constructor(private roomsService: ManageRoomServiceImpl) {}

  @Get()
  @ApiOkResponse({ description: 'Success!' })
  async getAllRoom(
    @Query() getRoomsQueryDTO: GetRoomQueryDTO,
    @User() user,
  ): Promise<RoomsResponseDTO> {
    return await this.roomsService.getAllRoom(getRoomsQueryDTO, user);
  }

  @Get('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async getRoomDetail(
    @Param() roomId: RoomIdParamRequestDTO,
  ): Promise<RoomDetailResponseDTO> {
    return await this.roomsService.getRoomDetail(roomId);
  }

  @Post('/create')
  @ApiOkResponse({ description: 'Success!' })
  async createRoom(@Body() room: RoomDetailRequestDTO, @User() user) {
    return await this.roomsService.createRoom(room, user);
  }

  @Put('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async updateRoom(
    @Res() response: Response,
    @Body()
    room: RoomDetailRequestDTO,
    @Param() { room_id }: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.roomsService.updateRoom(room, { room_id }))
      .render();
  }

  @Delete('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async removeRoom(
    @Res() response: Response,
    @Param() room_id: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.roomsService.removeRoom(room_id))
      .render();
  }
}
