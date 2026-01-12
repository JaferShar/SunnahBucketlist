export type Difficulty = 'easy' | 'medium' | 'hard';
export type Category = 'worship' | 'character' | 'social' | 'daily';

export interface Sunnah {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  source: string;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  difficultyStats: {
    easy: number;
    medium: number;
    hard: number;
  };
  completions: Record<string, boolean>; // date string -> completed
  dailyDifficulty: Record<string, Difficulty>; // date string -> difficulty
  completedSunnahs: Set<string>; // Set of Sunnah IDs
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface CalendarDay {
  date: string;
  completed: boolean;
  difficulty?: Difficulty;
}
