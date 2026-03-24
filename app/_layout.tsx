import React, { useEffect, useState } from 'react';
import { View, AppState, AppStateStatus } from 'react-native';
import { Stack, router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import '../src/i18n';
import { usePreferencesStore } from '../src/stores/preferencesStore';
import { useTemplateStore } from '../src/stores/templateStore';
import { useTimerStore } from '../src/stores/timerStore';
import { configureAudioSession } from '../src/services/audioService';
import { startInterval, stopInterval } from '../src/services/timerService';
import { setToastCallback } from '../src/utils/errorHandler';
import { Toast } from '../src/components/ui/Toast';
import { getDatabase } from '../src/db/database';

export default function RootLayout() {
  const hasCompletedOnboarding = usePreferencesStore(s => s.hasCompletedOnboarding);
  const themeMode = usePreferencesStore(s => s.themeMode);
  const seedPresets = useTemplateStore(s => s.seedPresets);
  const incrementAppOpenCount = usePreferencesStore(s => s.incrementAppOpenCount);
  const timerStatus = useTimerStore(s => s.status);
  const recalculate = useTimerStore(s => s.recalculateFromBackground);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Init
    configureAudioSession();
    seedPresets();
    incrementAppOpenCount();
    getDatabase().catch(console.error);

    setToastCallback((msg) => setToast(msg));

    // AppState listener for background recalculation
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        if (useTimerStore.getState().status === 'running') {
          recalculate();
          startInterval();
        }
      } else if (state === 'background') {
        if (useTimerStore.getState().status === 'running') {
          stopInterval();
        }
      }
    });

    return () => {
      subscription.remove();
      stopInterval();
    };
  }, []);

  // Start/stop interval based on timer status
  useEffect(() => {
    if (timerStatus === 'running') {
      startInterval();
    } else {
      stopInterval();
    }
  }, [timerStatus]);

  const isDark = themeMode === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'auto'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="timer/[id]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="timer/editor" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="timer/complete" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="paywall" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
        <Toast message={toast} onHide={() => setToast(null)} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
