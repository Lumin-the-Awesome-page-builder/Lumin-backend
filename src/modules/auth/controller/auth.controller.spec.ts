import AuthController from "./auth.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import appConf from "../../../conf/app.conf";
import dbConf from "../../../conf/db.conf";
import { JwtModule } from "@nestjs/jwt";
import { JwtOptionsModule } from "../service/jwt-options.module";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../../../strategies/jwt.strategy";
import { BcryptUtil } from "../../../utils/bcrypt.util";
import { JwtUtil } from "../../../utils/jwt.util";
import AuthService from "../service/auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let loginMock;
  let signUpMock;
  let refreshMock;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['../.env', '.env', '/root/api.beta/.env', '.env.example'],
          load: [appConf, dbConf],
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          useClass: JwtOptionsModule,
        }),
        PassportModule,
      ],
      controllers: [AuthController],
      providers: [
        JwtStrategy,
        BcryptUtil,
        JwtUtil,
        AuthService
      ],
    }).compile();

    controller = app.get<AuthController>(AuthController);

    loginMock = jest.fn()
    signUpMock = jest.fn()
    refreshMock = jest.fn()
    //@ts-ignore
    controller.authService.login = loginMock
    //@ts-ignore
    controller.authService.signup = signUpMock
    //@ts-ignore
    controller.authService.refresh = refreshMock
  })

  it("Test login", async () => {
    await controller.login({login: "", password: ""})

    expect(loginMock).toBeCalledWith("", "")
    expect(loginMock).toBeCalledTimes(1)
  })

  it("Test signup", async () => {
    await controller.signup({login: "", password: ""})

    expect(signUpMock).toBeCalledWith({login: "", password: ""})
    expect(signUpMock).toBeCalledTimes(1)
  })

  it("Test signup", async () => {
    await controller.refresh({
      user: {id: 1, lastLogin: 123}
    })

    expect(refreshMock).toBeCalledWith({id: 1, lastLogin: 123})
    expect(refreshMock).toBeCalledTimes(1)
  })
})