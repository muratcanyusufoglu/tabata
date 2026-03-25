import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { layout } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: number;          // 0–1, phase progress
  secondsRemaining: number;  // used to detect tick & phase boundary
  phase: string;             // current phase key — phase change = instant snap
  timeDisplay: string;
  fontSize?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  progress,
  secondsRemaining,
  phase,
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

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  const toOffset = (p: number) => circumference * (1 - clamp(p));

  // Initialise at the correct position on first render
  const animatedOffset = useSharedValue(toOffset(progress));

  const prevPhaseRef = useRef(phase);
  const prevSecondsRef = useRef(secondsRemaining);

  React.useEffect(() => {
    const target = toOffset(progress);

    // Phase changed → instant jump, no animated reverse sweep
    const phaseChanged = phase !== prevPhaseRef.current;
    // secondsRemaining jumped UP → phase reset / skip (not a normal tick)
    const timerReset = secondsRemaining > prevSecondsRef.current + 1;

    if (phaseChanged || timerReset) {
      cancelAnimation(animatedOffset);
      animatedOffset.value = target;           // snap immediately
    } else {
      // Normal 1-second tick: animate slightly longer than 1 s so the motion
      // is still running when the next tick fires → perfectly smooth flow.
      animatedOffset.value = withTiming(target, {
        duration: 1050,
        easing: Easing.linear,
      });
    }

    prevPhaseRef.current = phase;
    prevSecondsRef.current = secondsRemaining;
  }, [secondsRemaining, phase]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  const displayFontSize = fontSize ?? typography.timerCountdown.sizes.normal;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track ring */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress ring */}
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

      {/* Countdown number */}
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text
          style={[
            styles.time,
            { fontSize: displayFontSize, color },
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
