import 'reflect-metadata';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  CubeListSchema,
  CubeSchema,
  HealthResponseSchema,
  ValidationErrorSchema,
} from '@kubiki/core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from './app';
import { loadEnv } from './config/env';

let app: NestFastifyApplication;

beforeAll(async () => {
  app = await createApp(loadEnv({ NODE_ENV: 'test' }));
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});

afterAll(async () => {
  await app.close();
});

describe('GET /api/health', () => {
  it('отвечает статусом ok по контракту HealthResponseSchema', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/health' });
    expect(res.statusCode).toBe(200);
    expect(HealthResponseSchema.parse(res.json())).toMatchObject({ status: 'ok' });
  });
});

describe('/api/cubes', () => {
  it('создаёт, отдаёт и удаляет кубик', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/api/cubes',
      payload: { name: 'Синий', color: 'blue', size: 4 },
    });
    expect(created.statusCode).toBe(201);
    const cube = CubeSchema.parse(created.json());
    expect(cube).toMatchObject({ name: 'Синий', color: 'blue', size: 4 });

    const list = await app.inject({ method: 'GET', url: '/api/cubes' });
    expect(list.statusCode).toBe(200);
    expect(CubeListSchema.parse(list.json()).map((c) => c.id)).toContain(cube.id);

    const one = await app.inject({ method: 'GET', url: `/api/cubes/${cube.id}` });
    expect(one.statusCode).toBe(200);
    expect(one.json()).toEqual(cube);

    const removed = await app.inject({ method: 'DELETE', url: `/api/cubes/${cube.id}` });
    expect(removed.statusCode).toBe(204);

    const missing = await app.inject({ method: 'GET', url: `/api/cubes/${cube.id}` });
    expect(missing.statusCode).toBe(404);
  });

  it('отвечает 400 с описанием ошибок на невалидное тело', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/cubes',
      payload: { name: '', color: 'pink', size: 42 },
    });
    expect(res.statusCode).toBe(400);
    const body = ValidationErrorSchema.parse(res.json());
    const paths = body.issues.map((issue) => issue.path.join('.'));
    expect(paths).toEqual(expect.arrayContaining(['name', 'color', 'size']));
  });

  it('отвечает 404 при удалении несуществующего кубика', async () => {
    const res = await app.inject({ method: 'DELETE', url: '/api/cubes/nope' });
    expect(res.statusCode).toBe(404);
  });
});
