import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Zap, Music2, BarChart2, ChevronRight, Bell, CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { usePreferencesStore } from '../src/stores/preferencesStore';
import { useTemplateStore } from '../src/stores/templateStore';
import { semantic } from '../src/constants/colors';
import { layout, spacing } from '../src/constants/spacing';
import { typography } from '../src/constants/typography';
import { TimerCategory } from '../src/types';

const { width } = Dimensions.get('window');

const CATEGORIES: { id: TimerCategory; emoji: string; labelKey: string }[] = [
  { id: 'tabata', emoji: '⚡', labelKey: 'categories.tabata' },
  { id: 'hiit', emoji: '🔥', labelKey: 'categories.hiit' },
  { id: 'boxing', emoji: '🥊', labelKey: 'categories.boxing' },
  { id: 'crossfit', emoji: '🏋️', labelKey: 'categories.crossfit' },
  { id: 'circuit', emoji: '🔄', labelKey: 'categories.circuit' },
  { id: 'stretching', emoji: '🧘', labelKey: 'categories.stretching' },
];

const FONT_SIZES: { value: 'normal' | 'large' | 'xlarge'; label: string; fontSize: number }[] = [
  { value: 'normal', label: 'Normal', fontSize: 48 },
  { value: 'large', label: 'Large', fontSize: 64 },
  { value: 'xlarge', label: 'XL', fontSize: 80 },
];

