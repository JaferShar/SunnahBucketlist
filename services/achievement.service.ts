import { Achievement } from '../types';
import { StorageService } from './storage.service';
import { StorageKeys } from '../constants/storageKeys';
import { ProgressService } from './progress.service';

const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedDate'>[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first Sunnah practice',
    icon: '🌟',
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete 7 days in a row',
    icon: '💪',
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Complete 30 days in a row',
    icon: '👑',
  },
  {
    id: 'century',
    title: 'Century',
    description: 'Complete 100 Sunnah practices',
    icon: '💯',
  },
  {
    id: 'easy-rider',
    title: 'Easy Rider',
    description: 'Complete 10 Easy practices',
    icon: '😊',
  },
  {
    id: 'medium-master',
    title: 'Medium Master',
    description: 'Complete 10 Medium practices',
    icon: '🎯',
  },
  {
    id: 'hard-hero',
    title: 'Hard Hero',
    description: 'Complete 10 Hard practices',
    icon: '🔥',
  },
  {
    id: 'balanced',
    title: 'Balanced',
    description: 'Complete at least 5 practices in each difficulty',
    icon: '⚖️',
  },
];

export class AchievementService {
  private static achievements: Achievement[] = [];

  static async initialize(): Promise<Achievement[]> {
    const stored = await StorageService.getItem<Achievement[]>(StorageKeys.ACHIEVEMENTS);
    
    if (stored && stored.length > 0) {
      this.achievements = stored;
    } else {
      // Initialize with all achievements locked
      this.achievements = ACHIEVEMENTS.map(ach => ({
        ...ach,
        unlocked: false,
      }));
      await StorageService.setItem(StorageKeys.ACHIEVEMENTS, this.achievements);
    }

    // Check and update achievements
    await this.checkAchievements();

    return this.achievements;
  }

  static async getAllAchievements(): Promise<Achievement[]> {
    if (this.achievements.length === 0) {
      await this.initialize();
    }
    return [...this.achievements];
  }

  static async checkAchievements(): Promise<Achievement[]> {
    if (this.achievements.length === 0) {
      await this.initialize();
    }

    const progress = await ProgressService.getProgress();
    const today = new Date();
    const todayStr = ProgressService.formatDate(today);

    let updated = false;

    // Check each achievement
    for (const achievement of this.achievements) {
      if (achievement.unlocked) continue; // Already unlocked

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first-step':
          shouldUnlock = progress.totalCompletions >= 1;
          break;
        case 'week-warrior':
          shouldUnlock = progress.currentStreak >= 7;
          break;
        case 'month-master':
          shouldUnlock = progress.currentStreak >= 30;
          break;
        case 'century':
          shouldUnlock = progress.totalCompletions >= 100;
          break;
        case 'easy-rider':
          shouldUnlock = progress.difficultyStats.easy >= 10;
          break;
        case 'medium-master':
          shouldUnlock = progress.difficultyStats.medium >= 10;
          break;
        case 'hard-hero':
          shouldUnlock = progress.difficultyStats.hard >= 10;
          break;
        case 'balanced':
          shouldUnlock =
            progress.difficultyStats.easy >= 5 &&
            progress.difficultyStats.medium >= 5 &&
            progress.difficultyStats.hard >= 5;
          break;
      }

      if (shouldUnlock) {
        achievement.unlocked = true;
        achievement.unlockedDate = todayStr;
        updated = true;
      }
    }

    if (updated) {
      await StorageService.setItem(StorageKeys.ACHIEVEMENTS, this.achievements);
    }

    return this.achievements;
  }

  static async getUnlockedAchievements(): Promise<Achievement[]> {
    const all = await this.getAllAchievements();
    return all.filter(a => a.unlocked);
  }
}

