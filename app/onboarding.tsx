import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  Bell, ChevronRight, Check, Star,
  Flame, Calendar, Clock,
  Music2, Vibrate,
  Zap, Dumbbell, Activity, RefreshCw, Wind, Timer,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';
import * as StoreReview from 'expo-store-review';
import { usePreferencesStore } from '../src/stores/preferencesStore';
import { useTemplateStore } from '../src/stores/templateStore';
import { layout, spacing } from '../src/constants/spacing';
import { TimerCategory } from '../src/types';

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG         = '#0A0A0A';
const CARD_BG    = '#161616';
const STATS_BG   = '#1E1E1E';
const DIVIDER    = 'rgba(255,255,255,0.08)';
const WORK_COLOR = '#00C853';
const REST_COLOR = '#536DFE';
const PREP_COLOR = '#FF9100';
const TEXT       = '#FFFFFF';
const TEXT_DIM   = 'rgba(255,255,255,0.35)';
const TEXT_MID   = 'rgba(255,255,255,0.65)';

const { width } = Dimensions.get('window');
const TOTAL_SLIDES = 5;

// ─── Types ────────────────────────────────────────────────────────────────────
type StatCell =
  | { kind: 'text'; value: string; color: string; label: string }
  | { kind: 'icon'; icon: React.ReactNode; color: string; label: string };

type FeatureData = {
  accent: string;
  name: string;
  sub: string;
  stats: [StatCell, StatCell, StatCell];
  foot: string;
};

type CategoryItem = {
  id: TimerCategory;
  icon: React.ReactNode;
  label: string;
};

