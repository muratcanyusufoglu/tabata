import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Play } from 'lucide-react-native';
import { TimerTemplate } from '../../types';
import { useTheme } from '../../hooks/useTheme';
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
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const theme =
    colorThemes.find(c => c.id === (template.colorThemeId ?? 'vivid')) ?? colorThemes[0];
  const accentColor = theme.work[0];
  const restColor = theme.rest[0];
  const totalText = formatDuration(template.totalDurationSeconds);

  const cardBg = isDark ? '#161616' : '#F5F5F5';
  const statsBg = isDark ? '#1E1E1E' : '#EBEBEB';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97, { duration: 80 }); }}
      onPressOut={() => { scale.value = withSpring(1, { duration: 100 }); }}
      style={[anim, styles.wrapper]}
    >
      <View style={[styles.card, { backgroundColor: cardBg }]}>

        {/* Left accent border */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.inner}>

          {/* Timer name — bold italic uppercase */}
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {template.name.toUpperCase()}
          </Text>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: statsBg }]}>

            {/* WORK */}
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: accentColor }]}>
                {template.workSeconds}
              </Text>
              <Text style={[styles.statUnit, { color: colors.textTertiary }]}>
                {t('timer.work').toUpperCase()}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {/* REST */}
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: restColor }]}>
                {template.restSeconds}
              </Text>
              <Text style={[styles.statUnit, { color: colors.textTertiary }]}>
                {t('timer.rest').toUpperCase()}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {/* ROUNDS */}
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                {template.rounds}
              </Text>
              <Text style={[styles.statUnit, { color: colors.textTertiary }]}>
                {t('editor.rounds').toUpperCase()}
              </Text>
            </View>

            {/* SETS (only if > 1) */}
            {template.sets > 1 && (
              <>
                <View style={[styles.divider, { backgroundColor: dividerColor }]} />
                <View style={styles.statCell}>
                  <Text style={[styles.statValue, { color: colors.textSecondary }]}>
                    {template.sets}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.textTertiary }]}>
                    SETS
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Footer: total duration + play button */}
          <View style={styles.footer}>
            <Text style={[styles.duration, { color: colors.textTertiary }]}>
              {totalText}
            </Text>

            <Pressable
              onPress={onStart}
              hitSlop={8}
              style={[styles.playBtn, { backgroundColor: accentColor }]}
            >
              <Play size={18} color="#000" fill="#000" strokeWidth={0} />
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
  inner: {
    flex: 1,
    padding: layout.cardPadding,
    gap: spacing.md,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.8,
    lineHeight: 26,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    gap: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
    lineHeight: 32,
    fontVariant: ['tabular-nums'],
  },
  statUnit: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    lineHeight: 12,
  },
  divider: {
    width: 1,
    marginVertical: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
