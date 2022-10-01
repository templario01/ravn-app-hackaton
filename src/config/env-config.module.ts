import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfigService } from './env-config.service';
import { appConfig, jwtConfig } from './app.config';
import { JwtModule } from '@nestjs/jwt';

const configuration = [appConfig, jwtConfig];

@Global()
@Module({
  providers: [EnvConfigService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configuration],
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('appConfig.jwtSecretKey'),
        signOptions: { expiresIn: `${configService.get('app.jwtExpirationTime')}s` },
      }),
    }),
  ],
  exports: [EnvConfigService, JwtModule],
})
export class EnvConfigModule {}
