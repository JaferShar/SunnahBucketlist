import { useState, useEffect } from 'react';
import { Achievement } from '../types';
import { AchievementService } from '../services/achievement.service';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const data = await AchievementService.checkAchievements();
      setAchievements(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  return { achievements, loading, refreshAchievements: loadAchievements };
}

