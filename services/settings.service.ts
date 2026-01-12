import { Settings, Language, Theme } from '../types/settings';
import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storageKeys';

const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  theme: 'light',
};

export class SettingsService {
  private static settings: Settings | null = null;

  static async initialize(): Promise<Settings> {
    const stored = await StorageService.getItem<Settings>(StorageKeys.SETTINGS);
    
    if (stored) {
      this.settings = stored;
      return stored;
    }

    this.settings = DEFAULT_SETTINGS;
    await StorageService.setItem(StorageKeys.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  static async getSettings(): Promise<Settings> {
    if (!this.settings) {
      return await this.initialize();
    }
    return this.settings;
  }

  static async setLanguage(language: Language): Promise<boolean> {
    if (!this.settings) {
      await this.initialize();
    }
    
    if (!this.settings) return false;
    
    this.settings.language = language;
    return await StorageService.setItem(StorageKeys.SETTINGS, this.settings);
  }

  static async setTheme(theme: Theme): Promise<boolean> {
    if (!this.settings) {
      await this.initialize();
    }
    
    if (!this.settings) return false;
    
    this.settings.theme = theme;
    return await StorageService.setItem(StorageKeys.SETTINGS, this.settings);
  }

  static async updateSettings(settings: Partial<Settings>): Promise<boolean> {
    if (!this.settings) {
      await this.initialize();
    }
    
    if (!this.settings) return false;
    
    this.settings = { ...this.settings, ...settings };
    return await StorageService.setItem(StorageKeys.SETTINGS, this.settings);
  }
}

