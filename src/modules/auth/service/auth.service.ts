import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import TokenPairDto from '../dto/token-pair.dto';
import { UserModel } from '../../user/models/user.model';
import { BcryptUtil } from '../../../utils/bcrypt.util';
import { JwtUtil } from '../../../utils/jwt.util';
import AuthInputDto from '../dto/auth-input.dto';

@Injectable()
export default class AuthService {
  user: UserModel;

  constructor(
    @Inject(BcryptUtil) private bcrypt: BcryptUtil,
    @Inject(JwtUtil) private jwt: JwtUtil,
  ) {}

  async login(login: string, password: string): Promise<TokenPairDto> {
    const user = await UserModel.findOne({
      where: {
        login,
      },
    });

    if (!user) throw new ForbiddenException();

    const passwordCompare = await this.bcrypt
      .compare(password, user.hash)
      .then((el) => el)
      .catch(() => false);

    if (!passwordCompare) throw new ForbiddenException();

    const tokens = this.jwt.signUser(user);

    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }

  async refresh(onRefresh: {
    id: number;
    lastLogin: number;
  }): Promise<TokenPairDto> {
    const user = await UserModel.findOne({ where: { id: onRefresh.id } });

    if (user) {
      if (user.lastLogin == onRefresh.lastLogin) {
        user.lastLogin = Date.now();
        await user.save();
        const tokens = this.jwt.signUser(user);
        return {
          accessToken: tokens[0],
          refreshToken: tokens[1],
        };
      }
    }
    throw new ForbiddenException();
  }

  async signup(credentials: AuthInputDto): Promise<TokenPairDto> {
    const user = await UserModel.create({
      ...credentials,
      hash: await this.bcrypt.hash(credentials.password),
      lastLogin: Date.now(),
    });

    if (!user) {
      throw new BadRequestException();
    }

    const tokens = this.jwt.signUser(user);
    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  }
}
