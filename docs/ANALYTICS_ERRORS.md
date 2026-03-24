# FitTimer — Analytics & Error Handling
## Addendum to LOGIC.md

---

## 11. Analytics Event List

Library: `expo-insights` or custom lightweight tracker (no heavy SDK for MVP)

### 11.1 Core Events

```typescript
type AnalyticsEvent =
  // App lifecycle
  | { name: 'app_open'; params: { open_count: number; is_premium: boolean } }
  | { name: 'app_background'; params: { session_duration_seconds: number } }
  | { name: 'onboarding_complete'; params: { selected_category: string } }
  | { name: 'onboarding_skip'; params: { skipped_at_step: number } }

  // Timer usage
  | { name: 'timer_start'; params: { template_id: string; template_name: string; category: string; is_preset: boolean; total_duration: number } }
  | { name: 'timer_pause'; params: { elapsed_seconds: number; phase: string } }
  | { name: 'timer_resume'; params: { paused_duration_seconds: number } }
  | { name: 'timer_stop'; params: { elapsed_seconds: number; planned_duration: number; completion_pct: number; phase_at_stop: string } }
  | { name: 'timer_complete'; params: { template_id: string; category: string; total_duration: number; rounds_completed: number } }
  | { name: 'timer_skip_phase'; params: { from_phase: string; to_phase: string } }

  // Template management
  | { name: 'template_create'; params: { category: string; total_duration: number } }
  | { name: 'template_edit'; params: { template_id: string } }
  | { name: 'template_duplicate'; params: { source_template_id: string } }
  | { name: 'template_delete'; params: { template_id: string } }
  | { name: 'template_favorite'; params: { template_id: string; is_favorite: boolean } }

  // Premium & monetization
  | { name: 'paywall_view'; params: { trigger: string } }  // trigger = which feature triggered it
  | { name: 'paywall_dismiss'; params: { viewed_seconds: number } }
  | { name: 'purchase_start'; params: { product_id: string; plan: 'monthly' | 'yearly' | 'lifetime' } }
  | { name: 'purchase_complete'; params: { product_id: string; plan: string; price: number } }
  | { name: 'purchase_fail'; params: { product_id: string; error: string } }
  | { name: 'purchase_restore'; params: { success: boolean } }
  | { name: 'ad_impression'; params: { placement: string } }

  // Settings & preferences
  | { name: 'theme_change'; params: { from: string; to: string } }
  | { name: 'color_theme_change'; params: { theme_id: string } }
  | { name: 'sound_pack_change'; params: { pack_id: string } }
  | { name: 'language_change'; params: { from: string; to: string } }
  | { name: 'font_size_change'; params: { size: string } }
  | { name: 'haptics_toggle'; params: { enabled: boolean } }

  // Engagement
  | { name: 'calendar_view'; params: { month: number; year: number } }
  | { name: 'streak_milestone'; params: { days: number } }  // fire at 7, 14, 30, 60, 100
  | { name: 'rate_prompt_shown'; params: { app_open_count: number; workout_count: number } }
  | { name: 'rate_prompt_accepted'; params: {} }
  | { name: 'rate_prompt_dismissed'; params: {} }
  | { name: 'share_workout'; params: { template_category: string } }

  // Errors
  | { name: 'error_audio_play'; params: { sound_key: string; error: string } }
  | { name: 'error_db_write'; params: { operation: string; error: string } }
  | { name: 'error_background_timer'; params: { missed_seconds: number } }
  | { name: 'error_purchase'; params: { product_id: string; error: string } };
```

### 11.2 Key Metrics to Derive

| Metric | How to Calculate | Why It Matters |
|--------|------------------|----------------|
| Workout completion rate | `timer_complete / timer_start` | Are users finishing workouts? |
| Avg workout duration | Average `total_duration` from `timer_complete` | User engagement depth |
| Popular categories | Count `timer_start` grouped by `category` | What templates to promote |
| Paywall conversion | `purchase_complete / paywall_view` | Monetization efficiency |
| Premium trigger | Most common `trigger` in `paywall_view` | Which feature drives upgrades |
| D1/D7/D30 retention | Users with `app_open` on day 1/7/30 after install | Growth health |
| Streak distribution | `streak_milestone` counts | Engagement stickiness |
| Early stop phase | Most common `phase_at_stop` in `timer_stop` | UX friction point |
| Completion % at stop | Average `completion_pct` from `timer_stop` | When do users give up |

### 11.3 Implementation

