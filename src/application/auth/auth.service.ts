import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Hash } from '../common/Hash';
import { UserServiceImpl } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserServiceImpl,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findUser(username);
    const isValidPassword = Hash.compare(password, user.password);

    if (user && isValidPassword) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(user: any) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
