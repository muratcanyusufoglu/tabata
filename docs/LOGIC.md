# FitTimer — App Logic
## Version 2.0

---

## 1. Timer State Machine

```
[IDLE]
  │ start(template)
  ▼
[PREPARE] ─── prepareSeconds ends ──→ [WORK]
                                         │
                                         │ workSeconds ends
                                         ▼
                                 ┌─── round < maxRounds? ───┐
                                 │ YES                       │ NO
                                 ▼                           ▼
                              [REST]                  set < maxSets?
                                 │                    │ YES         │ NO
                                 │ restSeconds ends   ▼             ▼
                                 │            [REST_BETWEEN_SETS]  cooldown > 0?
                                 │                    │             │ YES    │ NO
                                 │                    │ ends        ▼        ▼
                                 └──→ [WORK]  ←───────┘       [COOLDOWN]  [COMPLETED]
                                   (round++)    (set++,                │
                                                 round=1)             │ ends
                                                                      ▼
                                                                [COMPLETED]

At any point:
  pause() → status = 'paused' (freezes countdown)
  resume() → status = 'running' (continues)
  stop() → saves workout, returns to IDLE
  skipPhase() → jump to next phase immediately
```

---

## 2. Core Timer Logic

### 2.1 Phase Transition

```typescript
function getNextPhase(
  currentPhase: TimerPhase,
  currentRound: number,
  currentSet: number,
  template: TimerTemplate
): { phase: TimerPhase; duration: number; newRound: number; newSet: number } {

  switch (currentPhase) {
    case 'prepare':
      return { phase: 'work', duration: template.workSeconds, newRound: 1, newSet: 1 };

    case 'work':
      if (currentRound < template.rounds) {
        if (template.restSeconds > 0) {
          return { phase: 'rest', duration: template.restSeconds, newRound: currentRound, newSet: currentSet };
        }
        // No rest configured — go straight to next work
        return { phase: 'work', duration: template.workSeconds, newRound: currentRound + 1, newSet: currentSet };
      }
      // All rounds in set done
      if (currentSet < template.sets) {
        if (template.restBetweenSetsSeconds > 0) {
          return { phase: 'restBetweenSets', duration: template.restBetweenSetsSeconds, newRound: currentRound, newSet: currentSet };
        }
        return { phase: 'work', duration: template.workSeconds, newRound: 1, newSet: currentSet + 1 };
      }
      // All sets done
      if (template.cooldownSeconds > 0) {
        return { phase: 'cooldown', duration: template.cooldownSeconds, newRound: currentRound, newSet: currentSet };
      }
      return { phase: 'completed', duration: 0, newRound: currentRound, newSet: currentSet };

    case 'rest':
      return { phase: 'work', duration: template.workSeconds, newRound: currentRound + 1, newSet: currentSet };

    case 'restBetweenSets':
      return { phase: 'work', duration: template.workSeconds, newRound: 1, newSet: currentSet + 1 };

    case 'cooldown':
      return { phase: 'completed', duration: 0, newRound: currentRound, newSet: currentSet };

    default:
      return { phase: 'completed', duration: 0, newRound: currentRound, newSet: currentSet };
  }
}
```

### 2.2 Tick Function

```typescript
function tick(): void {
  const state = get(); // zustand get()
  if (state.status !== 'running' || !state.template) return;

  const now = Date.now();
  const newRemaining = state.secondsRemaining - 1;
  const newElapsed = state.totalElapsedSeconds + 1;

  // Countdown sounds (3, 2, 1)
  if (newRemaining <= 3 && newRemaining > 0 && state.currentPhase !== 'prepare') {
    AudioService.playCountdown(newRemaining);
    HapticService.light();
  }

  // Phase complete
  if (newRemaining <= 0) {
    const next = getNextPhase(state.currentPhase, state.currentRound, state.currentSet, state.template);

    if (next.phase === 'completed') {
      AudioService.play('workoutComplete');
      HapticService.success();
      WorkoutRepository.save(state, true);
      set({
        currentPhase: 'completed',
        status: 'completed',
        secondsRemaining: 0,
        totalElapsedSeconds: newElapsed,
        lastTickTimestamp: now,
      });
      return;
    }

    // Play appropriate transition sound
    AudioService.playPhaseTransition(next.phase);
    HapticService.medium();

    set({
      currentPhase: next.phase,
      secondsRemaining: next.duration,
      currentPhaseTotalSeconds: next.duration,
      currentRound: next.newRound,
      currentSet: next.newSet,
      totalElapsedSeconds: newElapsed,
      nextPhase: getNextPhase(next.phase, next.newRound, next.newSet, state.template).phase,
      nextPhaseDuration: getNextPhase(next.phase, next.newRound, next.newSet, state.template).duration,
      lastTickTimestamp: now,
    });
    return;
  }

  // Normal tick
  set({
    secondsRemaining: newRemaining,
    totalElapsedSeconds: newElapsed,
    lastTickTimestamp: now,
  });
}
```

