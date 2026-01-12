import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LightColors, DarkColors, getShadows } from '../constants/theme';
import { SettingsService } from '../services/settings.service';
import { Theme } from '../types/settings';

interface ThemeContextType {
  theme: Theme;
  colors: typeof LightColors;
  shadows: ReturnType<typeof getShadows>;
  setTheme: (theme: Theme) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [colors, setColors] = useState(LightColors);
  const isDark = theme === 'dark';

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    setColors(isDark ? DarkColors : LightColors);
  }, [isDark]);

  const loadTheme = async () => {
    const settings = await SettingsService.getSettings();
    setThemeState(settings.theme);
  };

  const setTheme = async (newTheme: Theme) => {
    await SettingsService.setTheme(newTheme);
    setThemeState(newTheme);
  };

  const shadows = getShadows(isDark);

  return (
    <ThemeContext.Provider value={{ theme, colors, shadows, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

