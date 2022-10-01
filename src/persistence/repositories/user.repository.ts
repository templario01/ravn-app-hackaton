import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { CreateAccountInput } from '../../application/auth/dtos/request/create-account.input';
import { RolesEnum } from '../../application/common/roles.enum';

import { UserWithRoles } from '../../application/user/types/user.types';
import { PrismaService } from '../services/prisma.service';
import { CreateAdminAccountInput } from '../../application/auth/dtos/request/create-admin-account.input';

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

  async createAdminAccount({ password, email }: CreateAdminAccountInput) {
    const roles = [RolesEnum.ADMIN, RolesEnum.USER];
    const passwordEncrypted = await this.encryptPassword(password);
    return this.prisma.user.create({
      data: {
        username: email,
        password: passwordEncrypted,
        roles: { connect: roles.map((role) => ({ name: role })) },
      },
    });
  }

  async createAccount({ email, password }: CreateAccountInput): Promise<User> {
    const passwordEncrypted = await this.encryptPassword(password);
    return this.prisma.user.create({
      data: {
        username: email,
        password: passwordEncrypted,
        roles: { connect: { name: RolesEnum.USER } },
      },
    });
  }

  private async encryptPassword(pass: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(pass, salt);
  }
}