### 2.3 Timer Interval with Drift Correction

```typescript
let intervalRef: ReturnType<typeof setInterval> | null = null;
let nextExpectedTick: number = 0;

function startInterval(): void {
  nextExpectedTick = Date.now() + 1000;

  intervalRef = setInterval(() => {
    const now = Date.now();
    const drift = now - nextExpectedTick;
    nextExpectedTick += 1000;

    // Perform tick
    useTimerStore.getState().tick();

    // If drift is significant, self-correct
    if (Math.abs(drift) > 100) {
      stopInterval();
      startInterval(); // restart with corrected timing
    }
  }, 1000);
}

function stopInterval(): void {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
  }
}
```

### 2.4 Background Recalculation

```typescript
// Called when app returns to foreground (AppState 'active')
function recalculateFromBackground(): void {
  const state = get();
  if (state.status !== 'running' || !state.template) return;

  const now = Date.now();
  const missedMs = now - state.lastTickTimestamp;
  const missedSeconds = Math.floor(missedMs / 1000);

  if (missedSeconds <= 0) return;

  // Fast-forward through missed seconds
  for (let i = 0; i < missedSeconds; i++) {
    tick();
    // Break if timer completed during fast-forward
    if (get().status === 'completed') break;
  }
}
```

---

## 3. Audio System

### 3.1 Configuration (CRITICAL)

```typescript
import { Audio } from 'expo-av';

async function configureAudioSession(): Promise<void> {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    staysActiveInBackground: true,
    // CRITICAL: mixWithOthers — do NOT interrupt user's music
    interruptionModeIOS: 1,   // MIX_WITH_OTHERS
    interruptionModeAndroid: 2, // DUCK_OTHERS
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });
}
```

### 3.2 Sound Cache

```typescript
const soundCache = new Map<string, Audio.Sound>();

async function preloadSoundPack(pack: SoundPack): Promise<void> {
  // Unload previous pack
  for (const sound of soundCache.values()) {
    await sound.unloadAsync();
  }
  soundCache.clear();

  // Load new pack
  const entries = Object.entries(pack.sounds) as [string, number][];
  await Promise.all(
    entries.map(async ([key, asset]) => {
      const { sound } = await Audio.Sound.createAsync(asset);
      soundCache.set(key, sound);
    })
  );
}

async function play(key: string): Promise<void> {
  const sound = soundCache.get(key);
  if (!sound) return;
  try {
    const volume = usePreferencesStore.getState().timerVolume;
    await sound.setVolumeAsync(volume);
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (e) {
    console.warn('Sound play failed:', e);
  }
}
```

---

## 4. Workout Repository (SQLite)

