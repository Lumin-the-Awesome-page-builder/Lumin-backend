import { Injectable } from '@nestjs/common';
import UserDto from "../dto/user.dto";
import { UserModel } from "../models/user.model";

@Injectable()
export default class UserService {
  public async getOne(id: number): Promise<UserDto> {
    return await UserModel.findOne({where: { id }}).then(res => {
      return new UserDto(res.id, res.login, res.lastLogin)
    })
  }
}