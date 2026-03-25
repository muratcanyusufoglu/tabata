import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Clock } from 'lucide-react-native';
import { TimerTemplate } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../constants/typography';
import { spacing, layout } from '../../constants/spacing';
import { colorThemes } from '../../constants/colors';
import { formatDuration } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TimerCardProps {
  template: TimerTemplate;
  onPress: () => void;
  onStart: () => void;
  index?: number;
}

export function TimerCard({ template, onPress, onStart }: TimerCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const theme =
    colorThemes.find(c => c.id === (template.colorThemeId ?? 'vivid')) ?? colorThemes[0];
  const workColor = theme.work[0];
  const restColor = theme.rest[0];
  const totalText = formatDuration(template.totalDurationSeconds);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97, { duration: 80 }); }}
      onPressOut={() => { scale.value = withSpring(1, { duration: 100 }); }}
      style={[anim, styles.wrapper]}
    >
      <View style={[styles.card, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border }]}>

        {/* Left gradient accent bar */}
        <LinearGradient
          colors={theme.work}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.accentBar}
        />

        <View style={styles.content}>
          {/* Name */}
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {template.name}
          </Text>

          {/* Stats chips */}
          <View style={styles.chips}>
            {/* Work chip */}
            <View style={[styles.chip, { backgroundColor: workColor + '1A' }]}>
              <Text style={[styles.chipVal, { color: workColor }]}>
                {template.workSeconds}s
              </Text>
              <Text style={[styles.chipLbl, { color: workColor + 'BB' }]}>
                {t('timer.work').toUpperCase()}
              </Text>
            </View>

            {/* Rest chip */}
            {template.restSeconds > 0 && (
              <View style={[styles.chip, { backgroundColor: restColor + '1A' }]}>
                <Text style={[styles.chipVal, { color: restColor }]}>
                  {template.restSeconds}s
                </Text>
                <Text style={[styles.chipLbl, { color: restColor + 'BB' }]}>
                  {t('timer.rest').toUpperCase()}
                </Text>
              </View>
            )}

            {/* Rounds chip */}
            <View style={[styles.chip, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.chipVal, { color: colors.textSecondary }]}>
                {template.rounds}×
              </Text>
              <Text style={[styles.chipLbl, { color: colors.textTertiary }]}>
                {t('editor.rounds').toUpperCase()}
              </Text>
            </View>

            {/* Sets chip (only if > 1) */}
            {template.sets > 1 && (
              <View style={[styles.chip, { backgroundColor: colors.backgroundTertiary }]}>
                <Text style={[styles.chipVal, { color: colors.textSecondary }]}>
                  {template.sets}
                </Text>
                <Text style={[styles.chipLbl, { color: colors.textTertiary }]}>
                  SETS
                </Text>
              </View>
            )}
          </View>

          {/* Footer: duration + start */}
          <View style={styles.footer}>
            <View style={styles.durationRow}>
              <Clock size={12} color={colors.textTertiary} />
              <Text style={[styles.duration, { color: colors.textTertiary }]}>
                {totalText} {t('format.totalTime', { time: '' }).replace('{{time}}', '').trim()}
              </Text>
            </View>

            <Pressable onPress={onStart} hitSlop={8}>
              <LinearGradient
                colors={theme.work}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startBtn}
              >
                <Play size={12} color="#FFF" fill="#FFF" />
                <Text style={styles.startText}>{t('timer.start')}</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  accentBar: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: layout.cardPadding,
    gap: spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  chip: {
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    minWidth: 58,
  },
  chipVal: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    lineHeight: 20,
  },
  chipLbl: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  duration: {
    ...typography.caption,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: layout.pillRadius,
  },
  startText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
});
