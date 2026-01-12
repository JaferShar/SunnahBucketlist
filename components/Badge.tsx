import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { Difficulty, Category } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface BadgeProps {
  label: string;
  variant?: 'difficulty' | 'category' | 'default' | 'success' | 'warning';
  difficulty?: Difficulty;
  category?: Category;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  label,
  variant = 'default',
  difficulty,
  category,
  style,
  textStyle,
}: BadgeProps) {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    if (difficulty) {
      switch (difficulty) {
        case 'easy':
          return colors.difficultyEasy;
        case 'medium':
          return colors.difficultyMedium;
        case 'hard':
          return colors.difficultyHard;
      }
    }
    
    if (category) {
      switch (category) {
        case 'worship':
          return colors.categoryWorship;
        case 'character':
          return colors.categoryCharacter;
        case 'social':
          return colors.categorySocial;
        case 'daily':
          return colors.categoryDaily;
      }
    }

    switch (variant) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      default:
        return colors.primaryLight;
    }
  };

  const getTextColor = () => {
    if (difficulty === 'easy' || variant === 'default') {
      return colors.textPrimary;
    }
    return colors.surface;
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