```typescript
// src/services/analyticsService.ts

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];

  track(event: AnalyticsEvent): void {
    if (__DEV__) {
      console.log('[Analytics]', event.name, event.params);
      return;
    }
    this.queue.push(event);
    this.flush();
  }

  private async flush(): Promise<void> {
    // MVP: write to AsyncStorage, batch upload later
    // Or use expo-insights / PostHog / Mixpanel
  }
}

export const analytics = new AnalyticsService();

// Usage:
// analytics.track({ name: 'timer_start', params: { ... } });
```

---

## 12. Error Handling Strategy

### 12.1 Error Categories & Responses

```typescript
// src/utils/errorHandler.ts

type ErrorSeverity = 'silent' | 'toast' | 'alert' | 'fallback';

interface ErrorConfig {
  severity: ErrorSeverity;
  userMessage?: string;         // shown to user (via t() key)
  fallbackAction?: () => void;  // what to do instead
  shouldReport: boolean;        // send to crash reporting
}

const errorConfigs: Record<string, ErrorConfig> = {

  // ---- AUDIO ERRORS ----
  'audio_play_fail': {
    severity: 'silent',         // don't interrupt workout for a missed beep
    shouldReport: true,
    fallbackAction: () => {
      // Try haptic as fallback
      HapticService.heavy();
    },
  },
  'audio_session_fail': {
    severity: 'toast',
    userMessage: 'errors.audioSession',  // "Timer sounds may not work correctly"
    shouldReport: true,
  },
  'audio_preload_fail': {
    severity: 'toast',
    userMessage: 'errors.soundLoad',     // "Could not load sounds. Using defaults."
    shouldReport: true,
    fallbackAction: () => {
      // Fall back to default "minimal" sound pack
      preloadSoundPack(soundPacks[0]);
    },
  },

  // ---- DATABASE ERRORS ----
  'db_init_fail': {
    severity: 'alert',
    userMessage: 'errors.dbInit',        // "Could not initialize storage. Workout history may not be saved."
    shouldReport: true,
  },
  'db_write_fail': {
    severity: 'toast',
    userMessage: 'errors.saveFail',      // "Could not save workout. Please try again."
    shouldReport: true,
  },
  'db_read_fail': {
    severity: 'silent',
    shouldReport: true,
    fallbackAction: () => {
      // Return empty data, UI shows "no workouts" state
    },
  },

  // ---- PURCHASE ERRORS ----
  'purchase_fail': {
    severity: 'alert',
    userMessage: 'errors.purchaseFail',  // "Purchase could not be completed. You have not been charged."
    shouldReport: true,
  },
  'purchase_restore_fail': {
    severity: 'alert',
    userMessage: 'errors.restoreFail',   // "Could not restore purchases. Please try again or contact support."
    shouldReport: true,
  },
  'revenuecat_init_fail': {
    severity: 'silent',                  // don't block app launch
    shouldReport: true,
    fallbackAction: () => {
      // Use cached premium status from AsyncStorage
    },
  },

  // ---- TIMER ERRORS ----
  'timer_background_drift': {
    severity: 'silent',
    shouldReport: true,
    // Handled automatically by recalculateFromBackground
  },
  'timer_interval_fail': {
    severity: 'toast',
    userMessage: 'errors.timerError',    // "Timer encountered an error. Restarting..."
    shouldReport: true,
    fallbackAction: () => {
      // Stop and restart the interval
      stopInterval();
      startInterval();
    },
  },

  // ---- NOTIFICATION ERRORS ----
  'notification_schedule_fail': {
    severity: 'silent',                  // notifications are backup, not primary
    shouldReport: true,
  },
  'notification_permission_denied': {
    severity: 'silent',                  // user chose this, respect it
    shouldReport: false,
  },

  // ---- AD ERRORS ----
  'ad_load_fail': {
    severity: 'silent',                  // no ad = better UX honestly
    shouldReport: false,
    fallbackAction: () => {
      // Hide ad container, show nothing
    },
  },

  // ---- NETWORK ERRORS (for RevenueCat only) ----
  'network_error': {
    severity: 'silent',
    shouldReport: false,
    // App is fully offline — this only affects premium validation
    // Use cached status
  },
};
```

### 12.2 Error UI Components

```typescript
// Toast: non-intrusive, bottom of screen, auto-dismiss 3s
// Alert: modal dialog with OK button, blocks interaction
// Silent: logged only, no user-facing indication
// Fallback: execute alternative action, optionally show toast

// Translation keys for error messages:
// Add to all locale files under "errors" namespace:
{
  "errors": {
    "audioSession": "Timer sounds may not work correctly",
    "soundLoad": "Could not load sounds. Using defaults.",
    "dbInit": "Could not initialize storage. Workout history may not be saved.",
    "saveFail": "Could not save workout. Please try again.",
    "purchaseFail": "Purchase could not be completed. You have not been charged.",
    "restoreFail": "Could not restore purchases. Please try again or contact support.",
    "timerError": "Timer encountered an error. Restarting...",
    "generic": "Something went wrong. Please try again."
  }
}
```

