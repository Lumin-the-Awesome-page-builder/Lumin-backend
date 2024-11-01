import AuthService from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import AuthController from '../controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionsModule } from './jwt-options.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../../strategies/jwt.strategy';
import { BcryptUtil } from '../../../utils/bcrypt.util';
import { JwtUtil } from '../../../utils/jwt.util';
import { UserModel } from '../../user/models/user.model';
import { ConfigModule } from '@nestjs/config';
import appConf from '../../../conf/app.conf';
import dbConf from '../../../conf/db.conf';
import { ForbiddenException } from '@nestjs/common';
import AuthInputDto from '../dto/auth-input.dto';
import YandexAuthInputDto from '../dto/yandex-auth-input.dto';
import axios from 'axios';
import VkAuthInputDto from '../dto/vk-auth-input.dto';

jest.mock('axios');
jest.mock('../../user/models/user.model', () => {
  return {
    UserModel: {
      create: jest.fn(() => true),
      findOne: jest.fn(() => ({
        hash: 'hash',
        lastLogin: 124,
        save: jest.fn(() => new Promise((resolve) => resolve(1))),
      })),
    },
  };
});

describe('AuthService tests', () => {
  let service: AuthService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [
            '../.env',
            '.env',
            '/root/api.beta/.env',
            '.env.example',
          ],
          load: [appConf, dbConf],
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          useClass: JwtOptionsModule,
        }),
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [JwtStrategy, BcryptUtil, JwtUtil, AuthService],
    }).compile();

    service = app.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Test login', async () => {
    //@ts-ignore
    service.bcrypt.compare = jest.fn(
      () => new Promise((resolve) => resolve(true)),
    );
    //@ts-ignore
    service.jwt.signUser = jest.fn(() => ['1', '2']);

    const res = await service.login('l', 'p');

    expect(UserModel.findOne).toBeCalledTimes(1);
    //@ts-ignore
    expect(service.bcrypt.compare).toBeCalledTimes(1);
    //@ts-ignore
    expect(service.bcrypt.compare).toBeCalledWith('p', 'hash');
    //@ts-ignore
    expect(service.jwt.signUser).toBeCalledTimes(1);
    expect(res).toStrictEqual({ accessToken: '1', refreshToken: '2' });
  });

  describe('Test refresh', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Test eq lastLogin', async () => {
      jest.restoreAllMocks();
      //@ts-ignore
      service.jwt.signUser = jest.fn(() => ['1', '2']);

      const res = await service.refresh({ id: 1, lastLogin: 124 });

      //@ts-ignore
      expect(service.jwt.signUser).toBeCalledTimes(1);
      expect(res).toStrictEqual({ accessToken: '1', refreshToken: '2' });
    });

    it('Test not eq lastLogin', async () => {
      //@ts-ignore
      service.jwt.signUser = jest.fn(() => ['1', '2']);

      const err = await service
        .refresh({ id: 1, lastLogin: 1241 })
        .catch((err) => {
          return err;
        });

      expect(err).toStrictEqual(new ForbiddenException());
    });
  });

  it('Test signup with already exists login', async () => {
    //@ts-ignore
    service.bcrypt.hash = jest.fn(
      //@ts-ignore
      () => new Promise((resolve) => resolve(true)),
    );
    //@ts-ignore
    service.jwt.signUser = jest.fn(() => ['1', '2']);

    await expect(service.signup(new AuthInputDto('l', 'p'))).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('Test signup', async () => {
    jest.restoreAllMocks();
    //@ts-ignore
    service.bcrypt.hash = jest.fn(
      //@ts-ignore
      () => new Promise((resolve) => resolve(true)),
    );
    //@ts-ignore
    service.jwt.signUser = jest.fn(() => ['1', '2']);

    const mockUser = false;

    //@ts-ignore
    jest.spyOn(UserModel, 'findOne').mockResolvedValue(mockUser);

    const res = await service.signup(new AuthInputDto('l', 'p'));
    //@ts-ignore
    expect(service.bcrypt.hash).toBeCalledTimes(1);
    //@ts-ignore
    expect(service.bcrypt.hash).toBeCalledWith('p');
    //@ts-ignore
    expect(service.jwt.signUser).toBeCalledTimes(1);
    expect(res).toStrictEqual({ accessToken: '1', refreshToken: '2' });
  });

  describe('Yandex Auth tests', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Test login with wrong Yandex token', async () => {
      jest.restoreAllMocks();
      const token = 'wrong_token';
      await expect(
        service.authUserYandex(new YandexAuthInputDto(token)),
      ).rejects.toThrow(ForbiddenException);
    });

    it('Test login with correct Yandex token', async () => {
      jest.restoreAllMocks();

      //@ts-ignore
      service.jwt.signUser = jest.fn(() => ['1', '2']);
      const token = 'valid_token';
      const expectedResponse = {
        id: 'user-id',
        login: 'user-login',
      };
      (axios.get as jest.Mock).mockResolvedValue({ data: expectedResponse });
      await service.authUserYandex(new YandexAuthInputDto(token));
      expect(UserModel.findOne).toBeCalledWith({
        where: {
          internalServiceId: expectedResponse.id,
          serviceName: 'yandex',
        },
      });
      //@ts-ignore
      expect(service.jwt.signUser).toBeCalledTimes(1);
      expect(UserModel.create).toBeCalled();
    });
  });

  describe('Vk Auth tests', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('Test login by Vk data', async () => {
      jest.restoreAllMocks();

      //@ts-ignore
      service.jwt.signUser = jest.fn(() => ['1', '2']);
      const data = new VkAuthInputDto(1, 'vk-user-login');
      await service.authUserVk(data);
      expect(UserModel.findOne).toBeCalledWith({
        where: {
          internalServiceId: data.id,
          serviceName: 'vk',
        },
      });
      //@ts-ignore
      expect(service.jwt.signUser).toBeCalledTimes(1);
    });
  });
});
