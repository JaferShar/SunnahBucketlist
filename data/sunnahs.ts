import { Sunnah } from '../types';
import { Language } from '../types/settings';

// Sample Sunnah data - multilingual template for the library
const sampleSunnahsData: Record<Language, Sunnah[]> = {
  en: [
    {
      id: 'sunnah-001',
      title: 'Saying Bismillah Before Eating',
      description: 'Before you begin your meal, say "Bismillah" (In the name of Allah) aloud or silently. This simple act of remembrance brings barakah (blessing) to your food and aligns your intention with gratitude to Allah.',
      category: 'daily',
      difficulty: 'easy',
      source: 'This practice brings barakah to your meal and reminds you of Allah\'s blessings. The Prophet (ﷺ) said that mentioning Allah\'s name before eating makes the food blessed. - Sahih Bukhari, Sahih Muslim',
    },
  ],
  de: [
    {
      id: 'sunnah-001',
      title: 'Bismillah vor dem Essen sagen',
      description: 'Bevor du mit deiner Mahlzeit beginnst, sage "Bismillah" (Im Namen Allahs) laut oder leise. Diese einfache Erinnerung bringt Barakah (Segen) zu deinem Essen und richtet deine Absicht auf Dankbarkeit zu Allah aus.',
      category: 'daily',
      difficulty: 'easy',
      source: 'Diese Praxis bringt Barakah zu deiner Mahlzeit und erinnert dich an Allahs Segnungen. Der Prophet (ﷺ) sagte, dass das Erwähnen von Allahs Namen vor dem Essen das Essen gesegnet macht. - Sahih Bukhari, Sahih Muslim',
    },
  ],
};

export function getSampleSunnahs(language: Language = 'en'): Sunnah[] {
  return sampleSunnahsData[language] || sampleSunnahsData.en;
}

// For backward compatibility
export const sampleSunnahs = sampleSunnahsData.en;
