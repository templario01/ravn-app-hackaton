import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../persistence/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AcccessTokenResponse, SessionData, TokenResponse } from '../dtos/response/auth.response';
import { UserWithRoles } from '../../user/types/user.types';
import { EnvConfigService } from '../../../config/env-config.service';
import { CreateAdminAccountBody, SendInvitationBody } from '../dtos/request/create-admin-account.input';
import { MailerService } from '../../mail/mail.service';
import { WorkspaceService } from '../../workspace/worskpace.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: EnvConfigService,
    private readonly mailerService: MailerService,
    private readonly workspaceService: WorkspaceService,
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
    if (!user || user.verified === false) return;
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

  async createAdminAccount(params: CreateAdminAccountBody) {
    const findUser = await this.userRepository.findUserByEmail(params.email);
    if (findUser && findUser.verified === true) throw new HttpException('User already exists', HttpStatus.CONFLICT);
    const user = await this.userRepository.createAdminAccount(params);
    const userSession: SessionData = {
      id: user.id,
      roles: user.roles.map((role) => role.name),
      username: user.username,
    };
    const refreshToken = this.createRefreshToken(userSession).token;
    return this.userRepository.saveRefreshToken(user.id, refreshToken);
  }

  async sendInvitation(params: SendInvitationBody, adminId: string, req: Request) {
    let diff = 60;
    const user = await this.userRepository.findUserByEmail(params.email);
    const workspace = await this.workspaceService.getWorkspaceByUser(adminId);
    if (!workspace) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
    if (user) {
      const currentDate = new Date();
      const dateSend = user.emailSendAt;
      diff = (currentDate.getTime() - dateSend.getTime()) / 1000;
    }
    if (diff < 60) throw new HttpException('Please wait 60 seconds to send another invitation', HttpStatus.CONFLICT);

    const userInvited = await this.userRepository.sendInvitation(params, workspace.id);
    if (userInvited) {
      const url = `${req.protocol}://${req.get('host')}/auth/validate-invitation?id=${userInvited.id}`;
      console.log(url);
      this.mailerService.sendMail({
        email: userInvited.username,
        subject: `Invitation to workspace: ${workspace.urlPath}`,
        text: url,
      });
    }
  }

  async validateInvitation(userId: string) {
    await this.userRepository.verifyAccount(userId);
    return HttpStatus.OK;
  }
}
