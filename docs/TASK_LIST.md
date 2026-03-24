# FitTimer — Task List
## Version 2.0

---

## Phase 0: Project Setup (Day 1)

- [ ] **T-001** Init Expo project: `npx create-expo-app@latest FitTimer --template expo-template-blank-typescript`
- [ ] **T-002** Pin Expo SDK 51 stable in package.json
- [ ] **T-003** Install & configure Expo Router v3
- [ ] **T-004** Install core dependencies:
  ```
  zustand @react-native-async-storage/async-storage
  expo-sqlite expo-av expo-haptics expo-notifications
  expo-keep-awake expo-blur expo-linear-gradient
  react-native-reanimated react-native-gesture-handler
  react-native-svg react-native-safe-area-context
  lucide-react-native
  ```
- [ ] **T-005** Install monetization deps:
  ```
  react-native-purchases (RevenueCat)
  react-native-google-mobile-ads
  ```
- [ ] **T-006** Create folder structure:
  ```
  app/                    — Expo Router screens
    (tabs)/               — Tab layout
    timer/                — Timer screens
  src/
    components/
      ui/                 — Glass card, buttons, etc.
      timer/              — Timer-specific components
      calendar/           — Calendar components
    stores/               — Zustand stores
    db/                   — SQLite layer
    services/             — Audio, haptics, notifications
    utils/                — Helpers, formatters
    constants/            — Colors, typography, presets, themes
    hooks/                — Custom hooks
    types/                — TypeScript interfaces
    assets/
      sounds/             — .wav/.mp3 files per sound pack
  ```
- [ ] **T-007** Create all TypeScript types from DATA_SCHEMA.md → `src/types/index.ts`
- [ ] **T-008** Create design constants from DESIGN_SYSTEM.md:
  - `src/constants/colors.ts` (base palette, phase colors, semantic)
  - `src/constants/typography.ts`
  - `src/constants/spacing.ts`
  - `src/constants/themes.ts` (10 color themes)
  - `src/constants/animations.ts` (timing/easing specs)
- [ ] **T-009** Create preset template data → `src/constants/presets.ts` (7 templates)
- [ ] **T-010** Configure app.config.ts (name, bundle ID, permissions, plugins, splash)

---

## Phase 1: Timer Engine (Days 2-3)

- [ ] **T-011** Create timer store → `src/stores/timerStore.ts`
  - ActiveTimerState interface
  - start, pause, resume, stop, skipPhase actions
  - tick function with phase transition logic
  - recalculateFromBackground
- [ ] **T-012** Implement getNextPhase state machine (from LOGIC.md)
- [ ] **T-013** Implement timer interval with drift correction → `src/services/timerService.ts`
- [ ] **T-014** Create template store → `src/stores/templateStore.ts`
  - CRUD for custom timers
  - Seed presets on first load
  - AsyncStorage persistence (zustand/persist)
- [ ] **T-015** Create preferences store → `src/stores/preferencesStore.ts`
  - All preferences with defaults
  - AsyncStorage persistence
- [ ] **T-016** Implement calculateTotalDuration utility
- [ ] **T-017** Implement validateTimer utility
- [ ] **T-018** Write unit tests for getNextPhase (cover all transitions)

---

## Phase 2: Database & Data Layer (Day 4)

- [ ] **T-019** SQLite setup → `src/db/database.ts`
  - Init DB, create tables, create indexes
  - Migration runner for future changes
- [ ] **T-020** Workout repository → `src/db/workoutRepository.ts`
  - saveWorkout, getWorkoutsByMonth, getRecentWorkouts, getCompletedCount
- [ ] **T-021** Streak service → `src/db/streakService.ts`
  - calculateStreak (current + longest)
  - getWeeklySummary
- [ ] **T-022** Calendar service → `src/db/calendarService.ts`
  - getCalendarMonth, getDayDetail

---

## Phase 3: Audio & Haptics (Days 5-6)

- [ ] **T-023** Audio service → `src/services/audioService.ts`
  - configureAudioSession (mixWithOthers — CRITICAL)
  - preloadSoundPack, play, playCountdown, playPhaseTransition
- [ ] **T-024** Source/create sound files for "Minimal" pack (7 sounds)
- [ ] **T-025** Source/create sound files for "Energetic" pack (7 sounds)
- [ ] **T-026** Haptic service → `src/services/hapticService.ts`
  - light, medium, heavy, success methods
- [ ] **T-027** Test music coexistence: Spotify + timer sounds simultaneously
- [ ] **T-028** Test music coexistence: Apple Music + timer sounds simultaneously
- [ ] **T-029** Notification service → `src/services/notificationService.ts`
  - schedulePhaseNotifications, cancelAll

