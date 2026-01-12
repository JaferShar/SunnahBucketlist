import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { Difficulty } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
const DAY_SIZE = Math.floor((width - Spacing.md * 2 - Spacing.sm * 14) / 7);

interface CalendarProps {
  year: number;
  month: number;
  days: Record<string, { completed: boolean; difficulty?: Difficulty }>;
  onDayPress?: (date: string) => void;
}

export function Calendar({ year, month, days, onDayPress }: CalendarProps) {
  const { colors } = useTheme();
  const { t, language } = useLanguage();
  
  const monthNames = language === 'de' 
    ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const weekDays = language === 'de'
    ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const getDayColor = (dayData: { completed: boolean; difficulty?: Difficulty } | undefined) => {
    if (!dayData) return colors.border;
    if (dayData.completed) return colors.calendarCompleted;
    return colors.calendarIncomplete;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderDay = (day: number, index: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = days[dateStr];
    const today = isToday(day);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.day,
          {
            backgroundColor: getDayColor(dayData),
            borderWidth: today ? 2 : 0,
            borderColor: today ? colors.calendarToday : 'transparent',
          },
        ]}
        onPress={() => onDayPress?.(dateStr)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: dayData?.completed ? colors.surface : colors.textSecondary,
            },
            today && { color: colors.textPrimary, fontWeight: '700' },
          ]}
        >
          {day}
        </Text>
        {dayData?.difficulty && (
          <View
            style={[
              styles.difficultyDot,
              {
                backgroundColor:
                  dayData.difficulty === 'easy'
                    ? colors.difficultyEasy
                    : dayData.difficulty === 'medium'
                    ? colors.difficultyMedium
                    : colors.difficultyHard,
              },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <View style={styles.container}>
      <View style={styles.weekDays}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={[styles.weekDayText, { color: colors.textTertiary }]} numberOfLines={1}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {calendarDays.map((day, index) =>
          day !== null ? (
            renderDay(day, index)
          ) : (
            <View key={index} style={styles.day} />
          )
        )}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.calendarCompleted }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]} numberOfLines={1}>
            {t('calendar.legend.completed')}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.calendarIncomplete }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]} numberOfLines={1}>
            {t('calendar.legend.pending')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs / 2,
  },
  weekDay: {
    width: DAY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  weekDayText: {
    fontSize: 10,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xs / 2,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    margin: Spacing.xs / 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  difficultyDot: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
  },
});
