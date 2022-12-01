import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './admin.decorator';
import {
  GetRoomQueryDTO,
  RoomDetailRequestDTO,
  RoomIdParamRequestDTO,
  QueryGetRoomsByLocation,
} from './dto/manage_room.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ManageRoomServiceImpl } from './manage_room.service';
import { HttpPresenter } from '../http-presenters';

@ApiTags('rooms')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('/rooms')
export class RoomController {
  constructor(private roomsService: ManageRoomServiceImpl) {}

  @Get()
  @ApiOkResponse({ description: 'Success!' })
  async getAllRoom(
    @Res() response: Response,
    @Query() getRoomsQueryDTO: GetRoomQueryDTO,
    @User() user,
  ): Promise<any> {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(
        await this.roomsService.getAllRoom(getRoomsQueryDTO, user),
      );
    } catch (e) {
      httpPresenter.reject(e);
    }
    httpPresenter.render();
  }

  @Get('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async getRoomDetail(
    @Res() response: Response,
    @Param() roomId: RoomIdParamRequestDTO,
  ): Promise<any> {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(await this.roomsService.getRoomDetail(roomId));
    } catch (e) {
      httpPresenter.reject(e);
    }
    httpPresenter.render();
  }

  @Post('/create')
  @ApiOkResponse({ description: 'Success!' })
  async createRoom(
    @Body() room: RoomDetailRequestDTO,
    @User() user,
    @Res() response: Response,
  ) {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(await this.roomsService.createRoom(room, user));
    } catch (e) {
      httpPresenter.reject(e);
    }
    httpPresenter.render();
  }

  @Put('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async updateRoom(
    @Res() response: Response,
    @Body() room: RoomDetailRequestDTO,
    @Param() { room_id }: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(
        await this.roomsService.updateRoom(room, { room_id }),
      );
    } catch (e) {
      httpPresenter.reject(e);
    }
    httpPresenter.render();
  }

  @Delete('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async removeRoom(
    @Res() response: Response,
    @Param() room_id: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(await this.roomsService.removeRoom(room_id));
    } catch (e) {
      httpPresenter.accept(await this.roomsService.removeRoom(room_id));
    }
    httpPresenter.render();
  }

  @Get('/location/find')
  @ApiOkResponse({ description: 'Success!' })
  async getRoomsByLocation(
    @Res() response: Response,
    @Query() { lng, lat, distance = 10 }: QueryGetRoomsByLocation,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.roomsService.getRoomsByLocation({ lng, lat, distance }))
      .render();
  }
}
