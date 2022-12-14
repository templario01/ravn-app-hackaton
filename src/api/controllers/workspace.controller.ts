import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SessionData } from '../../application/auth/dtos/response/auth.response';
import { RolesEnum } from '../../application/common/roles.enum';
import {
  CreateWorkspaceBody,
  GetOfficesByWorkspace,
  GetOFloorsByOffice,
} from '../../application/workspace/dtos/create-workspace';
import { WorkspaceService } from '../../application/workspace/worskpace.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/role.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  async createWorkspace(@Body() params: CreateWorkspaceBody, @CurrentUser() user: SessionData) {
    return this.workspaceService.createWorkspace(params, user.id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('members')
  async getUsersCount(@CurrentUser() user: SessionData) {
    return this.workspaceService.getWorkspaceAndUsersCount(user.id);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('offices')
  async getOfficesByWorkspace(@Query() { workspaceId }: GetOfficesByWorkspace) {
    return this.workspaceService.getWorkspaceAndUsersCount(workspaceId);
  }

  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('offices/floors')
  async getFloorsByOffice(@Query() { officeId }: GetOFloorsByOffice) {
    return this.workspaceService.getWorkspaceAndUsersCount(officeId);
  }
}
