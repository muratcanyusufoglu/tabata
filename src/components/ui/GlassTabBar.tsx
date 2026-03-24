import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { semantic } from '../../constants/colors';
import { layout } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

interface GlassTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

export function GlassTabBar({ tabs, activeTab, onTabPress }: GlassTabBarProps) {
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <BlurView
      intensity={isDark ? 60 : 80}
      tint={isDark ? 'dark' : 'light'}
      style={[
        styles.blur,
        {
          borderTopColor: isDark ? colors.tabBarBorder : colors.tabBarBorder,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={[styles.inner, { backgroundColor: colors.tabBarGlass }]}>
        {tabs.map(tab => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              style={styles.tab}
            >
              {isActive ? tab.activeIcon : tab.icon}
              <Text
                style={[
                  styles.label,
                  { color: isActive ? semantic.accent : colors.textTertiary },
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={[styles.dot, { backgroundColor: semantic.accent }]} />}
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 56,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
  },
  label: {
    ...typography.badge,
    fontSize: 10,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
