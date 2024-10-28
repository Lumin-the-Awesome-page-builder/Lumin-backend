import UserController from './user.controller';
import UserService from '../service/user.service';
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

describe('UserController', () => {
  let controller: UserController;
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

    controller = app.get<UserController>(UserController);
  });

  it('Test getOne', async () => {
    //@ts-ignore
    controller.userService.getOne = jest.fn();

    await controller.getAuthorized({ user: { id: 1, lastLogin: 12 } });

    //@ts-ignore
    expect(controller.userService.getOne).toBeCalledTimes(1);
    //@ts-ignore
    expect(controller.userService.getOne).toBeCalledWith(1);
  });
});
