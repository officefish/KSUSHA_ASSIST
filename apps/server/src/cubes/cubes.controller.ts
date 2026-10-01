import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CreateCubeInputSchema, type CreateCubeInput, type Cube } from '@kubiki/core';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { CubesService } from './cubes.service';

@Controller('cubes')
export class CubesController {
  // Явный @Inject: tsx и vitest собирают через esbuild без emitDecoratorMetadata.
  constructor(@Inject(CubesService) private readonly cubes: CubesService) {}

  @Get()
  list(): Cube[] {
    return this.cubes.list();
  }

  @Get(':id')
  get(@Param('id') id: string): Cube {
    const cube = this.cubes.get(id);
    if (!cube) {
      throw new NotFoundException(`Кубик ${id} не найден`);
    }
    return cube;
  }

  @Post()
  @HttpCode(201)
  create(@Body(new ZodValidationPipe(CreateCubeInputSchema)) input: CreateCubeInput): Cube {
    return this.cubes.create(input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    if (!this.cubes.remove(id)) {
      throw new NotFoundException(`Кубик ${id} не найден`);
    }
  }
}
