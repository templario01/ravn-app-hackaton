import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../persistence/services/prisma.service';
import { CreateWorkspaceBody, WorkspaceAndUsersCount } from './dtos/create-workspace';

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

  async getWorkspaceAndUsersCount(userId: string): Promise<WorkspaceAndUsersCount> {
    const workspace = await this.getWorkspaceByUser(userId);
    const users = await this.prisma.user.count({
      where: {
        workspaceId: workspace.id,
      },
    });

    return {
      count: users,
      workspace: workspace.urlPath,
    };
  }
}
