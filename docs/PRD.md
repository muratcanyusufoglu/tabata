# FitTimer — Product Requirements Document
## Version 2.0 — March 2026

---

## 1. Product Vision

FitTimer is a premium interval training timer that stands apart through its striking visual design and bulletproof reliability. In a market full of apps that look like they were designed in 2018 — neon green numbers on black backgrounds — FitTimer delivers a glassmorphism-powered, gradient-rich experience that feels like it belongs on Apple Vision Pro.

**One-line pitch:** "The interval timer that looks as good as your workout feels."

**Core differentiators (in priority order):**
1. **Design that turns heads** — Glassmorphism UI, animated gradient backgrounds, circular progress rings. Nothing in the App Store looks like this.
2. **Audio that actually works** — Timer sounds play over your music without interrupting it. This is the #1 complaint across all competitors.
3. **Workout tracking built in** — Calendar, streaks, and stats. No competitor offers this in a timer app.

---

## 2. Target Users

| Persona | Age | Behavior | What they search |
|---------|-----|----------|-----------------|
| CrossFitter | 22-40 | Daily WODs at box or home gym | "crossfit timer", "wod timer", "emom timer" |
| HIIT Enthusiast | 20-35 | YouTube/app-guided HIIT sessions | "hiit timer", "interval timer" |
| Boxing/MMA | 18-40 | Round-based bag work or sparring | "boxing timer", "round timer" |
| Home Workout | 25-45 | Tabata, bodyweight circuits at home | "tabata timer", "workout timer" |
| Runner | 20-50 | Interval runs, C25K style | "running interval timer" |

---

## 3. MVP Feature Set

### 3.1 Core Timer Engine
- Timer states: Prepare → Work → Rest → (repeat rounds) → Rest Between Sets → (repeat sets) → Cooldown → Completed
- Each phase duration independently configurable (1s - 3600s)
- Rounds per set: 1-100
- Sets: 1-20
- Rest between sets: 0-600s
- Controls: Start, Pause/Resume, Stop (with confirmation), Skip Phase
- Background execution: timer MUST survive backgrounding and screen lock for 60+ minutes
- Haptic feedback on every phase transition (configurable)
- Keep screen awake during active timer (configurable)

### 3.2 Preset Templates (7 built-in)

| Template | Prepare | Work | Rest | Rounds | Sets | Rest/Sets | Cooldown | Total |
|----------|---------|------|------|--------|------|-----------|----------|-------|
| Tabata Classic | 10s | 20s | 10s | 8 | 1 | — | 0s | 4:10 |
| HIIT Standard | 10s | 30s | 15s | 10 | 1 | — | 30s | 7:40 |
| Boxing 3-min | 10s | 180s | 60s | 12 | 1 | — | 0s | 48:10 |
| EMOM 10 | 10s | 60s | 0s | 10 | 1 | — | 0s | 10:10 |
| AMRAP 20 | 10s | 1200s | 0s | 1 | 1 | — | 0s | 20:10 |
| Circuit Burn | 10s | 45s | 15s | 6 | 3 | 60s | 30s | 18:40 |
| Stretch & Flow | 5s | 30s | 5s | 10 | 1 | — | 0s | 5:55 |

- Presets cannot be deleted — only duplicated and modified
- Each preset has a unique icon and gradient color pair

### 3.3 Custom Timer Creation
- Name (required, max 50 chars)
- All timing fields with intuitive stepper/wheel pickers
- Live total duration preview as user adjusts values
- Sound pack selection per timer
- Save to "My Timers" library
- Edit, Duplicate, Delete (with confirmation), Reorder (drag & drop)
- Free tier: max 3 custom timers. Premium: unlimited.

### 3.4 Workout Calendar & Streak System
- Monthly calendar grid with colored dots on workout days
- Today highlighted with accent ring
- Streak counter: consecutive days with ≥1 completed workout
- Streak badge prominently displayed on home screen
- Weekly summary card: workouts count + total minutes
- Tap on any day → see workout details (template name, duration, completed/abandoned)
- Free tier: last 7 days history. Premium: unlimited history.

### 3.5 Audio System (CRITICAL DIFFERENTIATOR)
- Phase transition sounds: distinct for work-start, rest-start, countdown (3-2-1), workout-complete
- 2 free sound packs: "Minimal" (clean beeps), "Energetic" (punchy tones)
- 4 premium sound packs: "Boxing Bell", "Whistle", "Digital", "Zen"
- **Music coexistence: timer sounds OVER user's music (Spotify, Apple Music, etc.) without pausing/stopping it** — this is achieved via proper AVAudioSession configuration with `.mixWithOthers` and ducking
- Independent timer volume control
- Lock screen playback controls
- Sounds must work when app is backgrounded

### 3.6 Theming System
- **System adaptive** (follows device light/dark setting) as default
- Manual override: force light or force dark
- 3 free color themes + 7 premium themes (10 total)
- Each theme defines: timer gradient colors, accent color, card tints
- Timer font size option: Normal (72px) / Large (96px) / Extra Large (120px)

### 3.7 Onboarding (First Launch)
- 3 screens max, skippable
- Screen 1: Value prop with hero animation
- Screen 2: Pick preferred workout style → personalizes home screen order
- Screen 3: Notification permission request
- Sets `hasCompletedOnboarding` flag

---

## 4. Monetization: Freemium Model

### Free Tier
- All 7 preset templates
- Up to 3 custom timers
- 7-day workout history
- 2 sound packs (Minimal, Energetic)
- 3 color themes
- Light & dark mode
- Non-intrusive banner ad on home screen only (NEVER during active timer)

### Premium ($2.99/mo · $19.99/yr · $39.99 lifetime)
- Unlimited custom timers
- Full workout history & advanced stats
- All 10 color themes
- All 6 sound packs
- Ad-free
- Export workout history (CSV)
- Priority access to new features

