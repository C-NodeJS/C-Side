import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MapPipe } from '@automapper/nestjs';
import { Response } from 'express';
import { UserServiceImpl } from './user.service';
import { CreateUserRequestDTO } from './dto/create-user.dto';
import { UserModel } from '../../infrastructure/data-access/typeorm/user.entity';
import { HttpPresenter } from '../http-presenters';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AbilityFactory } from '../casl/casl-ability.factory';
import { PermissionAction } from '../casl/action.constant';
import { AbilityGuard } from '../auth/guards/ability.guard';
import { checkAbility } from '../casl/casl-ability.decorator';
@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(
    private userService: UserServiceImpl,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post('create')
  @UseGuards(AbilityGuard)
  @UseGuards(JwtAuthGuard)
  @checkAbility({ action: PermissionAction.CREATE, object: new UserModel() })
  @ApiOkResponse({ description: 'Success!' })
  async createUser(
    @Req() request: any,
    @Res() response: Response,
    @Body(MapPipe(CreateUserRequestDTO, UserModel)) user: UserModel,
  ) {
    const httpPresenter = new HttpPresenter(response);
    // const ability = await this.abilityFactory.defineAbility(request.user);
    // const isAllowed = ability.can(PermissionAction.CREATE, UserModel);
    // if (!isAllowed)
    //   return httpPresenter
    //     .reject(new ForbiddenException('You dont have access to create user!'))
    //     .render();
    return httpPresenter
      .accept(await this.userService.createUser(user))
      .render();
  }
}
