import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FitTimer',
  slug: 'fittimer',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'fittimer',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.fittimer.app',
    infoPlist: {
      UIBackgroundModes: ['audio'],
      NSMicrophoneUsageDescription: 'FitTimer uses audio for timer sounds',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#000000',
    },
    package: 'com.fittimer.app',
    permissions: [
      'VIBRATE',
      'RECEIVE_BOOT_COMPLETED',
      'FOREGROUND_SERVICE',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-sqlite',
    [
      'expo-av',
      {
        microphonePermission: false,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#00C853',
        sounds: [],
      },
    ],
    'expo-localization',
    'react-native-purchases',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: 'your-project-id',
    },
  },
});
