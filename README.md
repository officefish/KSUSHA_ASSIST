# Kubiki

Клиент-серверное приложение на Node.js и TypeScript. Монорепозиторий на Yarn 4 workspaces и Turborepo.
Стек унаследован от [Membrana](https://github.com/officefish/Membrana).

## Структура

```
kubiki/
├── apps/
│   ├── client/   # @kubiki/client — Vite + React 18 + Tailwind CSS + daisyUI
│   └── server/   # @kubiki/server — NestJS 11 на Fastify, pino, zod
└── packages/
    └── core/     # @kubiki/core — общие контракты API (zod-схемы и типы)
```

- **Сервер** отдаёт REST API под префиксом `/api`: `GET /api/health`, `GET|POST /api/cubes`,
  `DELETE /api/cubes/:id`. Входные данные валидируются zod-схемами из `@kubiki/core`.
- **Клиент** в dev-режиме проксирует `/api` на сервер (`VITE_API_URL`, по умолчанию
  `http://localhost:3000`) и проверяет ответы теми же схемами.

## Требования

- Node.js 22.12+ (см. `.nvmrc`)
- Yarn 4 через Corepack: `corepack enable`

## Команды

```bash
yarn install          # установка зависимостей
yarn dev              # сервер (:3000) и клиент (:5173) одновременно
yarn build            # сборка всех пакетов
yarn lint             # ESLint
yarn typecheck        # проверка типов
yarn test             # Vitest
yarn format           # Prettier
yarn verify           # всё вместе, как на CI
```

Запуск одного workspace: `yarn workspace @kubiki/server dev`, `yarn workspace @kubiki/client dev`.

## Переменные окружения

Сервер читает `apps/server/.env` (образец — `apps/server/.env.example`): `PORT`, `HOST`, `LOG_LEVEL`.
Клиент — `apps/client/.env` (`VITE_API_URL`).

## Соглашения

- TypeScript `strict`, общие опции в `tsconfig.base.json`.
- ESLint (`.eslintrc.cjs`) и Prettier (`.prettierrc.json`) — единые для всех пакетов.
- Переводы строк — LF (`.gitattributes`, `.editorconfig`).
- CI (`.github/workflows/ci.yml`) гоняет формат, линт, типы, тесты и сборку на каждый push и PR в `main`.
