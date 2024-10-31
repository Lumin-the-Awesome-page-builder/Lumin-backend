import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../modules/user/models/user.model';
import { Injectable } from '@nestjs/common';
import UserDto from '../modules/user/dto/user.dto';

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  public signUser(user: UserModel | UserDto): string[] {
    const access = this.jwtService.sign(
      {
        sub: user.id,
      },
      { expiresIn: '2m' },
    );
    const refresh = this.jwtService.sign(
      {
        sub: user.id,
        lastLogin: user.lastLogin,
      },
      { expiresIn: '30d' },
    );

    return [access, refresh];
  }
}
