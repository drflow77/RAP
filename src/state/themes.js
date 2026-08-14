// Los 5 temas de color de la app. La clave se persiste en settings.theme.

export const THEMES = [
  { key: 'bosque',  label: 'Bosque',  swatch: '#7FC8A0', mode: 'Oscuro' },
  { key: 'marfil',  label: 'Marfil',  swatch: '#2E5D4B', mode: 'Claro' },
  { key: 'lavanda', label: 'Lavanda', swatch: '#584BA8', mode: 'Claro' },
  { key: 'rosa',    label: 'Rosa',    swatch: '#C4557E', mode: 'Claro' },
  { key: 'azul',    label: 'Azul',    swatch: '#63B3ED', mode: 'Oscuro' }
];

export const THEME_BG = {
  bosque: '#0A1512',
  azul: '#081426',
  marfil: '#F5F2EA',
  lavanda: '#F2F0F8',
  rosa: '#FDF2F5'
};

export const CONFETTI_PALETTES = {
  bosque: ['#7FC8A0', '#BFE6CE', '#EDF3EF', '#3E8C6A'],
  azul: ['#63B3ED', '#B6DCF7', '#EDF3FA', '#2C6C9E'],
  rosa: ['#C4557E', '#F0A8C4', '#FDF2F5', '#7E3355'],
  marfil: ['#2E5D4B', '#7FB79F', '#C9A34E', '#141A16'],
  lavanda: ['#584BA8', '#A79BE8', '#3F8C74', '#1B1630']
};

const LEGACY = { dark: 'bosque', light: 'marfil' };

// Migra los valores antiguos ('dark' | 'light') y valida la clave.
export function normalizeTheme(theme) {
  if (LEGACY[theme]) return LEGACY[theme];
  return THEMES.some((t) => t.key === theme) ? theme : 'bosque';
}

export function applyTheme(theme) {
  const key = normalizeTheme(theme);
  document.documentElement.setAttribute('data-theme', key);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_BG[key]);
  return key;
}
