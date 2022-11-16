import { CreateUserRequest } from "./user-create/create-user.request";
import { User } from "../entities/users";
import { UserModel } from "../../infrastructure/data-access/typeorm/user.entity";

export interface IUserService extends IService {
  createUser(user: CreateUserRequest | any): Promise<User | UserModel>; //TODO refactor later
}
