import UserController from '../controller/user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import appConf from '../../../conf/app.conf';
import dbConf from '../../../conf/db.conf';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionsModule } from '../../auth/service/jwt-options.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../../strategies/jwt.strategy';
import { BcryptUtil } from '../../../utils/bcrypt.util';
import { JwtUtil } from '../../../utils/jwt.util';
import UserService from './user.service';
import { UserModel } from '../models/user.model';

jest.mock('../models/user.model', () => {
  return {
    UserModel: {
      findOne: jest.fn(
        () =>
          new Promise((resolve) =>
            resolve({ id: 1, login: '', lastLogin: 123 }),
          ),
      ),
    },
  };
});

describe('UserService', () => {
  let service: UserService;
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
      controllers: [UserController],
      providers: [JwtStrategy, BcryptUtil, JwtUtil, UserService],
    }).compile();

    service = app.get<UserService>(UserService);
  });

  it('Test getOne', async () => {
    const res = await service.getOne(1);

    //@ts-ignore
    expect(UserModel.findOne).toBeCalledTimes(1);
    //@ts-ignore
    expect(UserModel.findOne).toBeCalledWith({ where: { id: 1 } });
    expect({ ...res }).toStrictEqual({ id: 1, login: '', lastLogin: 123 });
  });
});
