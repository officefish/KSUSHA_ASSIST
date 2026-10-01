import { z } from 'zod';

/** Префикс всех HTTP-маршрутов сервера (без ведущего слэша). */
export const API_PREFIX = 'api';

export const CUBE_COLORS = ['red', 'green', 'blue', 'yellow'] as const;
export const CubeColorSchema = z.enum(CUBE_COLORS);
export type CubeColor = z.infer<typeof CubeColorSchema>;

export const CubeSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(64),
  color: CubeColorSchema,
  size: z.number().int().min(1).max(10),
  createdAt: z.string().datetime(),
});
export type Cube = z.infer<typeof CubeSchema>;

export const CreateCubeInputSchema = CubeSchema.pick({ name: true, color: true, size: true });
export type CreateCubeInput = z.infer<typeof CreateCubeInputSchema>;

export const CubeListSchema = z.array(CubeSchema);

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  uptimeSec: z.number().int().nonnegative(),
  version: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;

/** Тело ответа при ошибке валидации (HTTP 400). */
export const ValidationErrorSchema = z.object({
  statusCode: z.literal(400),
  message: z.string(),
  issues: z.array(
    z.object({
      path: z.array(z.union([z.string(), z.number()])),
      message: z.string(),
    }),
  ),
});
export type ValidationError = z.infer<typeof ValidationErrorSchema>;
