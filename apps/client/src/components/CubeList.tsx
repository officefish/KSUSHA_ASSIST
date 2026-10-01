import type { Cube } from '@kubiki/core';

const COLOR_CLASSES: Record<Cube['color'], string> = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-400',
};

interface CubeListProps {
  cubes: Cube[];
  onDelete: (id: string) => Promise<void>;
}

export function CubeList({ cubes, onDelete }: CubeListProps) {
  if (cubes.length === 0) {
    return <p className="text-base-content/60">Кубиков пока нет — добавьте первый.</p>;
  }

  return (
    <ul className="flex flex-col gap-2" aria-label="Список кубиков">
      {cubes.map((cube) => (
        <li key={cube.id} className="flex items-center gap-3 rounded-box bg-base-200 p-3">
          <span
            className={`inline-block rounded ${COLOR_CLASSES[cube.color]}`}
            style={{ width: 12 + cube.size * 3, height: 12 + cube.size * 3 }}
            aria-hidden
          />
          <span className="flex-1 font-medium">{cube.name}</span>
          <span className="badge badge-ghost">размер {cube.size}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => void onDelete(cube.id)}
            aria-label={`Удалить ${cube.name}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
