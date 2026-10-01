import { useCallback, useEffect, useState } from 'react';
import type { CreateCubeInput, Cube, HealthResponse } from '@kubiki/core';
import { api, type ApiClient } from './api/client';
import { CubeForm } from './components/CubeForm';
import { CubeList } from './components/CubeList';

interface AppProps {
  client?: ApiClient;
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Неизвестная ошибка';
}

export function App({ client = api }: AppProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const [nextHealth, nextCubes] = await Promise.all([client.health(), client.listCubes()]);
      setHealth(nextHealth);
      setCubes(nextCubes);
    } catch (e) {
      setHealth(null);
      setError(describeError(e));
    }
  }, [client]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      setCubes(await client.listCubes());
    } catch (e) {
      setError(describeError(e));
    } finally {
      setBusy(false);
    }
  }

  const handleCreate = (input: CreateCubeInput) =>
    run(async () => {
      await client.createCube(input);
    });
  const handleDelete = (id: string) => run(() => client.deleteCube(id));

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kubiki</h1>
        <span className={`badge ${health ? 'badge-success' : 'badge-error'}`}>
          {health ? `сервер v${health.version}` : 'сервер недоступен'}
        </span>
      </header>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
          <button type="button" className="btn btn-sm" onClick={() => void refresh()}>
            Повторить
          </button>
        </div>
      )}

      <CubeForm onSubmit={handleCreate} disabled={busy || !health} />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Кубики ({cubes.length})</h2>
        <CubeList cubes={cubes} onDelete={handleDelete} />
      </section>
    </main>
  );
}
