import { describe, expect, it } from 'vitest';
import { loadEnv } from './env';

describe('loadEnv', () => {
  it('подставляет значения по умолчанию', () => {
    expect(loadEnv({})).toEqual({
      NODE_ENV: 'development',
      PORT: 3000,
      HOST: '0.0.0.0',
      LOG_LEVEL: 'info',
    });
  });

  it('приводит PORT к числу', () => {
    expect(loadEnv({ PORT: '8080' }).PORT).toBe(8080);
  });

  it('падает на некорректном PORT', () => {
    expect(() => loadEnv({ PORT: 'abc' })).toThrow(/PORT/);
  });
});
