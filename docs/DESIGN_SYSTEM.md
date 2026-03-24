# FitTimer — Design System
## Version 2.0

---

## 1. Design Philosophy

**"Glassmorphic Athletic"** — Where Apple Vision Pro meets the gym floor.

Every competitor in this space looks the same: neon green numbers on flat black backgrounds, ugly yellow/red phase indicators, and UI that screams "2018 Android app." FitTimer breaks this pattern completely.

**Our visual signature has three pillars:**

1. **Glassmorphism everywhere** — Frosted glass cards, translucent bottom bar, blurred overlays. The UI feels like it's floating on layers of frosted glass. This is achieved via `expo-blur` (BlurView) with `intensity={60-80}` and semi-transparent backgrounds (`rgba(255,255,255,0.12)` in dark mode, `rgba(255,255,255,0.7)` in light mode).

2. **Living gradient backgrounds** — The timer screen isn't a static color. It's an animated gradient that breathes and shifts based on the current phase. Work = energetic green-to-teal gradient. Rest = calm indigo-to-purple gradient. Transitions are smooth 400ms animated blends. This single detail makes screenshots look unlike anything else in the App Store.

3. **Confident energy** — Bold countdown numbers in ultralight weight (counterintuitive — thin = premium), punchy micro-animations on phase transitions, and a circular progress ring that fills with satisfying smoothness.

**The acid test:** If you took a screenshot of our timer screen and put it next to every competitor's, would a stranger immediately pick ours as "the premium one"? That's the bar.

---

## 2. Color System

### 2.1 Base Palette (Adaptive Light/Dark)

```typescript
export const colors = {
  light: {
    background:          '#F2F2F7',    // system grouped bg
    backgroundPrimary:   '#FFFFFF',    // card/surface bg
    backgroundSecondary: '#F2F2F7',    // page bg
    backgroundTertiary:  '#E5E5EA',    // inset bg

    text:                '#000000',
    textSecondary:       '#3C3C43',    // 60% opacity equivalent
    textTertiary:        '#8E8E93',

    border:              'rgba(0,0,0,0.08)',
    borderMedium:        'rgba(0,0,0,0.15)',

    // Glassmorphism
    glass:               'rgba(255,255,255,0.72)',
    glassBorder:         'rgba(255,255,255,0.5)',
    glassBlurIntensity:  80,

    // Tab bar
    tabBarGlass:         'rgba(249,249,249,0.85)',
    tabBarBorder:        'rgba(0,0,0,0.06)',
  },

  dark: {
    background:          '#000000',
    backgroundPrimary:   '#1C1C1E',
    backgroundSecondary: '#000000',
    backgroundTertiary:  '#2C2C2E',

    text:                '#FFFFFF',
    textSecondary:       '#EBEBF5',    // 60% opacity equivalent
    textTertiary:        '#8E8E93',

    border:              'rgba(255,255,255,0.08)',
    borderMedium:        'rgba(255,255,255,0.15)',

    // Glassmorphism
    glass:               'rgba(40,40,42,0.65)',
    glassBorder:         'rgba(255,255,255,0.1)',
    glassBlurIntensity:  60,

    // Tab bar
    tabBarGlass:         'rgba(30,30,30,0.75)',
    tabBarBorder:        'rgba(255,255,255,0.06)',
  }
};
```

### 2.2 Phase Colors — The Hero Palette

Each phase has a **gradient pair** (used for timer background) and a **solid color** (used for UI elements like badges, dots).