---

## Phase 4: Design Foundation (Days 7-8)

### Glassmorphism Component Library
- [ ] **T-030** Theme provider → `src/components/ui/ThemeProvider.tsx`
  - useTheme hook, system/light/dark detection
  - Provides colors, glass config based on mode
- [ ] **T-031** GlassCard component → `src/components/ui/GlassCard.tsx`
  - BlurView wrapper with proper intensity/tint per theme
  - Border, radius, padding props
- [ ] **T-032** GlassButton component → `src/components/ui/GlassButton.tsx`
  - Circular and pill variants
  - Press animation (scale 0.96, 100ms spring)
- [ ] **T-033** GlassTabBar component → `src/components/ui/GlassTabBar.tsx`
  - Custom tab bar with BlurView
  - Active dot indicator
  - Content scrolls behind (absolute positioned)
- [ ] **T-034** GlassBottomSheet component → `src/components/ui/GlassBottomSheet.tsx`
  - BlurView background, handle bar, swipe-to-dismiss
- [ ] **T-035** AnimatedGradientBg component → `src/components/timer/AnimatedGradientBg.tsx`
  - expo-linear-gradient with reanimated interpolateColor
  - Phase transition animation (400ms)
  - Breathing effect (4s subtle oscillation)
- [ ] **T-036** CircularProgress component → `src/components/timer/CircularProgress.tsx`
  - react-native-svg Circle with animated strokeDashoffset
  - Track (15% opacity) + progress (100%)
  - Countdown pulse (scale 1.08 on 3-2-1)
  - Timer number rendered inside ring
- [ ] **T-037** PhaseLabel component → `src/components/timer/PhaseLabel.tsx`
  - Uppercase, letter-spacing 6, weight 800
  - Fade transition on phase change
- [ ] **T-038** StatCard component → `src/components/ui/StatCard.tsx`
  - Glass background, icon + number + label layout

---

## Phase 5: Core Screens (Days 9-14)

### Navigation
- [ ] **T-039** Root layout → `app/_layout.tsx`
  - Onboarding check, theme provider wrapper
- [ ] **T-040** Tab layout → `app/(tabs)/_layout.tsx`
  - 3 tabs with custom GlassTabBar
  - Icons: timer, calendar-days, settings

### Home Screen
- [ ] **T-041** Home screen → `app/(tabs)/index.tsx`
  - Greeting + streak badge top section
  - Quick Start horizontal scroll
  - My Timers vertical list
  - Recent Workouts section
- [ ] **T-042** TimerCard component → `src/components/timer/TimerCard.tsx`
  - GlassCard with gradient dot, name, config summary, start button
  - Press animation, stagger animation on load
- [ ] **T-043** StreakBadge component → `src/components/ui/StreakBadge.tsx`
  - Flame icon + count, glass background

### Active Timer Screen
- [ ] **T-044** Active timer screen → `app/timer/[id].tsx`
  - Full screen, hide tab bar + status bar
  - Animated gradient background
  - All subcomponents integrated
- [ ] **T-045** Integrate AnimatedGradientBg (phase-reactive)
- [ ] **T-046** Integrate CircularProgress (time-reactive)
- [ ] **T-047** Linear progress bar (top, 3px, current phase progress)
- [ ] **T-048** Phase label + round/set display
- [ ] **T-049** Next phase preview pill (glass)
- [ ] **T-050** Control buttons row (skip-back, pause/resume, skip-forward) — all glass
- [ ] **T-051** Total elapsed display (bottom, small)
- [ ] **T-052** Stop confirmation: swipe-down gesture or long-press stop → glass bottom sheet
- [ ] **T-053** Connect to timerStore — real-time updates every second
- [ ] **T-054** Connect to audioService — sounds on phase transitions
- [ ] **T-055** Connect to hapticService — vibrations on transitions
- [ ] **T-056** Keep screen awake (expo-keep-awake)

### Workout Complete Screen
- [ ] **T-057** Complete screen → `app/timer/complete.tsx`
  - Gradient background (completed phase colors)
  - Animated checkmark (SVG path animation)
  - Stats grid (glass cards: duration, rounds, streak, sets)
  - Done button → navigate home

### Timer Editor
- [ ] **T-058** Timer editor → `app/timer/editor.tsx`
  - Name input
  - Duration pickers (stepper or wheel)
  - Rounds/sets steppers
  - Advanced section (prepare, cooldown, rest between sets)
  - Live total duration preview
  - Sound pack picker
  - Save / Start immediately buttons
