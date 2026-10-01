import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Cube } from '@kubiki/core';
import { App } from './App';
import type { ApiClient } from './api/client';

const cube: Cube = {
  id: '1',
  name: 'Зелёный',
  color: 'green',
  size: 5,
  createdAt: '2026-10-01T10:00:00.000Z',
};

function fakeClient(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    health: vi.fn(async () => ({ status: 'ok' as const, uptimeSec: 1, version: '0.1.0' })),
    listCubes: vi.fn(async () => [cube]),
    createCube: vi.fn(async () => cube),
    deleteCube: vi.fn(async () => undefined),
    ...overrides,
  };
}

describe('App', () => {
  it('показывает версию сервера и список кубиков', async () => {
    render(<App client={fakeClient()} />);
    expect(await screen.findByText('сервер v0.1.0')).toBeTruthy();
    const list = await screen.findByRole('list', { name: 'Список кубиков' });
    expect(within(list).getByText('Зелёный')).toBeTruthy();
    expect(screen.getByText('Кубики (1)')).toBeTruthy();
  });

  it('показывает ошибку, когда сервер недоступен', async () => {
    const client = fakeClient({
      health: vi.fn(async () => {
        throw new Error('HTTP 503');
      }),
    });
    render(<App client={client} />);
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByText('HTTP 503')).toBeTruthy();
    expect(screen.getByText('сервер недоступен')).toBeTruthy();
  });
});
