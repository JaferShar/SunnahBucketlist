import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Spacing, Typography } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  const { colors } = useTheme();
  const iconColor = color || colors.primary;
  
  return (
    <Card style={styles.container}>
      {icon && (
        <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
      )}
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={2} ellipsizeMode="tail">{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    minWidth: 80,
    maxWidth: 150,
  },
  icon: {
    fontSize: 28,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
