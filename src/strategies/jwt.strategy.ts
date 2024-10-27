import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('main.jwtSecret'),
    });
  }

  async validate(payload: {
    sub?: number;
    lastLogin?: number;
  }) {
    return {
      id: payload.sub,
      lastLogin: payload.lastLogin,
    };
  }
}
