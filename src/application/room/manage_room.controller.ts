import {
  RoomReponseDTO,
  CreateRoomReponseDTO,
  CreateRoomRequestDTO,
  IdRoomReponseDTO,
} from './dto/manage_room.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { ManageRoomServiceImpl } from './manage_room.service';
import { HttpPresenter } from '../http-presenters';

@ApiTags('manage_room')
@Controller('/rooms')
export class ManageRoomController {
  constructor(private ManageRoomService: ManageRoomServiceImpl) {}
  @Get()
  @ApiOkResponse({ description: 'Success!' })
  async getAllRoom(): Promise<RoomReponseDTO> {
    return await this.ManageRoomService.getAllRoom();
  }
  @Get('/:room_id')
  @ApiOkResponse({ description: 'Success!' })
  async getRoomDetail(
    @Param() id_room: IdRoomReponseDTO,
  ): Promise<CreateRoomReponseDTO> {
    return await this.ManageRoomService.getRoomDetail(id_room);
  }

  @Post('/create')
  @ApiOkResponse({ description: 'Success!' })
  async createRoom(
    @Req() request: any,
    @Res() response: Response,
    @Body() Room: CreateRoomRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.ManageRoomService.createRoom(Room))
      .render();
  }
  @Put('/')
  @ApiOkResponse({ description: 'Success!' })
  async updateRoom(
    @Req() request: any,
    @Res() response: Response,
    @Body() Room: CreateRoomRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(await this.ManageRoomService.UpdateRoom(Room))
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
