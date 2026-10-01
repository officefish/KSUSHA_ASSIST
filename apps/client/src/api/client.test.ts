import { describe, expect, it, vi } from 'vitest';
import { ApiError, buildUrl, createApiClient } from './client';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('buildUrl', () => {
  it('склеивает базу и путь без двойных слэшей', () => {
    expect(buildUrl('', 'health')).toBe('/api/health');
    expect(buildUrl('http://localhost:3000/', '/cubes')).toBe('http://localhost:3000/api/cubes');
  });
});

describe('createApiClient', () => {
  it('валидирует ответ health по схеме', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ status: 'ok', uptimeSec: 1, version: '0.1.0' }),
    );
    const client = createApiClient({ baseUrl: '', fetchImpl });
    await expect(client.health()).resolves.toEqual({
      status: 'ok',
      uptimeSec: 1,
      version: '0.1.0',
    });
    expect(fetchImpl).toHaveBeenCalledWith('/api/health', expect.anything());
  });

  it('бросает ApiError с сообщением сервера при неуспешном статусе', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ message: 'Ошибка валидации' }, 400));
    const client = createApiClient({ baseUrl: '', fetchImpl });
    await expect(client.createCube({ name: '', color: 'red', size: 1 })).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: 'Ошибка валидации',
    } satisfies Partial<ApiError>);
  });

  it('отправляет POST с JSON-телом', async () => {
    const cube = {
      id: '1',
      name: 'Жёлтый',
      color: 'yellow',
      size: 2,
      createdAt: '2026-10-01T10:00:00.000Z',
    };
    const fetchImpl = vi.fn(async () => jsonResponse(cube, 201));
    const client = createApiClient({ baseUrl: 'http://api', fetchImpl });
    await expect(client.createCube({ name: 'Жёлтый', color: 'yellow', size: 2 })).resolves.toEqual(
      cube,
    );
    expect(fetchImpl).toHaveBeenCalledWith(
      'http://api/api/cubes',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Жёлтый', color: 'yellow', size: 2 }),
      }),
    );
  });
});
