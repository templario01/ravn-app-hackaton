import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { AuthService } from './auth/services/auth.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { UserService } from './user/services/user.service';

const services = [AuthService, UserService];
const strategies = [LocalStrategy, JwtStrategy];

@Module({
  exports: [...services],
  imports: [PersistenceModule],
  providers: [...services, ...strategies],
  controllers: [],
})
export class ApplicationModule {}
