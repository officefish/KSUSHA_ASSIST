import { useState, type FormEvent } from 'react';
import { CUBE_COLORS, CreateCubeInputSchema, type CreateCubeInput } from '@kubiki/core';

const COLOR_LABELS: Record<(typeof CUBE_COLORS)[number], string> = {
  red: 'Красный',
  green: 'Зелёный',
  blue: 'Синий',
  yellow: 'Жёлтый',
};

interface CubeFormProps {
  onSubmit: (input: CreateCubeInput) => Promise<void>;
  disabled?: boolean;
}

export function CubeForm({ onSubmit, disabled = false }: CubeFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState<CreateCubeInput['color']>('red');
  const [size, setSize] = useState(3);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = CreateCubeInputSchema.safeParse({ name, color, size });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Проверьте поля формы');
      return;
    }
    setError(null);
    await onSubmit(parsed.data);
    setName('');
  }

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 shadow">
      <div className="card-body gap-3">
        <h2 className="card-title">Новый кубик</h2>

        <label className="form-control">
          <span className="label-text">Имя</span>
          <input
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Красный"
            maxLength={64}
            disabled={disabled}
          />
        </label>

        <label className="form-control">
          <span className="label-text">Цвет</span>
          <select
            className="select select-bordered"
            value={color}
            onChange={(e) => setColor(e.target.value as CreateCubeInput['color'])}
            disabled={disabled}
          >
            {CUBE_COLORS.map((value) => (
              <option key={value} value={value}>
                {COLOR_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text">Размер: {size}</span>
          <input
            type="range"
            className="range range-sm"
            min={1}
            max={10}
            step={1}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            disabled={disabled}
          />
        </label>

        {error && <p className="text-error text-sm">{error}</p>}

        <div className="card-actions justify-end">
          <button type="submit" className="btn btn-primary" disabled={disabled}>
            Добавить
          </button>
        </div>
      </div>
    </form>
  );
}
