import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { RotateCcw, Home, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTimerStore } from '../../src/stores/timerStore';
import { useTheme } from '../../src/hooks/useTheme';
import { colorThemes, semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { formatDuration } from '../../src/utils/formatters';

export default function CompleteScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { template, totalElapsedSeconds, stop } = useTimerStore();

  const templateRef = React.useRef(template);
  const durationRef = React.useRef(totalElapsedSeconds);

  useEffect(() => {
    if (template) {
      templateRef.current = template;
      durationRef.current = totalElapsedSeconds;
    }
  }, []);

  const tmpl = templateRef.current;
  const dur = durationRef.current;

  const cardBg   = isDark ? '#161616' : '#F5F5F5';
  const statsBg  = isDark ? '#1E1E1E' : '#EBEBEB';
  const divColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const sectionLabelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';

  const activeTheme = colorThemes.find(c => c.id === (tmpl?.colorThemeId ?? 'vivid')) ?? colorThemes[0];
  const accentColor = activeTheme.work[0];
  const restColor   = activeTheme.rest[0];

  function handleDone() {
    stop();
    router.replace('/(tabs)');
  }

  function handleRestart() {
    const tpl = templateRef.current;
    if (tpl) {
      stop();
      useTimerStore.getState().start(tpl);
      router.replace(`/timer/${tpl.id}`);
    } else {
      handleDone();
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      {/* ── Content ── */}
      <View style={styles.content}>

        {/* Section label */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>
            WORKOUT COMPLETE
          </Text>
          <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
        </View>

        {/* Result card */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <View style={styles.cardInner}>

            {/* Check badge + name */}
            <View style={styles.topRow}>
              <View style={[styles.checkBadge, { backgroundColor: accentColor + '22' }]}>
                <Check size={20} color={accentColor} strokeWidth={3} />
              </View>
              <View style={styles.nameBlock}>
                <Text style={[styles.workoutName, { color: colors.text }]} numberOfLines={1}>
                  {tmpl?.name.toUpperCase() ?? 'WORKOUT'}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                  {t('complete.greatJob')}
                </Text>
              </View>
            </View>

            {/* Stats grid */}
            <View style={[styles.statsGrid, { backgroundColor: statsBg }]}>
              <View style={styles.statCell}>
                <Text style={[styles.statValue, { color: accentColor }]}>
                  {formatDuration(dur)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                  {t('complete.duration').toUpperCase()}
                </Text>
              </View>

              <View style={[styles.statDivider, { backgroundColor: divColor }]} />

              <View style={styles.statCell}>
                <Text style={[styles.statValue, { color: restColor }]}>
                  {tmpl?.rounds ?? '—'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                  {t('complete.rounds').toUpperCase()}
                </Text>
              </View>

              {tmpl && tmpl.sets > 1 && (
                <>
                  <View style={[styles.statDivider, { backgroundColor: divColor }]} />
                  <View style={styles.statCell}>
                    <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                      {tmpl.sets}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                      {t('complete.sets').toUpperCase()}
                    </Text>
                  </View>
                </>
              )}
            </View>

          </View>
        </View>
      </View>

      {/* ── Actions ── */}
      <View style={[styles.actions, { paddingHorizontal: layout.screenPadding }]}>
        <Pressable
          onPress={handleRestart}
          style={({ pressed }) => [
            styles.restartBtn,
            { borderColor: divColor, backgroundColor: cardBg, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <RotateCcw size={16} color={colors.textSecondary} strokeWidth={2.5} />
          <Text style={[styles.restartText, { color: colors.textSecondary }]}>
            {t('complete.restart', { defaultValue: 'Restart' }).toUpperCase()}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDone}
          style={({ pressed }) => [
            styles.doneBtn,
            { backgroundColor: accentColor, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Home size={16} color="#000" strokeWidth={2.5} />
          <Text style={styles.doneText}>
            {t('complete.done').toUpperCase()}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: spacing.lg,
  },

  /* Section label row */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
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

  /* Result card — same as TimerCard */
  card: {
    borderRadius: layout.cardRadius,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  accentBar: {
    width: 5,
  },
  cardInner: {
    flex: 1,
    padding: layout.cardPadding,
    gap: spacing.md,
  },

  /* Top row: check badge + name */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  workoutName: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },

  /* Stats grid — same as TimerCard stats section */
  statsGrid: {
    flexDirection: 'row',
    borderRadius: layout.cardRadiusSmall,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    fontStyle: 'italic',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    marginVertical: spacing.sm,
  },

  /* Buttons */
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  restartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: layout.cardRadius,
    borderWidth: 1,
  },
  restartText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  doneBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: layout.cardRadius,
  },
  doneText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
