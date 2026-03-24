import { create } from 'zustand';
import { TimerTemplate, TimerPhase, TimerStatus } from '../types';

interface TimerState {
  template: TimerTemplate | null;
  status: TimerStatus;
  currentPhase: TimerPhase;
  currentRound: number;
  currentSet: number;
  secondsRemaining: number;
  currentPhaseTotalSeconds: number;
  totalElapsedSeconds: number;
  nextPhase: TimerPhase | null;
  nextPhaseDuration: number;
  startedAt: string | null;
  lastTickTimestamp: number;

  start: (template: TimerTemplate) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skipPhase: () => void;
  tick: () => void;
  recalculateFromBackground: () => void;
}

function getNextPhase(
  currentPhase: TimerPhase,
  currentRound: number,
  currentSet: number,
  template: TimerTemplate
): { phase: TimerPhase; duration: number; newRound: number; newSet: number } {
  switch (currentPhase) {
    case 'prepare':
      return { phase: 'work', duration: template.workSeconds, newRound: 1, newSet: 1 };

    case 'work':
      if (currentRound < template.rounds) {
        if (template.restSeconds > 0) {
          return { phase: 'rest', duration: template.restSeconds, newRound: currentRound, newSet: currentSet };
        }
        return { phase: 'work', duration: template.workSeconds, newRound: currentRound + 1, newSet: currentSet };
      }
      if (currentSet < template.sets) {
        if (template.restBetweenSetsSeconds > 0) {
          return { phase: 'restBetweenSets', duration: template.restBetweenSetsSeconds, newRound: currentRound, newSet: currentSet };
        }
        return { phase: 'work', duration: template.workSeconds, newRound: 1, newSet: currentSet + 1 };
      }
      if (template.cooldownSeconds > 0) {
        return { phase: 'cooldown', duration: template.cooldownSeconds, newRound: currentRound, newSet: currentSet };
      }
      return { phase: 'completed', duration: 0, newRound: currentRound, newSet: currentSet };

    case 'rest':
      return { phase: 'work', duration: template.workSeconds, newRound: currentRound + 1, newSet: currentSet };

    case 'restBetweenSets':
      return { phase: 'work', duration: template.workSeconds, newRound: 1, newSet: currentSet + 1 };

    case 'cooldown':
      return { phase: 'completed', duration: 0, newRound: currentRound, newSet: currentSet };

    default:
      return { phase: 'completed', duration: 0, newRound: currentRound, newSet: currentSet };
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  template: null,
  status: 'idle',
  currentPhase: 'prepare',
  currentRound: 1,
  currentSet: 1,
  secondsRemaining: 0,
  currentPhaseTotalSeconds: 0,
  totalElapsedSeconds: 0,
  nextPhase: null,
  nextPhaseDuration: 0,
  startedAt: null,
  lastTickTimestamp: 0,

  start: (template: TimerTemplate) => {
    const prepareSeconds = template.prepareSeconds > 0 ? template.prepareSeconds : template.workSeconds;
    const initialPhase: TimerPhase = template.prepareSeconds > 0 ? 'prepare' : 'work';
    const initialDuration = template.prepareSeconds > 0 ? template.prepareSeconds : template.workSeconds;

    const firstNext = getNextPhase(initialPhase, 1, 1, template);

    set({
      template,
      status: 'running',
      currentPhase: initialPhase,
      currentRound: 1,
      currentSet: 1,
      secondsRemaining: initialDuration,
      currentPhaseTotalSeconds: initialDuration,
      totalElapsedSeconds: 0,
      nextPhase: firstNext.phase,
      nextPhaseDuration: firstNext.duration,
      startedAt: new Date().toISOString(),
      lastTickTimestamp: Date.now(),
    });
  },

  pause: () => {
    set({ status: 'paused', lastTickTimestamp: Date.now() });
  },

  resume: () => {
    set({ status: 'running', lastTickTimestamp: Date.now() });
  },

  stop: () => {
    set({
      template: null,
      status: 'idle',
      currentPhase: 'prepare',
      currentRound: 1,
      currentSet: 1,
      secondsRemaining: 0,
      currentPhaseTotalSeconds: 0,
      totalElapsedSeconds: 0,
      nextPhase: null,
      nextPhaseDuration: 0,
      startedAt: null,
      lastTickTimestamp: 0,
    });
  },

  skipPhase: () => {
    const state = get();
    if (!state.template) return;

    const next = getNextPhase(state.currentPhase, state.currentRound, state.currentSet, state.template);

    if (next.phase === 'completed') {
      set({
        currentPhase: 'completed',
        status: 'completed',
        secondsRemaining: 0,
        lastTickTimestamp: Date.now(),
      });
      return;
    }

    const nextNext = getNextPhase(next.phase, next.newRound, next.newSet, state.template);

    set({
      currentPhase: next.phase,
      secondsRemaining: next.duration,
      currentPhaseTotalSeconds: next.duration,
      currentRound: next.newRound,
      currentSet: next.newSet,
      nextPhase: nextNext.phase,
      nextPhaseDuration: nextNext.duration,
      lastTickTimestamp: Date.now(),
    });
  },

  tick: () => {
    const state = get();
    if (state.status !== 'running' || !state.template) return;

    const now = Date.now();
    const newRemaining = state.secondsRemaining - 1;
    const newElapsed = state.totalElapsedSeconds + 1;

    if (newRemaining <= 0) {
      const next = getNextPhase(state.currentPhase, state.currentRound, state.currentSet, state.template);

      if (next.phase === 'completed') {
        set({
          currentPhase: 'completed',
          status: 'completed',
          secondsRemaining: 0,
          totalElapsedSeconds: newElapsed,
          lastTickTimestamp: now,
        });
        return;
      }

      const nextNext = getNextPhase(next.phase, next.newRound, next.newSet, state.template);

      set({
        currentPhase: next.phase,
        secondsRemaining: next.duration,
        currentPhaseTotalSeconds: next.duration,
        currentRound: next.newRound,
        currentSet: next.newSet,
        totalElapsedSeconds: newElapsed,
        nextPhase: nextNext.phase,
        nextPhaseDuration: nextNext.duration,
        lastTickTimestamp: now,
      });
      return;
    }

    set({
      secondsRemaining: newRemaining,
      totalElapsedSeconds: newElapsed,
      lastTickTimestamp: now,
    });
  },

  recalculateFromBackground: () => {
    const state = get();
    if (state.status !== 'running' || !state.template) return;

    const now = Date.now();
    const missedMs = now - state.lastTickTimestamp;
    const missedSeconds = Math.floor(missedMs / 1000);

    if (missedSeconds <= 0) return;

    for (let i = 0; i < missedSeconds; i++) {
      get().tick();
      if (get().status === 'completed') break;
    }
  },
}));

export { getNextPhase };
