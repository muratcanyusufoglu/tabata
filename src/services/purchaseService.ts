import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import {
  REVENUECAT_IOS_KEY,
  REVENUECAT_ANDROID_KEY,
  ENTITLEMENT_ID,
} from '../config/revenuecat';
import { handleError } from '../utils/errorHandler';

let isInitialized = false;

export async function initializePurchases(): Promise<void> {
  if (isInitialized) return;
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
    await Purchases.configure({ apiKey });
    isInitialized = true;
  } catch (e) {
    handleError('revenuecat_init_fail', e);
  }
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (e) {
    handleError('purchase_fail', e);
    return [];
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return checkEntitlement(customerInfo);
  } catch (e: any) {
    if (!e.userCancelled) {
      handleError('purchase_fail', e);
    }
    return false;
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return checkEntitlement(customerInfo);
  } catch (e) {
    handleError('purchase_restore_fail', e);
    return false;
  }
}

export async function checkCustomerInfo(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return checkEntitlement(customerInfo);
  } catch {
    return false;
  }
}

function checkEntitlement(customerInfo: CustomerInfo): boolean {
  return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
}

export function formatPrice(pkg: PurchasesPackage): string {
  return pkg.product.priceString;
}
