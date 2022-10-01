import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from './services/prisma.service';

const services = [UserRepository, PrismaService];

@Module({
  imports: [],
  providers: [...services],
  exports: [...services],
})
export class PersistenceModule {}
