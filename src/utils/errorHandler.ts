import { Alert } from 'react-native';
import i18n from '../i18n';

type ErrorSeverity = 'silent' | 'toast' | 'alert' | 'fallback';

interface ErrorConfig {
  severity: ErrorSeverity;
  userMessageKey?: string;
  fallbackAction?: () => void;
  shouldReport: boolean;
}

const errorConfigs: Record<string, ErrorConfig> = {
  audio_play_fail: { severity: 'silent', shouldReport: true },
  audio_session_fail: { severity: 'toast', userMessageKey: 'errors.audioSession', shouldReport: true },
  audio_preload_fail: { severity: 'toast', userMessageKey: 'errors.soundLoad', shouldReport: true },
  db_init_fail: { severity: 'alert', userMessageKey: 'errors.dbInit', shouldReport: true },
  db_write_fail: { severity: 'toast', userMessageKey: 'errors.saveFail', shouldReport: true },
  db_read_fail: { severity: 'silent', shouldReport: true },
  purchase_fail: { severity: 'alert', userMessageKey: 'errors.purchaseFail', shouldReport: true },
  purchase_restore_fail: { severity: 'alert', userMessageKey: 'errors.restoreFail', shouldReport: true },
  revenuecat_init_fail: { severity: 'silent', shouldReport: true },
  timer_background_drift: { severity: 'silent', shouldReport: true },
  timer_interval_fail: { severity: 'toast', userMessageKey: 'errors.timerError', shouldReport: true },
  notification_schedule_fail: { severity: 'silent', shouldReport: true },
  notification_permission_denied: { severity: 'silent', shouldReport: false },
  ad_load_fail: { severity: 'silent', shouldReport: false },
  network_error: { severity: 'silent', shouldReport: false },
};

let toastCallback: ((msg: string) => void) | null = null;

export function setToastCallback(cb: (msg: string) => void): void {
  toastCallback = cb;
}

export function handleError(key: string, error?: Error | unknown, context?: Record<string, unknown>): void {
  const config = errorConfigs[key] ?? { severity: 'silent', shouldReport: true };

  if (__DEV__) {
    console.warn(`[Error][${key}]`, error, context);
  }

  if (config.fallbackAction) {
    try { config.fallbackAction(); } catch {}
  }

  switch (config.severity) {
    case 'toast':
      if (toastCallback && config.userMessageKey) {
        toastCallback(i18n.t(config.userMessageKey));
      }
      break;
    case 'alert':
      if (config.userMessageKey) {
        Alert.alert(
          i18n.t('common.ok'),
          i18n.t(config.userMessageKey)
        );
      }
      break;
  }
}
