import React from 'react';
import { Pressable, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { semantic } from '../../constants/colors';
import { layout } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'pill' | 'circle';
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accent?: boolean;
  disabled?: boolean;
}

export function GlassButton({
  onPress,
  children,
  variant = 'pill',
  size,
  style,
  accent = false,
  disabled = false,
}: GlassButtonProps) {
  const { isDark } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { duration: 100 });
  };

  const circleSize = size ?? layout.controlButtonSize;
  const isCircle = variant === 'circle';

  const containerStyle: ViewStyle = isCircle
    ? { width: circleSize, height: circleSize, borderRadius: circleSize / 2 }
    : { borderRadius: layout.pillRadius, height: 48 };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={[
          styles.blur,
          containerStyle,
          { borderColor: 'rgba(255,255,255,0.15)' },
          style,
        ]}
      >
        <View
          style={[
            styles.inner,
            containerStyle,
            {
              backgroundColor: accent ? semantic.accent : 'rgba(255,255,255,0.12)',
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {typeof children === 'string' ? (
            <Text style={[styles.text, { color: '#FFFFFF' }]}>{children}</Text>
          ) : children}
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
