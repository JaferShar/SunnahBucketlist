import { useState, useEffect } from 'react';
import { Sunnah, Difficulty, Category } from '../types';
import { SunnahService } from '../services/sunnah.service';
import { useCompletedSunnahs } from './useProgress';
import { useLanguage } from '../contexts/LanguageContext';

export function useSunnahs() {
  const [sunnahs, setSunnahs] = useState<Sunnah[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadSunnahs();
  }, [language]); // Reload when language changes

  const loadSunnahs = async () => {
    try {
      setLoading(true);
      // Reload sunnahs for the current language
      await SunnahService.reloadForLanguage(language);
      const data = await SunnahService.getAllSunnahs();
      setSunnahs(data);
    } catch (error) {
      console.error('Error loading sunnahs:', error);
    } finally {
      setLoading(false);
    }
  };

  return { sunnahs, loading, refetch: loadSunnahs };
}

export function useDailySunnah(date: string, difficulty: Difficulty | null) {
  const [sunnah, setSunnah] = useState<Sunnah | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (difficulty) {
      loadDailySunnah();
    } else {
      setSunnah(null);
      setLoading(false);
    }
  }, [date, difficulty, language]); // Reload when language changes

  const loadDailySunnah = async () => {
    if (!difficulty) return;

    try {
      setLoading(true);
      // Ensure sunnahs are loaded for current language
      await SunnahService.reloadForLanguage(language);
      const data = await SunnahService.getDailySunnah(date, difficulty);
      setSunnah(data);
    } catch (error) {
      console.error('Error loading daily sunnah:', error);
    } finally {
      setLoading(false);
    }
  };

  return { sunnah, loading };
}

export function useFilteredSunnahs(
  searchQuery: string,
  difficultyFilter: Difficulty | 'all',
  categoryFilter: Category | 'all',
  completionFilter: 'all' | 'completed' | 'incomplete'
) {
  const { sunnahs, loading } = useSunnahs();
  const [filtered, setFiltered] = useState<Sunnah[]>([]);
  const { completedSunnahs } = useCompletedSunnahs();

  useEffect(() => {
    let result = [...sunnahs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter(s => s.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(s => s.category === categoryFilter);
    }

    // Completion filter
    if (completionFilter !== 'all') {
      result = result.filter(s => {
        const isCompleted = completedSunnahs.has(s.id);
        return completionFilter === 'completed' ? isCompleted : !isCompleted;
      });
    }

    setFiltered(result);
  }, [sunnahs, searchQuery, difficultyFilter, categoryFilter, completionFilter, completedSunnahs]);

  return { sunnahs: filtered, loading };
}
