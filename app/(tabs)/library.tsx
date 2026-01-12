import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Spacing, Typography } from '../../constants/theme';
import { useFilteredSunnahs } from '../../hooks/useSunnahs';
import { useCompletedSunnahs } from '../../hooks/useProgress';
import { SunnahCard } from '../../components/SunnahCard';
import { Card } from '../../components/Card';
import { Difficulty, Category } from '../../types';
import { Search, Filter, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LibraryScreen() {
  const { colors, shadows } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { completedSunnahs, refreshCompleted } = useCompletedSunnahs();
  const { sunnahs, loading } = useFilteredSunnahs(
    searchQuery,
    difficultyFilter,
    categoryFilter,
    completionFilter
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshCompleted();
    setRefreshing(false);
  };

  const difficulties: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard'];
  const categories: (Category | 'all')[] = ['all', 'worship', 'character', 'social', 'daily'];
  const completionOptions: ('all' | 'completed' | 'incomplete')[] = ['all', 'completed', 'incomplete'];

  const completionRate = sunnahs.length > 0
    ? (sunnahs.filter(s => completedSunnahs.has(s.id)).length / sunnahs.length) * 100
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('library.title')}</Text>

        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}>
            <Search size={20} color={colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder={t('library.search.placeholder')}
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.sm]}
            onPress={() => setShowFilters(!showFilters)}
            activeOpacity={0.7}
          >
            <Filter size={20} color={showFilters ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <Card style={[styles.filtersCard, shadows.md]}>
            <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>
              {t('library.filters.title')}
            </Text>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {t('library.filters.difficulty')}
              </Text>
              <View style={styles.filterOptions}>
                {difficulties.map(diff => (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: difficultyFilter === diff ? colors.primary : colors.primaryLight + '40',
                        borderColor: difficultyFilter === diff ? colors.primary : colors.border,
                      },
                      shadows.sm,
                    ]}
                    onPress={() => setDifficultyFilter(diff)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: difficultyFilter === diff ? colors.surface : colors.textPrimary,
                          fontWeight: difficultyFilter === diff ? '700' : '600',
                        },
                      ]}
                    >
                      {diff === 'all' ? t('library.filters.all') : t(`today.difficulty.${diff}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {t('library.filters.category')}
              </Text>
              <View style={styles.filterOptions}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: categoryFilter === cat ? colors.primary : colors.primaryLight + '40',
                        borderColor: categoryFilter === cat ? colors.primary : colors.border,
                      },
                      shadows.sm,
                    ]}
                    onPress={() => setCategoryFilter(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: categoryFilter === cat ? colors.surface : colors.textPrimary,
                          fontWeight: categoryFilter === cat ? '700' : '600',
                        },
                      ]}
                    >
                      {cat === 'all' ? t('library.filters.all') : t(`category.${cat}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {t('library.filters.completion')}
              </Text>
              <View style={styles.filterOptions}>
                {completionOptions.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: completionFilter === opt ? colors.primary : colors.primaryLight + '40',
                        borderColor: completionFilter === opt ? colors.primary : colors.border,
                      },
                      shadows.sm,
                    ]}
                    onPress={() => setCompletionFilter(opt)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        {
                          color: completionFilter === opt ? colors.surface : colors.textPrimary,
                          fontWeight: completionFilter === opt ? '700' : '600',
                        },
                      ]}
                    >
                      {t(`library.filters.${opt}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>
        )}

        <Card style={[styles.statsCard, { backgroundColor: colors.primaryLight + '20' }, shadows.md]}>
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {t('library.stats.showing')} {sunnahs.length} {t('library.stats.sunnahs')}
            {completionFilter === 'all' && ` (${Math.round(completionRate)}% ${t('library.stats.completed')})`}
          </Text>
        </Card>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : sunnahs.length === 0 ? (
          <Card style={[styles.emptyCard, shadows.md]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('library.empty')}
            </Text>
          </Card>
        ) : (
          sunnahs.map(sunnah => (
            <View key={sunnah.id} style={styles.sunnahContainer}>
              {completedSunnahs.has(sunnah.id) && (
                <View style={[styles.completedBadge, { backgroundColor: colors.success + '20' }]}>
                  <CheckCircle2 size={20} color={colors.success} />
                  <Text style={[styles.completedBadgeText, { color: colors.success }]}>
                    {t('library.filters.completed')}
                  </Text>
                </View>
              )}
              <SunnahCard sunnah={sunnah} />
            </View>
          ))
        )}
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
  searchContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    paddingVertical: Spacing.sm,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersCard: {
    marginBottom: Spacing.md,
  },
  filterTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  filterSection: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: Typography.fontSize.sm,
  },
  statsCard: {
    marginBottom: Spacing.md,
  },
  statsText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
  },
  sunnahContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  completedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    zIndex: 10,
    gap: Spacing.xs,
  },
  completedBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    textAlign: 'center',
  },
});
