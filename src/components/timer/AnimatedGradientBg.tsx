import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, interpolateColor, Easing,
} from 'react-native-reanimated';
import { phaseColors } from '../../constants/colors';
import { TimerPhase } from '../../types';

const { width, height } = Dimensions.get('window');

interface AnimatedGradientBgProps {
  phase: TimerPhase;
  customGradient?: [string, string];
}

// We use a simple approach: render 2 gradients and cross-fade between them
export function AnimatedGradientBg({ phase, customGradient }: AnimatedGradientBgProps) {
  const opacity = useSharedValue(1);

  const getGradient = (p: TimerPhase): [string, string] => {
    if (customGradient) return customGradient;
    const c = phaseColors[p as keyof typeof phaseColors];
    return c ? c.gradient : phaseColors.work.gradient;
  };

  const colors = getGradient(phase);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