---

## 5. Screen Architecture

```
App Root
├── Onboarding (first launch only)
│
├── Main Tabs
│   ├── Tab 1: Home (Timer)
│   │   ├── Streak badge + greeting
│   │   ├── Quick Start (preset cards, horizontal scroll)
│   │   ├── My Timers (custom timers, vertical list)
│   │   └── Recent Workouts (last 3)
│   │
│   ├── Tab 2: History (Calendar)
│   │   ├── Streak counter (top)
│   │   ├── Monthly calendar grid
│   │   ├── Weekly summary card
│   │   └── Day detail bottom sheet
│   │
│   └── Tab 3: Settings
│       ├── Appearance (theme, color, font size)
│       ├── Sound (pack, volume, haptics)
│       ├── Timer Defaults
│       ├── Premium / Restore
│       └── About / Rate / Feedback
│
├── Timer Editor (modal / push)
│   ├── Name, timing config, sound selection
│   └── Save / Start immediately
│
├── Active Timer (full screen overlay, no tabs)
│   ├── Animated gradient background
│   ├── Circular progress ring + linear top bar
│   ├── Large countdown number
│   ├── Phase label, round/set info, next preview
│   ├── Glassmorphism control buttons
│   └── Stop confirmation bottom sheet
│
├── Workout Complete (full screen)
│   ├── Animated checkmark
│   ├── Stats summary (duration, rounds, calories est.)
│   └── Share / Done buttons
│
└── Paywall (modal)
    ├── Feature comparison
    ├── Pricing cards
    └── Restore purchases
```

---

## 6. Technical Stack

| Layer | Technology | Version / Note |
|-------|-----------|----------------|
| Framework | Expo | SDK 51 (stable) |
| Language | TypeScript | Strict mode |
| Navigation | Expo Router | v3 (file-based) |
| State | Zustand | Lightweight, persist middleware |
| Local DB | expo-sqlite | Workout history |
| Key-Value | @react-native-async-storage | Preferences, template cache |
| Audio | expo-av | Background audio, mixWithOthers |
| Haptics | expo-haptics | Phase transitions |
| Notifications | expo-notifications | Background timer fallback |
| Animations | react-native-reanimated v3 | Gradient transitions, progress ring |
| Gestures | react-native-gesture-handler | Drag-drop, swipe |
| Blur/Glass | expo-blur | Glassmorphism effects |
| Gradients | expo-linear-gradient | Animated backgrounds |
| SVG | react-native-svg | Circular progress ring |
| Icons | lucide-react-native | Consistent icon set |
| IAP | react-native-purchases (RevenueCat) | Subscription management |
| Ads | react-native-google-mobile-ads | Banner ads (free tier) |
| Screen Awake | expo-keep-awake | During active timer |
| Confetti | react-native-confetti-cannon | Workout complete (optional) |

### Performance Targets
- Cold start → interactive: < 2 seconds
- Timer accuracy: ±50ms
- Background survival: 60+ minutes
- Memory: < 150MB during active timer
- Battery: < 5% per 30-min session
- App download size: < 30MB

---

## 7. ASO Strategy

- **App Name:** FitTimer — Interval & Tabata
- **Subtitle:** HIIT, Boxing, CrossFit Timer
- **Keywords (100 chars):** `tabata,interval,crossfit,boxing,round,circuit,wod,training,exercise,stopwatch`
- **Category:** Health & Fitness
- **Secondary:** Sports
- **Localization (post-MVP):** Turkish, German, Spanish, Portuguese (BR), French

---

## 8. Success Metrics

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Monthly Downloads | 2,000 | 8,000 | 15,000 |
| DAU | 500 | 2,500 | 5,000 |
| Rating | 4.7+ | 4.8+ | 4.8+ |
| Premium Conversion | 3% | 4% | 5% |
| D7 Retention | 30% | 35% | 40% |
| D30 Retention | 15% | 20% | 25% |

---

## 9. Internationalization (i18n)

### CRITICAL RULE
**Every user-visible text string MUST be loaded from translation files via `t()` function. No hardcoded strings anywhere in the codebase. No exceptions.**

### Technical Setup
- **Library:** `i18next` + `react-i18next` + `expo-localization`
- **Detection:** Device locale via `expo-localization`, manual override in Settings
- **Fallback:** English (en)
- **File structure:** `src/i18n/locales/{lang}.json`

### Launch Languages (10)
| Priority | Language | Code | Rationale |
|----------|----------|------|-----------|
| 1 | English | en | Primary market, 42% App Store revenue |
| 2 | Turkish | tr | Home market, near-zero keyword competition |
| 3 | German | de | #3 European market, high IAP spend |
| 4 | Spanish | es | 500M+ speakers, growing LatAm market |
| 5 | Portuguese (BR) | pt | Largest LatAm app market |
| 6 | French | fr | Strong European + African market |
| 7 | Japanese | ja | #2 App Store revenue, premium users |
| 8 | Korean | ko | High smartphone penetration, fitness culture |
| 9 | Chinese (Simplified) | zh | Largest Android market by downloads |
| 10 | Arabic | ar | Fast-growing MENA market (requires RTL support) |

### i18n Rules for Development
1. Never write literal strings in JSX — always use `t('key')`
2. Use interpolation for dynamic values: `t('timer.round', { current: 3, total: 8 })`
3. Pluralization: use i18next plural syntax where needed
4. Date/time formatting: use `expo-localization` for locale-aware formatting
5. RTL support: Arabic requires `writingDirection: 'rtl'` — test all screens in RTL
6. Language selector in Settings — user can override device locale
7. App Store metadata must also be localized for each language

See TRANSLATIONS.md for complete translation files.
