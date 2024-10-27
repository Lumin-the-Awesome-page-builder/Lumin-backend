import { Controller, Get, Inject, Req, UseGuards } from "@nestjs/common";
import UserService from "../service/user.service";
import { JwtAuthGuard } from "../../../guards/jwt-auth.guard";

@Controller('user')
export default class UserController {
  constructor(@Inject() private readonly userService: UserService) {}

  @Get("authorized")
  @UseGuards(JwtAuthGuard)
  public async getAuthorized(
    @Req() req: {user: { id: number, lastLogin: number }}
  ) {
    return this.userService.getOne(req.user.id)
  }
}