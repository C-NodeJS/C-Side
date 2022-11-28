import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { User } from './admin.decorator';
import {
  RoomDetailResponseDTO,
  RoomsResponseDTO,
  CreateRoomRequestDTO,
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

@ApiTags('manage_room')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/rooms')
export class ManageRoomController {
  constructor(private ManageRoomService: ManageRoomServiceImpl) {}

  @Get()
  @ApiOkResponse({ description: 'Success!' })
  async getAllRoom(
    @Query() getRoomsQueryDTO: GetRoomQueryDTO,
    @User() user,
  ): Promise<RoomsResponseDTO> {
    return await this.ManageRoomService.getAllRoom(getRoomsQueryDTO, user);
  }

  @Get('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async getRoomDetail(
    @Param() id_room: RoomIdParamRequestDTO,
  ): Promise<RoomDetailResponseDTO> {
    return await this.ManageRoomService.getRoomDetail(id_room);
  }

  @Post('/create')
  @ApiOkResponse({ description: 'Success!' })
  async createRoom(@Body() Room: CreateRoomRequestDTO, @User() user) {
    return await this.ManageRoomService.createRoom(Room, user);
  }

  @Put('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async updateRoom(
    @Res() response: Response,
    @Body() Room: CreateRoomRequestDTO,
    @Param() { room_id }: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.ManageRoomService.updateRoom(Room, { room_id }))
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
      .accept(await this.ManageRoomService.removeRoom(room_id))
      .render();
  }
}
