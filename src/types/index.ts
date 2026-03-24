export type TimerCategory =
  | 'tabata'
  | 'hiit'
  | 'boxing'
  | 'crossfit'
  | 'circuit'
  | 'stretching'
  | 'custom';

export interface TimerTemplate {
  id: string;
  name: string;
  type: 'preset' | 'custom';
  category: TimerCategory;
  prepareSeconds: number;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  sets: number;
  restBetweenSetsSeconds: number;
  cooldownSeconds: number;
  totalDurationSeconds: number;
  colorThemeId: string;
  iconName: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  usageCount: number;
  lastUsedAt: string | null;
}

export type TimerPhase =
  | 'prepare'
  | 'work'
  | 'rest'
  | 'restBetweenSets'
  | 'cooldown'
  | 'completed';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface ActiveTimerState {
  template: TimerTemplate | null;
  status: TimerStatus;
  currentPhase: TimerPhase;
  currentRound: number;
  currentSet: number;
  secondsRemaining: number;
  currentPhaseTotalSeconds: number;
  totalElapsedSeconds: number;
  nextPhase: TimerPhase | null;
  nextPhaseDuration: number;
  startedAt: string | null;
  lastTickTimestamp: number;
  start: (template: TimerTemplate) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipPhase: () => void;
  tick: () => void;
  recalculateFromBackground: () => void;
}

export interface UserPreferences {
  themeMode: 'system' | 'light' | 'dark';
  colorThemeId: string;
  timerFontSize: 'normal' | 'large' | 'xlarge';
  soundPackId: string;
  timerVolume: number;
  hapticsEnabled: boolean;
  countdownSoundEnabled: boolean;
  defaultPrepareSeconds: number;
  defaultCooldownSeconds: number;
  keepScreenAwake: boolean;
  hasCompletedOnboarding: boolean;
  preferredCategory: TimerCategory | null;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  appOpenCount: number;
  lastRatePromptDate: string | null;
  installDate: string;
  language: string | null;
}

export interface SoundPack {
  id: string;
  name: string;
  isPremium: boolean;
  sounds: {
    workStart: any;
    restStart: any;
    countdown3: any;
    countdown2: any;
    countdown1: any;
    setComplete: any;
    workoutComplete: any;
  };
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalMinutes: number;
  thisWeekWorkouts: number;
  thisWeekMinutes: number;
}

export interface WorkoutSummary {
  id: string;
  templateName: string;
  category: TimerCategory;
  durationSeconds: number;
  wasCompleted: boolean;
  startedAt: string;
}

export interface CalendarDay {
  date: string;
  workoutCount: number;
  totalMinutes: number;
  hasCompletedWorkout: boolean;
  workouts: WorkoutSummary[];
}

export interface ColorTheme {
  id: string;
  name: string;
  isPremium: boolean;
  work: [string, string];
  rest: [string, string];
  prepare: [string, string];
  cooldown: [string, string];
  restBetweenSets?: [string, string];
  completed?: [string, string];
}
