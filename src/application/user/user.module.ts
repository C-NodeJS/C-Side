import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { UserModel } from "../../infrastructure/data-access/typeorm/user.entity";
import { UserController } from "./user.controller";
import { UserServiceImpl } from "./user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel])
  ],
  controllers: [UserController],
  providers: [UserServiceImpl],
  exports: [UserServiceImpl]
})
export class UserModule {}
