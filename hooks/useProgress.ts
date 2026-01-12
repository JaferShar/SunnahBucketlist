import { useState, useEffect, useCallback } from 'react';
import { UserProgress, Difficulty } from '../types';
import { ProgressService } from '../services/progress.service';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getProgress();
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = useCallback(() => {
    return loadProgress();
  }, []);

  return { progress, loading, refreshProgress };
}

export function useDailyDifficulty(date: string) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDifficulty();
  }, [date]);

  const loadDifficulty = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getDailyDifficulty(date);
      setDifficulty(data);
    } catch (error) {
      console.error('Error loading daily difficulty:', error);
    } finally {
      setLoading(false);
    }
  };

  const setDailyDifficulty = async (newDifficulty: Difficulty): Promise<boolean> => {
    try {
      const success = await ProgressService.setDailyDifficulty(date, newDifficulty);
      if (success) {
        setDifficulty(newDifficulty);
      }
      return success;
    } catch (error) {
      console.error('Error setting daily difficulty:', error);
      return false;
    }
  };

  return { difficulty, loading, setDailyDifficulty };
}

export function useDailyCompletion(date: string) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletion();
  }, [date]);

  const loadCompletion = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.isCompleted(date);
      setCompleted(data);
    } catch (error) {
      console.error('Error loading completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (sunnahId: string, difficulty: Difficulty): Promise<boolean> => {
    try {
      const success = await ProgressService.markComplete(date, sunnahId, difficulty);
      if (success) {
        setCompleted(true);
      }
      return success;
    } catch (error) {
      console.error('Error marking complete:', error);
      return false;
    }
  };

  return { completed, loading, markComplete };
}

export function useCompletedSunnahs() {
  const [completedSunnahs, setCompletedSunnahs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompleted();
  }, []);

  const loadCompleted = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getCompletedSunnahs();
      setCompletedSunnahs(data);
    } catch (error) {
      console.error('Error loading completed sunnahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCompleted = useCallback(() => {
    return loadCompleted();
  }, []);

  return { completedSunnahs, loading, refreshCompleted };
}

export function useCompletionRate() {
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRate();
  }, []);

  const loadRate = async () => {
    try {
      setLoading(true);
      const data = await ProgressService.getCompletionRate();
      setRate(data);
    } catch (error) {
      console.error('Error loading completion rate:', error);
    } finally {
      setLoading(false);
    }
  };

  return { rate, loading, refreshRate: loadRate };
}

