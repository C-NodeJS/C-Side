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
