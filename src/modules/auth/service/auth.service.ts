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
import YandexAuthInputDto from '../dto/yandex-auth-input.dto';
import YandexAuthOutputDto from '../dto/yandex-auth-output.dto';
import UserDto from '../../user/dto/user.dto';
import axios from 'axios';
import VkAuthInputDto from '../dto/vk-auth-input.dto';
import ExceptionReportDto from '../dto/exception-report-dto';
import { ReportModel } from '../models/ReportModel';
import ExceptionResponseDto from '../dto/exception-response-dto';

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

  async authUserYandex(
    yandexAuthInputDto: YandexAuthInputDto,
  ): Promise<TokenPairDto> {
    let result: YandexAuthOutputDto;
    try {
      await axios
        .get('https://login.yandex.ru/info?format=json', {
          headers: {
            Authorization: `OAuth ${yandexAuthInputDto.token}`,
          },
        })
        .then(function (response) {
          result = new YandexAuthOutputDto(
            response.data.id,
            response.data.login,
          );
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      throw new ForbiddenException();
    }
    return await this.authOrSignByService(result, 'yandex');
  }

  async authUserVk(vkAuthInputDto: VkAuthInputDto): Promise<TokenPairDto> {
    return await this.authOrSignByService(vkAuthInputDto, 'vk');
  }

  private async authOrSignByService(
    data: YandexAuthOutputDto | VkAuthInputDto,
    serviceName: string,
  ) {
    let curUser: UserDto;
    try {
      curUser = await UserModel.findOne({
        where: {
          internalServiceId: data.id,
          serviceName: serviceName,
        },
      }).then((res) => {
        return new UserDto(res.id, res.login, res.lastLogin);
      });

      const tokens = this.jwt.signUser(curUser);
      return {
        accessToken: tokens[0],
        refreshToken: tokens[1],
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      curUser = await UserModel.create({
        login: data.login,
        hash: null,
        serviceName: serviceName,
        internalServiceId: data.id,
        lastLogin: Date.now(),
      });

      const tokens = this.jwt.signUser(curUser);
      return {
        accessToken: tokens[0],
        refreshToken: tokens[1],
      };
    }
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
    let user: UserModel;
    user = await UserModel.findOne({ where: { login: credentials.login } });
    if (!user) {
      user = await UserModel.create({
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
    } else {
      throw new ForbiddenException(
        'User with this name is already registered in the system',
      );
    }
  }

  // @ts-ignore
  async report(credentials: ExceptionReportDto): Promise<ExceptionResponseDto> {
    console.log(credentials.url.length);
    console.log(credentials.errorCode.length);
    console.log(credentials.message.length);
    console.log(credentials.userAgent.length);
    console.log(credentials.stack.length);
    const report = await ReportModel.create({
      ...credentials,
    });
    if (!report) {
      throw new BadRequestException();
    }
    return {
      message: 'Ваш отчет успешно записан',
    };
  }
}
