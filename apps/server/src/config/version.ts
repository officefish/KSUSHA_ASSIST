import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Версия сервера из apps/server/package.json; работает и из src (tsx), и из dist (node). */
export function readAppVersion(): string {
  try {
    const raw = readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'version' in parsed) {
      const version = (parsed as { version: unknown }).version;
      if (typeof version === 'string') return version;
    }
  } catch {
    // package.json недоступен — вернём заглушку
  }
  return '0.0.0';
}
