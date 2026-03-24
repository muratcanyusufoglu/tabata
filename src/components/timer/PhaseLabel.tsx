import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { typography } from '../../constants/typography';
import { TimerPhase } from '../../types';
import { useTranslation } from 'react-i18next';

interface PhaseLabelProps {
  phase: TimerPhase;
  color?: string;
}

export function PhaseLabel({ phase, color = '#FFFFFF' }: PhaseLabelProps) {
  const { t } = useTranslation();
  const opacity = useRef(new Animated.Value(1)).current;
  const prevPhase = useRef(phase);

  useEffect(() => {
    if (prevPhase.current !== phase) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      prevPhase.current = phase;
    }
  }, [phase]);

  const labelKey = `timer.${phase}`;

  return (
    <Animated.Text
      style={[
        styles.label,
        { color, opacity },
      ]}
    >
      {t(labelKey)}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.phaseLabel,
    textAlign: 'center',
  },
});
