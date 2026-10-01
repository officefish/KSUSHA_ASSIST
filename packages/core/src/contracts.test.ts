import { describe, expect, it } from 'vitest';
import { CreateCubeInputSchema, CubeSchema, HealthResponseSchema } from './contracts';

describe('CreateCubeInputSchema', () => {
  it('принимает корректный ввод и обрезает пробелы в имени', () => {
    const parsed = CreateCubeInputSchema.parse({ name: '  Красный  ', color: 'red', size: 3 });
    expect(parsed).toEqual({ name: 'Красный', color: 'red', size: 3 });
  });

  it('отклоняет неизвестный цвет и размер вне диапазона', () => {
    expect(CreateCubeInputSchema.safeParse({ name: 'x', color: 'pink', size: 3 }).success).toBe(
      false,
    );
    expect(CreateCubeInputSchema.safeParse({ name: 'x', color: 'red', size: 0 }).success).toBe(
      false,
    );
    expect(CreateCubeInputSchema.safeParse({ name: 'x', color: 'red', size: 2.5 }).success).toBe(
      false,
    );
  });

  it('отклоняет пустое имя', () => {
    expect(CreateCubeInputSchema.safeParse({ name: '   ', color: 'red', size: 1 }).success).toBe(
      false,
    );
  });
});

describe('CubeSchema', () => {
  it('требует id и createdAt в формате ISO', () => {
    const ok = CubeSchema.safeParse({
      id: 'abc',
      name: 'x',
      color: 'blue',
      size: 1,
      createdAt: '2026-10-01T10:00:00.000Z',
    });
    expect(ok.success).toBe(true);
    const bad = CubeSchema.safeParse({ id: 'abc', name: 'x', color: 'blue', size: 1 });
    expect(bad.success).toBe(false);
  });
});

describe('HealthResponseSchema', () => {
  it('принимает только status=ok', () => {
    expect(
      HealthResponseSchema.safeParse({ status: 'ok', uptimeSec: 0, version: '1' }).success,
    ).toBe(true);
    expect(
      HealthResponseSchema.safeParse({ status: 'down', uptimeSec: 0, version: '1' }).success,
    ).toBe(false);
  });
});
