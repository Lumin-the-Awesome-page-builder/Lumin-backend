import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import AuthInputDto from '../dto/auth-input.dto';
import AuthService from '../service/auth.service';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../../guards/jwt-refresh.guard';
import YandexAuthInputDto from '../dto/yandex-auth-input.dto';
import VkAuthInputDto from '../dto/vk-auth-input.dto';
import ExceptionReportDto from '../dto/exception-report-dto';

@Controller('auth')
export default class AuthController {
  constructor(@Inject() private authService: AuthService) {}

  @Post('/report')
  @HttpCode(200)
  public async report(@Body() credentials: ExceptionReportDto) {
    return await this.authService.report(credentials);
  }

  @Post('/')
  @HttpCode(200)
  public async login(@Body() credentials: AuthInputDto) {
    return await this.authService.login(
      credentials.login,
      credentials.password,
    );
  }

  @Post('/signup')
  @HttpCode(200)
  public async signup(@Body() credentials: AuthInputDto) {
    return await this.authService.signup(credentials);
  }

  @Post('/refresh')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, JwtRefreshGuard)
  public async refresh(
    @Req() req: { user: { id: number; lastLogin: number } },
  ) {
    return await this.authService.refresh(req.user);
  }
  @Post('/yandex')
  @HttpCode(200)
  public async yandex(@Body() credentials: YandexAuthInputDto) {
    return await this.authService.authUserYandex(credentials);
  }

  @Post('/vk')
  @HttpCode(200)
  public async vk(@Body() credentials: VkAuthInputDto) {
    return await this.authService.authUserVk(credentials);
  }
}