```typescript
// db/workoutRepository.ts

async function saveWorkout(state: ActiveTimerState, wasCompleted: boolean): Promise<void> {
  const now = new Date();
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO workouts (id, template_id, template_name, template_category,
      started_at, completed_at, total_duration_seconds, planned_duration_seconds,
      rounds_completed, rounds_total, sets_completed, sets_total,
      was_completed, year, month, day)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      generateUUID(),
      state.template!.id,
      state.template!.name,
      state.template!.category,
      state.startedAt,
      now.toISOString(),
      state.totalElapsedSeconds,
      state.template!.totalDurationSeconds,
      state.currentRound,
      state.template!.rounds * state.template!.sets,
      state.currentSet,
      state.template!.sets,
      wasCompleted ? 1 : 0,
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    ]
  );
}

async function getWorkoutsByMonth(year: number, month: number): Promise<CalendarDay[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT day, COUNT(*) as count,
            SUM(total_duration_seconds) as totalSeconds,
            MAX(was_completed) as hasCompleted
     FROM workouts
     WHERE year = ? AND month = ?
     GROUP BY day`,
    [year, month]
  );
  return rows.map(r => ({
    date: `${year}-${String(month).padStart(2, '0')}-${String(r.day).padStart(2, '0')}`,
    workoutCount: r.count,
    totalMinutes: Math.round(r.totalSeconds / 60),
    hasCompletedWorkout: r.hasCompleted === 1,
    workouts: [], // loaded on demand when day is tapped
  }));
}
```

---

## 5. Streak Calculation

```typescript
async function calculateStreak(): Promise<{ current: number; longest: number }> {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    `SELECT DISTINCT date(started_at) as d
     FROM workouts
     WHERE was_completed = 1
     ORDER BY d DESC`
  );

  if (rows.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  // If no workout today, start checking from yesterday
  const todayStr = formatDateKey(checkDate);
  const startFromYesterday = rows[0].d !== todayStr;
  if (startFromYesterday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Calculate current streak
  for (const row of rows) {
    if (row.d === formatDateKey(checkDate)) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak (scan all dates)
  let prevDate: Date | null = null;
  for (const row of rows) {
    const d = new Date(row.d);
    if (prevDate && daysBetween(d, prevDate) === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    longest = Math.max(longest, tempStreak);
    prevDate = d;
  }

  return { current, longest: Math.max(longest, current) };
}
```

---

## 6. Template Duration Calculator

```typescript
export function calculateTotalDuration(t: {
  prepareSeconds: number;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  sets: number;
  restBetweenSetsSeconds: number;
  cooldownSeconds: number;
}): number {
  const roundDuration = t.workSeconds + t.restSeconds;
  const setDuration = (roundDuration * t.rounds) - t.restSeconds; // no rest after last round
  const allSets = setDuration * t.sets;
  const betweenSetsRest = t.restBetweenSetsSeconds * Math.max(0, t.sets - 1);

  return t.prepareSeconds + allSets + betweenSetsRest + t.cooldownSeconds;
}
```

---

## 7. Timer Validation

```typescript
export function validateTimer(t: Partial<TimerTemplate>): string[] {
  const errors: string[] = [];

  if (!t.name?.trim()) errors.push('Name is required');
  if (t.name && t.name.length > 50) errors.push('Name must be 50 characters or less');
  if (!t.workSeconds || t.workSeconds < 1) errors.push('Work time must be at least 1 second');
  if (t.workSeconds && t.workSeconds > 3600) errors.push('Work time cannot exceed 60 minutes');
  if (t.restSeconds !== undefined && t.restSeconds < 0) errors.push('Rest time cannot be negative');
  if (t.restSeconds && t.restSeconds > 600) errors.push('Rest time cannot exceed 10 minutes');
  if (!t.rounds || t.rounds < 1) errors.push('At least 1 round required');
  if (t.rounds && t.rounds > 100) errors.push('Cannot exceed 100 rounds');
  if (!t.sets || t.sets < 1) errors.push('At least 1 set required');
  if (t.sets && t.sets > 20) errors.push('Cannot exceed 20 sets');

  // Total duration check
  if (t.workSeconds && t.rounds && t.sets) {
    const total = calculateTotalDuration(t as any);
    if (total > 7200) errors.push('Total duration cannot exceed 2 hours');
  }

  return errors;
}
```

---

## 8. Premium Access Control

```typescript
const PREMIUM_LIMITS = {
  maxCustomTimers: 3,           // free tier limit
  historyDays: 7,               // free tier: 7 days
  freeSoundPacks: ['minimal', 'energetic'],
  freeColorThemes: ['vivid', 'ocean', 'sunset'],
};

export function checkPremiumAccess(
  feature: 'custom_timer' | 'full_history' | 'sound_pack' | 'color_theme' | 'export' | 'ad_free',
  resourceId?: string
): 'allowed' | 'paywall' {
  const { isPremium } = usePreferencesStore.getState();
  if (isPremium) return 'allowed';

  switch (feature) {
    case 'custom_timer':
      const customCount = useTemplateStore.getState().templates.filter(t => t.type === 'custom').length;
      return customCount < PREMIUM_LIMITS.maxCustomTimers ? 'allowed' : 'paywall';
    case 'sound_pack':
      return PREMIUM_LIMITS.freeSoundPacks.includes(resourceId!) ? 'allowed' : 'paywall';
    case 'color_theme':
      return PREMIUM_LIMITS.freeColorThemes.includes(resourceId!) ? 'allowed' : 'paywall';
    case 'full_history':
    case 'export':
    case 'ad_free':
      return 'paywall';
    default:
      return 'allowed';
  }
}
```

---

## 9. Navigation & App Lifecycle

```typescript
// App state listener — handle background/foreground
import { AppState } from 'react-native';

AppState.addEventListener('change', (nextState) => {
  if (nextState === 'active') {
    // App came to foreground
    const timerState = useTimerStore.getState();
    if (timerState.status === 'running') {
      timerState.recalculateFromBackground();
      startInterval(); // restart interval
    }
  } else if (nextState === 'background') {
    // App going to background — schedule fallback notifications
    const timerState = useTimerStore.getState();
    if (timerState.status === 'running') {
      NotificationService.schedulePhaseNotifications(timerState);
    }
  }
});
```

---

## 10. Rate Prompt Logic

```typescript
function shouldShowRatePrompt(): boolean {
  const prefs = usePreferencesStore.getState();

  // Never if prompted in last 90 days
  if (prefs.lastRatePromptDate) {
    const daysSince = daysBetween(new Date(prefs.lastRatePromptDate), new Date());
    if (daysSince < 90) return false;
  }

  // Show after completing 5+ workouts and 5+ app opens
  const completedCount = WorkoutRepository.getCompletedCount();
  return completedCount >= 5 && prefs.appOpenCount >= 5;
}
```
