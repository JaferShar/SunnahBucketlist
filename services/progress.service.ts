import { UserProgress, Difficulty } from '../types';
import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storageKeys';

export class ProgressService {
  private static progress: UserProgress | null = null;

  static async initialize(): Promise<UserProgress> {
    const stored = await StorageService.getItem<UserProgress>(StorageKeys.USER_PROGRESS);
    
    if (stored) {
      // Convert completedSunnahs array back to Set
      if (stored.completedSunnahs && Array.isArray(stored.completedSunnahs)) {
        stored.completedSunnahs = new Set(stored.completedSunnahs);
      } else if (!stored.completedSunnahs) {
        stored.completedSunnahs = new Set();
      }
      
      this.progress = stored;
      return stored;
    }

    // Initialize default progress
    const defaultProgress: UserProgress = {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      difficultyStats: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      completions: {},
      dailyDifficulty: {},
      completedSunnahs: new Set(),
    };

    this.progress = defaultProgress;
    await StorageService.setItem(StorageKeys.USER_PROGRESS, this.serialize(defaultProgress));
    return defaultProgress;
  }

  private static serialize(progress: UserProgress): any {
    return {
      ...progress,
      completedSunnahs: Array.from(progress.completedSunnahs),
    };
  }

  static async getProgress(): Promise<UserProgress> {
    if (!this.progress) {
      return await this.initialize();
    }
    return this.progress;
  }

  static async setDailyDifficulty(date: string, difficulty: Difficulty): Promise<boolean> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return false;
    
    this.progress.dailyDifficulty[date] = difficulty;
    return await StorageService.setItem(StorageKeys.USER_PROGRESS, this.serialize(this.progress));
  }

  static async getDailyDifficulty(date: string): Promise<Difficulty | null> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return null;
    
    return this.progress.dailyDifficulty[date] || null;
  }

  static async markComplete(date: string, sunnahId: string, difficulty: Difficulty): Promise<boolean> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return false;

    // Check if already completed today
    if (this.progress.completions[date]) {
      return true; // Already completed
    }

    // Mark as completed
    this.progress.completions[date] = true;
    this.progress.completedSunnahs.add(sunnahId);
    this.progress.totalCompletions++;
    this.progress.difficultyStats[difficulty]++;

    // Calculate streak
    const streak = this.calculateStreak();
    this.progress.currentStreak = streak;
    if (streak > this.progress.longestStreak) {
      this.progress.longestStreak = streak;
    }

    return await StorageService.setItem(StorageKeys.USER_PROGRESS, this.serialize(this.progress));
  }

  static async isCompleted(date: string): Promise<boolean> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return false;
    
    return this.progress.completions[date] || false;
  }

  static async getCompletionRate(): Promise<number> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return 0;

    const totalDays = Object.keys(this.progress.completions).length;
    const completedDays = Object.values(this.progress.completions).filter(Boolean).length;
    
    if (totalDays === 0) return 0;
    return (completedDays / totalDays) * 100;
  }

  private static calculateStreak(): number {
    if (!this.progress) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    // Count consecutive days backwards
    while (true) {
      const dateStr = this.formatDate(checkDate);
      if (this.progress.completions[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static async getCalendarDays(year: number, month: number): Promise<Record<string, { completed: boolean; difficulty?: Difficulty }>> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return {};

    const days: Record<string, { completed: boolean; difficulty?: Difficulty }> = {};
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = this.formatDate(date);
      
      days[dateStr] = {
        completed: this.progress.completions[dateStr] || false,
        difficulty: this.progress.dailyDifficulty[dateStr],
      };
    }

    return days;
  }

  static async getCompletedSunnahs(): Promise<Set<string>> {
    if (!this.progress) {
      await this.initialize();
    }
    
    if (!this.progress) return new Set();
    
    return new Set(this.progress.completedSunnahs);
  }

  // DEBUG: Reset all progress data
  static async resetProgress(): Promise<boolean> {
    const defaultProgress: UserProgress = {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      difficultyStats: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      completions: {},
      dailyDifficulty: {},
      completedSunnahs: new Set(),
    };

    this.progress = defaultProgress;
    return await StorageService.setItem(StorageKeys.USER_PROGRESS, this.serialize(defaultProgress));
  }
}