```typescript
export const phaseColors = {
  work: {
    gradient:    ['#00C853', '#00BFA5'],   // Green → Teal (energetic)
    solid:       '#00C853',
    label:       'WORK',
    glowColor:   'rgba(0,200,83,0.25)',    // Ambient glow on timer screen
  },
  rest: {
    gradient:    ['#536DFE', '#7C4DFF'],   // Indigo → Purple (calm recovery)
    solid:       '#536DFE',
    label:       'REST',
    glowColor:   'rgba(83,109,254,0.25)',
  },
  prepare: {
    gradient:    ['#FF9100', '#FF6D00'],   // Amber → Deep Orange (attention)
    solid:       '#FF9100',
    label:       'GET READY',
    glowColor:   'rgba(255,145,0,0.25)',
  },
  restBetweenSets: {
    gradient:    ['#448AFF', '#2979FF'],   // Blue → Blue (set break)
    solid:       '#448AFF',
    label:       'SET BREAK',
    glowColor:   'rgba(68,138,255,0.25)',
  },
  cooldown: {
    gradient:    ['#00B0FF', '#0091EA'],   // Light Blue → Blue (wind down)
    solid:       '#00B0FF',
    label:       'COOLDOWN',
    glowColor:   'rgba(0,176,255,0.25)',
  },
  completed: {
    gradient:    ['#AA00FF', '#D500F9'],   // Purple → Pink-Purple (achievement)
    solid:       '#AA00FF',
    label:       'COMPLETE',
    glowColor:   'rgba(170,0,255,0.25)',
  },
};
```

### 2.3 Accent & Semantic Colors

```typescript
export const semantic = {
  accent:     '#007AFF',    // Primary actions, links
  success:    '#34C759',    // Completed workouts, streaks
  warning:    '#FF9500',    // Attention needed
  error:      '#FF3B30',    // Destructive actions, stop button
  premium:    '#FFD60A',    // Premium badge, crown icon
  streak:     '#FF6B35',    // Streak flame color
};
```

### 2.4 Color Themes (10 total, 3 free + 7 premium)

Each theme overrides the phase gradient colors during active timer:

```typescript
export const colorThemes = [
  // FREE
  { id: 'vivid',    name: 'Vivid',    isPremium: false, work: ['#00C853','#00BFA5'], rest: ['#536DFE','#7C4DFF'], prepare: ['#FF9100','#FF6D00'], cooldown: ['#00B0FF','#0091EA'] },
  { id: 'ocean',    name: 'Ocean',    isPremium: false, work: ['#0288D1','#0277BD'], rest: ['#1565C0','#0D47A1'], prepare: ['#00ACC1','#00838F'], cooldown: ['#4FC3F7','#29B6F6'] },
  { id: 'sunset',   name: 'Sunset',   isPremium: false, work: ['#FF7043','#F4511E'], rest: ['#AB47BC','#8E24AA'], prepare: ['#FFA726','#FB8C00'], cooldown: ['#EC407A','#D81B60'] },

  // PREMIUM
  { id: 'neon',     name: 'Neon',     isPremium: true, work: ['#76FF03','#64DD17'], rest: ['#E040FB','#D500F9'], prepare: ['#FFEA00','#FFD600'], cooldown: ['#18FFFF','#00E5FF'] },
  { id: 'midnight', name: 'Midnight', isPremium: true, work: ['#90CAF9','#64B5F6'], rest: ['#CE93D8','#BA68C8'], prepare: ['#FFCC80','#FFB74D'], cooldown: ['#80DEEA','#4DD0E1'] },
  { id: 'forest',   name: 'Forest',   isPremium: true, work: ['#66BB6A','#43A047'], rest: ['#5C6BC0','#3F51B5'], prepare: ['#FFA726','#FB8C00'], cooldown: ['#26A69A','#00897B'] },
  { id: 'fire',     name: 'Fire',     isPremium: true, work: ['#FF5252','#FF1744'], rest: ['#FF4081','#F50057'], prepare: ['#FFD740','#FFC400'], cooldown: ['#FF6E40','#FF3D00'] },
  { id: 'arctic',   name: 'Arctic',   isPremium: true, work: ['#E0F7FA','#B2EBF2'], rest: ['#E8EAF6','#C5CAE9'], prepare: ['#FFF8E1','#FFECB3'], cooldown: ['#E0F2F1','#B2DFDB'] },
  { id: 'mono',     name: 'Monochrome', isPremium: true, work: ['#BDBDBD','#9E9E9E'], rest: ['#757575','#616161'], prepare: ['#E0E0E0','#BDBDBD'], cooldown: ['#9E9E9E','#757575'] },
  { id: 'candy',    name: 'Candy',    isPremium: true, work: ['#F48FB1','#EC407A'], rest: ['#CE93D8','#AB47BC'], prepare: ['#FFF176','#FFEE58'], cooldown: ['#80CBC4','#4DB6AC'] },
];
```

