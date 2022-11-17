import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterPayload } from './dto/register.dto';
import { UserServiceImpl } from './../user/user.service';
import { UserModel } from './../../infrastructure/data-access/typeorm/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserServiceImpl) {}

  async register(payload: RegisterPayload) {
    if (payload.email) {
      const checkEmailUser = await this.userService.getByUserEmail(
        payload.email,
      );
      if (checkEmailUser) {
        throw new HttpException(
          {
            messageCode: 'The email existed!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const createUserData = {
      email: payload.email,
      password: payload.password,
    } as any as UserModel;
    const user = await this.userService.createUser(createUserData);
    return user;
  }
}
