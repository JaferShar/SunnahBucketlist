export const LightColors = {
  // Primary colors - Warm, Islamic/Ramadan inspired
  primary: '#D4AF37', // Gold
  primaryDark: '#B8941F',
  primaryLight: '#E8D5A3',
  
  // Secondary colors
  secondary: '#1B4D5E', // Deep blue
  secondaryDark: '#0F2E38',
  secondaryLight: '#5B8FA8',
  
  // Accent colors
  accent: '#2D8659', // Emerald green
  accentDark: '#1F5A3F',
  accentLight: '#5FB88E',
  
  // Neutral colors
  background: '#FDF9F3', // Warm beige
  surface: '#FFFFFF',
  surfaceElevated: '#FFFEF9',
  
  // Text colors
  textPrimary: '#2C2416',
  textSecondary: '#5A4E3D',
  textTertiary: '#8B7D6B',
  
  // Status colors
  success: '#2D8659',
  error: '#C84A3A',
  warning: '#D4AF37',
  info: '#5B8FA8',
  
  // Difficulty colors
  difficultyEasy: '#5FB88E',
  difficultyMedium: '#D4AF37',
  difficultyHard: '#C84A3A',
  
  // Category colors
  categoryWorship: '#1B4D5E',
  categoryCharacter: '#2D8659',
  categorySocial: '#5B8FA8',
  categoryDaily: '#D4AF37',
  
  // Calendar colors
  calendarCompleted: '#2D8659',
  calendarIncomplete: '#E8D5A3',
  calendarToday: '#D4AF37',
  
  // Borders and dividers
  border: '#E8E0D4',
  divider: '#E8E0D4',
  
  // Shadows
  shadow: 'rgba(44, 36, 22, 0.1)',
  shadowDark: 'rgba(44, 36, 22, 0.2)',
};

export const DarkColors = {
  // Primary colors - Adjusted for dark mode with soft purple theme
  primary: '#B794F6', // Soft purple
  primaryDark: '#9B7DD9',
  primaryLight: '#D4B8FF',
  
  // Secondary colors - Deep purple tones
  secondary: '#8B7FC8', // Muted purple-blue
  secondaryDark: '#6B5FA8',
  secondaryLight: '#A89FD4',
  
  // Accent colors
  accent: '#A78BFA', // Soft purple accent
  accentDark: '#8B6FE8',
  accentLight: '#C4A9FF',
  
  // Neutral colors - Dark purple background
  background: '#1A1625', // Very dark purple
  surface: '#252035', // Dark purple surface
  surfaceElevated: '#302A45', // Elevated dark purple
  
  // Text colors - Light for dark background
  textPrimary: '#F5F0FF', // Very light purple-white
  textSecondary: '#D4C9E8', // Light purple-gray
  textTertiary: '#B8A8D4', // Medium purple-gray
  
  // Status colors
  success: '#A78BFA',
  error: '#F28B82',
  warning: '#F4D03F',
  info: '#9BB5FF',
  
  // Difficulty colors – Dark mode (warm, Islamic, easy on the eyes)
  difficultyEasy: '#5FAF8A',    // Muted emerald green (dark-mode friendly)
  difficultyMedium: '#B89A5A',  // Soft dark gold (no purple, warm & calm)
  difficultyHard: '#B46A6A',    // Muted deep rose / brick red
  
  // Category colors
  categoryWorship: '#8B7FC8',
  categoryCharacter: '#A78BFA',
  categorySocial: '#9BB5FF',
  categoryDaily: '#B794F6',
  
  // Calendar colors
  calendarCompleted: '#A78BFA',
  calendarIncomplete: '#302A45',
  calendarToday: '#B794F6',
  
  // Borders and dividers
  border: '#3A3455',
  divider: '#3A3455',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.4)',
  shadowDark: 'rgba(0, 0, 0, 0.6)',
};

// Export LightColors as Colors for backward compatibility
export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const getShadows = (isDark: boolean) => ({
  sm: {
    shadowColor: isDark ? '#000' : 'rgba(44, 36, 22, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.5 : 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: isDark ? '#000' : 'rgba(44, 36, 22, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.6 : 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: isDark ? '#000' : 'rgba(44, 36, 22, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.7 : 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
});

export const MotivatingMessages = {
  en: [
    'بارك الله فيك - May Allah bless you',
    'جعل الله عملك في ميزان حسناتك - May Allah put this in your scale of good deeds',
    'ماشاء الله - As Allah has willed',
    'اللهم بارك - O Allah, bless',
    'جعله الله خالصاً لوجهه الكريم - May Allah make it purely for His Noble Face',
  ],
  de: [
    'بارك الله فيك - Möge Allah dich segnen',
    'جعل الله عملك في ميزان حسناتك - Möge Allah dies in deine Waagschale der guten Taten legen',
    'ماشاء الله - Wie Allah es gewollt hat',
    'اللهم بارك - O Allah, segne',
    'جعله الله خالصاً لوجهه الكريم - Möge Allah es rein für Sein edles Antlitz machen',
  ],
};

export const WisdomQuotes = {
  en: [
    'The best of people are those who are most beneficial to others.',
    'Whoever does not show mercy will not be shown mercy.',
    'The most beloved of deeds to Allah are those that are most consistent, even if they are small.',
    'The best provision is piety, and the best companion is a good character.',
    'Do not belittle any good deed, even meeting your brother with a cheerful face.',
    'The best of you are those who have the best character.',
    'A good word is charity.',
    'The believer is not one who eats his fill while his neighbor goes hungry.',
  ],
  de: [
    'Die Besten unter den Menschen sind die, die anderen am nützlichsten sind.',
    'Wer keine Barmherzigkeit zeigt, dem wird keine Barmherzigkeit gezeigt.',
    'Die Allah am liebsten Taten sind die, die am beständigsten sind, auch wenn sie klein sind.',
    'Die beste Versorgung ist Frömmigkeit, und der beste Begleiter ist ein guter Charakter.',
    'Unterschätze keine gute Tat, selbst wenn du deinen Bruder mit fröhlichem Gesicht triffst.',
    'Die Besten unter euch sind die, die den besten Charakter haben.',
    'Ein gutes Wort ist Wohltätigkeit.',
    'Der Gläubige ist nicht einer, der sich satt isst, während sein Nachbar hungrig ist.',
  ],
};
