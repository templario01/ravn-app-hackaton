import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AcccessTokenResponse, SessionData } from '../../application/auth/dtos/response/auth.response';
import { AuthService } from '../../application/auth/services/auth.service';
import { RolesEnum } from '../../application/common/roles.enum';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoginAuthGuard } from '../guards/login-auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LoginAuthGuard)
  async login(@CurrentUser() user: SessionData): Promise<AcccessTokenResponse> {
    return this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async testEndpoint() {
    console.log('autenticado');
  }

  @Get('justadmins')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async testEndpointAdmins() {
    console.log('is admin');
  }
}
