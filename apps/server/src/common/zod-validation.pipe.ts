import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { ZodType, ZodTypeDef } from 'zod';

/**
 * Pipe валидации тела/параметров запроса zod-схемой из @kubiki/core.
 * При ошибке отвечает 400 с телом формата ValidationErrorSchema.
 */
export class ZodValidationPipe<TOutput, TInput = unknown> implements PipeTransform<
  unknown,
  TOutput
> {
  constructor(private readonly schema: ZodType<TOutput, ZodTypeDef, TInput>) {}

  transform(value: unknown): TOutput {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Ошибка валидации',
        issues: result.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }
    return result.data;
  }
}
