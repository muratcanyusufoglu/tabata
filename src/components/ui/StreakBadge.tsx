import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';
import { semantic } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { useTranslation } from 'react-i18next';

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  const { isDark, colors } = useTheme();
  const { t } = useTranslation();

  if (count === 0) return null;

  return (
    <BlurView
      intensity={isDark ? 60 : 80}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.blur, { borderColor: colors.glassBorder }]}
    >
      <View style={[styles.inner, { backgroundColor: colors.glass }]}>
        <Flame size={16} color={semantic.streak} fill={semantic.streak} />
        <Text style={[styles.text, { color: colors.text }]}>
          {t('history.streak', { count })}
        </Text>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    alignSelf: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.badge,
    fontSize: 13,
    fontWeight: '600',
  },
});