### 12.3 Crash Reporting

```typescript
// MVP: use expo-insights or Sentry (free tier)
// Setup in app/_layout.tsx root

import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_DSN',
  enableInExpoDevelopment: false,
  debug: __DEV__,
});

// Wrap error handler:
function handleError(key: string, error: Error, context?: Record<string, any>): void {
  const config = errorConfigs[key] || { severity: 'silent', shouldReport: true };

  if (config.shouldReport) {
    Sentry.captureException(error, { extra: { key, ...context } });
    analytics.track({ name: `error_${key}` as any, params: { error: error.message, ...context } });
  }

  if (config.fallbackAction) {
    config.fallbackAction();
  }

  switch (config.severity) {
    case 'toast':
      showToast(i18n.t(config.userMessage || 'errors.generic'));
      break;
    case 'alert':
      Alert.alert(i18n.t('common.ok'), i18n.t(config.userMessage || 'errors.generic'));
      break;
  }
}
```

---

## 13. Sound Asset Specification

### 13.1 File Requirements

| Property | Requirement |
|----------|-------------|
| Format | `.wav` (uncompressed, no decoding delay) |
| Sample Rate | 44100 Hz |
| Bit Depth | 16-bit |
| Channels | Mono |
| Max Duration | 1.5 seconds per sound |
| Max File Size | 200KB per sound |
| Naming Convention | `{pack}_{event}.wav` |

### 13.2 Sound Files Per Pack

```
assets/sounds/
  minimal/
    minimal_work_start.wav       — clean high beep (0.3s)
    minimal_rest_start.wav       — clean low beep (0.3s)
    minimal_countdown_3.wav      — short tick (0.1s)
    minimal_countdown_2.wav      — short tick (0.1s)
    minimal_countdown_1.wav      — short tick, slightly louder (0.15s)
    minimal_set_complete.wav     — double beep ascending (0.5s)
    minimal_workout_complete.wav — triple beep ascending (0.8s)

  energetic/
    energetic_work_start.wav     — punchy synth hit (0.4s)
    energetic_rest_start.wav     — soft chime (0.3s)
    energetic_countdown_3.wav    — electronic tick (0.15s)
    energetic_countdown_2.wav    — electronic tick (0.15s)
    energetic_countdown_1.wav    — electronic tick, louder (0.2s)
    energetic_set_complete.wav   — rising synth sweep (0.6s)
    energetic_workout_complete.wav — victory fanfare short (1.0s)
```

### 13.3 Premium Sound Packs (file structure same, different sounds)

```
  bell/       — Boxing bell ring, corner bell, traditional gym sounds
  whistle/    — Coach whistle blasts, referee style
  digital/    — Sci-fi blips, futuristic computer sounds
  zen/        — Singing bowl, soft gong, meditation bell
```

### 13.4 Sound Sourcing Options
1. **Generate with AI:** Tools like ElevenLabs SFX or Soundraw
2. **Free sound libraries:** Freesound.org (check licenses — need CC0 or similar)
3. **Create manually:** GarageBand / Audacity — simple beeps are easy to synthesize
4. **Purchase:** Envato Elements sound packs ($16.50/mo, cancel after download)

---

## 14. App Icon & Splash Specification

### 14.1 App Icon

**Concept:** A stylized timer/stopwatch silhouette with gradient fill matching the "Vivid" theme (green→teal), on a dark background. Simple, recognizable at 29×29px.

```
Design specs:
- Size: 1024×1024px (Apple requirement, auto-scaled for all sizes)
- Shape: Auto-masked by iOS (rounded rect) and Android (adaptive icon)
- Background: #0D0D0F (near-black)
- Foreground: Gradient timer icon (green #00C853 → teal #00BFA5)
- No text in icon (too small to read at app grid size)
- Icon should work on both light and dark home screens
- Style: bold, geometric, minimal — matches glassmorphism aesthetic

Delivery:
- icon.png (1024×1024) in assets/
- adaptive-icon.png (1024×1024, with safe area padding) for Android
```

### 14.2 Splash Screen

```
Design specs:
- Background: match system theme (dark: #000000, light: #F2F2F7)
- Center: app icon at ~120px + "FitTimer" text below in 24px weight 600
- No tagline (keep it fast and clean)
- Duration: show until app is ready (fonts loaded, stores hydrated)

Config in app.config.ts:
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  }
```
