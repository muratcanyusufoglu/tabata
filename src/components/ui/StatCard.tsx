import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { GlassCard } from './GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function StatCard({ value, label, icon, style }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <GlassCard style={style} padding={12}>
      <View style={styles.container}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.label, { color: colors.textTertiary }]}>{label}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: {
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.statNumber,
  },
  label: {
    ...typography.statLabel,
    textAlign: 'center',
  },
});
