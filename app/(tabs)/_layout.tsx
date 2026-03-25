import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, router, usePathname } from 'expo-router';
import { Timer, CalendarDays, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { semantic } from '../../src/constants/colors';
import { layout } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';

function TabBarIcon({ focused, Icon }: { focused: boolean; Icon: React.ElementType }) {
  const { colors } = useTheme();
  return <Icon size={24} color={focused ? semantic.accent : colors.textTertiary} />;
}

export default function TabLayout() {
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
          height: layout.tabBarHeight,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDark ? 60 : 80}
            tint={isDark ? 'dark' : 'light'}
            style={[
              StyleSheet.absoluteFill,
              {
                borderTopWidth: 0.5,
                borderTopColor: colors.tabBarBorder,
              },
            ]}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.tabBarGlass },
              ]}
            />
          </BlurView>
        ),
        tabBarActiveTintColor: semantic.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          ...typography.badge,
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.timer'),
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={Timer} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={CalendarDays} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={Settings} />,
        }}
      />
      {/* explore.tsx silindi — Expo Router artık bu sayfayı keşfetmesin */}
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
