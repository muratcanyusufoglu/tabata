import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { useTemplateStore } from '../../src/stores/templateStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { usePreferencesStore } from '../../src/stores/preferencesStore';
import { TimerCard } from '../../src/components/timer/TimerCard';
import { semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { TimerTemplate } from '../../src/types';

const FREE_TIMER_LIMIT = 3;

function getTimeGreeting(): { label: string } {
  const h = new Date().getHours();
  if (h < 12) return { label: 'GOOD MORNING' };
  if (h < 17) return { label: 'GOOD AFTERNOON' };
  return { label: 'GOOD EVENING' };
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const templates = useTemplateStore(s => s.templates);
  const incrementUsage = useTemplateStore(s => s.incrementUsage);
  const deleteTemplate = useTemplateStore(s => s.deleteTemplate);
  const start = useTimerStore(s => s.start);
  const isPremium = usePreferencesStore(s => s.isPremium);

  const presets = templates.filter(t => t.type === 'preset');
  const customs = templates.filter(t => t.type === 'custom');

  const greeting = useMemo(() => getTimeGreeting(), []);
  const atLimit = !isPremium && customs.length >= FREE_TIMER_LIMIT;

  // Subtle surface colors on top of theme background
  const headerBg = isDark ? '#111111' : '#FFFFFF';
  const sectionLabelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const accentColor = semantic.accent;

  function handleNewTimer() {
    if (atLimit) {
      router.push('/paywall');
    } else {
      router.push('/timer/editor');
    }
  }

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
        <View style={[styles.header, { backgroundColor: headerBg }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greetingLabel, { color: sectionLabelColor }]}>
              {greeting.label}
            </Text>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              TABATA
            </Text>
          </View>

          <Pressable
            onPress={handleNewTimer}
            style={[
              styles.addBtn,
              { backgroundColor: atLimit ? semantic.premium : accentColor },
            ]}
          >
            {atLimit
              ? <Lock size={18} color="#FFF" strokeWidth={2.5} />
              : <Plus size={20} color="#FFF" strokeWidth={2.5} />
            }
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Quick Start ── */}
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>
              QUICK START
            </Text>
            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
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

          {/* ── My Timers ── */}
          <View style={[styles.sectionRow, { marginTop: spacing.xl }]}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>
              MY TIMERS
            </Text>

            {!isPremium && (
              <Text style={[styles.limitText, {
                color: atLimit ? semantic.warning : sectionLabelColor,
              }]}>
                {customs.length}/{FREE_TIMER_LIMIT}
              </Text>
            )}

            {customs.length > 0 && (
              <Pressable
                onPress={handleNewTimer}
                style={[styles.sectionAddBtn, {
                  backgroundColor: atLimit
                    ? semantic.premium + '22'
                    : accentColor + '22',
                }]}
              >
                {atLimit
                  ? <Lock size={11} color={semantic.premium} strokeWidth={2.5} />
                  : <Plus size={13} color={accentColor} strokeWidth={2.5} />
                }
                <Text style={[styles.sectionAddText, {
                  color: atLimit ? semantic.premium : accentColor,
                }]}>
                  {atLimit ? 'PRO' : 'NEW'}
                </Text>
              </Pressable>
            )}

            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
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
                onPress={handleNewTimer}
                style={[styles.emptyCard, {
                  borderColor: accentColor + '40',
                  backgroundColor: isDark ? '#161616' : '#F5F5F5',
                }]}
              >
                <View style={[styles.emptyPlusCircle, { backgroundColor: accentColor + '18' }]}>
                  <Plus size={28} color={accentColor} strokeWidth={2} />
                </View>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  CREATE CUSTOM
                </Text>
                <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>
                  {t('home.createHint', { defaultValue: 'Build your own timer' })}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    gap: 2,
  },
  greetingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1.5,
    lineHeight: 34,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },

  /* Section rows */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },
  limitText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  sectionAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: layout.pillRadius,
  },
  sectionAddText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* Empty state */
  emptyCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: layout.cardRadius,
    paddingVertical: spacing.xxl + spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyPlusCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
  },
  emptyHint: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
});
