import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Badge } from './Badge';
import { Spacing, Typography } from '../constants/theme';
import { Sunnah } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SunnahCardProps {
  sunnah: Sunnah;
  showReward?: boolean;
  showSource?: boolean;
}

export function SunnahCard({ sunnah, showReward = true, showSource = true }: SunnahCardProps) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Badge difficulty={sunnah.difficulty} label={t(`today.difficulty.${sunnah.difficulty}`)} />
        <Badge category={sunnah.category} label={t(`category.${sunnah.category}`)} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{sunnah.title}</Text>
      
      <Text style={[styles.description, { color: colors.textSecondary }]}>{sunnah.description}</Text>

      {showReward && (
        <View style={[styles.rewardContainer, { backgroundColor: colors.primaryLight + '40' }]}>
          <Text style={[styles.rewardLabel, { color: colors.textPrimary }]}>
            {t('sunnah.reward')}:
          </Text>
          <Text style={[styles.reward, { color: colors.textSecondary }]}>{sunnah.reward}</Text>
        </View>
      )}

      {showSource && (
        <Text style={[styles.source, { color: colors.textTertiary }]}>
          {t('sunnah.source')}: {sunnah.source}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    marginBottom: Spacing.md,
  },
  rewardContainer: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  rewardLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  reward: {
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontStyle: 'italic',
  },
  source: {
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
  },
});
