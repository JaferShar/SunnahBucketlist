import { Sunnah, Difficulty } from '../types';
import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storageKeys';
import { getSampleSunnahs } from '../data/sunnahs';
import { SettingsService } from './settings.service';
import { Language } from '../types/settings';

export class SunnahService {
  private static sunnahs: Sunnah[] = [];
  private static currentLanguage: Language | null = null;

  static async initialize(): Promise<void> {
    const settings = await SettingsService.getSettings();
    const stored = await StorageService.getItem<Sunnah[]>(StorageKeys.SUNNAHS);
    
    // Check if we need to reload based on language change
    if (stored && stored.length > 0 && this.currentLanguage === settings.language) {
      this.sunnahs = stored;
      return;
    }

    // If language changed or no data exists, initialize with sample data for current language
    this.currentLanguage = settings.language;
    this.sunnahs = [...getSampleSunnahs(settings.language)];
    await StorageService.setItem(StorageKeys.SUNNAHS, this.sunnahs);
  }

  static async reloadForLanguage(language: Language): Promise<void> {
    this.currentLanguage = language;
    this.sunnahs = [...getSampleSunnahs(language)];
    await StorageService.setItem(StorageKeys.SUNNAHS, this.sunnahs);
  }

  static async getAllSunnahs(): Promise<Sunnah[]> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    return [...this.sunnahs];
  }

  static async addSunnah(sunnah: Sunnah): Promise<boolean> {
    this.sunnahs.push(sunnah);
    return await StorageService.setItem(StorageKeys.SUNNAHS, this.sunnahs);
  }

  static async getSunnahById(id: string): Promise<Sunnah | null> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    return this.sunnahs.find(s => s.id === id) || null;
  }

  static async getSunnahsByDifficulty(difficulty: Difficulty): Promise<Sunnah[]> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    return this.sunnahs.filter(s => s.difficulty === difficulty);
  }

  static async getSunnahsByCategory(category: string): Promise<Sunnah[]> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    return this.sunnahs.filter(s => s.category === category);
  }

  static async searchSunnahs(query: string): Promise<Sunnah[]> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    const lowerQuery = query.toLowerCase();
    return this.sunnahs.filter(
      s =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.category.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get daily sunnah deterministically based on date and difficulty
   * Uses a simple hash function to ensure same date + difficulty = same sunnah
   */
  static async getDailySunnah(date: string, difficulty: Difficulty): Promise<Sunnah | null> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    
    const filtered = this.sunnahs.filter(s => s.difficulty === difficulty);
    if (filtered.length === 0) {
      return null;
    }

    // Create a deterministic seed from date string
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      const char = date.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % filtered.length;
    return filtered[index];
  }

  static async getSunnahsCount(): Promise<number> {
    if (this.sunnahs.length === 0) {
      await this.initialize();
    }
    return this.sunnahs.length;
  }
}
