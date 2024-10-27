import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "./models/user.model";
import { AuthModule } from "../auth/auth.module";
import UserService from "./service/user.service";
import UserController from "./controller/user.controller";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    SequelizeModule.forFeature([UserModel]),
    AuthModule,
  ],
})
export class UserModule {}