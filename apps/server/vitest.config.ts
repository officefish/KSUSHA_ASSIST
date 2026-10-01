import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    // esbuild не умеет emitDecoratorMetadata, поэтому зависимости в контроллерах
    // объявлены явно через @Inject(...) — см. src/cubes/cubes.controller.ts.
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    pool: 'forks',
  },
});
