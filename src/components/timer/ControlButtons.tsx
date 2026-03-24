import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { layout } from '../../constants/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ControlButtonsProps {
  isPlaying: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
}

function GlassCircleButton({
  onPress,
  size,
  children,
}: {
  onPress: () => void;
  size: number;
  children: React.ReactNode;
}) {
  const scale = useSharedValue(1);

  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.92, { duration: 80 }); }}
      onPressOut={() => { scale.value = withSpring(1, { duration: 100 }); }}
      style={anim}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <View
          style={[
            styles.inner,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </AnimatedPressable>
  );
}

export function ControlButtons({
  isPlaying,
  onPause,
  onResume,
  onSkipBack,
  onSkipForward,
}: ControlButtonsProps) {
  return (
    <View style={styles.row}>
      <GlassCircleButton onPress={onSkipBack} size={layout.stopButtonSize}>
        <SkipBack size={24} color="#FFFFFF" />
      </GlassCircleButton>

      <GlassCircleButton
        onPress={isPlaying ? onPause : onResume}
        size={layout.controlButtonSize}
      >
        {isPlaying
          ? <Pause size={28} color="#FFFFFF" />
          : <Play size={28} color="#FFFFFF" />
        }
      </GlassCircleButton>

      <GlassCircleButton onPress={onSkipForward} size={layout.stopButtonSize}>
        <SkipForward size={24} color="#FFFFFF" />
      </GlassCircleButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
  },
  button: {
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  inner: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
