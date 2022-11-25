import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserModel } from '../../infrastructure/data-access/typeorm/user.entity';
import { IUserService } from '../../domain/usecases/user.service';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
  ) {}

  async createUser(user: UserModel): Promise<UserModel> {
    return await this.userRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findUserByEmailOrPhoneNumber(
    emailOrPhoneNumber: string,
  ): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: [{ email: emailOrPhoneNumber }, { phone: emailOrPhoneNumber }],
    });
  }
}
