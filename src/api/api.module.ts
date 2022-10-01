import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { WorkspaceController } from './controllers/workspace.controller';
import { UserController } from './controllers/user.controller';

const controllers = [AuthController, WorkspaceController, UserController];

@Module({
  imports: [PassportModule, ApplicationModule],
  controllers: [...controllers],
  providers: [],
})
export class ApiModule {}
