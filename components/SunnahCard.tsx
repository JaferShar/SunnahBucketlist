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
  showSource?: boolean;
  isCompleted?: boolean;
}

export function SunnahCard({ sunnah, showSource = true, isCompleted = false }: SunnahCardProps) {
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

      {showSource && (
        <View style={[styles.sourceContainer, { backgroundColor: colors.primaryLight + '40' }]}>
          <Text style={[styles.sourceLabel, { color: colors.textPrimary }]}>
            {t('sunnah.source')}:
          </Text>
          <Text style={[styles.source, { color: colors.textSecondary }]}>{sunnah.source}</Text>
        </View>
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
  sourceContainer: {
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  sourceLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  source: {
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontStyle: 'italic',
  },
});
