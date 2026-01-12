import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../../components/Card';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { Language, Theme } from '../../types/settings';
import { Settings as SettingsIcon, Moon, Sun, Globe, RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { ProgressService } from '../../services/progress.service';

export default function SettingsScreen() {
  const { theme, colors, shadows, setTheme } = useTheme();
  const { language, t, setLanguage } = useLanguage();

  const handleThemeChange = async (newTheme: Theme) => {
    if (newTheme !== theme) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setTheme(newTheme);
    }
  };

  const handleLanguageChange = async (newLanguage: Language) => {
    if (newLanguage !== language) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setLanguage(newLanguage);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      t('settings.debug.reset'),
      t('settings.debug.reset.confirm'),
      [
        {
          text: t('settings.debug.reset.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.debug.reset.reset'),
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await ProgressService.resetProgress();
            Alert.alert(t('settings.debug.reset.success.title'), t('settings.debug.reset.success'));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('settings.title')}
        </Text>

        {/* Language Section */}
        <Card style={[styles.sectionCard, shadows.md]}>
          <View style={styles.sectionHeader}>
            <Globe size={24} color={colors.primary} />
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {t('settings.language.title')}
              </Text>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                {t('settings.language.description')}
              </Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                language === 'en' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  language === 'en' && { color: colors.primary, fontWeight: '700' },
                  { color: colors.textPrimary },
                ]}
              >
                {t('settings.language.english')}
              </Text>
              {language === 'en' && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                language === 'de' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => handleLanguageChange('de')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  language === 'de' && { color: colors.primary, fontWeight: '700' },
                  { color: colors.textPrimary },
                ]}
              >
                {t('settings.language.german')}
              </Text>
              {language === 'de' && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Theme Section */}
        <Card style={[styles.sectionCard, shadows.md]}>
          <View style={styles.sectionHeader}>
            {theme === 'dark' ? (
              <Moon size={24} color={colors.primary} />
            ) : (
              <Sun size={24} color={colors.primary} />
            )}
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {t('settings.theme.title')}
              </Text>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                {t('settings.theme.description')}
              </Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.option,
                theme === 'light' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => handleThemeChange('light')}
              activeOpacity={0.7}
            >
              <Sun size={20} color={theme === 'light' ? colors.primary : colors.textTertiary} />
              <Text
                style={[
                  styles.optionText,
                  theme === 'light' && { color: colors.primary, fontWeight: '700' },
                  { color: colors.textPrimary },
                ]}
              >
                {t('settings.theme.light')}
              </Text>
              {theme === 'light' && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                theme === 'dark' && { backgroundColor: colors.primary + '20', borderColor: colors.primary },
                { borderColor: colors.border },
              ]}
              onPress={() => handleThemeChange('dark')}
              activeOpacity={0.7}
            >
              <Moon size={20} color={theme === 'dark' ? colors.primary : colors.textTertiary} />
              <Text
                style={[
                  styles.optionText,
                  theme === 'dark' && { color: colors.primary, fontWeight: '700' },
                  { color: colors.textPrimary },
                ]}
              >
                {t('settings.theme.dark')}
              </Text>
              {theme === 'dark' && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Debug Section */}
        <Card style={[styles.sectionCard, shadows.md]}>
          <View style={styles.sectionHeader}>
            <RotateCcw size={24} color={colors.error} />
            <View style={styles.sectionHeaderText}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                {t('settings.debug.title')}
              </Text>
              <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                {t('settings.debug.description')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.debugButton,
              { backgroundColor: colors.error + '20', borderColor: colors.error },
            ]}
            onPress={handleResetProgress}
            activeOpacity={0.7}
          >
            <RotateCcw size={20} color={colors.error} />
            <Text style={[styles.debugButtonText, { color: colors.error }]}>
              {t('settings.debug.reset')}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: Typography.fontSize.sm,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  optionText: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  debugButtonText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
});

