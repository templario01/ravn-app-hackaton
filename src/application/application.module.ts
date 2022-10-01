import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { PrismaService } from '../persistence/services/prisma.service';
import { AuthService } from './auth/services/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { MailerService } from './mail/mail.service';
import { UserService } from './user/services/user.service';
import { WorkspaceService } from './workspace/worskpace.service';

const services = [AuthService, UserService, PrismaService, WorkspaceService, MailerService];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
  exports: [...services],
  imports: [PersistenceModule],
  providers: [...services, ...strategies],
  controllers: [],
})
export class ApplicationModule {}
