import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { ProgressService } from '../../services/progress.service';
import { Difficulty } from '../../types';
import { useDailySunnah } from '../../hooks/useSunnahs';
import { useDailyDifficulty, useDailyCompletion, useProgress } from '../../hooks/useProgress';
import { DifficultySelector } from '../../components/DifficultySelector';
import { SunnahCard } from '../../components/SunnahCard';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { CelebrationAnimation } from '../../components/CelebrationAnimation';
import * as Haptics from 'expo-haptics';
import { MotivatingMessages, WisdomQuotes } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function TodayScreen() {
  const today = ProgressService.formatDate(new Date());
  const { colors, shadows } = useTheme();
  const { language, t } = useLanguage();
  const { difficulty, loading: difficultyLoading, setDailyDifficulty } = useDailyDifficulty(today);
  const { completed, loading: completionLoading, markComplete } = useDailyCompletion(today);
  const { progress, refreshProgress } = useProgress();
  const [celebrating, setCelebrating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [previewDifficulty, setPreviewDifficulty] = useState<Difficulty | null>(null);
  const [lockedDifficulty, setLockedDifficulty] = useState<Difficulty | null>(difficulty);

  // Use preview difficulty if not locked, otherwise use locked difficulty
  const activeDifficulty = lockedDifficulty || previewDifficulty;
  const { sunnah, loading: sunnahLoading } = useDailySunnah(today, activeDifficulty);

  // Sync locked difficulty with stored difficulty
  useEffect(() => {
    setLockedDifficulty(difficulty);
  }, [difficulty]);

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    // Allow changing difficulty if not completed
    if (!completed) {
      // If already locked, unlock it first and set as preview
      if (lockedDifficulty) {
        setLockedDifficulty(null);
        setPreviewDifficulty(selectedDifficulty);
      } else {
        setPreviewDifficulty(selectedDifficulty);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleLockIn = async () => {
    if (previewDifficulty) {
      await setDailyDifficulty(previewDifficulty);
      setLockedDifficulty(previewDifficulty);
      setPreviewDifficulty(null);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleComplete = async () => {
    if (!sunnah || completed || !lockedDifficulty) return;

    const success = await markComplete(sunnah.id, sunnah.difficulty);
    if (success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCelebrating(true);
      await refreshProgress();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('today.greeting.morning');
    if (hour < 17) return t('today.greeting.afternoon');
    return t('today.greeting.evening');
  };

  const getDateString = () => {
    const date = new Date();
    const locale = language === 'de' ? 'de-DE' : 'en-US';
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(locale, options);
  };

  const getRandomMessage = () => {
    const messages = MotivatingMessages[language] || MotivatingMessages.en;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomQuote = () => {
    const quotes = WisdomQuotes[language] || WisdomQuotes.en;
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProgress();
    setRefreshing(false);
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
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>{getGreeting()}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{getDateString()}</Text>
        </View>

        {progress && (
          <Card style={[styles.streakCard, { backgroundColor: colors.primaryLight + '40' }, shadows.md]}>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
              {t('today.streak.current')}
            </Text>
            <Text style={[styles.streakValue, { color: colors.primary }]}>
              {progress.currentStreak} {t('today.streak.days')}
            </Text>
            <Text style={[styles.streakMessage, { color: colors.textSecondary }]}>
              {progress.currentStreak > 0
                ? `${t('today.streak.keepup')} ${getRandomMessage()}`
                : t('today.streak.start')}
            </Text>
          </Card>
        )}

        <DifficultySelector
          selected={lockedDifficulty || previewDifficulty}
          onSelect={handleDifficultySelect}
          disabled={completed}
        />

        {sunnahLoading && activeDifficulty ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : activeDifficulty && sunnah ? (
          <>
            <SunnahCard sunnah={sunnah} />
            {!lockedDifficulty && previewDifficulty && (
              <Button
                title={t('today.complete.lock')}
                onPress={handleLockIn}
                size="lg"
                style={styles.lockButton}
              />
            )}
            {lockedDifficulty && !completed && (
              <Button
                title={t('today.complete.button')}
                onPress={handleComplete}
                size="lg"
                style={styles.completeButton}
              />
            )}
            {completed && (
              <Card style={[styles.completedCard, { backgroundColor: colors.success + '20' }, shadows.md]}>
                <Text style={[styles.completedText, { color: colors.success }]}>
                  ✓ {t('today.complete.completed')}
                </Text>
                <Text style={[styles.completedMessage, { color: colors.textSecondary }]}>
                  {getRandomMessage()}
                </Text>
              </Card>
            )}
          </>
        ) : activeDifficulty && !sunnah && !sunnahLoading ? (
          <Card style={[styles.emptyCard, shadows.md]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('today.empty')}
            </Text>
          </Card>
        ) : null}

        <Card style={[styles.wisdomCard, { backgroundColor: colors.secondaryLight + '20' }, shadows.md]}>
          <Text style={[styles.wisdomTitle, { color: colors.textPrimary }]}>
            {t('today.wisdom.title')}
          </Text>
          <Text style={[styles.wisdomText, { color: colors.textSecondary }]}>
            {getRandomQuote()}
          </Text>
        </Card>
      </ScrollView>

      <CelebrationAnimation
        visible={celebrating}
        onComplete={() => setCelebrating(false)}
      />
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
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.fontSize.md,
  },
  streakCard: {
    marginBottom: Spacing.md,
  },
  streakLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  streakValue: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  streakMessage: {
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  lockButton: {
    marginTop: Spacing.md,
  },
  completeButton: {
    marginTop: Spacing.md,
  },
  completedCard: {
    marginTop: Spacing.md,
  },
  completedText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  completedMessage: {
    fontSize: Typography.fontSize.md,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    textAlign: 'center',
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
