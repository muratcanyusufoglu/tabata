import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';
import { layout } from '../../constants/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
  intensity?: number;
}

export function GlassCard({ children, style, padding, radius, intensity }: GlassCardProps) {
  const { isDark, colors } = useTheme();

  const cardRadius = radius ?? layout.glassCardRadius;
  const cardPadding = padding ?? layout.glassCardPadding;
  const blurIntensity = intensity ?? colors.glassBlurIntensity;

  return (
    <BlurView
      intensity={blurIntensity}
      tint={isDark ? 'dark' : 'light'}
      style={[
        styles.blur,
        { borderRadius: cardRadius, borderColor: colors.glassBorder },
        style,
      ]}
    >
      <View style={[styles.inner, { backgroundColor: colors.glass, padding: cardPadding, borderRadius: cardRadius }]}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  inner: {
    flex: 1,
  },
});
