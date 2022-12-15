import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './admin.decorator';
import {
  GetRoomQueryDTO,
  RoomDetailRequestDTO,
  RoomIdParamRequestDTO,
  QueryGetRoomsByLocation,
  RoomApprovalDTO,
} from './dto/manage-room.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ManageRoomServiceImpl } from './manage-room.service';
import { HttpPresenter } from '../http-presenters';
import { checkAbility } from '../casl/casl-ability.decorator';
import { PermissionAction } from '../casl/action.constant';
import { RoomModel } from 'src/infrastructure/data-access/typeorm';
import { AbilityGuard } from '../auth/guards/ability.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(AbilityGuard)
@UseGuards(JwtAuthGuard)
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
  @checkAbility({ action: PermissionAction.CREATE, object: new RoomModel() })
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
  @checkAbility({ action: PermissionAction.UPDATE, object: new RoomModel() })
  @ApiOkResponse({ description: 'Success!' })
  async updateRoom(
    @Res() response: Response,
    @Body() room: RoomDetailRequestDTO,
    @User() user,
    @Param() { room_id }: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(
        await this.roomsService.updateRoom(room, { room_id }, user),
      );
    } catch (e) {
      httpPresenter.reject(e);
    }
    httpPresenter.render();
  }

  @Delete('/:room_id')
  @checkAbility({ action: PermissionAction.DELETE, object: new RoomModel() })
  @ApiOkResponse({ description: 'Success!' })
  async removeRoom(
    @User() user,
    @Res() response: Response,
    @Param() room_id: RoomIdParamRequestDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    try {
      httpPresenter.accept(await this.roomsService.removeRoom(room_id, user));
    } catch (e) {
      httpPresenter.reject(e);
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
      .accept(
        await this.roomsService.getRoomsByLocation({ lng, lat, distance }),
      )
      .render();
  }

  @Put('/change-status/:room_id')
  @checkAbility({ action: PermissionAction.MANAGE, object: new RoomModel() })
  @ApiOkResponse({ description: 'Success!' })
  async roomApproval(
    @Res() response: Response,
    @Param() room_id: RoomIdParamRequestDTO,
    @Body() { status_id, reason }: RoomApprovalDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);
    return httpPresenter
      .accept(
        await this.roomsService.roomApproval(room_id, { status_id, reason }),
      )
      .render();
  }

  @Get('/find/pending-rooms')
  @ApiOkResponse({ description: 'Success!' })
  async getPendingRooms(
    @Res() response: Response,
    @Query() { pageSize = 20, pageNumber = 1 }: GetRoomQueryDTO,
  ) {
    const httpPresenter = new HttpPresenter(response);

    return httpPresenter
      .accept(await this.roomsService.getPendingRooms({ pageSize, pageNumber }))
      .render();
  }

  @Post('/import-rooms')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ description: 'Success!' })
  async importRoomsWithExcel(
    @Res() response: Response,
    @User() user,
    @UploadedFile('file') file
  ) {
    const httpPresenter = new HttpPresenter(response);
    const { buffer } = file;

    return httpPresenter
      .accept(await this.roomsService.importRoomsWithExcel(buffer, user))
      .render();
  }
}
