import * as Notifications from 'expo-notifications';
import { handleError } from '../utils/errorHandler';
import i18n from '../i18n';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    handleError('notification_permission_denied', e);
    return false;
  }
}

export async function schedulePhaseNotifications(timerState: {
  currentPhase: string;
  secondsRemaining: number;
  template: { name: string } | null;
}): Promise<void> {
  try {
    await cancelAll();

    if (!timerState.template) return;

    const delay = timerState.secondsRemaining;
    if (delay <= 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.workTitle'),
        body: timerState.template.name,
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delay,
      },
    });
  } catch (e) {
    handleError('notification_schedule_fail', e);
  }
}

export async function cancelAll(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
