import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Crown, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { PurchasesPackage } from 'react-native-purchases';
import { usePreferencesStore } from '../src/stores/preferencesStore';
import {
  getOfferings, purchasePackage, restorePurchases, formatPrice,
} from '../src/services/purchaseService';
import { semantic } from '../src/constants/colors';
import { layout, spacing } from '../src/constants/spacing';
import { typography } from '../src/constants/typography';

const FEATURES = [
  'premium.feature1', 'premium.feature2', 'premium.feature3',
  'premium.feature4', 'premium.feature5', 'premium.feature6',
];

// Map RevenueCat package types to translation keys
function planLabel(pkg: PurchasesPackage, t: (k: string) => string): string {
  const id = pkg.identifier;
  if (id.includes('monthly')) return t('premium.monthly');
  if (id.includes('yearly') || id.includes('annual')) return t('premium.yearly');
  if (id.includes('lifetime')) return t('premium.lifetime');
  return pkg.product.title;
}

function isBestValue(pkg: PurchasesPackage): boolean {
  const id = pkg.identifier;
  return id.includes('yearly') || id.includes('annual');
}

export default function PaywallScreen() {
  const { t } = useTranslation();
  const setIsPremium = usePreferencesStore(s => s.setIsPremium);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    getOfferings().then(pkgs => {
      setPackages(pkgs);
      // Default select yearly if available, else first
      const yearly = pkgs.find(p => isBestValue(p));
      setSelected(yearly ?? pkgs[0] ?? null);
      setLoading(false);
    });
  }, []);

  async function handleSubscribe() {
    if (!selected || purchasing) return;
    setPurchasing(true);
    const success = await purchasePackage(selected);
    setPurchasing(false);
    if (success) {
      setIsPremium(true);
      router.back();
    } else {
      Alert.alert(t('common.ok'), t('errors.purchaseFail'));
    }
  }

  async function handleRestore() {
    const success = await restorePurchases();
    if (success) {
      setIsPremium(true);
      router.back();
    } else {
      Alert.alert(t('common.ok'), t('errors.restoreFail'));
    }
  }

  return (
    <LinearGradient colors={['#1a1a2e', '#0f3460', '#1a1a2e']} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <X size={24} color="rgba(255,255,255,0.7)" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.crownWrap}>
            <LinearGradient colors={[semantic.premium, '#FF9500']} style={styles.crownCircle}>
              <Crown size={40} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>{t('premium.title')}</Text>
          <Text style={styles.subtitle}>{t('premium.subtitle')}</Text>

          <View style={styles.features}>
            {FEATURES.map(key => (
              <View key={key} style={styles.featureRow}>
                <View style={[styles.checkCircle, { backgroundColor: semantic.success }]}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
                <Text style={styles.featureText}>{t(key)}</Text>
              </View>
            ))}
          </View>

          {/* Pricing */}
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="large" style={{ marginVertical: spacing.xxl }} />
          ) : packages.length === 0 ? (
            <Text style={styles.noOfferings}>No offerings available</Text>
          ) : (
            <View style={styles.pricingRow}>
              {packages.map(pkg => {
                const best = isBestValue(pkg);
                const isSelected = selected?.identifier === pkg.identifier;
                return (
                  <Pressable
                    key={pkg.identifier}
                    onPress={() => setSelected(pkg)}
                    style={[
                      styles.priceCard,
                      best && styles.priceCardFeatured,
                      isSelected && styles.priceCardSelected,
                    ]}
                  >
                    {best && (
                      <View style={styles.bestValueBadge}>
                        <Text style={styles.bestValueText}>{t('premium.bestValue')}</Text>
                      </View>
                    )}
                    <Text style={[styles.planLabel, (best || isSelected) && { color: '#FFFFFF' }]}>
                      {planLabel(pkg, t)}
                    </Text>
                    <Text style={[styles.planPrice, (best || isSelected) && { color: '#FFFFFF' }]}>
                      {formatPrice(pkg)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={styles.cta}>
          <Pressable
            onPress={handleSubscribe}
            disabled={purchasing || !selected}
            style={({ pressed }) => [styles.ctaBtn, { opacity: pressed || purchasing ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={[semantic.premium, '#FF9500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtnGradient}
            >
              {purchasing
                ? <ActivityIndicator color="#FFFFFF" />
                : <>
                    <Crown size={18} color="#FFFFFF" />
                    <Text style={styles.ctaText}>{t('premium.subscribe')}</Text>
                  </>
              }
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleRestore} style={styles.restoreBtn}>
            <Text style={styles.restoreText}>{t('premium.restore')}</Text>
          </Pressable>

          <Text style={styles.termsText}>{t('premium.terms')}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
  },
  closeBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  crownWrap: { marginBottom: spacing.xl, marginTop: spacing.lg },
  crownCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...typography.h1, color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.sm },
  subtitle: {
    ...typography.body, color: 'rgba(255,255,255,0.65)',
    textAlign: 'center', marginBottom: spacing.xxl,
  },
  features: { alignSelf: 'stretch', gap: spacing.md, marginBottom: spacing.xxl },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  featureText: { ...typography.body, color: 'rgba(255,255,255,0.9)', flex: 1 },
  noOfferings: { ...typography.body, color: 'rgba(255,255,255,0.5)', marginVertical: spacing.xxl },
  pricingRow: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch' },
  priceCard: {
    flex: 1, alignItems: 'center', padding: spacing.md,
    borderRadius: layout.cardRadius, borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    gap: spacing.sm, minHeight: 90, justifyContent: 'center',
  },
  priceCardFeatured: {
    borderColor: semantic.premium,
    backgroundColor: 'rgba(255,214,10,0.12)',
  },
  priceCardSelected: {
    borderColor: semantic.accent,
    backgroundColor: 'rgba(0,122,255,0.15)',
  },
  bestValueBadge: {
    position: 'absolute', top: -10,
    backgroundColor: semantic.premium,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
    borderRadius: layout.pillRadius,
  },
  bestValueText: { ...typography.badge, color: '#000000', fontWeight: '800' },
  planLabel: {
    ...typography.caption, color: 'rgba(255,255,255,0.7)',
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  planPrice: { ...typography.bodySmall, color: 'rgba(255,255,255,0.9)', fontWeight: '700', textAlign: 'center' },
  cta: {
    paddingHorizontal: layout.screenPadding, paddingBottom: spacing.xl,
    gap: spacing.md, alignItems: 'center',
  },
  ctaBtn: { alignSelf: 'stretch', borderRadius: layout.pillRadius, overflow: 'hidden' },
  ctaBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, paddingVertical: spacing.lg,
  },
  ctaText: { ...typography.body, color: '#FFFFFF', fontWeight: '700' },
  restoreBtn: { paddingVertical: spacing.sm },
  restoreText: { ...typography.bodySmall, color: 'rgba(255,255,255,0.5)' },
  termsText: { ...typography.caption, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
});
