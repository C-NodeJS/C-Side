import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, HttpException, Post, Req, Res } from "@nestjs/common";
import { InjectMapper, MapPipe } from "@automapper/nestjs";
import { Response } from 'express';
import { UserServiceImpl } from "./user.service";
import { Mapper } from "@automapper/core";
import { CreateUserRequestDTO } from "./dto/create-user.dto";
import { UserModel } from "../../infrastructure/data-access/typeorm/user.entity";
import { HttpPresenter } from "../http-presenters";

@ApiTags("User")
@Controller("/user")
export class UserController {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private userService: UserServiceImpl
  ) {
  }

  @Post("create")
  @ApiOkResponse({ description: "Success!" })
  async createUser(
    @Req() request: any,
    @Res() response: Response,
    @Body(MapPipe(CreateUserRequestDTO, UserModel)) user: UserModel
  ) {
    const httpPresenter = new HttpPresenter(response);

    // TODO check role later
    // return presenter
    //   .reject(new ForbiddenException('You dont have access to create user!'))
    //   .render();
    return httpPresenter.accept(await this.userService.createUser(user)).render()
  }
}
