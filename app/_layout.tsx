import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SunnahService } from '../services/sunnah.service';
import { ProgressService } from '../services/progress.service';
import { AchievementService } from '../services/achievement.service';
import { SettingsService } from '../services/settings.service';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';

function StatusBarWrapper() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

function AppContent() {
  useEffect(() => {
    // Initialize services
    SunnahService.initialize();
    ProgressService.initialize();
    AchievementService.initialize();
    SettingsService.initialize();
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <StatusBarWrapper />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
