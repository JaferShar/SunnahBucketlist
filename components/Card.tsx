import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius, Spacing } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function Card({ children, style, elevated = true }: CardProps) {
  const { colors, shadows } = useTheme();
  
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        elevated && shadows.md,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
});
