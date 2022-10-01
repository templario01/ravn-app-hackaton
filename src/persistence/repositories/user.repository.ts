import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateAccountInput } from '../../application/auth/dtos/request/create-account.input';
import { RolesEnum } from '../../application/common/roles.enum';

import { UserWithRoles } from '../../application/user/types/user.types';
import { PrismaService } from '../services/prisma.service';
import {
  CreateAdminAccountBody,
  SendInvitationBody,
} from '../../application/auth/dtos/request/create-admin-account.input';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(mail: string): Promise<UserWithRoles> {
    return this.prisma.user.findFirst({
      where: {
        username: {
          equals: mail,
          mode: 'insensitive',
        },
      },
      include: { roles: true },
    });
  }

  async createAdminAccount({ password, email }: CreateAdminAccountBody) {
    const roles = [RolesEnum.ADMIN, RolesEnum.USER];
    const passwordEncrypted = await this.encryptPassword(password);
    return this.prisma.user.create({
      data: {
        verified: true,
        username: email,
        password: passwordEncrypted,
        roles: { connect: roles.map((role) => ({ name: role })) },
      },

      include: { roles: true },
    });
  }

  async createAccount({ email, password }: CreateAccountInput): Promise<User> {
    const passwordEncrypted = await this.encryptPassword(password);
    return this.prisma.user.upsert({
      where: { username: email },
      create: {
        verified: true,
        username: email,
        password: passwordEncrypted,
        roles: { connect: { name: RolesEnum.USER } },
      },
      update: {
        verified: true,
      },
    });
  }

  private async encryptPassword(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pass, salt);
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async sendInvitation({ email }: SendInvitationBody, workspaceId: string) {
    return this.prisma.user.upsert({
      where: { username: email },
      create: {
        password: '',
        workspaces: { connect: { id: workspaceId } },
        username: email,
        verified: false,
        emailSendAt: new Date(),
        roles: { connect: { name: RolesEnum.USER } },
      },
      update: { emailSendAt: new Date() },
    });
  }

  async verifyAccount(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });
  }
}
