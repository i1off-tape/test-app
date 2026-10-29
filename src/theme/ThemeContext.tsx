import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { getNextTheme, getThemeColors, Theme, ThemeColors } from './theme';

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: getThemeColors('light'),
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => getNextTheme(prev));
  }, []);

  const colors = getThemeColors(theme);

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
