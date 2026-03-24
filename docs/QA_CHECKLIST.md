# FitTimer — QA Checklist
## Version 2.0

---

## 1. Timer Engine (CRITICAL — test first)

### Accuracy
- [ ] Counts down 1 second per second (no drift over 10-min test)
- [ ] Phase transitions fire at exactly 0 (not -1 or 1)
- [ ] Total workout time matches template calculation (±2s)
- [ ] Round counter: increments after each rest→work
- [ ] Set counter: increments after restBetweenSets→work
- [ ] No skipped phases, no double-counted rounds
- [ ] Skip forward: jumps to next phase, correct round/set
- [ ] Skip backward: resets current phase to beginning
- [ ] Pause: freezes at exact second. Resume: continues from that second
- [ ] Stop: saves workout (with was_completed flag), returns home

### Background Execution
- [ ] Timer survives 5 min backgrounded (iOS)
- [ ] Timer survives 10 min backgrounded (iOS)
- [ ] Timer survives 30 min backgrounded (iOS)
- [ ] Timer survives 5 min backgrounded (Android)
- [ ] Timer survives 30 min backgrounded (Android)
- [ ] Timer survives screen lock (iOS)
- [ ] Timer survives screen lock (Android)
- [ ] Foreground recalculation: correct position after 1 min background
- [ ] Foreground recalculation: correct position after 10 min background
- [ ] Sounds play while backgrounded
- [ ] Sounds play while screen locked
- [ ] Fallback notifications fire for phase transitions
- [ ] NOT killed by iOS memory management (normal conditions)
- [ ] NOT killed by Android Doze mode
- [ ] Phone call interruption → pause → resume after call works

### Edge Cases
- [ ] 1 round, 1 set → works
- [ ] 0s rest (work-only timer) → works
- [ ] 0s prepare → starts at work immediately
- [ ] 0s cooldown → goes to completed after last work
- [ ] Max values (100 rounds, 20 sets, 3600s work) → no crash
- [ ] Rapid start/stop/start → no zombie timers
- [ ] Stop during prepare → doesn't save empty workout
- [ ] Timer running + app killed → clean state on next launch

---

## 2. Audio System (CRITICAL — #1 differentiator)

### Sound Playback
- [ ] Work start sound plays
- [ ] Rest start sound plays
- [ ] Countdown 3-2-1 sounds play at correct seconds
- [ ] Workout complete sound plays
- [ ] Set complete sound plays
- [ ] Volume respects timerVolume setting
- [ ] Sounds play on silent mode (iOS ringer switch OFF)
- [ ] Sounds play through wired headphones
- [ ] Sounds play through Bluetooth (AirPods, etc.)
- [ ] Sounds play through Bluetooth speakers

### Music Coexistence (MOST CRITICAL TESTS)
- [ ] Spotify playing → start timer → music continues uninterrupted
- [ ] Apple Music playing → start timer → music continues
- [ ] YouTube Music playing → start timer → music continues
- [ ] Podcast playing → start timer → audio continues
- [ ] Music ducks slightly during timer sounds, returns to normal
- [ ] Music does NOT pause when timer starts
- [ ] Music does NOT pause on phase transition
- [ ] Music does NOT pause when timer completes
- [ ] Music does NOT pause when timer is stopped

### Haptics
- [ ] Haptic on phase transitions (iPhone)
- [ ] Haptic on countdown 3-2-1 (iPhone)
- [ ] Vibration on phase transitions (Android)
- [ ] Haptics toggle OFF → no vibration
- [ ] Success haptic on workout complete

---

## 3. UI & Design (BRAND-CRITICAL)

### Glassmorphism
- [ ] Glass cards render correctly in light mode (frosted white)
- [ ] Glass cards render correctly in dark mode (frosted dark)
- [ ] Bottom tab bar: blur visible, content scrolls behind it
- [ ] Timer control buttons: glass effect visible over gradient
- [ ] Bottom sheets: glass background with blur
- [ ] Glass surfaces have 0.5px border (visible but subtle)
- [ ] No performance drop from blur effects (60fps)
- [ ] expo-blur renders correctly on Android API 26-30 (fallback if needed)