- [ ] **T-059** Edit mode: pre-fill with existing timer data
- [ ] **T-060** Duplicate logic: create copy with "Copy of" prefix

---

## Phase 6: Calendar & History (Days 15-16)

- [ ] **T-061** History screen → `app/(tabs)/history.tsx`
- [ ] **T-062** StreakCard component (glass, with progress toward longest)
- [ ] **T-063** CalendarGrid component
  - 7-column grid, month nav arrows
  - Gradient dots on workout days
  - Today accent ring
  - Tap day → show detail bottom sheet
- [ ] **T-064** WeeklySummary component (glass card, count + minutes)
- [ ] **T-065** DayDetail bottom sheet (glass, workout list)
- [ ] **T-066** Connect to SQLite data (calendarService, streakService)

---

## Phase 7: Settings (Day 17)

- [ ] **T-067** Settings screen → `app/(tabs)/settings.tsx`
- [ ] **T-068** Appearance section: theme mode toggle, color theme grid, font size
- [ ] **T-069** Sound section: sound pack selector with preview, volume slider, haptics toggle
- [ ] **T-070** Timer Defaults section: default prepare/cooldown
- [ ] **T-071** Premium section: upgrade button, restore purchases
- [ ] **T-072** About section: version, rate app link, feedback email, privacy policy

---

## Phase 8: Onboarding (Day 18)

- [ ] **T-073** Onboarding screen → `app/onboarding.tsx`
- [ ] **T-074** Screen 1: hero animation + 3 value props
- [ ] **T-075** Screen 2: workout category picker (sets preferredCategory)
- [ ] **T-076** Screen 3: notification permission request
- [ ] **T-077** Complete → set flag, navigate to tabs, sort presets by preference

---

## Phase 9: Premium & Ads (Days 19-21)

- [ ] **T-078** RevenueCat setup (products: monthly, yearly, lifetime)
- [ ] **T-079** Paywall screen → `app/paywall.tsx`
  - Feature comparison (free vs premium)
  - Pricing cards (glass styled)
  - Restore purchases
- [ ] **T-080** Premium access checks throughout app (from LOGIC.md)
- [ ] **T-081** AdMob integration: banner ad on home screen
  - Hidden during timer, hidden for premium
- [ ] **T-082** Test purchase flow (iOS sandbox)
- [ ] **T-083** Test purchase flow (Android test)

---

## Phase 10: Background & Reliability (Days 22-23)

- [ ] **T-084** Background audio session (keep timer alive in background)
- [ ] **T-085** Local notification scheduling for phase transitions (fallback)
- [ ] **T-086** AppState listener: recalculate on foreground return
- [ ] **T-087** Android foreground service notification
- [ ] **T-088** Test: 30-min background timer (iOS)
- [ ] **T-089** Test: 30-min background timer (Android)
- [ ] **T-090** Test: phone call interruption recovery

---

## Phase 11: Polish & QA (Days 24-27)

