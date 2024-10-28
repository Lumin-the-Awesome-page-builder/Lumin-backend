import { Module } from '@nestjs/common';
import AuthController from './controller/auth.controller';
import AuthService from './service/auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../user/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionsModule } from './service/jwt-options.module';
import { BcryptUtil } from '../../utils/bcrypt.util';
import { JwtUtil } from '../../utils/jwt.util';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    JwtModule.registerAsync({
      useClass: JwtOptionsModule,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, BcryptUtil, JwtUtil, AuthService],
  exports: [
    SequelizeModule.forFeature([UserModel]),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtOptionsModule,
    }),
    AuthService,
    JwtStrategy,
    BcryptUtil,
    JwtUtil,
  ],
})
export class AuthModule {}