---

## 3. Typography

```typescript
export const typography = {
  // === TIMER DISPLAY (the hero) ===
  timerCountdown: {
    fontFamily: 'System',           // SF Pro Display (iOS) / Roboto (Android)
    fontVariant: ['tabular-nums'],  // CRITICAL: fixed-width digits, no jitter during countdown
    fontWeight: '200' as const,     // Ultralight — thin = premium, unexpected = memorable
    letterSpacing: -3,
    sizes: {
      normal:  72,
      large:   96,
      xlarge:  120,
    },
  },

  // === PHASE LABEL ("WORK", "GET READY") ===
  phaseLabel: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '800' as const,
    letterSpacing: 6,               // Extra wide tracking — athletic feel
    textTransform: 'uppercase' as const,
  },

  // === HEADINGS ===
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.3 },
  h3: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0 },

  // === BODY ===
  body:      { fontSize: 17, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20 },
  caption:   { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },

  // === LABELS ===
  label:     { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
  badge:     { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.3 },

  // === STATS/NUMBERS ===
  statNumber: { fontSize: 28, fontWeight: '700' as const, fontVariant: ['tabular-nums'] },
  statLabel:  { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
};
```

---

## 4. Spacing & Layout

```typescript
export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
  huge: 48,
};

export const layout = {
  screenPadding:    20,     // horizontal page padding
  cardPadding:      16,
  cardRadius:       20,     // generously rounded — modern feel
  cardRadiusSmall:  14,
  buttonRadius:     14,
  pillRadius:       999,
  inputRadius:      12,

  // Glassmorphism card
  glassCardRadius:  20,
  glassCardPadding: 16,

  // Bottom tab bar
  tabBarHeight:     88,     // includes safe area
  tabBarBlurIntensity: 80,

  // Active timer
  timerRingSize:    280,    // diameter of circular progress ring
  timerRingStroke:  8,      // stroke width of ring
  controlButtonSize: 64,    // play/pause/skip buttons
  stopButtonSize:   56,
};
```

---

## 5. Glassmorphism Implementation Guide

This is our visual signature. Every glass surface must follow these specs exactly:

### 5.1 Glass Card (used for timer cards, stat cards, bottom sheets)

```typescript
// Component pattern using expo-blur
import { BlurView } from 'expo-blur';

// Dark mode glass card
<BlurView
  intensity={60}
  tint="dark"
  style={{
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  }}
>
  <View style={{
    backgroundColor: 'rgba(40,40,42,0.65)',
    padding: 16,
  }}>
    {/* Card content */}
  </View>
</BlurView>

// Light mode glass card
<BlurView
  intensity={80}
  tint="light"
  style={{
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.5)',
  }}
>
  <View style={{
    backgroundColor: 'rgba(255,255,255,0.72)',
    padding: 16,
  }}>
    {/* Card content */}
  </View>
</BlurView>
```

### 5.2 Glass Bottom Tab Bar (SIGNATURE ELEMENT)

The tab bar is a frosted glass strip floating at the bottom. This alone differentiates us from every competitor.

```typescript
// Custom tab bar with glassmorphism
<BlurView
  intensity={isDark ? 60 : 80}
  tint={isDark ? 'dark' : 'light'}
  style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 88,                                  // includes safe area
    borderTopWidth: 0.5,
    borderTopColor: isDark
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)',
  }}
>
  <View style={{
    backgroundColor: isDark
      ? 'rgba(30,30,30,0.75)'
      : 'rgba(249,249,249,0.85)',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: safeAreaInsets.bottom,
  }}>
    {/* Tab items */}
  </View>
</BlurView>
```

