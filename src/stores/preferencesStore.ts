import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, TimerCategory } from '../types';

interface PreferencesState extends UserPreferences {
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
  setColorThemeId: (id: string) => void;
  setTimerFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  setSoundPackId: (id: string) => void;
  setTimerVolume: (volume: number) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  setCountdownSoundEnabled: (enabled: boolean) => void;
  setDefaultPrepareSeconds: (seconds: number) => void;
  setDefaultCooldownSeconds: (seconds: number) => void;
  setKeepScreenAwake: (enabled: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setPreferredCategory: (category: TimerCategory | null) => void;
  setIsPremium: (isPremium: boolean, expiresAt?: string) => void;
  incrementAppOpenCount: () => void;
  setLastRatePromptDate: (date: string) => void;
  setLanguage: (lang: string | null) => void;
}

const defaultPreferences: UserPreferences = {
  themeMode: 'system',
  colorThemeId: 'vivid',
  timerFontSize: 'normal',
  soundPackId: 'minimal',
  timerVolume: 0.8,
  hapticsEnabled: true,
  countdownSoundEnabled: true,
  defaultPrepareSeconds: 10,
  defaultCooldownSeconds: 0,
  keepScreenAwake: true,
  hasCompletedOnboarding: false,
  preferredCategory: null,
  isPremium: false,
  premiumExpiresAt: null,
  appOpenCount: 0,
  lastRatePromptDate: null,
  installDate: new Date().toISOString(),
  language: null,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,

      setThemeMode: (mode) => set({ themeMode: mode }),
      setColorThemeId: (id) => set({ colorThemeId: id }),
      setTimerFontSize: (size) => set({ timerFontSize: size }),
      setSoundPackId: (id) => set({ soundPackId: id }),
      setTimerVolume: (volume) => set({ timerVolume: volume }),
      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),
      setCountdownSoundEnabled: (enabled) => set({ countdownSoundEnabled: enabled }),
      setDefaultPrepareSeconds: (seconds) => set({ defaultPrepareSeconds: seconds }),
      setDefaultCooldownSeconds: (seconds) => set({ defaultCooldownSeconds: seconds }),
      setKeepScreenAwake: (enabled) => set({ keepScreenAwake: enabled }),
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      setPreferredCategory: (category) => set({ preferredCategory: category }),
      setIsPremium: (isPremium, expiresAt) => set({ isPremium, premiumExpiresAt: expiresAt ?? null }),
      incrementAppOpenCount: () => set(state => ({ appOpenCount: state.appOpenCount + 1 })),
      setLastRatePromptDate: (date) => set({ lastRatePromptDate: date }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'fittimer-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
