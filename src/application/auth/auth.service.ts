
import { RegisterRequestDTO } from './dto/register.dto';
import { UserServiceImpl } from './../user/user.service';
import { UserModel } from './../../infrastructure/data-access/typeorm/user.entity';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Hash } from '../common/Hash';

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
    if (payload.email) {
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
      } as any as UserModel;
      const user = await this.userService.createUser(createUserData);
      const accessTokenKey = randomBytes(64).toString('hex');
      const accessToken = this.createToken(user, accessTokenKey);
      return accessToken;
    } else {
      return {
        status_code: 9002,
        message: 'Bad request',
        error: 'Missing email!',
      };
    }
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
