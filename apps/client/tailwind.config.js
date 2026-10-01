import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind сканирует и исходники пакетов монорепо, чьи компоненты импортирует клиент.
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/core/src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'],
    logs: false,
  },
};
