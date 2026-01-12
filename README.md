# Sunnah Bucketlist 📿

A beautiful, production-ready React Native mobile app for tracking daily Sunnah practices. Built with Expo Router, TypeScript, and an offline-first architecture.

## ✨ Features

### 🎯 Core Functionality
- **Daily Sunnah Tracking**: Get a daily Sunnah practice based on your selected difficulty level
- **Progress Tracking**: Monitor your streaks, completion rates, and achievements
- **Calendar View**: Visual calendar showing your completion history
- **Sunnah Library**: Browse, search, and filter through all available Sunnah practices
- **Difficulty Levels**: Choose from Easy, Medium, or Hard challenges each day

### 🌍 Internationalization
- **Multi-language Support**: English and German
- **Full Translation**: All UI elements, messages, and content translated

### 🎨 Theming
- **Light Mode**: Warm, Islamic/Ramadan-inspired color palette with gold and deep blue accents
- **Dark Mode**: Soft dark purple theme that's easy on the eyes
- **Smooth Transitions**: Seamless theme switching with consistent styling

### 📊 Progress & Achievements
- **Streak Tracking**: Current and longest streak counters
- **Statistics Dashboard**: Comprehensive progress metrics
- **Achievement System**: Unlockable badges and achievements
- **Difficulty Breakdown**: Track completions by difficulty level

### 🔧 Settings
- **Language Selection**: Switch between English and German
- **Theme Toggle**: Choose between Light and Dark modes
- **Debug Tools**: Reset progress (development feature)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator / physical device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sunnah-bucketlist.git
   cd sunnah-bucketlist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` in the terminal or scan the QR code with Camera app
   - **Android**: Press `a` in the terminal or scan the QR code with Expo Go app
   - **Web**: Press `w` in the terminal (limited functionality)

## 📱 App Structure

### Tabs
- **Today**: Daily Sunnah selection, difficulty picker, completion tracking
- **Progress**: Statistics, achievements, and progress metrics
- **Calendar**: Monthly view with completion indicators
- **Library**: Browse and search all Sunnah practices
- **Settings**: Language and theme configuration

### Key Features
- **Offline-First**: All data stored locally using AsyncStorage
- **Daily Difficulty Lock**: Lock in your difficulty choice after previewing the Sunnah
- **Celebration Animations**: Visual feedback when completing tasks
- **Haptic Feedback**: Tactile responses for better UX
- **Pull-to-Refresh**: Refresh data on all screens

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (~54.0)
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Storage**: AsyncStorage (offline-first architecture)
- **Icons**: Lucide React Native
- **Haptics**: Expo Haptics
- **Styling**: React Native StyleSheet with theme system

## 📁 Project Structure

```
sunnah-bucketlist/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Today screen
│   │   ├── progress.tsx   # Progress screen
│   │   ├── calendar.tsx   # Calendar screen
│   │   ├── library.tsx    # Library screen
│   │   ├── settings.tsx   # Settings screen
│   │   └── _layout.tsx    # Tab layout
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Calendar.tsx
│   ├── CelebrationAnimation.tsx
│   ├── DifficultySelector.tsx
│   ├── StatCard.tsx
│   └── SunnahCard.tsx
├── constants/             # Constants and configuration
│   ├── theme.ts           # Color themes and styling
│   ├── translations.ts    # i18n translations
│   └── storageKeys.ts     # Storage key constants
├── contexts/              # React contexts
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── data/                  # Data files
│   └── sunnahs.ts         # Sample Sunnah data
├── hooks/                 # Custom React hooks
│   ├── useAchievements.ts
│   ├── useProgress.ts
│   └── useSunnahs.ts
├── services/              # Business logic services
│   ├── achievement.service.ts
│   ├── progress.service.ts
│   ├── settings.service.ts
│   ├── storage.service.ts
│   └── sunnah.service.ts
└── types/                 # TypeScript type definitions
    ├── index.ts
    └── settings.ts
```

## 🎨 Design Philosophy

### Light Mode
- Warm, Islamic/Ramadan-inspired palette
- Gold (#D4AF37) primary color
- Deep blue (#1B4D5E) secondary color
- Warm beige background (#FDF9F3)

### Dark Mode
- Soft dark purple theme (#1A1625 background)
- Purple accents (#B794F6 primary)
- Muted colors that are easy on the eyes
- Maintains warmth while being dark-mode friendly

## 🔄 Development

### Available Scripts
- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator/device
- `npm run ios`: Run on iOS simulator/device
- `npm run web`: Run on web (limited functionality)

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Service layer pattern for business logic
- Context API for theme and language
- Custom hooks for data fetching

## 📝 Data Structure

### Sunnah
```typescript
{
  id: string;
  title: string;
  description: string;
  category: 'worship' | 'character' | 'social' | 'daily';
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
}
```

### User Progress
- Streaks (current and longest)
- Total completions
- Difficulty statistics
- Daily completion records
- Completed Sunnah IDs

## 🌟 Key Features Explained

### Daily Difficulty Selection
1. Select your preferred difficulty level (Easy, Medium, or Hard)
2. Preview the daily Sunnah for that difficulty
3. Lock in your choice when ready
4. Complete the Sunnah and track your progress

### Progress Tracking
- Automatic streak calculation
- Achievement unlocking system
- Detailed statistics dashboard
- Visual progress indicators

### Calendar Integration
- Monthly view with completion indicators
- Difficulty markers for each day
- Monthly statistics
- Visual completion tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by Islamic teachings and Sunnah practices

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**May this app help you on your journey to follow the Sunnah. Barakallahu feekum! 🙏**

