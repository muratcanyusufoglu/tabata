import { useTimerStore } from '../stores/timerStore';
import { handleError } from '../utils/errorHandler';

let intervalRef: ReturnType<typeof setInterval> | null = null;
let nextExpectedTick = 0;

export function startInterval(): void {
  stopInterval();
  nextExpectedTick = Date.now() + 1000;

  intervalRef = setInterval(() => {
    try {
      const now = Date.now();
      const drift = now - nextExpectedTick;
      nextExpectedTick += 1000;

      useTimerStore.getState().tick();

      if (Math.abs(drift) > 200) {
        stopInterval();
        startInterval();
      }
    } catch (e) {
      handleError('timer_interval_fail', e);
      stopInterval();
      startInterval();
    }
  }, 1000);
}

export function stopInterval(): void {
  if (intervalRef !== null) {
    clearInterval(intervalRef);
    intervalRef = null;
  }
}

export function isRunning(): boolean {
  return intervalRef !== null;
}