### 5.3 Glass Control Buttons (Active Timer)

During active timer, pause/skip/stop buttons are frosted glass circles floating over the gradient background:

```typescript
<BlurView
  intensity={40}
  tint="dark"
  style={{
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  }}
>
  <Pressable style={{
    backgroundColor: 'rgba(255,255,255,0.12)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <PauseIcon color="#FFFFFF" size={28} />
  </Pressable>
</BlurView>
```

### 5.4 Glass Bottom Sheet (Stop Confirmation, Day Detail)

```typescript
<BlurView intensity={90} tint={isDark ? 'dark' : 'light'}
  style={{
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  }}
>
  <View style={{
    backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)',
    padding: 24,
  }}>
    {/* Bottom sheet content */}
  </View>
</BlurView>
```

---

## 6. Component Specifications

### 6.1 Timer Preset Card (Home Screen)

```
┌────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐  │  ← Glass card (BlurView)
│  │ ● Tabata Classic                     │  │  ← Phase dot (gradient) + name (bold)
│  │ 20s work · 10s rest · 8 rounds      │  │  ← Config summary (textTertiary)
│  │                                      │  │
│  │ 4:10 total              [▶ START]   │  │  ← Duration + glass start button
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘

- Phase dot: 10px circle with gradient fill matching template category
- Start button: pill shape, accent color bg, white text, 44px height
- On press: scale down to 0.96 (100ms spring animation)
- Horizontal scroll for Quick Start section, vertical list for My Timers
```

### 6.2 Active Timer Screen (HERO SCREEN)

```
┌────────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← Linear progress bar (3px, white 40% opacity)
│                                            │
│                                            │  ← Animated gradient background
│              GET READY                     │  ← Phase label (800 weight, 6px tracking, uppercase)
│                                            │
│           ╭──────────────╮                 │
│          ╱                ╲                │  ← Circular progress ring (280px)
│         │                  │               │     Stroke: 8px, white 30% opacity (track)
│         │      0:14        │               │     Stroke: 8px, white 100% (progress, animated)
│         │                  │               │     Timer number inside (ultralight 200, 72-120px)
│          ╲                ╱                │
│           ╰──────────────╯                 │
│                                            │
│           Round 3 of 8                     │  ← Round info (white 70% opacity)
│           Set 1 of 3                       │  ← Set info (white 50% opacity)
│                                            │
│    ┌──────────────────────────────┐        │
│    │  ↑ Next: REST · 0:10        │        │  ← Next phase preview (glass pill)
│    └──────────────────────────────┘        │
│                                            │
│     [⏪]      [ ⏸ ]      [⏩]             │  ← Glass control buttons (64px circles)
│                                            │
│              02:34 elapsed                 │  ← Total time (white 40% opacity, small)
│                                            │
│         ━━━ swipe down to stop ━━━         │  ← Hint text (white 20% opacity)
└────────────────────────────────────────────┘

GRADIENT BACKGROUND BEHAVIOR:
- Full screen animated linear gradient using expo-linear-gradient
- Gradient direction: top-left → bottom-right (diagonal)
- Phase transition: gradient colors animate over 400ms (react-native-reanimated interpolateColor)
- Subtle ambient pulse: gradient endpoint shifts ±5% on a 4-second loop (breathing effect)
- Glow effect: radial gradient overlay behind the circular ring (phaseColor at 25% opacity)

CIRCULAR PROGRESS RING:
- react-native-svg <Circle> with strokeDasharray/strokeDashoffset animation
- Track: white at 15% opacity, 8px stroke
- Progress: white at 100%, 8px stroke, rounded linecap
- Fills clockwise, animated smoothly via reanimated shared values
- On countdown 3-2-1: ring pulses (scale 1.0 → 1.05 → 1.0, 200ms)

LINEAR PROGRESS BAR:
- Top of screen, 3px height, full width
- Track: white at 10% opacity
- Progress: white at 40% opacity
- Shows progress within current phase (not total workout)

CONTROL BUTTONS:
- 3 glass circles in a row, centered
- Left: skip-back (go to phase start) — 56px
- Center: pause/resume — 64px (slightly larger, primary action)
- Right: skip-forward (jump to next phase) — 56px
- All use BlurView + rgba(255,255,255,0.12) bg
```

