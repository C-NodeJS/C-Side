import { RegisterRequestDTO } from './dto/register.dto';
import { UserServiceImpl } from './../user/user.service';
import { UserModel } from './../../infrastructure/data-access/typeorm/user.entity';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Hash } from '../common/Hash';
import { LoginRequestDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserServiceImpl,
    private readonly jwtService: JwtService,
  ) {}

  createToken(user: UserModel, accessTokenKey: string) {
    const curentTime = Math.floor(Date.now() / 1000);
    let accessToken = '';
    try {
      accessToken = this.jwtService.sign({
        aud: '',
        sub: user.email.toString(),
        iss: '',
        iat: curentTime,
        prm: accessTokenKey,
      });
    } catch (err) {
      throw new Error(err);
    }
    return {
      status_code: 1000,
      message: 'Success!',
      response: {
        access_token: accessToken,
      },
    };
  }

  async register(payload: RegisterRequestDTO) {
    if (!payload.email) {
      return {
        status_code: 9002,
        message: 'Bad request',
        error: 'Missing email!',
      };
    }
    const checkEmailUser = await this.userService.findUserByEmail(
      payload.email,
    );
    if (checkEmailUser) {
      return {
        status_code: 9001,
        message: 'Failed',
        error: 'Duplicated Email!',
      };
    }
    const createUserData = {
      email: payload.email,
      password: payload.password,
      name: payload.name || '',
      phone: payload.phone || '',
      address: payload.address || '',
      roleId: payload.roleId || 3,
    } as any as UserModel;
    const user = await this.userService.createUser(createUserData);
    const accessTokenKey = randomBytes(64).toString('hex');
    const accessToken = this.createToken(user, accessTokenKey);
    return accessToken;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new HttpException('User is not exist', HttpStatus.NOT_FOUND);
    }
    const isValidPassword = Hash.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid Password', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async login(payload: LoginRequestDTO) {
    const currUser = await this.validateUser(payload.email, payload.password);
    const token = {
      email: currUser.email,
      sub: currUser.userId,
      roleId: currUser.role.id,
    };

    return {
      access_token: this.jwtService.sign(token),
    };
  }
}
