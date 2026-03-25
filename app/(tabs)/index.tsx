import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { useTemplateStore } from '../../src/stores/templateStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { TimerCard } from '../../src/components/timer/TimerCard';
import { semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { TimerTemplate } from '../../src/types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const templates = useTemplateStore(s => s.templates);
  const incrementUsage = useTemplateStore(s => s.incrementUsage);
  const deleteTemplate = useTemplateStore(s => s.deleteTemplate);
  const start = useTimerStore(s => s.start);

  const presets = templates.filter(t => t.type === 'preset');
  const customs = templates.filter(t => t.type === 'custom');

  function handleStartTimer(template: TimerTemplate) {
    incrementUsage(template.id);
    start(template);
    router.push(`/timer/${template.id}`);
  }

  function handleDeleteTemplate(template: TimerTemplate) {
    Alert.alert(
      t('editor.delete'),
      t('editor.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => deleteTemplate(template.id) },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>{t('home.greeting')}</Text>
          <Pressable
            onPress={() => router.push('/timer/editor')}
            style={[styles.addBtn, { backgroundColor: semantic.accent }]}
          >
            <Plus size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>{t('home.quickStart')}</Text>
          {presets.map((template, index) => (
            <TimerCard
              key={template.id}
              template={template}
              index={index}
              onPress={() => router.push(`/timer/editor?id=${template.id}&readonly=1`)}
              onStart={() => handleStartTimer(template)}
            />
          ))}

          <Text style={[styles.sectionTitle, { color: colors.textTertiary, marginTop: spacing.xxl }]}>{t('home.myTimers')}</Text>
          {customs.length > 0
            ? customs.map((template, index) => (
                <TimerCard
                  key={template.id}
                  template={template}
                  index={index}
                  onPress={() => router.push(`/timer/editor?id=${template.id}`)}
                  onStart={() => handleStartTimer(template)}
                />
              ))
            : (
              <Pressable
                onPress={() => router.push('/timer/editor')}
                style={[styles.emptyCard, { borderColor: colors.border, backgroundColor: colors.backgroundPrimary }]}
              >
                <Plus size={24} color={semantic.accent} />
                <Text style={[styles.emptyText, { color: colors.textTertiary }]}>{t('home.createFirst')}</Text>
              </Pressable>
            )
          }

          <View style={{ height: layout.tabBarHeight + spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: { ...typography.h2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  emptyCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: layout.cardRadius,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  emptyText: { ...typography.body },
});