### 6.3 Workout Complete Screen

```
┌────────────────────────────────────────────┐
│                                            │  ← Gradient bg: completed phase colors
│                                            │
│              ✓                             │  ← Animated checkmark (draw-in animation, 800ms)
│                                            │     Circle: white stroke, scales in
│         Workout Complete!                  │     Check: white, draws left-to-right
│                                            │
│    ┌──────────────────────────────┐        │
│    │  ⏱ 18:40     🔄 18 rounds  │        │  ← Glass stat cards (2x2 grid)
│    │  Duration     Rounds        │        │
│    ├──────────────────────────────┤        │
│    │  🔥 12 days   📊 3 sets    │        │
│    │  Streak       Sets          │        │
│    └──────────────────────────────┘        │
│                                            │
│         [ Done ]                           │  ← Primary button (white, full width)
│                                            │
└────────────────────────────────────────────┘

CHECKMARK ANIMATION (800ms total):
1. Circle draws clockwise (0→360°) over 500ms, ease-out
2. Checkmark path draws left→right over 300ms, ease-out, starts at 400ms
3. Slight scale bounce on completion (1.0 → 1.1 → 1.0)
```

### 6.4 Calendar Screen

```
┌────────────────────────────────────────────┐
│  History                                   │  ← Screen title (h1)
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  🔥 12 day streak                   │  │  ← Glass streak badge
│  │  ████████████░░░░ Best: 23 days     │  │  ← Progress bar toward best
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  ◀  March 2026  ▶                  │  │  ← Month nav (glass card)
│  │  Mo  Tu  We  Th  Fr  Sa  Su        │  │
│  │                                      │  │  ← Calendar grid
│  │              1   2   3   4          │  │  ← Numbers in grid
│  │   5   6   7   8   9  10  11        │  │
│  │  ●        ●   ●      ●             │  │  ← Gradient dots = workout done
│  │  12  13  14  15  16  17  18        │  │
│  │   ●       ●   ●   ●                │  │
│  │  19  20  21  22  23  24  25        │  │
│  │   ●   ●  ◉                          │  │  ← ◉ = today (accent ring)
│  │  26  27  28  29  30  31            │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  This Week                          │  │  ← Weekly summary (glass card)
│  │  4 workouts  ·  32 min total       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ╔════ Glassmorphism Tab Bar ════════════╗ │
└────────────────────────────────────────────┘

WORKOUT DOTS:
- 6px circles below the date number
- Filled with current theme's accent gradient
- Multiple workouts = wider pill (proportional to count)
- Today: 2px accent ring around date number
```

### 6.5 Bottom Tab Bar (SIGNATURE)

```
╔════════════════════════════════════════════════╗
║                                                ║  ← BlurView (expo-blur)
║    ⏱        📅         ⚙                    ║  ← intensity: 60-80
║   Timer    History   Settings                  ║  ← bg: rgba glass overlay
║                                                ║  ← 0.5px top border
╚════════════════════════════════════════════════╝

- Active tab: accent color icon + label
- Inactive tab: textTertiary color icon + label
- Active indicator: small 4px dot below active icon (accent gradient)
- Tab bar floats over content (absolute positioned)
- Content scrolls BEHIND the glass — visible through the blur
```

---

## 7. Animation Specifications

