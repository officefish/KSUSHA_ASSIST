import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type { CreateCubeInput, Cube } from '@kubiki/core';

/** Хранилище кубиков в памяти процесса. Достаточно для старта; заменяется на БД без смены контроллера. */
@Injectable()
export class CubesService {
  private readonly cubes = new Map<string, Cube>();

  list(): Cube[] {
    return [...this.cubes.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  get(id: string): Cube | undefined {
    return this.cubes.get(id);
  }

  create(input: CreateCubeInput): Cube {
    const cube: Cube = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.cubes.set(cube.id, cube);
    return cube;
  }

  remove(id: string): boolean {
    return this.cubes.delete(id);
  }
}
