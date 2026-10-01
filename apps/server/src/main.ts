import 'dotenv/config';
import { createApp } from './app';
import { loadEnv } from './config/env';

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const app = await createApp(env);
  await app.listen({ port: env.PORT, host: env.HOST });
  // eslint-disable-next-line no-console
  console.log(`Kubiki server: http://${env.HOST}:${env.PORT}/api/health`);
}

bootstrap().catch((error: unknown) => {
  // eslint-disable-next-line no-console
  console.error('Сервер не запустился', error);
  process.exit(1);
});
