import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../persistence/services/prisma.service';
import { GetUsers } from '../dto/get-users';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsersInvited({ mail }: GetUsers) {
    return this.prisma.user.findMany({
      where: {
        verified: false,
        ...(mail && {
          username: {
            contains: mail,
            mode: 'insensitive',
          },
        }),
      },
    });
  }
}
