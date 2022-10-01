import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../persistence/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AcccessTokenResponse, SessionData, TokenResponse } from '../dtos/response/auth.response';
import { UserWithRoles } from '../../user/types/user.types';
import { EnvConfigService } from '../../../config/env-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: EnvConfigService,
  ) {}

  async login(user: SessionData): Promise<AcccessTokenResponse> {
    const accessToken = this.createAccessToken(user).token;
    const refreshToken = this.createRefreshToken(user).token;
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateLogin(username: string, password: string): Promise<SessionData> {
    const user = await this.userRepository.findUserByEmail(username);
    if (!user) return;
    const matchPassword = await compare(password, user.password);
    return matchPassword ? this.getSessionData(user) : null;
  }

  getSessionData(user: UserWithRoles): SessionData {
    const { id, username } = user;
    const userRoles = user.roles.map((e) => e.name);
    return { id, username, roles: userRoles };
  }

  createAccessToken(user: SessionData): TokenResponse {
    const config = this.configService.jwtConfig();
    return {
      token: this.jwtService.sign(user, {
        secret: config.jwtSecretKey,
        expiresIn: `${config.jwtExpirationTime}s`,
      }),
    };
  }

  createRefreshToken(user: SessionData): TokenResponse {
    const config = this.configService.jwtConfig();
    return {
      token: this.jwtService.sign(user, {
        secret: config.jwtRefreshSecretKey,
        expiresIn: `${config.jwtRefreshExpirationTime}s`,
      }),
    };
  }
}
