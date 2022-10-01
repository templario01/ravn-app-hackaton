import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RolesEnum } from '../../application/common/roles.enum';
import { GetUsers } from '../../application/user/dto/get-users';
import { UserService } from '../../application/user/services/user.service';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('invited')
  async getAllUsersInvited(@Query() params: GetUsers) {
    return this.userService.getAllUsersInvited(params);
  }
}
