import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../persistence/services/prisma.service';
import { CreateWorkspaceBody } from './dtos/create-workspace';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkspace({ urlPath }: CreateWorkspaceBody, userId: string) {
    return this.prisma.workspace.create({
      data: {
        urlPath,
        user: { connect: { id: userId } },
      },
    });
  }

  async getWorkspaceByUser(userId: string) {
    return this.prisma.workspace.findFirst({
      where: {
        user: { some: { id: userId } },
      },
    });
  }
}
