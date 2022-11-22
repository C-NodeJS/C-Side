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

  async findUserByUserName(userName: string): Promise<UserModel> {
    try {
      const currUser = await this.userRepository.findOne({
        where: {
          userName,
        },
      });

      if (!currUser) {
        throw new HttpException(
          'Database error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return currUser;
    } catch (e) {
      throw new HttpException(
        'Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAllPermissionOfUser(user: Partial<UserModel>) {
    const data: UserModel = await this.userRepository.findOne({
      where: { userName: user.userName },
      relations: {
        role: {
          permissions: { object: true },
        },
      },
    });
    console.log(data?.role?.permissions);
    return 'OK';
  }
}
