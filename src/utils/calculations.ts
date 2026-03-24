import { TimerTemplate } from '../types';

export function calculateTotalDuration(t: {
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
  const betweenSetsRest = t.restBetweenSetsSeconds * Math.max(0, t.sets - 1);
  return t.prepareSeconds + allSets + betweenSetsRest + t.cooldownSeconds;
}

export function validateTimer(t: Partial<TimerTemplate>): string[] {
  const errors: string[] = [];

  if (!t.name?.trim()) errors.push('editor.validation.nameRequired');
  if (t.name && t.name.length > 50) errors.push('editor.validation.nameTooLong');
  if (!t.workSeconds || t.workSeconds < 1) errors.push('editor.validation.workRequired');
  if (t.workSeconds && t.workSeconds > 3600) errors.push('editor.validation.workRequired');
  if (t.restSeconds !== undefined && t.restSeconds < 0) errors.push('editor.validation.workRequired');
  if (!t.rounds || t.rounds < 1) errors.push('editor.validation.workRequired');
  if (t.rounds && t.rounds > 100) errors.push('editor.validation.workRequired');
  if (!t.sets || t.sets < 1) errors.push('editor.validation.workRequired');
  if (t.sets && t.sets > 20) errors.push('editor.validation.workRequired');

  if (t.workSeconds && t.rounds && t.sets) {
    const total = calculateTotalDuration({
      prepareSeconds: t.prepareSeconds ?? 0,
      workSeconds: t.workSeconds,
      restSeconds: t.restSeconds ?? 0,
      rounds: t.rounds,
      sets: t.sets,
      restBetweenSetsSeconds: t.restBetweenSetsSeconds ?? 0,
      cooldownSeconds: t.cooldownSeconds ?? 0,
    });
    if (total > 7200) errors.push('editor.validation.tooLong');
  }

  return errors;
}

export function getProgressPercent(secondsRemaining: number, totalSeconds: number): number {
  if (totalSeconds <= 0) return 0;
  return (totalSeconds - secondsRemaining) / totalSeconds;
}
