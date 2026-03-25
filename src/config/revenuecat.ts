// ─────────────────────────────────────────────
//  RevenueCat API Keys
//  Replace the placeholder strings below with your
//  keys from https://app.revenuecat.com
// ─────────────────────────────────────────────

export const REVENUECAT_IOS_KEY = 'appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
export const REVENUECAT_ANDROID_KEY = 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Product IDs — must match what you create in App Store Connect / Google Play
export const PRODUCT_IDS = {
  monthly: 'fittimer_premium_monthly',
  yearly: 'fittimer_premium_yearly',
  lifetime: 'fittimer_premium_lifetime',
} as const;

// Entitlement ID — create this in RevenueCat dashboard
export const ENTITLEMENT_ID = 'premium';
