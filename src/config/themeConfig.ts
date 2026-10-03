export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  category: 'Light' | 'Dark Navy' | 'Stealth';
  cssClass: string;
  badgeColor: string;
  previewColors: {
    background: string;
    surface: string;
    border: string;
    accent: string;
    text: string;
  };
}

export const THEMES: ThemeDefinition[] = [
  {
    id: 'theme_white_default',
    name: 'Basic Default White',
    description: 'Crisp, clean default light theme with white background, slate borders, and high contrast text.',
    category: 'Light',
    cssClass: 'theme-white-default',
    badgeColor: '#0284c7',
    previewColors: {
      background: '#ffffff',
      surface: '#f8fafc',
      border: '#cbd5e1',
      accent: '#0284c7',
      text: '#0f172a',
    },
  },
  {
    id: 'theme_navy_dark',
    name: 'Dark Navy Blue',
    description: 'Deep cosmic dark navy blue theme with cyan neon accents, dark slate panels, and glowing metrics.',
    category: 'Dark Navy',
    cssClass: 'theme-navy-dark',
    badgeColor: '#38bdf8',
    previewColors: {
      background: '#030712',
      surface: '#0f172a',
      border: '#1e293b',
      accent: '#38bdf8',
      text: '#f8fafc',
    },
  },
  {
    id: 'theme_imperial_obsidian',
    name: 'Imperial Obsidian',
    description: 'Pure stealth jet-black dark mode with high contrast metallic zinc trim.',
    category: 'Stealth',
    cssClass: 'theme-imperial-obsidian',
    badgeColor: '#e4e4e7',
    previewColors: {
      background: '#000000',
      surface: '#18181b',
      border: '#27272a',
      accent: '#e4e4e7',
      text: '#f4f4f5',
    },
  },
];

export const STORAGE_KEY_THEME = 'uc_active_app_theme';

export function getActiveThemeId(): string {
  if (typeof window === 'undefined') return 'theme_white_default';
  return localStorage.getItem(STORAGE_KEY_THEME) || 'theme_white_default';
}

export function setActiveThemeId(themeId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_THEME, themeId);
  applyThemeToDOM(themeId);
}

export function applyThemeToDOM(themeId: string): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  THEMES.forEach((t) => root.classList.remove(t.cssClass));
  const active = THEMES.find((t) => t.id === themeId) || THEMES[0];
  root.classList.add(active.cssClass);
}
