import { IUserService } from '../../domain/usecases/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../../infrastructure/data-access/typeorm/user.entity';
import { Repository } from 'typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
  ) {}

  async createUser(user: UserModel): Promise<UserModel> {
    return await this.userRepository.save(user);
  }

  async findUser(username: string): Promise<UserModel> {
    try {
      return await this.userRepository.findOne({
        where: {
          userName: username,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
