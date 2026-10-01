/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Базовый URL сервера; пусто — тот же origin (dev-прокси Vite). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
