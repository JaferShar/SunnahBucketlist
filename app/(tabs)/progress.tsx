import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { useProgress } from '../../hooks/useProgress';
import { useAchievements } from '../../hooks/useAchievements';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ProgressScreen() {
  const { colors, shadows } = useTheme();
  const { t, language } = useLanguage();
  const { progress, loading, refreshProgress } = useProgress();
  const { achievements, loading: achievementsLoading, refreshAchievements } = useAchievements();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    refreshAchievements();
  }, [progress]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProgress();
    await refreshAchievements();
    setRefreshing(false);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('progress.title')}</Text>

        {progress && (
          <>
            <View style={styles.statsRow}>
              <StatCard
                label={t('progress.streak.current')}
                value={progress.currentStreak}
                icon="🔥"
                color={colors.primary}
              />
              <StatCard
                label={t('progress.streak.longest')}
                value={progress.longestStreak}
                icon="👑"
                color={colors.secondary}
              />
            </View>

            <View style={styles.statsRow}>
              <StatCard
                label={t('progress.completions.total')}
                value={progress.totalCompletions}
                icon="✓"
                color={colors.accent}
              />
              <StatCard
                label={t('progress.completions.rate')}
                value={`${Math.round((progress.totalCompletions / Math.max(1, Object.keys(progress.completions).length)) * 100)}%`}
                icon="📊"
                color={colors.info}
              />
            </View>

            <Card style={[styles.difficultyCard, shadows.md]}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {t('progress.difficulty.breakdown')}
              </Text>
              <View style={styles.difficultyRow}>
                <View style={styles.difficultyItem}>
                  <Badge difficulty="easy" label={t('progress.difficulty.easy')} />
                  <Text style={[styles.difficultyValue, { color: colors.textPrimary }]}>
                    {progress.difficultyStats.easy}
                  </Text>
                </View>
                <View style={styles.difficultyItem}>
                  <Badge difficulty="medium" label={t('progress.difficulty.medium')} />
                  <Text style={[styles.difficultyValue, { color: colors.textPrimary }]}>
                    {progress.difficultyStats.medium}
                  </Text>
                </View>
                <View style={styles.difficultyItem}>
                  <Badge difficulty="hard" label={t('progress.difficulty.hard')} />
                  <Text style={[styles.difficultyValue, { color: colors.textPrimary }]}>
                    {progress.difficultyStats.hard}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        <Card style={[styles.achievementsCard, shadows.md]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('progress.achievements.title')}
          </Text>
          <Text style={[styles.achievementsSubtitle, { color: colors.textSecondary }]}>
            {unlockedAchievements.length} {t('progress.achievements.of')} {achievements.length} {t('progress.achievements.unlocked')}
          </Text>

          {unlockedAchievements.length > 0 && (
            <View style={styles.achievementsSection}>
              <Text style={[styles.achievementsSectionTitle, { color: colors.textPrimary }]}>
                {t('progress.achievements.unlocked.title')}
              </Text>
              {unlockedAchievements.map(achievement => (
                <View key={achievement.id} style={[styles.achievementItem, { backgroundColor: colors.primaryLight + '20' }]}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
                      {achievement.description}
                    </Text>
                    {achievement.unlockedDate && (
                      <Text style={[styles.achievementDate, { color: colors.textTertiary }]}>
                        {t('progress.achievements.unlocked')}: {new Date(achievement.unlockedDate).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US')}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {lockedAchievements.length > 0 && (
            <View style={styles.achievementsSection}>
              <Text style={[styles.achievementsSectionTitle, { color: colors.textPrimary }]}>
                {t('progress.achievements.locked')}
              </Text>
              {lockedAchievements.map(achievement => (
                <View key={achievement.id} style={[styles.achievementItem, styles.achievementItemLocked, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.achievementIcon, styles.achievementIconLocked]}>
                    {achievement.icon}
                  </Text>
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementTitle, styles.achievementTitleLocked, { color: colors.textTertiary }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, styles.achievementDescriptionLocked, { color: colors.textTertiary }]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  difficultyCard: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  difficultyItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  difficultyValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
  },
  achievementsCard: {
    marginBottom: Spacing.md,
  },
  achievementsSubtitle: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.lg,
  },
  achievementsSection: {
    marginBottom: Spacing.lg,
  },
  achievementsSectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  achievementItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  achievementItemLocked: {
    borderWidth: 1,
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  achievementTitleLocked: {
    fontStyle: 'italic',
  },
  achievementDescription: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  achievementDescriptionLocked: {
    fontStyle: 'italic',
  },
  achievementDate: {
    fontSize: Typography.fontSize.xs,
    fontStyle: 'italic',
  },
});
