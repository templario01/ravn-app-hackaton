import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import {
  CreateAdminAccountBody,
  SendInvitationBody,
  ValidateInvitation,
} from '../../application/auth/dtos/request/create-admin-account.input';
import { LoginUserBody } from '../../application/auth/dtos/request/login.input';
import { AcccessTokenResponse, SessionData } from '../../application/auth/dtos/response/auth.response';
import { AuthService } from '../../application/auth/services/auth.service';
import { RolesEnum } from '../../application/common/roles.enum';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LoginAuthGuard } from '../guards/login-auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('login')
  // @UseGuards(LoginAuthGuard)
  // async login(@CurrentUser() user: SessionData): Promise<AcccessTokenResponse> {
  //   return this.authService.login(user);
  // }

  @Post('login')
  async login(@Body() params: LoginUserBody): Promise<AcccessTokenResponse> {
    return this.authService.SecureLogin(params);
  }

  @Post('register')
  async registerAdminAccount(@Body() params: CreateAdminAccountBody) {
    return this.authService.createAdminAccount(params);
  }

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('send-invitation')
  async sendEmailInvitation(@Body() params: SendInvitationBody, @CurrentUser() user: SessionData, @Req() req: Request) {
    return this.authService.sendInvitation(params, user.id, req);
  }

  @Get('validate-invitation')
  async validateInvitation(@Query() params: ValidateInvitation) {
    return this.authService.validateInvitation(params.id);
  }
}
