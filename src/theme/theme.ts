export type Theme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  tabBackground: string;
  activeTabBackground: string;
  buttonBackground: string;
  buttonBorder: string;
  divider: string;
  badgeBackground: {
    finished: string;
    scheduled: string;
    live: string;
    postponed: string;
  };
  badgeText: {
    finished: string;
    scheduled: string;
    live: string;
    postponed: string;
  };
};

export const LIGHT_COLORS: ThemeColors = {
  background: '#f9fafb',
  card: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  tabBackground: '#f3f4f6',
  activeTabBackground: '#ffffff',
  buttonBackground: '#ffffff',
  buttonBorder: '#d1d5db',
  divider: '#f3f4f6',
  badgeBackground: {
    finished: '#f3f4f6',
    scheduled: '#eff6ff',
    live: '#fef2f2',
    postponed: '#fffbeb',
  },
  badgeText: {
    finished: '#4b5563',
    scheduled: '#1d4ed8',
    live: '#dc2626',
    postponed: '#b45309',
  },
};

export const DARK_COLORS: ThemeColors = {
  background: '#111827',
  card: '#1f2937',
  border: '#374151',
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  tabBackground: '#374151',
  activeTabBackground: '#1f2937',
  buttonBackground: '#1f2937',
  buttonBorder: '#4b5563',
  divider: '#374151',
  badgeBackground: {
    finished: '#374151',
    scheduled: '#1e3a8a',
    live: '#7f1d1d',
    postponed: '#78350f',
  },
  badgeText: {
    finished: '#9ca3af',
    scheduled: '#93c5fd',
    live: '#fca5a5',
    postponed: '#fcd34d',
  },
};

export function getNextTheme(current: Theme): Theme {
  return current === 'light' ? 'dark' : 'light';
}

export function getThemeColors(theme: Theme): ThemeColors {
  return theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}
