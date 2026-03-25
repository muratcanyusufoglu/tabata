import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Plus, Dumbbell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { useTemplateStore } from '../../src/stores/templateStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { TimerCard } from '../../src/components/timer/TimerCard';
import { semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { TimerTemplate } from '../../src/types';

function getTimeGreeting(): { emoji: string; key: string } {
  const h = new Date().getHours();
  if (h < 12) return { emoji: '🌅', key: 'home.greetingMorning' };
  if (h < 17) return { emoji: '⚡', key: 'home.greetingAfternoon' };
  return { emoji: '🔥', key: 'home.greetingEvening' };
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const templates = useTemplateStore(s => s.templates);
  const incrementUsage = useTemplateStore(s => s.incrementUsage);
  const deleteTemplate = useTemplateStore(s => s.deleteTemplate);
  const start = useTimerStore(s => s.start);

  const presets = templates.filter(t => t.type === 'preset');
  const customs = templates.filter(t => t.type === 'custom');

  const greeting = useMemo(() => getTimeGreeting(), []);

  function handleStartTimer(template: TimerTemplate) {
    incrementUsage(template.id);
    start(template);
    router.push(`/timer/${template.id}`);
  }

  function handleDeleteTemplate(template: TimerTemplate) {
    Alert.alert(
      t('editor.delete'),
      t('editor.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => deleteTemplate(template.id) },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>

        {/* ── Header ── */}
        <View style={styles.headerWrap}>
          {/* Gradient strip behind header */}
          <LinearGradient
            colors={isDark
              ? ['rgba(0,122,255,0.12)', 'rgba(0,122,255,0)']
              : ['rgba(0,122,255,0.07)', 'rgba(0,122,255,0)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greetingEmoji]}>{greeting.emoji}</Text>
              <View>
                <Text style={[styles.greetingTitle, { color: colors.text }]}>
                  {t('home.greeting')}
                </Text>
                <Text style={[styles.greetingSub, { color: colors.textTertiary }]}>
                  {t('home.readySub', { defaultValue: 'Pick a timer and go!' })}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/timer/editor')}
              style={[styles.addBtn, { backgroundColor: semantic.accent }]}
            >
              <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Start section */}
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: semantic.accent }]} />
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              {t('home.quickStart')}
            </Text>
          </View>

          {presets.map((template, index) => (
            <TimerCard
              key={template.id}
              template={template}
              index={index}
              onPress={() => router.push(`/timer/editor?id=${template.id}&readonly=1`)}
              onStart={() => handleStartTimer(template)}
            />
          ))}

          {/* My Timers section */}
          <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
            <View style={[styles.sectionDot, { backgroundColor: semantic.success }]} />
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              {t('home.myTimers')}
            </Text>
            {customs.length > 0 && (
              <Pressable
                onPress={() => router.push('/timer/editor')}
                style={[styles.sectionAddBtn, { backgroundColor: semantic.accent + '18' }]}
              >
                <Plus size={14} color={semantic.accent} strokeWidth={2.5} />
                <Text style={[styles.sectionAddText, { color: semantic.accent }]}>
                  {t('common.new', { defaultValue: 'New' })}
                </Text>
              </Pressable>
            )}
          </View>

          {customs.length > 0
            ? customs.map((template, index) => (
                <TimerCard
                  key={template.id}
                  template={template}
                  index={index}
                  onPress={() => router.push(`/timer/editor?id=${template.id}`)}
                  onStart={() => handleStartTimer(template)}
                />
              ))
            : (
              <Pressable
                onPress={() => router.push('/timer/editor')}
                style={[styles.emptyCard, {
                  borderColor: semantic.accent + '40',
                  backgroundColor: semantic.accent + '08',
                }]}
              >
                <View style={[styles.emptyIcon, { backgroundColor: semantic.accent + '18' }]}>
                  <Dumbbell size={24} color={semantic.accent} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  {t('home.createFirst')}
                </Text>
                <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
                  {t('home.createHint', { defaultValue: 'Tap to build your custom timer' })}
                </Text>
              </Pressable>
            )
          }

          <View style={{ height: layout.tabBarHeight + spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  /* Header */
  headerWrap: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  greetingEmoji: {
    fontSize: 32,
    lineHeight: 38,
  },
  greetingTitle: {
    ...typography.h2,
    fontWeight: '700',
  },
  greetingSub: {
    ...typography.caption,
    marginTop: 1,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: semantic.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.xs,
  },

  /* Section header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    ...typography.label,
    flex: 1,
  },
  sectionAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.pillRadius,
  },
  sectionAddText: {
    fontSize: 12,
    fontWeight: '600',
  },

  /* Empty state */
  emptyCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: layout.cardRadius,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  emptyHint: {
    ...typography.caption,
    textAlign: 'center',
  },
});
