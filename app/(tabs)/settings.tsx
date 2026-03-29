import {router} from 'expo-router';
import {ChevronRight, Crown, Volume2} from 'lucide-react-native';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView, StyleSheet, Switch,
  Text,
  View
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colorThemes, semantic} from '../../src/constants/colors';
import {soundPacks} from '../../src/constants/sounds';
import {layout, spacing} from '../../src/constants/spacing';
import {typography} from '../../src/constants/typography';
import {useTheme} from '../../src/hooks/useTheme';
import i18n from '../../src/i18n';
import {usePreferencesStore} from '../../src/stores/preferencesStore';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
];

// ---------------------------------------------------------------------------
// VolumeSlider
// ---------------------------------------------------------------------------

const THUMB_SIZE = 22;
const TRACK_HEIGHT = 4;
  
// Clean implementation using measured-width approach
function VolumeSliderFinal({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (v: number) => void;
}) {
  const { colors } = useTheme();
  const trackWidth = useRef(0);
  const [measured, setMeasured] = useState(false);
  const animVal = useRef(new Animated.Value(value)).current;
  const liveStartValue = useRef(value);

  React.useEffect(() => {
    animVal.setValue(value);
    liveStartValue.current = value;
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (trackWidth.current > 0) {
          const v = Math.min(Math.max(evt.nativeEvent.locationX / trackWidth.current, 0), 1);
          liveStartValue.current = v;
          animVal.setValue(v);
          onValueChange(parseFloat(v.toFixed(2)));
        }
      },
      onPanResponderMove: (_, gs) => {
        if (trackWidth.current > 0) {
          const v = Math.min(Math.max(liveStartValue.current + gs.dx / trackWidth.current, 0), 1);
          animVal.setValue(v);
        }
      },
      onPanResponderRelease: (_, gs) => {
        if (trackWidth.current > 0) {
          const v = Math.min(Math.max(liveStartValue.current + gs.dx / trackWidth.current, 0), 1);
          liveStartValue.current = v;
          animVal.setValue(v);
          onValueChange(parseFloat(v.toFixed(2)));
        }
      },
    })
  ).current;

  const thumbTranslate = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackWidth.current - THUMB_SIZE],
    extrapolate: 'clamp',
  });

  return (
    <View style={sliderStyles.row}>
      <Volume2 size={16} color={colors.textTertiary} />
      <View
        style={sliderStyles.trackOuter}
        onLayout={e => {
          trackWidth.current = e.nativeEvent.layout.width;
          setMeasured(true);
        }}
        {...panResponder.panHandlers}
      >
        <View style={[sliderStyles.trackBar, { backgroundColor: colors.border ?? '#d0d0d0' }]} />
        <Animated.View
          pointerEvents="none"
          style={[
            sliderStyles.trackFill,
            {
              backgroundColor: semantic.accent,
              width: animVal.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
        {measured && (
          <Animated.View
            pointerEvents="none"
            style={[
              sliderStyles.thumbCircle,
              {
                backgroundColor: colors.backgroundPrimary,
                borderColor: semantic.accent,
                transform: [{ translateX: thumbTranslate }],
              },
            ]}
          />
        )}
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  trackOuter: {
    flex: 1,
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  trackBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumbCircle: {
    position: 'absolute',
    top: (THUMB_SIZE - THUMB_SIZE) / 2,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

// ---------------------------------------------------------------------------
// SettingsRow / SectionHeader / SegmentedControl (unchanged)
// ---------------------------------------------------------------------------

function SettingsRow({
  label,
  right,
  onPress,
  destructive,
}: {
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      disabled={!onPress}
    >
      <Text style={[styles.rowLabel, { color: destructive ? semantic.error : colors.text }]}>
        {label}
      </Text>
      <View style={styles.rowRight}>
        {right}
        {onPress && !right && <ChevronRight size={18} color={colors.textTertiary} />}
      </View>
    </Pressable>
  );
}


function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.backgroundTertiary }]}>
      {options.map(opt => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          style={[
            styles.segment,
            value === opt.value && { backgroundColor: colors.backgroundPrimary },
          ]}
        >
          <Text style={[styles.segmentText, { color: value === opt.value ? colors.text : colors.textTertiary }]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// SettingsScreen
// ---------------------------------------------------------------------------

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const prefs = usePreferencesStore();

  const currentLang = prefs.language ?? i18n.language.split('-')[0];

  // TimerCard ile aynı renk sistemi
  const cardBg = isDark ? '#161616' : '#F5F5F5';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const sectionLabelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';

  const themeOptions = [
    { label: t('settings.themeSystem'), value: 'system' },
    { label: t('settings.themeLight'), value: 'light' },
    { label: t('settings.themeDark'), value: 'dark' },
  ];

  const fontOptions = [
    { label: t('settings.fontNormal'), value: 'normal' },
    { label: t('settings.fontLarge'), value: 'large' },
    { label: t('settings.fontXlarge'), value: 'xlarge' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('settings.title').toUpperCase()}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Premium banner */}
          {!prefs.isPremium && (
            <Pressable
              onPress={() => router.push('/paywall')}
              style={[styles.premiumBanner, { backgroundColor: semantic.premium + '20' }]}
            >
              <Crown size={20} color={semantic.premium} />
              <Text style={[styles.premiumText, { color: colors.text }]}>
                {t('settings.upgradeToPremium')}
              </Text>
              <ChevronRight size={18} color={semantic.premium} />
            </Pressable>
          )}

          {/* Appearance */}
          <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>{t('settings.appearance').toUpperCase()}</Text>
            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
          </View>
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardRow}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.theme')}</Text>
              <SegmentedControl
                options={themeOptions}
                value={prefs.themeMode}
                onChange={v => prefs.setThemeMode(v as 'system' | 'light' | 'dark')}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            <View style={styles.cardRow}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{t('settings.timerFontSize')}</Text>
              <SegmentedControl
                options={fontOptions}
                value={prefs.timerFontSize}
                onChange={v => prefs.setTimerFontSize(v as 'normal' | 'large' | 'xlarge')}
              />
            </View>
          </View>

          {/* Color theme */}
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.rowLabel, { color: colors.text, marginBottom: spacing.md }]}>{t('settings.colorTheme')}</Text>
            <View style={styles.themeRow}>
              {colorThemes.map(theme => (
                <Pressable
                  key={theme.id}
                  onPress={() => {
                    if (theme.isPremium && !prefs.isPremium) {
                      router.push('/paywall');
                      return;
                    }
                    prefs.setColorThemeId(theme.id);
                  }}
                  style={[
                    styles.themeChip,
                    prefs.colorThemeId === theme.id && styles.themeChipSelected,
                  ]}
                >
                  <View style={[styles.themeColor, { backgroundColor: theme.work[0] }]} />
                  <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>{theme.name}</Text>
                  {theme.isPremium && !prefs.isPremium && (
                    <Crown size={10} color={semantic.premium} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Sound */}
          <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>{t('settings.sound').toUpperCase()}</Text>
            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
          </View>
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <SettingsRow
              label={t('settings.haptics')}
              right={
                <Switch
                  value={prefs.hapticsEnabled}
                  onValueChange={prefs.setHapticsEnabled}
                  trackColor={{ true: semantic.accent }}
                />
              }
            />
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            <SettingsRow
              label={t('settings.countdownSound')}
              right={
                <Switch
                  value={prefs.countdownSoundEnabled}
                  onValueChange={prefs.setCountdownSoundEnabled}
                  trackColor={{ true: semantic.accent }}
                />
              }
            />
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {/* Volume slider row */}
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>
                {t('settings.volume') ?? 'Volume'}
              </Text>
              <View style={styles.sliderContainer}>
                <VolumeSliderFinal
                  value={prefs.timerVolume}
                  onValueChange={prefs.setTimerVolume}
                />
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />

            {/* Sound pack selector */}
            <View style={styles.soundPackRow}>
              <Text style={[styles.rowLabel, { color: colors.text, marginBottom: spacing.md }]}>
                {t('settings.soundPack') ?? 'Sound Pack'}
              </Text>
              <View style={styles.themeRow}>
                {soundPacks.map(pack => {
                  const isSelected = prefs.soundPackId === pack.id;
                  const locked = pack.isPremium && !prefs.isPremium;
                  return (
                    <Pressable
                      key={pack.id}
                      onPress={() => {
                        if (locked) {
                          router.push('/paywall');
                          return;
                        }
                        prefs.setSoundPackId(pack.id);
                      }}
                      style={[
                        styles.themeChip,
                        isSelected && styles.themeChipSelected,
                      ]}
                    >
                      <Text style={[styles.themeLabel, { color: isSelected ? colors.text : colors.textSecondary }]}>
                        {pack.name}
                      </Text>
                      {locked && (
                        <Crown size={10} color={semantic.premium} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Timer defaults */}
          <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>{t('settings.timerDefaults').toUpperCase()}</Text>
            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
          </View>
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <SettingsRow
              label={t('settings.keepScreenAwake')}
              right={
                <Switch
                  value={prefs.keepScreenAwake}
                  onValueChange={prefs.setKeepScreenAwake}
                  trackColor={{ true: semantic.accent }}
                />
              }
            />
          </View>

          {/* Language */}
          <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>{t('settings.language').toUpperCase()}</Text>
            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
          </View>
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={[styles.cardRow, { flexWrap: 'wrap', gap: spacing.sm }]}>
              {LANGUAGES.map(lang => (
                <Pressable
                  key={lang.code}
                  onPress={() => {
                    prefs.setLanguage(lang.code);
                    i18n.changeLanguage(lang.code);
                  }}
                  style={[
                    styles.themeChip,
                    currentLang === lang.code && styles.themeChipSelected,
                  ]}
                >
                  <Text style={[styles.themeLabel, { color: currentLang === lang.code ? semantic.accent : colors.textSecondary }]}>
                    {lang.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* About */}
          <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
            <Text style={[styles.sectionLabel, { color: sectionLabelColor }]}>{t('settings.about').toUpperCase()}</Text>
            <View style={[styles.sectionLine, { backgroundColor: sectionLabelColor }]} />
          </View>
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <SettingsRow label={t('settings.rateApp')} onPress={() => {}} />
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            <SettingsRow label={t('settings.sendFeedback')} onPress={() => {}} />
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            <SettingsRow label={t('settings.privacyPolicy')} onPress={() => {}} />
            <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            <SettingsRow label={t('settings.termsOfService')} onPress={() => {}} />
          </View>

          {prefs.isPremium && (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <SettingsRow label={t('settings.restorePurchases')} onPress={() => {}} />
            </View>
          )}

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
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1.5,
    lineHeight: 34,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: layout.cardRadius,
    marginBottom: spacing.xl,
  },
  premiumText: { flex: 1, ...typography.body, fontWeight: '600' },
  // Section row — home screen ile aynı pattern
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },
  card: {
    borderRadius: layout.cardRadius,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardRow: {
    padding: layout.cardPadding,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: layout.cardPadding,
    minHeight: 52,
  },
  rowLabel: { ...typography.body },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  divider: { height: StyleSheet.hairlineWidth },
  segmented: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  segmentText: { ...typography.caption, fontWeight: '600' },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: layout.pillRadius,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeChipSelected: {
    borderColor: semantic.accent,
  },
  themeColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeLabel: { ...typography.caption },
  sliderContainer: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  soundPackRow: {
    padding: layout.cardPadding,
  },
});
