import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../modules/user/models/user.model';
import { Injectable } from '@nestjs/common';
import UserDto from '../modules/user/dto/user.dto';
import { jwtConf } from "../conf/jwt.conf";

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  public signUser(user: UserModel | UserDto): string[] {
    const access = this.jwtService.sign(
      {
        sub: user.id,
      },
      { expiresIn: jwtConf.jwtAccessLifetime },
    );
    const refresh = this.jwtService.sign(
      {
        sub: user.id,
        lastLogin: user.lastLogin,
      },
      { expiresIn: jwtConf.jwtRefreshLifetime },
    );

    return [access, refresh];
  }
}