```typescript
export const animations = {
  // Phase transition (gradient color change)
  phaseTransition: {
    duration: 400,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),   // Material ease
    // interpolateColor between current and next gradient pair
  },

  // Ambient gradient breathing
  gradientBreathing: {
    duration: 4000,
    loop: true,
    // Gradient end position oscillates ±5% creating subtle "alive" feel
    // Only active during timer, not idle
  },

  // Countdown pulse (3, 2, 1)
  countdownPulse: {
    scale: { from: 1.0, to: 1.08, back: 1.0 },
    duration: 200,
    easing: Easing.bezier(0.0, 0.0, 0.2, 1),
    // Timer number and ring pulse simultaneously
  },

  // Circular progress ring
  progressRing: {
    // Smooth continuous animation via reanimated shared value
    // strokeDashoffset interpolated based on secondsRemaining / totalPhaseSeconds
    duration: 1000,  // each second tick is animated, not snapped
  },

  // Card press feedback
  cardPress: {
    scale: 0.96,
    duration: 100,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  // Workout complete checkmark
  checkmarkDraw: {
    circleDuration: 500,
    checkDuration: 300,
    checkDelay: 400,       // starts before circle finishes
    bounceScale: { to: 1.1, duration: 200 },
    easing: Easing.out(Easing.cubic),
  },

  // Timer screen enter
  timerEnter: {
    type: 'fade-scale',
    scale: { from: 0.92, to: 1.0 },
    opacity: { from: 0, to: 1 },
    duration: 400,
  },

  // Tab switch
  tabSwitch: {
    type: 'crossfade',
    duration: 200,
  },

  // List item stagger (home screen cards)
  listStagger: {
    delayPerItem: 60,
    translateY: { from: 20, to: 0 },
    opacity: { from: 0, to: 1 },
    duration: 350,
  },
};
```

---

## 8. Iconography

Library: `lucide-react-native` (consistent, clean line icons)

| Context | Icon name | Size |
|---------|-----------|------|
| Play | `play` | 28 |
| Pause | `pause` | 28 |
| Stop | `square` | 24 |
| Skip forward | `skip-forward` | 24 |
| Skip back | `skip-back` | 24 |
| Timer tab | `timer` | 24 |
| History tab | `calendar-days` | 24 |
| Settings tab | `settings` | 24 |
| Add | `plus` | 24 |
| Edit | `pencil` | 20 |
| Delete | `trash-2` | 20 |
| Duplicate | `copy` | 20 |
| Favorite | `star` | 20 |
| Premium/Crown | `crown` | 16 |
| Streak/Fire | `flame` | 20 |
| Volume | `volume-2` | 20 |
| Check | `check` | 24 |
| Chevron right | `chevron-right` | 20 |
| Close / X | `x` | 24 |
| Drag handle | `grip-vertical` | 20 |

---

## 9. Shadows & Elevation

```typescript
export const shadows = {
  // Light mode only — dark mode uses borders instead
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,  // Android
  },
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  // Glass surfaces don't use shadows — the blur IS the elevation cue
};
```

---

## 10. Accessibility

- Minimum tap target: 44×44 points
- Timer display contrast: ≥ 7:1 (white on gradient — tested against all phase gradients)
- Phase labels ALWAYS accompany color (never rely on color alone)
- VoiceOver: announce phase changes ("Work phase started. 20 seconds remaining.")
- Dynamic Type: supported for non-timer body text
- Reduce Motion: disable gradient breathing, countdown pulse, and checkmark animation
- Reduce Transparency: replace BlurView with solid opaque backgrounds

---

## 11. Platform Adaptations

### iOS
- System font: SF Pro Display (automatically via `fontFamily: 'System'`)
- Native blur: `expo-blur` uses `UIVisualEffectView` under the hood
- Haptics: `expo-haptics` uses `UIImpactFeedbackGenerator`
- Large title headers on Home and History screens
- Safe area: respect Dynamic Island, home indicator

### Android
- System font: Roboto
- Blur: `expo-blur` renders a fallback on older Android — test on API 26-30
- Haptics: vibration API via expo-haptics
- Edge-to-edge: transparent status bar and nav bar
- Material You: optionally extract accent from wallpaper (stretch goal)
- Navigation: predictive back gesture support
```
