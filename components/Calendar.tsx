import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Spacing, Typography, BorderRadius } from '../constants/theme';
import { Difficulty } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');
// Calculate day size to fit 6 rows (42 days total: 7 columns x 6 rows)
// Account for parent container padding (Spacing.md on each side from calendar.tsx)
// and spacing between days
const PARENT_PADDING = Spacing.md * 2; // Parent container padding in calendar.tsx
const DAY_MARGIN = Spacing.xs / 2;
const TOTAL_DAY_MARGINS = DAY_MARGIN * 14; // 7 days * 2 margins per day
const AVAILABLE_WIDTH = width - PARENT_PADDING;
const DAY_SIZE = Math.floor((AVAILABLE_WIDTH - TOTAL_DAY_MARGINS) / 7);

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

  // Calculate days from previous month
  const previousMonth = month === 0 ? 11 : month - 1;
  const previousMonthYear = month === 0 ? year - 1 : year;
  const previousMonthLastDay = new Date(previousMonthYear, previousMonth + 1, 0);
  const daysInPreviousMonth = previousMonthLastDay.getDate();
  
  // Calculate days from next month needed to fill 6 rows (42 days total)
  const totalCells = 42; // 7 columns x 6 rows
  const currentMonthCells = startingDayOfWeek + daysInMonth;
  const nextMonthDaysNeeded = Math.max(0, totalCells - currentMonthCells);

  const getDayColor = (dayData: { completed: boolean; difficulty?: Difficulty } | undefined, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return colors.border;
    if (!dayData) return colors.border;
    if (dayData.completed) return colors.calendarCompleted;
    return colors.calendarIncomplete;
  };

  const isToday = (day: number, isCurrentMonth: boolean, checkMonth: number, checkYear: number) => {
    if (!isCurrentMonth) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      checkMonth === today.getMonth() &&
      checkYear === today.getFullYear()
    );
  };

  const renderDay = (day: number, index: number, isCurrentMonth: boolean, checkMonth: number, checkYear: number) => {
    const date = new Date(checkYear, checkMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = isCurrentMonth ? days[dateStr] : undefined;
    const today = isToday(day, isCurrentMonth, checkMonth, checkYear);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.day,
          {
            backgroundColor: getDayColor(dayData, isCurrentMonth),
            borderWidth: today ? 2 : 0,
            borderColor: today ? colors.calendarToday : 'transparent',
            opacity: isCurrentMonth ? 1 : 0.4,
          },
        ]}
        onPress={() => isCurrentMonth && onDayPress?.(dateStr)}
        disabled={!isCurrentMonth}
        activeOpacity={isCurrentMonth ? 0.7 : 1}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: isCurrentMonth 
                ? (dayData?.completed ? colors.surface : colors.textSecondary)
                : colors.textTertiary,
            },
            today && isCurrentMonth && { color: colors.textPrimary, fontWeight: '700' },
          ]}
        >
          {day}
        </Text>
        {isCurrentMonth && dayData?.difficulty && (
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

  const calendarDays: { day: number; isCurrentMonth: boolean; month: number; year: number }[] = [];
  
  // Add days from previous month
  const daysFromPreviousMonth = startingDayOfWeek;
  for (let i = daysFromPreviousMonth - 1; i >= 0; i--) {
    const day = daysInPreviousMonth - i;
    calendarDays.push({
      day,
      isCurrentMonth: false,
      month: previousMonth,
      year: previousMonthYear,
    });
  }
  
  // Add all days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      month,
      year,
    });
  }
  
  // Add days from next month to fill 6 rows
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  for (let day = 1; day <= nextMonthDaysNeeded; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      month: nextMonth,
      year: nextMonthYear,
    });
  }

  // Calculate the exact width needed for the calendar grid
  const gridWidth = DAY_SIZE * 7 + TOTAL_DAY_MARGINS;
  // Calculate remaining space and divide equally for centering
  const remainingSpace = AVAILABLE_WIDTH - gridWidth;
  const horizontalPadding = remainingSpace / 2;

  return (
    <View style={styles.container}>
      <View style={[styles.weekDays, { paddingHorizontal: horizontalPadding }]}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={[styles.weekDayText, { color: colors.textTertiary }]} numberOfLines={1}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.daysContainer, { paddingHorizontal: horizontalPadding }]}>
        {calendarDays.map((calendarDay, index) =>
          renderDay(calendarDay.day, index, calendarDay.isCurrentMonth, calendarDay.month, calendarDay.year)
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
            {t('calendar.legend.incomplete')}
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
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    margin: DAY_MARGIN,
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