// ─── FeatureCard ──────────────────────────────────────────────────────────────
function FeatureCard({ f }: { f: FeatureData }) {
  return (
    <View style={[fc.card, { backgroundColor: CARD_BG }]}>
      <View style={[fc.accentBar, { backgroundColor: f.accent }]} />
      <View style={fc.inner}>
        <Text style={fc.name}>{f.name}</Text>
        <Text style={[fc.sub, { color: TEXT_MID }]}>{f.sub}</Text>
        <View style={[fc.statsGrid, { backgroundColor: STATS_BG }]}>
          {f.stats.map((cell, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={[fc.divider, { backgroundColor: DIVIDER }]} />}
              <View style={fc.cell}>
                {cell.kind === 'text' ? (
                  <Text style={[fc.val, { color: cell.color }]}>{cell.value}</Text>
                ) : (
                  <View style={fc.iconWrap}>{cell.icon}</View>
                )}
                <Text style={[fc.lbl, { color: TEXT_DIM }]}>{cell.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
        <Text style={[fc.foot, { color: TEXT_DIM }]}>{f.foot}</Text>
      </View>
    </View>
  );
}

const fc = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  accentBar: { width: 5 },
  inner: { flex: 1, padding: layout.cardPadding, gap: spacing.sm },
  name: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
    color: TEXT,
    letterSpacing: -0.5,
  },
  sub: { fontSize: 12, fontWeight: '500' },
  statsGrid: {
    flexDirection: 'row',
    borderRadius: layout.cardRadiusSmall,
    overflow: 'hidden',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: 4,
  },
  iconWrap: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  val: {
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  lbl: { fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  divider: { width: 1, marginVertical: spacing.xs },
  foot: { fontSize: 11, fontWeight: '500', marginTop: 2 },
});

// ─── SectionRow ───────────────────────────────────────────────────────────────
function SectionRow({ label }: { label: string }) {
  return (
    <View style={sr.row}>
      <Text style={sr.label}>{label}</Text>
      <View style={sr.line} />
    </View>
  );
}
const sr = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: TEXT_DIM },
  line: { flex: 1, height: 1, backgroundColor: TEXT_DIM, opacity: 0.4 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const setHasCompletedOnboarding = usePreferencesStore(s => s.setHasCompletedOnboarding);
  const setPreferredCategory      = usePreferencesStore(s => s.setPreferredCategory);
  const setTimerFontSize          = usePreferencesStore(s => s.setTimerFontSize);
  const templates                 = useTemplateStore(s => s.templates);
  const reorderTemplates          = useTemplateStore(s => s.reorderTemplates);

  const [page, setPage]                         = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<TimerCategory | null>(null);
  const [selectedFont, setSelectedFont]         = useState<'normal' | 'large' | 'xlarge'>('normal');

  const isLast = page === TOTAL_SLIDES - 1;

  // ── Feature card data (defined here so JSX icons work) ──────────────────
  const FEATURES: FeatureData[] = [
    {
      accent: WORK_COLOR,
      name: 'INTERVAL TIMER',
      sub: 'Tabata · HIIT · Boxing & more',
      stats: [
        { kind: 'text',  value: '20', color: WORK_COLOR,                    label: 'WORK'   },
        { kind: 'text',  value: '10', color: REST_COLOR,                    label: 'REST'   },
        { kind: 'text',  value: '8',  color: 'rgba(255,255,255,0.45)',       label: 'ROUNDS' },
      ],
      foot: '4m total',
    },
    {
      accent: REST_COLOR,
      name: 'FULL HISTORY',
      sub: 'Streaks · Calendar · Total time',
      stats: [
        { kind: 'icon', icon: <Flame    size={18} color={WORK_COLOR}                  strokeWidth={2} />, color: WORK_COLOR,                 label: 'STREAK'   },
        { kind: 'icon', icon: <Calendar size={18} color={REST_COLOR}                  strokeWidth={2} />, color: REST_COLOR,                 label: 'CALENDAR' },
        { kind: 'icon', icon: <Clock    size={18} color={'rgba(255,255,255,0.45)'}    strokeWidth={2} />, color: 'rgba(255,255,255,0.45)',   label: 'TIME'     },
      ],
      foot: 'Track your progress',
    },
    {
      accent: PREP_COLOR,
      name: 'YOUR MUSIC',
      sub: 'Plays alongside Spotify & Apple Music',
      stats: [
        { kind: 'icon', icon: <Music2   size={18} color={PREP_COLOR}                  strokeWidth={2} />, color: PREP_COLOR,                 label: 'MUSIC'    },
        { kind: 'icon', icon: <Bell     size={18} color={REST_COLOR}                  strokeWidth={2} />, color: REST_COLOR,                 label: 'SOUNDS'   },
        { kind: 'icon', icon: <Vibrate  size={18} color={'rgba(255,255,255,0.45)'}    strokeWidth={2} />, color: 'rgba(255,255,255,0.45)',   label: 'HAPTICS'  },
      ],
      foot: 'Never interrupted',
    },
  ];

  // ── Category data with Lucide icons ──────────────────────────────────────
  const CATEGORIES: CategoryItem[] = [
    { id: 'tabata',     icon: <Zap       size={15} color={TEXT_MID} strokeWidth={2} />, label: 'TABATA'   },
    { id: 'hiit',       icon: <Flame     size={15} color={TEXT_MID} strokeWidth={2} />, label: 'HIIT'     },
    { id: 'boxing',     icon: <Dumbbell  size={15} color={TEXT_MID} strokeWidth={2} />, label: 'BOXING'   },
    { id: 'crossfit',   icon: <Activity  size={15} color={TEXT_MID} strokeWidth={2} />, label: 'CROSSFIT' },
    { id: 'circuit',    icon: <RefreshCw size={15} color={TEXT_MID} strokeWidth={2} />, label: 'CIRCUIT'  },
    { id: 'stretching', icon: <Wind      size={15} color={TEXT_MID} strokeWidth={2} />, label: 'STRETCH'  },
  ];

  const FONT_SIZES: { value: 'normal' | 'large' | 'xlarge'; label: string; size: number }[] = [
    { value: 'normal',  label: 'NORMAL', size: 52 },
    { value: 'large',   label: 'LARGE',  size: 68 },
    { value: 'xlarge',  label: 'XL',     size: 86 },
  ];

  // ── Navigation ───────────────────────────────────────────────────────────
  function goNext() {
    if (isLast) { finish(); return; }
    goToSlide(page + 1);
  }

  function finish() {
    setPreferredCategory(selectedCategory);
    setTimerFontSize(selectedFont);
    if (selectedCategory) {
      const sorted = [...templates].sort((a, b) => {
        if (a.category === selectedCategory && b.category !== selectedCategory) return -1;
        if (b.category === selectedCategory && a.category !== selectedCategory) return 1;
        return 0;
      });
      reorderTemplates(sorted);
    }
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  }

  function skip() {
    setHasCompletedOnboarding(true);
    router.replace('/(tabs)');
  }

  async function requestNotifications() {
    try { await Notifications.requestPermissionsAsync(); } catch {}
    goToSlide(4);
  }

  function goToSlide(index: number) {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setPage(index);
  }

  async function requestRating() {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) await StoreReview.requestReview();
    } catch {}
    finish();
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top, paddingBottom: insets.bottom },
    ]}>

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressPill,
                {
                  backgroundColor: i <= page ? WORK_COLOR : 'rgba(255,255,255,0.12)',
                  flex: i === page ? 2 : 1,
                },
              ]}
            />
          ))}
        </View>
        {!isLast && (
          <Pressable onPress={skip} hitSlop={12}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        )}
      </View>

      {/* ── Slides ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >

        {/* ── Slide 0: Welcome + Features ───────────────────────────────── */}
        <View style={[styles.slide, { width }]}>
          <View style={styles.brandRow}>
            <View style={[styles.brandRing, { borderColor: WORK_COLOR }]}>
              <View style={[styles.brandRingInner, { borderColor: REST_COLOR }]} />
            </View>
            <View>
              <Text style={styles.appName}>INTERVL</Text>
              <Text style={[styles.appTagline, { color: TEXT_DIM }]}>
                INTERVAL TRAINING, PERFECTED
              </Text>
            </View>
          </View>

          <SectionRow label="WHAT YOU GET" />
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} />)}
        </View>

        {/* ── Slide 1: Workout style ─────────────────────────────────────── */}
        <View style={[styles.slide, { width }]}>
          <View style={styles.slideHeader}>
            <Text style={styles.slideTitle}>YOUR STYLE</Text>
            <Text style={[styles.slideSubtitle, { color: TEXT_MID }]}>
              We'll put your favourite workouts first
            </Text>
          </View>

          <SectionRow label="PICK YOUR TRAINING" />

          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const selected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(selected ? null : cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: selected ? WORK_COLOR + '22' : CARD_BG,
                      borderColor: selected ? WORK_COLOR : 'rgba(255,255,255,0.1)',
                    },
                  ]}
                >
                  {/* Re-render icon with correct color based on selection */}
                  {React.cloneElement(cat.icon as React.ReactElement<any>, {
                    color: selected ? WORK_COLOR : TEXT_MID,
                  })}
                  <Text style={[
                    styles.categoryLabel,
                    { color: selected ? WORK_COLOR : TEXT_MID },
                  ]}>
                    {cat.label}
                  </Text>
                  {selected && (
                    <Check size={12} color={WORK_COLOR} strokeWidth={3} />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.hintText, { color: TEXT_DIM }]}>
            You can change this anytime in Settings
          </Text>
        </View>

        {/* ── Slide 2: Timer font size ───────────────────────────────────── */}
        <View style={[styles.slide, { width }]}>
          <View style={styles.slideHeader}>
            <Text style={styles.slideTitle}>TIMER STYLE</Text>
            <Text style={[styles.slideSubtitle, { color: TEXT_MID }]}>
              How large should the countdown be?
            </Text>
          </View>

          <SectionRow label="DISPLAY SIZE" />

          <View style={styles.fontRow}>
            {FONT_SIZES.map(opt => {
              const selected = selectedFont === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setSelectedFont(opt.value)}
                  style={[
                    styles.fontCard,
                    {
                      backgroundColor: CARD_BG,
                      borderColor: selected ? WORK_COLOR : 'rgba(255,255,255,0.1)',
                    },
                  ]}
                >
                  {selected && (
                    <View style={[styles.fontCardAccent, { backgroundColor: WORK_COLOR }]} />
                  )}
                  <View style={styles.fontCardInner}>
                    <Text style={[
                      styles.fontPreviewNum,
                      {
                        fontSize: opt.size,
                        color: selected ? WORK_COLOR : 'rgba(255,255,255,0.2)',
                      },
                    ]}>
                      20
                    </Text>
                    <View style={styles.fontLabelRow}>
                      {selected && (
                        <Timer size={10} color={WORK_COLOR} strokeWidth={2.5} />
                      )}
                      <Text style={[
                        styles.fontLabel,
                        { color: selected ? TEXT : TEXT_DIM },
                      ]}>
                        {opt.label}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Slide 3: Notifications ─────────────────────────────────────── */}
        <View style={[styles.slide, { width }]}>
          <View style={styles.slideHeader}>
            <View style={[styles.bellBadge, { backgroundColor: WORK_COLOR + '18' }]}>
              <Bell size={36} color={WORK_COLOR} strokeWidth={1.5} />
            </View>
            <Text style={styles.slideTitle}>STAY ON TRACK</Text>
            <Text style={[styles.slideSubtitle, { color: TEXT_MID }]}>
              Get reminders to keep your streak alive.
            </Text>
          </View>

          <SectionRow label="NOTIFICATIONS" />

          {/* Notification preview card */}
          <View style={[styles.notifCard, { backgroundColor: CARD_BG }]}>
            <View style={[styles.notifAccent, { backgroundColor: WORK_COLOR }]} />
            <View style={styles.notifCardInner}>
              <View style={styles.notifRow}>
                <View style={styles.notifAppRow}>
                  <Bell size={11} color={WORK_COLOR} strokeWidth={2.5} />
                  <Text style={[styles.notifApp, { color: WORK_COLOR }]}>INTERVL</Text>
                </View>
                <Text style={[styles.notifTime, { color: TEXT_DIM }]}>now</Text>
              </View>
              <Text style={styles.notifTitle}>Keep your streak alive!</Text>
              <Text style={[styles.notifBody, { color: TEXT_MID }]}>
                You haven't trained today. Open INTERVL and go!
              </Text>
            </View>
          </View>

          <Pressable
            onPress={requestNotifications}
            style={({ pressed }) => [
              styles.notifBtn,
              { backgroundColor: WORK_COLOR, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Bell size={16} color="#000" strokeWidth={2.5} />
            <Text style={styles.notifBtnText}>ENABLE NOTIFICATIONS</Text>
          </Pressable>

          <Pressable onPress={() => goToSlide(4)} hitSlop={12} style={{ alignSelf: 'center' }}>
            <Text style={[styles.skipText, { marginTop: spacing.md }]}>
              Maybe later
            </Text>
          </Pressable>
        </View>

        {/* ── Slide 4: Rating ────────────────────────────────────────────── */}
        <View style={[styles.slide, { width }]}>
          <View style={styles.slideHeader}>
            <View style={[styles.bellBadge, { backgroundColor: '#FFD70022' }]}>
              <Star size={36} color="#FFD700" strokeWidth={1.5} />
            </View>
            <Text style={styles.slideTitle}>YOU'RE ALL SET!</Text>
            <Text style={[styles.slideSubtitle, { color: TEXT_MID }]}>
              If you enjoy INTERVL, leaving a review helps us grow and keeps the app improving.
            </Text>
          </View>

          <SectionRow label="QUICK FAVOUR" />

          {/* Stars preview */}
          <View style={[styles.starsCard, { backgroundColor: CARD_BG }]}>
            <View style={[styles.starsCardAccent, { backgroundColor: '#FFD700' }]} />
            <View style={styles.starsCardInner}>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={28} color="#FFD700" fill="#FFD700" strokeWidth={1.5} />
                ))}
              </View>
              <Text style={[styles.starsLabel, { color: TEXT_MID }]}>
                Takes less than 10 seconds
              </Text>
            </View>
          </View>

          <Pressable
            onPress={requestRating}
            style={({ pressed }) => [
              styles.notifBtn,
              { backgroundColor: '#FFD700', opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Star size={16} color="#000" strokeWidth={2.5} fill="#000" />
            <Text style={styles.notifBtnText}>RATE INTERVL</Text>
          </Pressable>

          <Pressable onPress={finish} hitSlop={12} style={{ alignSelf: 'center' }}>
            <Text style={[styles.skipText, { marginTop: spacing.md }]}>
              Get Started
            </Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* ── Bottom CTA (hidden on slides with their own action buttons) ── */}
      {page < TOTAL_SLIDES - 1 && page !== 3 && (
        <View style={[styles.bottomCta, { paddingHorizontal: layout.screenPadding }]}>
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: WORK_COLOR, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.ctaText}>
              {page === 0 ? "LET'S GO" : 'CONTINUE'}
            </Text>
            <ChevronRight size={18} color="#000" strokeWidth={2.5} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.md,
  },
  progressRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressPill: { height: 3, borderRadius: 2 },
  skipText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: TEXT_DIM,
  },

  slide: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  /* Slide 0 brand */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  brandRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRingInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: TEXT,
    letterSpacing: -1,
    lineHeight: 30,
  },
  appTagline: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 2,
  },

  /* Slide headers */
  slideHeader: { marginBottom: spacing.xl, gap: spacing.sm },
  slideTitle: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    color: TEXT,
    letterSpacing: -1,
  },
  slideSubtitle: { fontSize: 14, fontWeight: '500', lineHeight: 20 },

  /* Categories */
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: layout.pillRadius,
    borderWidth: 1,
  },
  categoryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  hintText: { fontSize: 11, fontWeight: '500', textAlign: 'center' },

  /* Font picker */
  fontRow: { flexDirection: 'row', gap: spacing.md },
  fontCard: {
    flex: 1,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
    minHeight: 140,
  },
  fontCardAccent: { width: 4 },
  fontCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  fontPreviewNum: {
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
  },
  fontLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fontLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },

  /* Notifications */
  bellBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  notifCard: {
    flexDirection: 'row',
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  notifAccent: { width: 5 },
  notifCardInner: { flex: 1, padding: layout.cardPadding, gap: spacing.xs },
  notifRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifAppRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  notifApp: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  notifTime: { fontSize: 11, fontWeight: '500' },
  notifTitle: { fontSize: 14, fontWeight: '700', color: TEXT },
  notifBody: { fontSize: 12, fontWeight: '500', lineHeight: 18 },
  notifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: layout.cardRadius,
    marginBottom: spacing.sm,
  },
  notifBtnText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },

  /* Rating slide */
  starsCard: {
    flexDirection: 'row',
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  starsCardAccent: { width: 5 },
  starsCardInner: {
    flex: 1,
    padding: layout.cardPadding,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  starsLabel: { fontSize: 12, fontWeight: '500' },

  /* Bottom CTA */
  bottomCta: { paddingBottom: spacing.xxl, paddingTop: spacing.md },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: layout.cardRadius,
  },
  ctaText: { color: '#000', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
});
