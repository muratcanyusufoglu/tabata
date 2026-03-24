import { Easing } from 'react-native-reanimated';

export const animations = {
  phaseTransition: {
    duration: 400,
  },
  gradientBreathing: {
    duration: 4000,
    loop: true,
  },
  countdownPulse: {
    scale: { from: 1.0, to: 1.08, back: 1.0 },
    duration: 200,
  },
  progressRing: {
    duration: 1000,
  },
  cardPress: {
    scale: 0.96,
    duration: 100,
  },
  checkmarkDraw: {
    circleDuration: 500,
    checkDuration: 300,
    checkDelay: 400,
    bounceScale: { to: 1.1, duration: 200 },
  },
  timerEnter: {
    type: 'fade-scale' as const,
    scale: { from: 0.92, to: 1.0 },
    opacity: { from: 0, to: 1 },
    duration: 400,
  },
  tabSwitch: {
    type: 'crossfade' as const,
    duration: 200,
  },
  listStagger: {
    delayPerItem: 60,
    translateY: { from: 20, to: 0 },
    opacity: { from: 0, to: 1 },
    duration: 350,
  },
};
