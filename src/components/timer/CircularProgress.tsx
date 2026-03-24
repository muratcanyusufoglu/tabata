import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps, withTiming, Easing,
} from 'react-native-reanimated';
import { layout } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number; // 0 to 1
  timeDisplay: string;
  fontSize?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  timeDisplay,
  fontSize,
  size = layout.timerRingSize,
  strokeWidth = layout.timerRingStroke,
  color = '#FFFFFF',
}: CircularProgressProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const strokeDashoffset = circumference * (1 - Math.max(0, Math.min(1, progress)));
  const animatedOffset = useSharedValue(strokeDashoffset);

  React.useEffect(() => {
    animatedOffset.value = withTiming(circumference * (1 - Math.max(0, Math.min(1, progress))), {
      duration: 800,
      easing: Easing.linear,
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  const displayFontSize = fontSize ?? typography.timerCountdown.sizes.normal;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          originX={cx}
          originY={cy}
        />
      </Svg>
      {/* Timer number */}
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text
          style={[
            styles.time,
            {
              fontSize: displayFontSize,
              color,
            },
          ]}
        >
          {timeDisplay}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontWeight: '200',
    fontVariant: ['tabular-nums'],
    letterSpacing: -3,
  },
});
