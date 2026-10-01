import {
  API_PREFIX,
  CubeListSchema,
  CubeSchema,
  HealthResponseSchema,
  type CreateCubeInput,
  type Cube,
  type HealthResponse,
} from '@kubiki/core';
import type { ZodType } from 'zod';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Склеивает базовый URL и путь без двойных слэшей. */
export function buildUrl(baseUrl: string, path: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${API_PREFIX}/${suffix}`;
}

async function extractMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === 'object' && 'message' in body) {
      const message = (body as { message: unknown }).message;
      if (typeof message === 'string') return message;
    }
  } catch {
    // тело не JSON — вернём статус
  }
  return `HTTP ${response.status}`;
}

export interface ApiClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? import.meta.env.VITE_API_URL ?? '';
  const fetchImpl = options.fetchImpl ?? ((input, init) => fetch(input, init));

  async function request<T>(path: string, schema: ZodType<T>, init?: RequestInit): Promise<T> {
    const response = await fetchImpl(buildUrl(baseUrl, path), {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!response.ok) {
      throw new ApiError(response.status, await extractMessage(response));
    }
    return schema.parse(await response.json());
  }

  async function requestVoid(path: string, init?: RequestInit): Promise<void> {
    const response = await fetchImpl(buildUrl(baseUrl, path), init);
    if (!response.ok) {
      throw new ApiError(response.status, await extractMessage(response));
    }
  }

  return {
    health: (): Promise<HealthResponse> => request('health', HealthResponseSchema),
    listCubes: (): Promise<Cube[]> => request('cubes', CubeListSchema),
    createCube: (input: CreateCubeInput): Promise<Cube> =>
      request('cubes', CubeSchema, { method: 'POST', body: JSON.stringify(input) }),
    deleteCube: (id: string): Promise<void> =>
      requestVoid(`cubes/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

export const api: ApiClient = createApiClient();
