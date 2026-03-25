import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { X, Minus, Plus, Play, Copy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { useTemplateStore } from '../../src/stores/templateStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { usePreferencesStore } from '../../src/stores/preferencesStore';
import { semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { formatDuration } from '../../src/utils/formatters';
import { generateUUID } from '../../src/utils/uuid';
import { TimerTemplate } from '../../src/types';

function calculateTotal(t: {
  prepareSeconds: number;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  sets: number;
  restBetweenSetsSeconds: number;
  cooldownSeconds: number;
}): number {
  const roundDuration = t.workSeconds + t.restSeconds;
  const setDuration = roundDuration * t.rounds - t.restSeconds;
  const allSets = setDuration * t.sets;
  const betweenSets = t.restBetweenSetsSeconds * Math.max(0, t.sets - 1);
  return t.prepareSeconds + allSets + betweenSets + t.cooldownSeconds;
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 300,
  step = 5,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.stepperRow}>
      <Text style={[styles.stepperLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - step))}
          style={[styles.stepBtn, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Minus size={16} color={colors.text} />
        </Pressable>
        <Text style={[styles.stepperValue, { color: colors.text }]}>{value}s</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + step))}
          style={[styles.stepBtn, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Plus size={16} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

function CountStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.stepperRow}>
      <Text style={[styles.stepperLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - 1))}
          style={[styles.stepBtn, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Minus size={16} color={colors.text} />
        </Pressable>
        <Text style={[styles.stepperValue, { color: colors.text }]}>{value}</Text>
        <Pressable
          onPress={() => onChange(Math.min(max, value + 1))}
          style={[styles.stepBtn, { backgroundColor: colors.backgroundTertiary }]}
        >
          <Plus size={16} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

export default function EditorScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { id, readonly } = useLocalSearchParams<{ id?: string; readonly?: string }>();
  const templates = useTemplateStore(s => s.templates);
  const addTemplate = useTemplateStore(s => s.addTemplate);
  const updateTemplate = useTemplateStore(s => s.updateTemplate);
  const deleteTemplate = useTemplateStore(s => s.deleteTemplate);
  const start = useTimerStore(s => s.start);
  const defaultPrepare = usePreferencesStore(s => s.defaultPrepareSeconds);
  const defaultCooldown = usePreferencesStore(s => s.defaultCooldownSeconds);

  const existing = id ? templates.find(t => t.id === id) : null;
  const isReadOnly = readonly === '1';
  const isEditing = !!existing && !isReadOnly;

  const [name, setName] = useState(existing?.name ?? '');
  const [workSeconds, setWorkSeconds] = useState(existing?.workSeconds ?? 20);
  const [restSeconds, setRestSeconds] = useState(existing?.restSeconds ?? 10);
  const [rounds, setRounds] = useState(existing?.rounds ?? 8);
  const [sets, setSets] = useState(existing?.sets ?? 1);
  const [restBetweenSets, setRestBetweenSets] = useState(existing?.restBetweenSetsSeconds ?? 60);
  const [prepareSeconds, setPrepareSeconds] = useState(existing?.prepareSeconds ?? defaultPrepare);
  const [cooldownSeconds, setCooldownSeconds] = useState(existing?.cooldownSeconds ?? defaultCooldown);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const totalDuration = calculateTotal({ prepareSeconds, workSeconds, restSeconds, rounds, sets, restBetweenSetsSeconds: restBetweenSets, cooldownSeconds });

  function validate(): string | null {
    if (!name.trim()) return t('editor.validation.nameRequired');
    if (name.length > 50) return t('editor.validation.nameTooLong');
    if (workSeconds < 1) return t('editor.validation.workRequired');
    if (totalDuration > 7200) return t('editor.validation.tooLong');
    return null;
  }

  function buildTemplate(): TimerTemplate {
    const now = new Date().toISOString();
    return {
      id: existing?.id ?? generateUUID(),
      name: name.trim(),
      type: 'custom',
      category: 'custom',
      prepareSeconds,
      workSeconds,
      restSeconds,
      rounds,
      sets,
      restBetweenSetsSeconds: restBetweenSets,
      cooldownSeconds,
      totalDurationSeconds: totalDuration,
      colorThemeId: existing?.colorThemeId ?? 'vivid',
      iconName: existing?.iconName ?? 'timer',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      isFavorite: existing?.isFavorite ?? false,
      usageCount: existing?.usageCount ?? 0,
      lastUsedAt: existing?.lastUsedAt ?? null,
    };
  }

  function handleSave() {
    const error = validate();
    if (error) {
      Alert.alert(t('common.ok'), error);
      return;
    }
    const tmpl = buildTemplate();
    if (isEditing) {
      updateTemplate(tmpl.id, tmpl);
    } else {
      addTemplate(tmpl);
    }
    router.back();
  }

  function handleStartNow() {
    const error = validate();
    if (error) {
      Alert.alert(t('common.ok'), error);
      return;
    }
    const tmpl = buildTemplate();
    if (!existing) addTemplate(tmpl);
    else if (isEditing) updateTemplate(tmpl.id, tmpl);
    start(tmpl);
    router.push(`/timer/${tmpl.id}`);
  }

  function handleDuplicate() {
    if (!existing) return;
    const dup = useTemplateStore.getState().duplicateTemplate(existing.id);
    if (dup) router.back();
  }

  function handleDelete() {
    if (!existing) return;
    Alert.alert(t('editor.delete'), t('editor.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          deleteTemplate(existing.id);
          router.back();
        },
      },
    ]);
  }

  const screenTitle = isReadOnly ? existing?.name ?? '' : isEditing ? t('editor.editTitle') : t('editor.title');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <View style={[styles.iconBtnBg, { backgroundColor: colors.backgroundTertiary }]}>
              <X size={18} color={colors.text} strokeWidth={2.5} />
            </View>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{screenTitle}</Text>
          {!isReadOnly ? (
            <Pressable onPress={handleSave} style={styles.saveBtn}>
              <Text style={[styles.saveBtnText, { color: semantic.accent }]}>{t('common.save')}</Text>
            </Pressable>
          ) : (
            <View style={styles.iconBtn} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Name */}
          {!isReadOnly && (
            <View style={[styles.card, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border }]}>
              <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>{t('editor.name').toUpperCase()}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('editor.namePlaceholder')}
                placeholderTextColor={colors.textTertiary}
                style={[styles.nameInput, { color: colors.text }]}
                maxLength={50}
                editable={!isReadOnly}
              />
            </View>
          )}

          {/* Total duration badge */}
          <View style={[styles.durationBadge, { backgroundColor: semantic.accent + '15' }]}>
            <Text style={[styles.durationText, { color: semantic.accent }]}>
              {t('editor.totalDuration')}: {formatDuration(totalDuration)}
            </Text>
          </View>

          {/* Main fields */}
          <View style={[styles.card, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border }]}>
            <Stepper value={workSeconds} onChange={setWorkSeconds} min={1} max={600} step={5} label={t('editor.workTime')} />
            <View style={styles.divider} />
            <Stepper value={restSeconds} onChange={setRestSeconds} min={0} max={300} step={5} label={t('editor.restTime')} />
            <View style={styles.divider} />
            <CountStepper value={rounds} onChange={setRounds} min={1} max={99} label={t('editor.rounds')} />
            <View style={styles.divider} />
            <CountStepper value={sets} onChange={setSets} min={1} max={20} label={t('editor.sets')} />
          </View>

          {/* Advanced */}
          <Pressable
            onPress={() => setShowAdvanced(!showAdvanced)}
            style={[styles.advancedToggle, { borderColor: colors.border }]}
          >
            <Text style={[styles.advancedToggleText, { color: semantic.accent }]}>
              {t('editor.advanced')} {showAdvanced ? '▲' : '▼'}
            </Text>
          </Pressable>

          {showAdvanced && (
            <View style={[styles.card, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border }]}>
              <Stepper value={prepareSeconds} onChange={setPrepareSeconds} min={0} max={60} step={5} label={t('editor.prepareTime')} />
              <View style={styles.divider} />
              <Stepper value={cooldownSeconds} onChange={setCooldownSeconds} min={0} max={300} step={10} label={t('editor.cooldownTime')} />
              {sets > 1 && (
                <>
                  <View style={styles.divider} />
                  <Stepper value={restBetweenSets} onChange={setRestBetweenSets} min={0} max={300} step={10} label={t('editor.restBetweenSets')} />
                </>
              )}
            </View>
          )}

          {/* Delete */}
          {isEditing && existing?.type === 'custom' && (
            <Pressable onPress={handleDelete} style={[styles.deleteBtn, { borderColor: semantic.error + '40' }]}>
              <Text style={[styles.deleteBtnText, { color: semantic.error }]}>{t('editor.delete')}</Text>
            </Pressable>
          )}

          {existing && (
            <Pressable
              onPress={handleDuplicate}
              style={[styles.duplicateBtn, { borderColor: colors.border, backgroundColor: colors.backgroundPrimary }]}
            >
              <Copy size={16} color={colors.textSecondary} />
              <Text style={[styles.duplicateBtnText, { color: colors.textSecondary }]}>{t('editor.duplicate')}</Text>
            </Pressable>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom actions */}
        {!isReadOnly && (
          <View style={[styles.bottomActions, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <Pressable
              onPress={handleStartNow}
              style={[styles.startBtn, { backgroundColor: semantic.accent }]}
            >
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.startBtnText}>{t('editor.startNow')}</Text>
            </Pressable>
          </View>
        )}
        {isReadOnly && (
          <View style={[styles.bottomActions, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
            <Pressable
              onPress={() => {
                if (existing) {
                  useTemplateStore.getState().incrementUsage(existing.id);
                  useTimerStore.getState().start(existing);
                  router.push(`/timer/${existing.id}`);
                }
              }}
              style={[styles.startBtn, { backgroundColor: semantic.accent }]}
            >
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.startBtnText}>{t('timer.start')}</Text>
            </Pressable>
          </View>
        )}
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
    paddingVertical: spacing.md,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...typography.h3 },
  saveBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  saveBtnText: { ...typography.body, fontWeight: '600' },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  card: {
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    paddingHorizontal: layout.cardPadding,
    paddingTop: layout.cardPadding,
    paddingBottom: spacing.xs,
  },
  nameInput: {
    ...typography.h3,
    paddingHorizontal: layout.cardPadding,
    paddingBottom: layout.cardPadding,
    minHeight: 44,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    borderRadius: layout.pillRadius,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  durationText: { ...typography.caption, fontWeight: '700' },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.cardPadding,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  stepperLabel: { ...typography.body },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...typography.body,
    fontWeight: '600',
    minWidth: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginHorizontal: layout.cardPadding,
  },
  advancedToggle: {
    borderWidth: 1,
    borderRadius: layout.buttonRadius,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  advancedToggleText: { ...typography.bodySmall, fontWeight: '600' },
  deleteBtn: {
    borderWidth: 1,
    borderRadius: layout.buttonRadius,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  deleteBtnText: { ...typography.body, fontWeight: '600' },
  duplicateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: layout.buttonRadius,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  duplicateBtnText: { ...typography.body },
  bottomActions: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: layout.pillRadius,
  },
  startBtnText: {
    color: '#FFFFFF',
    ...typography.body,
    fontWeight: '700',
  },
});
