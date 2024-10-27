import { JwtUtil } from './jwt.util';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import appConf from '../conf/app.conf';
import dbConf from '../conf/db.conf';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionsModule } from '../modules/auth/service/jwt-options.module';
import { PassportModule } from '@nestjs/passport';
import UserController from '../modules/user/controller/user.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { BcryptUtil } from './bcrypt.util';
import UserService from '../modules/user/service/user.service';

describe('JwtUtil', () => {
  let jwtUtil: JwtUtil;
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

    jwtUtil = app.get<JwtUtil>(JwtUtil);
  });

  it('Test sign user', () => {
    //@ts-ignore
    jwtUtil.jwtService.sign = jest.fn(() => 'signed');

    //@ts-ignore
    const res = jwtUtil.signUser({ id: 123, lastLogin: 123 });

    //@ts-ignore
    expect(jwtUtil.jwtService.sign).toBeCalledTimes(2);
    //@ts-ignore
    expect(jwtUtil.jwtService.sign).toBeCalledWith(
      { sub: 123, lastLogin: 123 },
      { expiresIn: '30d' },
    );
    //@ts-ignore
    expect(jwtUtil.jwtService.sign).toBeCalledWith(
      { sub: 123 },
      { expiresIn: '2m' },
    );
    expect(res).toStrictEqual(['signed', 'signed']);
  });
});