const TOTAL_SLIDES = 5;

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const setHasCompletedOnboarding = usePreferencesStore(s => s.setHasCompletedOnboarding);
  const setPreferredCategory = usePreferencesStore(s => s.setPreferredCategory);
  const setTimerFontSize = usePreferencesStore(s => s.setTimerFontSize);
  const templates = useTemplateStore(s => s.templates);
  const reorderTemplates = useTemplateStore(s => s.reorderTemplates);

  const [selectedCategory, setSelectedCategory] = useState<TimerCategory | null>(null);
  const [selectedFontSize, setSelectedFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [notifRequested, setNotifRequested] = useState(false);

  const isLast = page === TOTAL_SLIDES - 1;

  function goNext() {
    if (isLast) {
      finish();
      return;
    }
    const next = page + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setPage(next);
  }

  function finish() {
    // Save preferences
    setPreferredCategory(selectedCategory);
    setTimerFontSize(selectedFontSize);

    // Sort presets by selected category first
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
    try {
      await Notifications.requestPermissionsAsync();
    } catch {}
    setNotifRequested(true);
    goNext();
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View />
          {!isLast && (
            <Pressable onPress={skip}>
              <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
            </Pressable>
          )}
        </View>

        {/* Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.slides}
        >
          {/* Slide 0: Features */}
          <View style={[styles.slide, { width }]}>
            <Text style={styles.slideTitle}>{t('onboarding.welcome')}</Text>
            <Text style={styles.slideSubtitle}>{t('onboarding.subtitle')}</Text>
            <View style={styles.featureList}>
              {[
                { icon: Zap, color: '#FF9100', titleKey: 'onboarding.feature1Title', descKey: 'onboarding.feature1Desc' },
                { icon: Music2, color: '#00C853', titleKey: 'onboarding.feature2Title', descKey: 'onboarding.feature2Desc' },
                { icon: BarChart2, color: '#536DFE', titleKey: 'onboarding.feature3Title', descKey: 'onboarding.feature3Desc' },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <View key={i} style={styles.featureRow}>
                    <View style={[styles.featureIcon, { backgroundColor: f.color + '22' }]}>
                      <Icon size={22} color={f.color} />
                    </View>
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
                      <Text style={styles.featureDesc}>{t(f.descKey)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Slide 1: Category picker */}
          <View style={[styles.slide, { width }]}>
            <Text style={styles.slideTitle}>{t('onboarding.pickStyle')}</Text>
            <Text style={styles.slideSubtitle}>We'll put your preferred workouts first</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.id && styles.categoryChipSelected,
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text style={[
                    styles.categoryLabel,
                    selectedCategory === cat.id && { color: '#FFFFFF', fontWeight: '700' },
                  ]}>
                    {t(cat.labelKey)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Slide 2: Font size picker */}
          <View style={[styles.slide, { width }]}>
            <Text style={styles.slideTitle}>Timer Style</Text>
            <Text style={styles.slideSubtitle}>How large should the countdown be?</Text>
            <View style={styles.fontSizeRow}>
              {FONT_SIZES.map(opt => (
                <Pressable
                  key={opt.value}
                  onPress={() => setSelectedFontSize(opt.value)}
                  style={[
                    styles.fontSizeCard,
                    selectedFontSize === opt.value && styles.fontSizeCardSelected,
                  ]}
                >
                  <Text style={[styles.fontSizePreview, { fontSize: opt.fontSize, color: '#FFFFFF' }]}>
                    20
                  </Text>
                  <Text style={[
                    styles.fontSizeLabel,
                    selectedFontSize === opt.value && { color: '#FFFFFF' },
                  ]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Slide 3: Notifications */}
          <View style={[styles.slide, { width }]}>
            <View style={styles.notifIcon}>
              <Bell size={56} color={semantic.accent} />
            </View>
            <Text style={styles.slideTitle}>{t('onboarding.notifications')}</Text>
            <Text style={styles.slideSubtitle}>{t('onboarding.notificationsDesc')}</Text>
            <Pressable
              onPress={requestNotifications}
              style={[styles.notifBtn, { backgroundColor: semantic.accent }]}
            >
              <Text style={styles.notifBtnText}>{t('onboarding.enableNotifications')}</Text>
            </Pressable>
          </View>

          {/* Slide 4: All set */}
          <View style={[styles.slide, { width }]}>
            <View style={styles.checkWrap}>
              <CheckCircle size={80} color={semantic.success} />
            </View>
            <Text style={styles.slideTitle}>You're All Set!</Text>
            <Text style={styles.slideSubtitle}>Time to crush your workout</Text>
          </View>
        </ScrollView>

        {/* Dots */}
        <View style={styles.dots}>
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === page ? '#FFFFFF' : 'rgba(255,255,255,0.3)' },
                i === page && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* CTA — hide on notification slide since it has its own button */}
        {page !== 3 && (
          <View style={styles.cta}>
            <Pressable
              onPress={goNext}
              style={({ pressed }) => [styles.ctaBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <LinearGradient
                colors={[semantic.accent, '#0055CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaBtnGradient}
              >
                <Text style={styles.ctaText}>
                  {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
                </Text>
                {!isLast && <ChevronRight size={20} color="#FFFFFF" />}
              </LinearGradient>
            </Pressable>
          </View>
        )}
        {page === 3 && (
          <View style={styles.cta}>
            <Pressable onPress={goNext}>
              <Text style={styles.skipText}>{t('onboarding.skip')}</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    minHeight: 44,
  },
  skipText: { color: 'rgba(255,255,255,0.6)', ...typography.body },
  slides: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: spacing.lg,
  },
  slideTitle: { ...typography.h1, color: '#FFFFFF', textAlign: 'center' },
  slideSubtitle: { ...typography.body, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  featureList: { alignSelf: 'stretch', gap: spacing.lg, marginTop: spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { ...typography.body, color: '#FFFFFF', fontWeight: '600' },
  featureDesc: { ...typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: layout.pillRadius,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  categoryChipSelected: {
    borderColor: semantic.accent,
    backgroundColor: semantic.accent + '22',
  },
  categoryEmoji: { fontSize: 18 },
  categoryLabel: { ...typography.bodySmall, color: 'rgba(255,255,255,0.7)' },
  fontSizeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  fontSizeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    borderRadius: layout.cardRadius,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    gap: spacing.sm,
    minHeight: 120,
  },
  fontSizeCardSelected: {
    borderColor: semantic.accent,
    backgroundColor: semantic.accent + '22',
  },
  fontSizePreview: {
    fontVariant: ['tabular-nums'],
    fontWeight: '200',
    lineHeight: undefined,
  },
  fontSizeLabel: { ...typography.caption, color: 'rgba(255,255,255,0.6)' },
  notifIcon: { marginBottom: spacing.md },
  notifBtn: {
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderRadius: layout.pillRadius,
    marginTop: spacing.xl,
  },
  notifBtnText: { ...typography.body, color: '#FFFFFF', fontWeight: '700' },
  checkWrap: { marginBottom: spacing.lg },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { width: 20 },
  cta: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  ctaBtn: {
    alignSelf: 'stretch',
    borderRadius: layout.pillRadius,
    overflow: 'hidden',
  },
  ctaBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  ctaText: { ...typography.body, color: '#FFFFFF', fontWeight: '700' },
});
