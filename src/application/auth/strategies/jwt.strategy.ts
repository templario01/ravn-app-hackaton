import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { SessionData } from '../dtos/response/auth.response';
import { EnvConfigService } from '../../../config/env-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: EnvConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.jwtConfig().jwtSecretKey,
      ignoreExpiration: false,
    });
  }

  async validate(payload: SessionData) {
    return payload;
  }
}
