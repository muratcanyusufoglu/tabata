import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, Pressable, Platform, PanResponder,
} from 'react-native';
import Animated, {
  useSharedValue, withTiming, Easing, cancelAnimation, useAnimatedStyle,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTimerStore } from '../../src/stores/timerStore';
import { usePreferencesStore } from '../../src/stores/preferencesStore';
import { AnimatedGradientBg } from '../../src/components/timer/AnimatedGradientBg';
import { CircularProgress } from '../../src/components/timer/CircularProgress';
import { PhaseLabel } from '../../src/components/timer/PhaseLabel';
import { ControlButtons } from '../../src/components/timer/ControlButtons';
import { formatTime } from '../../src/utils/formatters';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { useTheme } from '../../src/hooks/useTheme';
import { saveWorkout } from '../../src/db/workoutRepository';
import * as KeepAwake from 'expo-keep-awake';
import * as audioService from '../../src/services/audioService';
import * as hapticService from '../../src/services/hapticService';
import { setHapticsEnabled } from '../../src/services/hapticService';
import { getSoundPackById } from '../../src/constants/sounds';

export default function TimerScreen() {
  const { t } = useTranslation();
  const { phaseGradient } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    template,
    status,
    currentPhase,
    currentRound,
    currentSet,
    secondsRemaining,
    currentPhaseTotalSeconds,
    totalElapsedSeconds,
    nextPhase,
    nextPhaseDuration,
    pause,
    resume,
    stop,
    skipPhase,
    startedAt,
  } = useTimerStore();
  const timerFontSize = usePreferencesStore(s => s.timerFontSize);
  const keepScreenAwake = usePreferencesStore(s => s.keepScreenAwake);
  const hapticsEnabled = usePreferencesStore(s => s.hapticsEnabled);
  const countdownSoundEnabled = usePreferencesStore(s => s.countdownSoundEnabled);
  const timerVolume = usePreferencesStore(s => s.timerVolume);
  const soundPackId = usePreferencesStore(s => s.soundPackId);
  const savedRef = useRef(false);
  const prevPhaseRef = useRef(currentPhase);
  // Ref to always call the latest handleStop (avoids stale closure in PanResponder)
  const handleStopRef = useRef<() => void>(() => {});

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 && gestureState.vy > 0.3) {
          handleStopRef.current();
        }
      },
    })
  );

  // Keep screen awake
  useEffect(() => {
    if (keepScreenAwake) {
      KeepAwake.activateKeepAwakeAsync();
      return () => { KeepAwake.deactivateKeepAwake(); };
    }
  }, [keepScreenAwake]);

  // Sync haptics enabled state
  useEffect(() => {
    setHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  // Preload sound pack on mount
  useEffect(() => {
    const pack = getSoundPackById(soundPackId);
    audioService.preloadSoundPack(pack).catch(() => {});
    return () => { audioService.unloadAll().catch(() => {}); };
  }, [soundPackId]);

  // Audio + haptics on phase change
  useEffect(() => {
    if (prevPhaseRef.current !== currentPhase) {
      prevPhaseRef.current = currentPhase;
      if (countdownSoundEnabled) {
        audioService.playPhaseTransition(currentPhase, timerVolume).catch(() => {});
      }
      if (currentPhase === 'work') {
        hapticService.heavy().catch(() => {});
      } else if (currentPhase === 'completed') {
        hapticService.success().catch(() => {});
      } else {
        hapticService.medium().catch(() => {});
      }
    }
  }, [currentPhase]);

  // Countdown sounds (3, 2, 1)
  useEffect(() => {
    if (!countdownSoundEnabled) return;
    if (secondsRemaining <= 3 && secondsRemaining >= 1 && status === 'running') {
      audioService.playCountdown(secondsRemaining, timerVolume).catch(() => {});
      hapticService.light().catch(() => {});
    }
  }, [secondsRemaining]);

  // Watch for completion
  useEffect(() => {
    if (currentPhase === 'completed' && !savedRef.current && template && startedAt) {
      savedRef.current = true;
      saveWorkout({
        templateId: template.id,
        templateName: template.name,
        templateCategory: template.category,
        totalElapsedSeconds,
        plannedDurationSeconds: template.totalDurationSeconds,
        roundsCompleted: currentRound,
        roundsTotal: template.rounds,
        setsCompleted: currentSet,
        setsTotal: template.sets,
        wasCompleted: true,
        startedAt,
      }).catch(console.error);
      router.replace('/timer/complete');
    }
  }, [currentPhase]);

  // ── Smooth linear progress bar animation ────────────────────────────────
  // HOOKS MUST be called before any early return (Rules of Hooks)
  const rawProgress = currentPhaseTotalSeconds > 0
    ? (currentPhaseTotalSeconds - secondsRemaining) / currentPhaseTotalSeconds
    : 0;

  const animBarProgress = useSharedValue(rawProgress);
  const barPhaseRef = useRef(currentPhase);
  const barSecondsRef = useRef(secondsRemaining);

  useEffect(() => {
    const phaseChanged = currentPhase !== barPhaseRef.current;
    const timerReset  = secondsRemaining > barSecondsRef.current + 1;

    if (phaseChanged || timerReset) {
      cancelAnimation(animBarProgress);
      animBarProgress.value = rawProgress;
    } else {
      animBarProgress.value = withTiming(rawProgress, {
        duration: 1050,
        easing: Easing.linear,
      });
    }
    barPhaseRef.current   = currentPhase;
    barSecondsRef.current = secondsRemaining;
  }, [secondsRemaining, currentPhase]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${animBarProgress.value * 100}%` as unknown as number,
  }));
  // ────────────────────────────────────────────────────────────────────────

  if (!template) {
    router.back();
    return null;
  }

  const progress = rawProgress;
  const gradient = phaseGradient(currentPhase);
  const fontSize = typography.timerCountdown.sizes[timerFontSize] ?? typography.timerCountdown.sizes.normal;

  function handleStop() {
    Alert.alert(
      t('timer.stopConfirmTitle'),
      t('timer.stopConfirmMessage'),
      [
        { text: t('timer.stopConfirmNo'), style: 'cancel' },
        {
          text: t('timer.stopConfirmYes'),
          style: 'destructive',
          onPress: async () => {
            if (template && startedAt && totalElapsedSeconds > 5) {
              await saveWorkout({
                templateId: template.id,
                templateName: template.name,
                templateCategory: template.category,
                totalElapsedSeconds,
                plannedDurationSeconds: template.totalDurationSeconds,
                roundsCompleted: currentRound,
                roundsTotal: template.rounds,
                setsCompleted: currentSet,
                setsTotal: template.sets,
                wasCompleted: false,
                startedAt,
              }).catch(console.error);
            }
            stop();
            router.back();
          },
        },
      ]
    );
  }

  // Update the ref every render so PanResponder always calls the latest version
  handleStopRef.current = handleStop;

  const sets = template.sets > 1;
  const rounds = template.rounds > 1 || template.sets > 1;

  return (
    <View style={styles.container} {...panResponder.current.panHandlers}>
      <AnimatedGradientBg phase={currentPhase} customGradient={gradient} />

      {/* ── Progress bar ──────────────────────────────────────────────────────
          Outer container'a absolute olarak yerleştirildi (SafeAreaView dışında).
          insets.top'un tam üzerinde — status bar / Dynamic Island'ın hemen altında.
          Bu sayede topBar ile hiçbir zaman çakışmaz. */}
      <View
        style={[styles.progressBarContainer, { top: insets.top }]}
        pointerEvents="none"
      >
        <Animated.View style={[styles.progressBarFill, progressBarStyle]} />
      </View>

      {/* ── İçerik: insets ile kesin pozisyonlama ── */}
      <View style={[
        styles.safeContent,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>

        {/* Top bar — insets.top zaten paddingTop olarak uygulandı,
            ekstra spacing.lg ile X butonu her zaman safe zone'un altında */}
        <View style={styles.topBar}>
          <Pressable onPress={handleStop} style={styles.closeBtn} hitSlop={12}>
            <View style={styles.closeBtnBg}>
              <X size={20} color="rgba(255,255,255,0.95)" strokeWidth={2.5} />
            </View>
          </Pressable>
          <Text style={styles.templateName} numberOfLines={1}>{template.name}</Text>
          <View style={styles.closeBtn} />
        </View>

        {/* Round/Set info */}
        <View style={styles.metaRow}>
          {rounds && (
            <Text style={styles.metaText}>
              {t('timer.round', { current: currentRound, total: template.rounds })}
            </Text>
          )}
          {sets && (
            <Text style={styles.metaText}>
              {t('timer.set', { current: currentSet, total: template.sets })}
            </Text>
          )}
        </View>

        {/* Main timer */}
        <View style={styles.timerSection}>
          <PhaseLabel phase={currentPhase} color="rgba(255,255,255,0.9)" />
          <View style={styles.ringContainer}>
            <CircularProgress
              progress={progress}
              secondsRemaining={secondsRemaining}
              phase={currentPhase}
              timeDisplay={formatTime(secondsRemaining)}
              fontSize={fontSize}
              color="rgba(255,255,255,0.9)"
            />
          </View>
        </View>

        {/* Next phase info */}
        <View style={styles.nextSection}>
          {nextPhase && nextPhase !== 'completed' && (
            <Text style={styles.nextText}>
              {t('timer.nextPhase', {
                phase: t(`timer.${nextPhase}`),
                duration: formatTime(nextPhaseDuration),
              })}
            </Text>
          )}
        </View>

        {/* Elapsed */}
        <Text style={styles.elapsed}>
          {t('timer.elapsed', { time: formatTime(totalElapsedSeconds) })}
        </Text>

        {/* Controls */}
        <View style={styles.controls}>
          <ControlButtons
            isPlaying={status === 'running'}
            onPause={pause}
            onResume={resume}
            onSkipBack={() => {}}
            onSkipForward={skipPhase}
          />
        </View>

        <Text style={styles.swipeHint}>{t('timer.swipeToStop')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Progress bar → outer View'e absolute, top = insets.top (JS'de set ediliyor)
  progressBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    overflow: 'hidden',
    zIndex: 10,
  },
  progressBarFill: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },

  // İçerik katmanı: paddingTop/Bottom insets'ten geliyor (JSX'te inline)
  safeContent: {
    flex: 1,
  },

  // topBar: insets.top paddingTop zaten safeContent'te var.
  // Ekstra spacing.lg → X butonu her zaman progress bar'ın altında.
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  closeBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  templateName: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    ...typography.bodySmall,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
    paddingTop: spacing.md,
  },
  metaText: {
    color: 'rgba(255,255,255,0.7)',
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextSection: {
    alignItems: 'center',
    minHeight: 24,
    paddingBottom: spacing.lg,
  },
  nextText: {
    color: 'rgba(255,255,255,0.6)',
    ...typography.bodySmall,
  },
  elapsed: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    ...typography.caption,
    marginBottom: spacing.xl,
  },
  controls: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  swipeHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    ...typography.caption,
    marginBottom: spacing.md,
  },
});
