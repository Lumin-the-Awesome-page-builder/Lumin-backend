import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConf from './conf/app.conf';
import { SequelizeModule } from '@nestjs/sequelize';
import dbConf from './conf/db.conf';
import { BcryptUtil } from './utils/bcrypt.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env', '.env', '/root/api.beta/.env'],
      load: [appConf, dbConf],
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      ...dbConf(),
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule,
  ],
  providers: [BcryptUtil],
})
export class AppModule {}