### Animated Gradients (Timer Screen)
- [ ] Gradient background displays for each phase (correct colors)
- [ ] Phase transition: gradient animates smoothly (400ms, no flash)
- [ ] Gradient breathing effect: subtle ±5% oscillation (4s loop)
- [ ] Gradient renders correctly on all screen sizes
- [ ] No gradient banding (smooth color transitions)

### Circular Progress Ring
- [ ] Ring fills clockwise, proportional to time remaining
- [ ] Ring animation is smooth (not stepping per second)
- [ ] Ring track: white at 15% opacity
- [ ] Ring progress: white at 100%
- [ ] Ring resets on phase change
- [ ] Countdown pulse: ring scales 1.08x on 3-2-1 seconds
- [ ] Ring centered on screen with timer number inside

### Timer Display
- [ ] Numbers use tabular-nums (fixed width, no jitter)
- [ ] Font weight ultralight (200) renders correctly iOS
- [ ] Font weight ultralight (200) renders correctly Android
- [ ] Font sizes: Normal(72), Large(96), XLarge(120) all fit screen
- [ ] Phase label: uppercase, letter-spacing 6, bold 800
- [ ] Round/set info: visible but secondary (70% opacity)
- [ ] Next phase preview: glass pill, correct next phase shown
- [ ] Total elapsed: small, bottom, 40% opacity

### Workout Complete Screen
- [ ] Checkmark circle draws clockwise (500ms)
- [ ] Checkmark draws left-to-right (300ms, starts at 400ms)
- [ ] Scale bounce on completion
- [ ] Stats grid shows: duration, rounds, streak, sets
- [ ] "Done" button returns to home

### Theme System
- [ ] System theme follows device setting
- [ ] Manual light override works
- [ ] Manual dark override works
- [ ] Color theme applies to timer gradient
- [ ] Premium themes show lock for free users
- [ ] Theme change persists after app restart

### Responsive Layout
- [ ] iPhone SE (375×667) — all elements visible, no overlap
- [ ] iPhone 14 (390×844) — ideal layout
- [ ] iPhone 16 Pro Max (430×932) — uses extra space well
- [ ] Small Android (360×640) — no clipping
- [ ] Large Android (412×915) — proper spacing
- [ ] Safe area: Dynamic Island respected
- [ ] Safe area: home indicator respected
- [ ] Safe area: Android status bar respected

---

## 4. Templates & Custom Timers

- [ ] All 7 presets display with correct values
- [ ] Presets show unique icon and gradient color
- [ ] Presets cannot be deleted (only duplicated)
- [ ] Custom timer creation: all fields work
- [ ] Timer name: required, max 50 chars validated
- [ ] Duration pickers: intuitive, prevent invalid values
- [ ] Total duration preview updates in real-time
- [ ] Save → appears in My Timers
- [ ] Edit → fields pre-filled, save updates existing
- [ ] Duplicate → creates copy with "Copy of" prefix
- [ ] Delete → confirmation dialog, then removed
- [ ] Favorite → star toggle, persists
- [ ] Free user: 4th custom timer → paywall shown
- [ ] Timer data persists after force close

---

## 5. Calendar & Streak

- [ ] Calendar shows current month
- [ ] Previous/next month navigation works
- [ ] Workout dots appear on correct dates
- [ ] Dot uses accent gradient color
- [ ] Today has accent ring highlight
- [ ] Tap on day with workouts → shows detail
- [ ] Day detail shows workout list (name, duration, completed?)
- [ ] Streak counter: correct consecutive days
- [ ] Streak badge on home screen matches calendar
- [ ] Streak breaks correctly on missed day
- [ ] Today without workout: streak still shows (breaks tomorrow)
- [ ] Weekly summary: correct count and minutes
- [ ] Free user: history limited to 7 days (paywall for older)
- [ ] Month boundaries: 28/29/30/31 days correct

