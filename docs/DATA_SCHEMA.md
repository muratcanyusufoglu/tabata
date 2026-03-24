# FitTimer — Data Schema
## Version 2.0

---

## Storage Strategy

| Data | Storage | Reason |
|------|---------|--------|
| Timer templates | Zustand + AsyncStorage (persist) | Fast read, offline, survives app restart |
| Workout history | SQLite (expo-sqlite) | Queryable for calendar, stats, streaks |
| User preferences | Zustand + AsyncStorage (persist) | Simple key-value, reactive |
| Active timer state | Zustand (memory only) | Runtime state, not persisted |
| Premium status | RevenueCat SDK cache | Server-validated on launch |

---

## 1. TimerTemplate

```typescript
export interface TimerTemplate {
  id: string;                          // uuid v4
  name: string;                        // max 50 chars
  type: 'preset' | 'custom';
  category: TimerCategory;

  // Timing
  prepareSeconds: number;              // 0-60 (default: 10)
  workSeconds: number;                 // 1-3600
  restSeconds: number;                 // 0-600
  rounds: number;                      // 1-100
  sets: number;                        // 1-20
  restBetweenSetsSeconds: number;      // 0-600 (only if sets > 1)
  cooldownSeconds: number;             // 0-300 (default: 0)

  // Computed
  totalDurationSeconds: number;        // auto-calculated on save

  // Display
  colorThemeId: string;                // which color theme to use
  iconName: string;                    // lucide icon name for presets

  // Metadata
  createdAt: string;                   // ISO 8601
  updatedAt: string;
  isFavorite: boolean;
  usageCount: number;
  lastUsedAt: string | null;
}

export type TimerCategory =
  | 'tabata'
  | 'hiit'
  | 'boxing'
  | 'crossfit'
  | 'circuit'
  | 'stretching'
  | 'custom';
```

---

## 2. ActiveTimerState (Zustand — runtime only)

```typescript
export type TimerPhase =
  | 'prepare'
  | 'work'
  | 'rest'
  | 'restBetweenSets'
  | 'cooldown'
  | 'completed';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface ActiveTimerState {
  // Config
  template: TimerTemplate | null;

  // Status
  status: TimerStatus;

  // Position
  currentPhase: TimerPhase;
  currentRound: number;                // 1-indexed
  currentSet: number;                  // 1-indexed
  secondsRemaining: number;            // countdown for current phase
  currentPhaseTotalSeconds: number;    // total seconds of current phase (for progress calc)
  totalElapsedSeconds: number;

  // Preview
  nextPhase: TimerPhase | null;
  nextPhaseDuration: number;

  // Timestamps
  startedAt: string | null;            // ISO 8601, set when timer first starts
  lastTickTimestamp: number;            // Date.now() — for background recalculation

  // Actions
  start: (template: TimerTemplate) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipPhase: () => void;
  tick: () => void;
  recalculateFromBackground: () => void;
}
```

---

## 3. Workout History (SQLite)

```sql
CREATE TABLE IF NOT EXISTS workouts (
  id                      TEXT PRIMARY KEY,
  template_id             TEXT NOT NULL,
  template_name           TEXT NOT NULL,
  template_category       TEXT NOT NULL,
  started_at              TEXT NOT NULL,
  completed_at            TEXT,
  total_duration_seconds  INTEGER NOT NULL,
  planned_duration_seconds INTEGER NOT NULL,
  rounds_completed        INTEGER NOT NULL,
  rounds_total            INTEGER NOT NULL,
  sets_completed          INTEGER NOT NULL,
  sets_total              INTEGER NOT NULL,
  was_completed           INTEGER NOT NULL DEFAULT 0,
  year                    INTEGER NOT NULL,
  month                   INTEGER NOT NULL,
  day                     INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(year, month, day);
CREATE INDEX IF NOT EXISTS idx_workouts_started ON workouts(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_template ON workouts(template_id);
```

---

## 4. UserPreferences (Zustand + AsyncStorage)

```typescript
export interface UserPreferences {
  // Appearance
  themeMode: 'system' | 'light' | 'dark';      // default: 'system'
  colorThemeId: string;                          // default: 'vivid'
  timerFontSize: 'normal' | 'large' | 'xlarge'; // default: 'normal'

  // Sound
  soundPackId: string;                           // default: 'minimal'
  timerVolume: number;                           // 0.0-1.0 (default: 0.8)
  hapticsEnabled: boolean;                       // default: true
  countdownSoundEnabled: boolean;                // default: true

  // Timer defaults
  defaultPrepareSeconds: number;                 // default: 10
  defaultCooldownSeconds: number;                // default: 0
  keepScreenAwake: boolean;                      // default: true

  // Onboarding
  hasCompletedOnboarding: boolean;               // default: false
  preferredCategory: TimerCategory | null;

  // Premium
  isPremium: boolean;                            // cached from RevenueCat
  premiumExpiresAt: string | null;

  // App lifecycle
  appOpenCount: number;
  lastRatePromptDate: string | null;
  installDate: string;                           // ISO 8601, set on first launch
}
```

---

## 5. SoundPack

```typescript
export interface SoundPack {
  id: string;
  name: string;
  isPremium: boolean;
  sounds: {
    workStart: number;       // require('./assets/sounds/...') asset ID
    restStart: number;
    countdown3: number;
    countdown2: number;
    countdown1: number;
    setComplete: number;
    workoutComplete: number;
  };
}

// 2 free + 4 premium = 6 total
export const soundPacks: SoundPack[] = [
  { id: 'minimal',   name: 'Minimal',     isPremium: false, sounds: { /* ... */ } },
  { id: 'energetic', name: 'Energetic',   isPremium: false, sounds: { /* ... */ } },
  { id: 'bell',      name: 'Boxing Bell', isPremium: true,  sounds: { /* ... */ } },
  { id: 'whistle',   name: 'Whistle',     isPremium: true,  sounds: { /* ... */ } },
  { id: 'digital',   name: 'Digital',     isPremium: true,  sounds: { /* ... */ } },
  { id: 'zen',       name: 'Zen',         isPremium: true,  sounds: { /* ... */ } },
];
```

---

## 6. StreakData (Computed — not stored)

```typescript
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalMinutes: number;
  thisWeekWorkouts: number;
  thisWeekMinutes: number;
}
```

---

## 7. CalendarDay (Computed — not stored)

```typescript
export interface CalendarDay {
  date: string;                        // "2026-03-24"
  workoutCount: number;
  totalMinutes: number;
  hasCompletedWorkout: boolean;
  workouts: WorkoutSummary[];
}

export interface WorkoutSummary {
  id: string;
  templateName: string;
  category: TimerCategory;
  durationSeconds: number;
  wasCompleted: boolean;
  startedAt: string;
}
```

---

## 8. Store File Structure

```
stores/
  timerStore.ts          — ActiveTimerState (not persisted)
  templateStore.ts       — TimerTemplate[] (AsyncStorage persist)
  preferencesStore.ts    — UserPreferences (AsyncStorage persist)

db/
  database.ts            — SQLite init, migrations
  workoutRepository.ts   — CRUD for workouts table
  streakService.ts       — Streak calculation queries
  calendarService.ts     — Calendar data queries
```
