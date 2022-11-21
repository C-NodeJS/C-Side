import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../common/Hash';
import { UserServiceImpl } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserServiceImpl,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.userService.findUserByUserName(userName);

    if (!user) {
      throw new HttpException(
        'Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const isValidPassword = Hash.compare(password, user.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid Password', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async login(user: any) {
    const payload = { userName: user.userName, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
