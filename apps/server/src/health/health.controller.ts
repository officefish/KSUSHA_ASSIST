import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@kubiki/core';

const APP_VERSION = process.env.npm_package_version ?? '0.0.0';

@Controller('health')
export class HealthController {
  private readonly startedAt = Date.now();

  @Get()
  get(): HealthResponse {
    return {
      status: 'ok',
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      version: APP_VERSION,
    };
  }
}
