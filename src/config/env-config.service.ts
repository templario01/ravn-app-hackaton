import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { IAppConfig, IJwtConfig } from './app.config'

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  appConfig(): IAppConfig {
    return this.configService.get<IAppConfig>('appConfig')
  }

  jwtConfig(): IJwtConfig {
    return this.configService.get<IJwtConfig>('jwtConfig')
  }
}
