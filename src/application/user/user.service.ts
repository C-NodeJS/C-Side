import { Mapper } from '@automapper/core';
import { IUserService } from "../../domain/usecases/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "../../infrastructure/data-access/typeorm/user.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async createUser(user: UserModel): Promise<UserModel> {
    return await this.userRepository.save(user);
  }
}
