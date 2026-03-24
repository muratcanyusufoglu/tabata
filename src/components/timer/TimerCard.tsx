import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Play } from 'lucide-react-native';
import { TimerTemplate } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../constants/typography';
import { spacing, layout } from '../../constants/spacing';
import { semantic } from '../../constants/colors';
import { formatDuration } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TimerCardProps {
  template: TimerTemplate;
  onPress: () => void;
  onStart: () => void;
  index?: number;
}

export function TimerCard({ template, onPress, onStart, index = 0 }: TimerCardProps) {
  const { isDark, colors, phaseGradient } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const [color1] = phaseGradient('work');
  const configText = `${template.workSeconds}s ${t('common.seconds', { count: '' }).trim()} · ${template.restSeconds > 0 ? `${template.restSeconds}s · ` : ''}${template.rounds} ${t('format.roundsCount', { count: '' }).trim()}`;
  const totalText = formatDuration(template.totalDurationSeconds);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97, { duration: 80 }); }}
      onPressOut={() => { scale.value = withSpring(1, { duration: 100 }); }}
      style={anim}
    >
      <BlurView
        intensity={isDark ? 60 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={[styles.blur, { borderColor: colors.glassBorder }]}
      >
        <View style={[styles.inner, { backgroundColor: colors.glass }]}>
          <View style={styles.header}>
            <View style={[styles.dot, { backgroundColor: color1 }]} />
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {template.name}
            </Text>
          </View>
          <Text style={[styles.config, { color: colors.textTertiary }]} numberOfLines={1}>
            {`${template.workSeconds}s ${t('timer.work').toLowerCase()} · ${template.rounds} ${t('history.workouts', { count: '' }).trim()}`}
          </Text>
          <View style={styles.footer}>
            <Text style={[styles.duration, { color: colors.textSecondary }]}>
              {totalText} {t('format.totalTime', { time: '' }).replace('{{time}}', '').trim()}
            </Text>
            <Pressable onPress={onStart} style={styles.startBtn}>
              <View style={[styles.startBtnInner, { backgroundColor: semantic.accent }]}>
                <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.startText}>{t('timer.start')}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: layout.glassCardRadius,
    overflow: 'hidden',
    borderWidth: 0.5,
    marginBottom: spacing.md,
  },
  inner: {
    padding: layout.cardPadding,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    ...typography.h3,
    flex: 1,
  },
  config: {
    ...typography.bodySmall,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  duration: {
    ...typography.caption,
  },
  startBtn: {
    borderRadius: layout.pillRadius,
    overflow: 'hidden',
  },
  startBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.pillRadius,
  },
  startText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