---

## 6. Onboarding

- [ ] Shows only on first launch
- [ ] Does NOT show on subsequent launches
- [ ] Screen 1: value prop, continue button
- [ ] Screen 2: category selection, persists preference
- [ ] Screen 3: notification permission
- [ ] Skip: sets onboarding complete, uses defaults
- [ ] Complete: navigates to home, presets sorted by preference

---

## 7. Premium & Monetization

- [ ] Paywall displays on premium feature access
- [ ] Feature comparison accurate
- [ ] Monthly/yearly/lifetime prices correct
- [ ] Purchase flow works (iOS sandbox)
- [ ] Purchase flow works (Android test)
- [ ] Premium activates immediately after purchase
- [ ] Premium features unlock (unlimited timers, full history, all themes, all sounds, no ads)
- [ ] Restore purchases works
- [ ] Subscription renewal works
- [ ] Banner ads on home screen (free tier)
- [ ] NO ads during active timer (ever)
- [ ] NO ads for premium users
- [ ] Ad load failure → no crash, no empty space

---

## 8. Performance

- [ ] Cold start: < 2 seconds to interactive
- [ ] Timer screen load: < 500ms
- [ ] Timer countdown: 60fps, no jank
- [ ] Home screen scroll: 60fps
- [ ] Calendar month switch: no lag
- [ ] Memory: < 150MB during timer
- [ ] No memory leaks (start/stop 10 timers)
- [ ] Battery: < 5% for 30-min session
- [ ] Download size: < 30MB

---

## 9. Platform Specific

### iOS
- [ ] Builds on iOS 16+
- [ ] App Store review compliant
- [ ] Privacy nutrition labels accurate
- [ ] ATT prompt if ads track

### Android
- [ ] Builds on API 26+ (Android 8)
- [ ] Works with battery saver ON
- [ ] Back button works correctly on all screens
- [ ] Foreground notification during active timer
- [ ] Notification channel configured

---

## 10. Offline & Error Handling

- [ ] Full functionality with no internet
- [ ] Low storage: graceful error on workout save
- [ ] Force quit during timer → clean state next launch
- [ ] Rapid taps on start → only one timer starts
- [ ] Date change during streak → no corruption
- [ ] Timezone change → streak intact

---

## 11. Analytics & Error Handling

### Analytics
- [ ] All core events fire correctly (check console in dev mode)
- [ ] timer_start fires with correct template params
- [ ] timer_complete fires with correct duration/rounds
- [ ] timer_stop fires with correct completion_pct
- [ ] paywall_view fires with correct trigger source
- [ ] purchase_complete fires after successful purchase
- [ ] streak_milestone fires at 7, 14, 30 days
- [ ] No analytics events fire in development mode (unless logging)

### Error Handling
- [ ] Audio play failure → haptic fallback fires, no crash
- [ ] Sound pack load failure → falls back to "Minimal", toast shown
- [ ] SQLite write failure → toast "Could not save", workout not lost
- [ ] SQLite read failure → empty state shown, no crash
- [ ] RevenueCat init failure → cached premium status used
- [ ] Purchase failure → alert shown, user not charged confirmed
- [ ] Ad load failure → ad container hidden, no empty space
- [ ] Timer interval failure → auto-restart, toast shown
- [ ] Background timer drift > 5s → recalculated correctly
- [ ] No unhandled promise rejections in any flow
- [ ] Sentry receives error reports (test with forced error)

### i18n Verification
- [ ] Zero hardcoded strings in entire codebase (grep check passes)
- [ ] All 10 languages load correctly
- [ ] Language switch in settings works without app restart
- [ ] RTL layout works for Arabic (all screens)
- [ ] Interpolated values ({{count}}, {{time}}) render correctly
- [ ] Long translations don't break layout (German is typically longest)
- [ ] Calendar month/weekday names correct in all languages
- [ ] Timer phase labels correct in all languages
