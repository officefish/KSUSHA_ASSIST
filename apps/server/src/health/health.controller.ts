import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@kubiki/core';
import { readAppVersion } from '../config/version';

@Controller('health')
export class HealthController {
  private readonly startedAt = Date.now();
  private readonly version = readAppVersion();

  @Get()
  get(): HealthResponse {
    return {
      status: 'ok',
      uptimeSec: Math.floor((Date.now() - this.startedAt) / 1000),
      version: this.version,
    };
  }
}
