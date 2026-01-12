import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { ProgressService } from '../../services/progress.service';
import { useProgress } from '../../hooks/useProgress';
import { Calendar } from '../../components/Calendar';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { WisdomQuotes } from '../../constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CalendarScreen() {
  const { colors, shadows } = useTheme();
  const { t, language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Record<string, { completed: boolean; difficulty?: any }>>({});
  const { progress, refreshProgress } = useProgress();
  const [refreshing, setRefreshing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadCalendarDays();
  }, [year, month]);

  const loadCalendarDays = async () => {
    const days = await ProgressService.getCalendarDays(year, month);
    setCalendarDays(days);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProgress();
    await loadCalendarDays();
    setRefreshing(false);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const monthStats = () => {
    const completed = Object.values(calendarDays).filter(d => d.completed).length;
    const total = Object.keys(calendarDays).length;
    const easy = Object.values(calendarDays).filter(d => d.difficulty === 'easy').length;
    const medium = Object.values(calendarDays).filter(d => d.difficulty === 'medium').length;
    const hard = Object.values(calendarDays).filter(d => d.difficulty === 'hard').length;

    return { completed, total, easy, medium, hard };
  };

  const stats = monthStats();
  const monthNames = language === 'de'
    ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getRandomQuote = () => {
    const quotes = WisdomQuotes[language] || WisdomQuotes.en;
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('calendar.title')}</Text>
          <View style={[styles.monthSelector, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
            <TouchableOpacity
              style={styles.monthButton}
              onPress={() => changeMonth('prev')}
              activeOpacity={0.7}
            >
              <ChevronLeft size={22} color={colors.primary} />
            </TouchableOpacity>
            
            <Text style={[styles.monthText, { color: colors.textPrimary }]} numberOfLines={1}>
              {monthNames[month]} {year}
            </Text>
            
            <TouchableOpacity
              style={styles.monthButton}
              onPress={() => changeMonth('next')}
              activeOpacity={0.7}
            >
              <ChevronRight size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Calendar
          year={year}
          month={month}
          days={calendarDays}
        />

        <Card style={[styles.statsCard, shadows.md]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('calendar.stats.title')}
          </Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.completed}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {t('calendar.stats.completed')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.total}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {t('calendar.stats.total')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {t('calendar.stats.rate')}
              </Text>
            </View>
          </View>

          <View style={styles.difficultyStats}>
            <Text style={[styles.difficultyLabel, { color: colors.textSecondary }]}>
              {t('calendar.stats.difficulty')}
            </Text>
            <View style={styles.difficultyBadges}>
              <View style={styles.difficultyBadgeItem}>
                <Badge difficulty="easy" label={t('calendar.difficulty.easy')} />
                <Text style={[styles.difficultyCount, { color: colors.textPrimary }]}>{stats.easy}</Text>
              </View>
              <View style={styles.difficultyBadgeItem}>
                <Badge difficulty="medium" label={t('calendar.difficulty.medium')} />
                <Text style={[styles.difficultyCount, { color: colors.textPrimary }]}>{stats.medium}</Text>
              </View>
              <View style={styles.difficultyBadgeItem}>
                <Badge difficulty="hard" label={t('calendar.difficulty.hard')} />
                <Text style={[styles.difficultyCount, { color: colors.textPrimary }]}>{stats.hard}</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={[styles.wisdomCard, { backgroundColor: colors.secondaryLight + '20' }, shadows.md]}>
          <Text style={[styles.wisdomTitle, { color: colors.textPrimary }]}>
            {t('calendar.wisdom.title')}
          </Text>
          <Text style={[styles.wisdomText, { color: colors.textSecondary }]}>{getRandomQuote()}</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
  },
  monthButton: {
    padding: Spacing.xs,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  statsCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 11,
  },
  difficultyStats: {
    marginTop: Spacing.md,
  },
  difficultyLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.sm,
  },
  difficultyBadges: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  difficultyBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  difficultyCount: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
  },
  wisdomCard: {
    marginTop: Spacing.md,
  },
  wisdomTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  wisdomText: {
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontStyle: 'italic',
  },
});
