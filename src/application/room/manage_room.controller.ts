import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { User } from './admin.decorator';
import {
  RoomReponseDTO,
  RoomReponsDTO,
  CreateRoomRequestDTO,
  IdRoomReponseDTO,
  GetQueryDTO,
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
    @Query() { pageSize, pageNumber }: GetQueryDTO,
    @User() user,
  ): Promise<RoomReponseDTO> {
    return await this.ManageRoomService.getAllRoom(
      { pageSize, pageNumber },
      user,
    );
  }
  @Get('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async getRoomDetail(
    @Param() id_room: IdRoomReponseDTO,
  ): Promise<RoomReponsDTO> {
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
    @Param() { room_id }: IdRoomReponseDTO,
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
    @Param() room_id: IdRoomReponseDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.ManageRoomService.removeRoom(room_id))
      .render();
  }
}
