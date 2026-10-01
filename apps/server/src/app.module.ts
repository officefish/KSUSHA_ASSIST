import { Module, type DynamicModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import type { AppEnv } from './config/env';
import { CubesModule } from './cubes/cubes.module';
import { HealthModule } from './health/health.module';

@Module({})
export class AppModule {
  /** Корневой модуль собирается от окружения: уровень логов и pretty-вывод зависят от NODE_ENV. */
  static forEnv(env: AppEnv): DynamicModule {
    return {
      module: AppModule,
      imports: [
        LoggerModule.forRoot({
          pinoHttp: {
            level: env.NODE_ENV === 'test' ? 'silent' : env.LOG_LEVEL,
            transport:
              env.NODE_ENV === 'development'
                ? {
                    target: 'pino-pretty',
                    options: { colorize: true, translateTime: 'SYS:standard' },
                  }
                : undefined,
          },
        }),
        HealthModule,
        CubesModule,
      ],
    };
  }
}
