import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { EnvConfigModule } from './config/env-config.module';

@Module({
  imports: [EnvConfigModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
