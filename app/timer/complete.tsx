import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CheckCircle, Clock, RotateCcw, Home } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTimerStore } from '../../src/stores/timerStore';
import { StatCard } from '../../src/components/ui/StatCard';
import { semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { formatDuration } from '../../src/utils/formatters';

export default function CompleteScreen() {
  const { t } = useTranslation();
  const { template, totalElapsedSeconds, stop } = useTimerStore();

  const templateRef = React.useRef(template);
  const durationRef = React.useRef(totalElapsedSeconds);

  useEffect(() => {
    if (template) {
      templateRef.current = template;
      durationRef.current = totalElapsedSeconds;
    }
  }, []);

  function handleDone() {
    stop();
    router.replace('/(tabs)');
  }

  function handleRestart() {
    const t = templateRef.current;
    if (t) {
      stop();
      useTimerStore.getState().start(t);
      router.replace(`/timer/${t.id}`);
    } else {
      handleDone();
    }
  }

  const tmpl = templateRef.current;
  const dur = durationRef.current;

  return (
    <LinearGradient colors={['#1a1a2e', '#0f3460']} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          {/* Trophy */}
          <View style={styles.iconWrap}>
            <CheckCircle size={72} color={semantic.success} />
          </View>

          <Text style={styles.title}>{t('complete.title')}</Text>
          <Text style={styles.subtitle}>{t('complete.greatJob')}</Text>

          {tmpl && (
            <Text style={styles.workoutName}>{tmpl.name}</Text>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard
              value={formatDuration(dur)}
              label={t('complete.duration')}
              icon={<Clock size={18} color={semantic.accent} />}
              style={styles.statCard}
            />
            {tmpl && (
              <StatCard
                value={tmpl.rounds}
                label={t('complete.rounds')}
                style={styles.statCard}
              />
            )}
            {tmpl && tmpl.sets > 1 && (
              <StatCard
                value={tmpl.sets}
                label={t('complete.sets')}
                style={styles.statCard}
              />
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleRestart}
            style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <RotateCcw size={18} color="#FFFFFF" />
            <Text style={styles.secondaryText}>Restart</Text>
          </Pressable>

          <Pressable
            onPress={handleDone}
            style={({ pressed }) => [styles.primaryBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={[semantic.accent, '#0055CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtnGradient}
            >
              <Home size={18} color="#FFFFFF" />
              <Text style={styles.primaryText}>{t('complete.done')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: spacing.lg,
  },
  iconWrap: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  workoutName: {
    ...typography.h3,
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    width: '100%',
  },
  statCard: { flex: 1 },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.xxl,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: layout.pillRadius,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  secondaryText: {
    color: '#FFFFFF',
    ...typography.body,
    fontWeight: '600',
  },
  primaryBtn: {
    flex: 2,
    borderRadius: layout.pillRadius,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  primaryText: {
    color: '#FFFFFF',
    ...typography.body,
    fontWeight: '700',
  },
});
