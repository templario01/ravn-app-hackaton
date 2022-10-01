import { registerAs } from '@nestjs/config';

export enum AppEnvironment {
  DEV = 'dev',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export interface IAppConfig {
  environment: string;
  port: number;
}

export const appConfig = registerAs<IAppConfig>(
  'appConfig',
  (): IAppConfig => ({
    environment: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT) || 3000,
  }),
);

export interface IJwtConfig {
  jwtSecretKey: string;
  jwtExpirationTime: string;
  jwtRefreshExpirationTime: string;
  jwtRefreshSecretKey: string;
}

export const jwtConfig = registerAs<IJwtConfig>(
  'jwtConfig',
  (): IJwtConfig => ({
    jwtSecretKey: process.env.JWT_SECRET,
    jwtExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    jwtRefreshExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    jwtRefreshSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET,
  }),
);
