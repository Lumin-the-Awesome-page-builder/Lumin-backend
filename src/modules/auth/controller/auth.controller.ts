import { Body, Controller, HttpCode, Inject, Post, Req, UseGuards } from "@nestjs/common";
import AuthInputDto from '../dto/auth-input.dto';
import AuthService from '../service/auth.service';
import { JwtAuthGuard } from "../../../guards/jwt-auth.guard";
import { JwtRefreshGuard } from "../../../guards/jwt-refresh.guard";

@Controller('auth')
export default class AuthController {

  constructor(@Inject() private authService: AuthService) {}

  @Post('/')
  @HttpCode(200)
  public async login(
    @Body() credentials: AuthInputDto,
  ) {
    return await this.authService.login(
      credentials.login,
      credentials.password,
    );
  }

  @Post('/signup')
  @HttpCode(200)
  public async signup(
    @Body() credentials: AuthInputDto,
  ) {
    return await this.authService.signup(credentials)
  }

  @Post('/refresh')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, JwtRefreshGuard)
  public async refresh(@Req() req: {user: { id: number, lastLogin: number }}) {
    return await this.authService.refresh(req.user)
  }
}