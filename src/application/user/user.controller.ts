import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MapPipe } from '@automapper/nestjs';
import { Response } from 'express';
import { UserServiceImpl } from './user.service';
import { CreateUserRequestDTO } from './dto/create-user.dto';
import { UserModel } from '../../infrastructure/data-access/typeorm/user.entity';
import { HttpPresenter } from '../http-presenters';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private userService: UserServiceImpl) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Success!' })
  async createUser(
    @Req() request: any,
    @Res() response: Response,
    @Body(MapPipe(CreateUserRequestDTO, UserModel)) user: UserModel,
  ) {
    const httpPresenter = new HttpPresenter(response);
    await this.userService.findAllPermissionOfUser(request.user);
    console.log(request.user);
    // TODO check role later
    // return presenter
    //   .reject(new ForbiddenException('You dont have access to create user!'))
    //   .render();
    return httpPresenter
      .accept(await this.userService.createUser(user))
      .render();
  }
}
