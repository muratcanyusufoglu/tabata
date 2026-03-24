import { useColorScheme } from 'react-native';
import { usePreferencesStore } from '../stores/preferencesStore';
import { colors, colorThemes } from '../constants/colors';
import { ColorTheme } from '../types';

export interface Theme {
  isDark: boolean;
  colors: typeof colors.dark | typeof colors.light;
  phaseGradient: (phase: string) => [string, string];
  colorTheme: ColorTheme;
}

export function useTheme(): Theme {
  const themeMode = usePreferencesStore(s => s.themeMode);
  const colorThemeId = usePreferencesStore(s => s.colorThemeId);
  const systemScheme = useColorScheme();

  const isDark =
    themeMode === 'dark' ? true :
    themeMode === 'light' ? false :
    systemScheme === 'dark';

  const colorTheme = colorThemes.find(t => t.id === colorThemeId) ?? colorThemes[0];

  const phaseGradient = (phase: string): [string, string] => {
    switch (phase) {
      case 'work': return colorTheme.work;
      case 'rest': return colorTheme.rest;
      case 'prepare': return colorTheme.prepare;
      case 'cooldown': return colorTheme.cooldown;
      case 'restBetweenSets': return colorTheme.restBetweenSets ?? colorTheme.rest;
      case 'completed': return colorTheme.completed ?? ['#AA00FF', '#D500F9'];
      default: return colorTheme.work;
    }
  };

  return {
    isDark,
    colors: isDark ? colors.dark : colors.light,
    phaseGradient,
    colorTheme,
  };
}
