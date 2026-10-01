import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

const clientRoot = fileURLToPath(new URL('.', import.meta.url));

/**
 * Алиас @kubiki/core указывает на ИСХОДНИКИ пакета, а не на dist:
 * мгновенный HMR при правке контрактов и честные source maps.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, clientRoot, '');
  const apiProxyTarget = env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@kubiki/core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: apiProxyTarget, changeOrigin: true },
      },
    },
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/test/setup.ts'],
    },
  };
});