- [ ] **T-091** Performance: cold start < 2s
- [ ] **T-092** Performance: timer screen 60fps
- [ ] **T-093** Performance: blur effects 60fps on mid-range devices
- [ ] **T-094** Memory audit: < 150MB
- [ ] **T-095** Battery audit: < 5% per 30-min
- [ ] **T-096** Accessibility: VoiceOver phase announcements
- [ ] **T-097** Accessibility: Dynamic Type for body text
- [ ] **T-098** Accessibility: Reduce Motion support (disable animations)
- [ ] **T-099** Accessibility: Reduce Transparency (solid bg fallback)
- [ ] **T-100** App icon design (1024×1024 + all sizes)
- [ ] **T-101** Splash screen design
- [ ] **T-102** App Store screenshots (6.7", 6.5", 5.5") — showcase glassmorphism
- [ ] **T-103** App Store description with target keywords
- [ ] **T-104** Run full QA_CHECKLIST.md — all items pass

---

## Phase 12: Launch (Days 28-30)

- [ ] **T-105** Production app.config.ts (bundle ID, version 1.0.0, all permissions)
- [ ] **T-106** EAS Build: iOS production
- [ ] **T-107** EAS Build: Android production (AAB)
- [ ] **T-108** Submit to App Store Connect
- [ ] **T-109** Submit to Google Play Console
- [ ] **T-110** ASO metadata (title, subtitle, keywords, description — EN)
- [ ] **T-111** Set up crash reporting (Sentry or expo-insights)
- [ ] **T-112** Post-launch: monitor reviews, respond to feedback

---

## Dependency Graph

```
T-001..010 (setup)
    ↓
T-011..018 (timer engine) ←── T-007 (types)
    ↓
T-019..022 (database) ←── T-007 (types)
    ↓
T-023..029 (audio/haptics)
    ↓
T-030..038 (design components) ←── T-008 (constants)
    ↓
T-039..060 (screens) ←── ALL above
    ↓
T-061..066 (calendar) ←── T-019..022 (DB)
    ↓
T-067..072 (settings) ←── T-030 (theme provider)
    ↓
T-073..077 (onboarding)
    ↓
T-078..083 (premium) ←── T-079 (paywall needs glass components)
    ↓
T-084..090 (background) ←── T-011 (timer engine), T-023 (audio)
    ↓
T-091..104 (polish)
    ↓
T-105..112 (launch)
```

---

## Timeline Summary

| Phase | Days | Tasks |
|-------|------|-------|
| 0: Setup | 1 | T-001 → T-010 |
| 1: Timer Engine | 2 | T-011 → T-018 |
| 2: Database | 1 | T-019 → T-022 |
| 3: Audio | 2 | T-023 → T-029 |
| 4: Design Foundation | 2 | T-030 → T-038 |
| 5: Core Screens | 6 | T-039 → T-060 |
| 6: Calendar | 2 | T-061 → T-066 |
| 7: Settings | 1 | T-067 → T-072 |
| 8: Onboarding | 1 | T-073 → T-077 |
| 9: Premium | 3 | T-078 → T-083 |
| 10: Background | 2 | T-084 → T-090 |
| 11: Polish | 4 | T-091 → T-104 |
| 12: Launch | 3 | T-105 → T-112 |
| **Total** | **30 days** | **112 tasks** |

---

## Phase 4.5: Internationalization (Day 8 — within Design Foundation phase)

- [ ] **T-038a** Install i18n dependencies: `i18next`, `react-i18next`, `expo-localization`
- [ ] **T-038b** Create i18n setup file → `src/i18n/index.ts` (device locale detection, fallback)
- [ ] **T-038c** Create all 10 translation JSON files under `src/i18n/locales/`
  - en.json, tr.json, de.json, es.json, pt.json, fr.json, ja.json, ko.json, zh.json, ar.json
- [ ] **T-038d** Create `useTranslation` wrapper hook (if needed for type safety)
- [ ] **T-038e** Add language selector to Settings screen
- [ ] **T-038f** Test RTL layout with Arabic locale
- [ ] **T-038g** Verify all screens have zero hardcoded strings (code review checkpoint)

### RULE: Every PR/commit that adds UI must pass this check:
```bash
# No literal strings in JSX — all text via t()
grep -r ">[A-Z][a-z]" src/components/ --include="*.tsx" | grep -v "t(" | grep -v "//"
# Should return zero results
```

---

## Additional Tasks (from gap analysis)

### Analytics Setup
- [ ] **T-038h** Create analytics service → `src/services/analyticsService.ts`
- [ ] **T-038i** Integrate analytics events at all key points (see ANALYTICS_ERRORS.md event list)
- [ ] **T-038j** Set up Sentry crash reporting (or expo-insights)

### Error Handling
- [ ] **T-038k** Create error handler → `src/utils/errorHandler.ts` (with severity levels)
- [ ] **T-038l** Create Toast component for non-blocking error messages
- [ ] **T-038m** Add error translation keys to all 10 locale files
- [ ] **T-038n** Wire error handlers into audio, DB, purchase, and timer services

### Sound Assets
- [ ] **T-038o** Create/source "Minimal" sound pack (7 .wav files per spec)
- [ ] **T-038p** Create/source "Energetic" sound pack (7 .wav files per spec)
- [ ] **T-038q** Placeholder files for 4 premium packs (can be same sounds initially)

### App Icon & Splash
- [ ] **T-100a** Design app icon (1024×1024, gradient timer on dark bg)
- [ ] **T-100b** Create adaptive-icon.png for Android
- [ ] **T-100c** Design splash screen (icon + app name, dark & light variants)

### Unit Tests (Timer Engine — critical path)
- [ ] **T-018a** Test: getNextPhase — all phase transitions (work→rest, rest→work, set boundaries)
- [ ] **T-018b** Test: getNextPhase — edge cases (1 round, 0 rest, 0 cooldown)
- [ ] **T-018c** Test: tick — countdown, phase complete, workout complete
- [ ] **T-018d** Test: calculateTotalDuration — matches expected for all 7 presets
- [ ] **T-018e** Test: validateTimer — catches all invalid inputs
- [ ] **T-018f** Test: streak calculation — consecutive days, gaps, today handling
