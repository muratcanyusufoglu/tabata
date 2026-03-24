import { getDatabase } from './database';
import { StreakData } from '../types';
import { daysBetween, formatDateKey } from '../utils/formatters';

export async function calculateStreak(): Promise<{ current: number; longest: number }> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{ d: string }>(
    `SELECT DISTINCT date(started_at) as d
     FROM workouts
     WHERE was_completed = 1
     ORDER BY d DESC`
  );

  if (rows.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  let longest = 0;
  let tempStreak = 0;

  let checkDate = new Date();
  checkDate.setHours(0, 0, 0, 0);

  const todayStr = formatDateKey(checkDate);
  if (rows[0].d !== todayStr) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (const row of rows) {
    if (row.d === formatDateKey(checkDate)) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  let prevDate: Date | null = null;
  for (const row of rows) {
    const d = new Date(row.d);
    if (prevDate && daysBetween(d, prevDate) === 1) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    longest = Math.max(longest, tempStreak);
    prevDate = d;
  }

  return { current, longest: Math.max(longest, current) };
}

export async function getStreakData(): Promise<StreakData> {
  const db = await getDatabase();

  const { current, longest } = await calculateStreak();

  const totalResult = await db.getFirstAsync<{ count: number; totalSeconds: number }>(
    `SELECT COUNT(*) as count, SUM(total_duration_seconds) as totalSeconds FROM workouts WHERE was_completed = 1`
  );

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekResult = await db.getFirstAsync<{ count: number; totalSeconds: number }>(
    `SELECT COUNT(*) as count, SUM(total_duration_seconds) as totalSeconds
     FROM workouts
     WHERE was_completed = 1 AND started_at >= ?`,
    [weekStart.toISOString()]
  );

  return {
    currentStreak: current,
    longestStreak: longest,
    totalWorkouts: totalResult?.count ?? 0,
    totalMinutes: Math.round((totalResult?.totalSeconds ?? 0) / 60),
    thisWeekWorkouts: weekResult?.count ?? 0,
    thisWeekMinutes: Math.round((weekResult?.totalSeconds ?? 0) / 60),
  };
}
