import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SettingsService } from '../services/settings.service';
import { Language } from '../types/settings';
import { translations } from '../constants/translations';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (language: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const settings = await SettingsService.getSettings();
    setLanguageState(settings.language);
  };

  const setLanguage = async (newLanguage: Language) => {
    await SettingsService.setLanguage(newLanguage);
    setLanguageState(newLanguage);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

