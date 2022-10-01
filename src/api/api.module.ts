import { Module } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/user.controller';

const controllers = [AuthController];

@Module({
  imports: [PassportModule, ApplicationModule],
  controllers: [...controllers],
  providers: [],
})
export class ApiModule {}
