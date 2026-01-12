import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { Difficulty } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface DifficultySelectorProps {
  selected: Difficulty | null;
  onSelect: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export function DifficultySelector({ selected, onSelect, disabled = false }: DifficultySelectorProps) {
  const { colors, shadows } = useTheme();
  const { t } = useLanguage();
  
  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy', label: t('today.difficulty.easy'), color: colors.difficultyEasy },
    { value: 'medium', label: t('today.difficulty.medium'), color: colors.difficultyMedium },
    { value: 'hard', label: t('today.difficulty.hard'), color: colors.difficultyHard },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>
        {t('today.difficulty.select')}
      </Text>
      <View style={styles.options}>
        {difficulties.map(({ value, label, color }) => {
          const isSelected = selected === value;
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? color + '20' : colors.surface,
                  borderColor: isSelected ? color : colors.border,
                },
                disabled && styles.disabled,
                shadows.sm,
              ]}
              onPress={() => !disabled && onSelect(value)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? color : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  options: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: Typography.fontSize.md,
  },
  disabled: {
    opacity: 0.5,
  },
});
