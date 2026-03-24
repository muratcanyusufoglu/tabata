import { getDatabase } from './database';
import { generateUUID } from '../utils/uuid';
import { CalendarDay, WorkoutSummary, TimerCategory } from '../types';

interface SaveWorkoutParams {
  templateId: string;
  templateName: string;
  templateCategory: TimerCategory;
  startedAt: string;
  totalElapsedSeconds: number;
  plannedDurationSeconds: number;
  roundsCompleted: number;
  roundsTotal: number;
  setsCompleted: number;
  setsTotal: number;
  wasCompleted: boolean;
}

export async function saveWorkout(params: SaveWorkoutParams): Promise<void> {
  const db = await getDatabase();
  const now = new Date();
  const completedAt = now.toISOString();

  await db.runAsync(
    `INSERT INTO workouts (
      id, template_id, template_name, template_category,
      started_at, completed_at, total_duration_seconds, planned_duration_seconds,
      rounds_completed, rounds_total, sets_completed, sets_total,
      was_completed, year, month, day
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      generateUUID(),
      params.templateId,
      params.templateName,
      params.templateCategory,
      params.startedAt,
      completedAt,
      params.totalElapsedSeconds,
      params.plannedDurationSeconds,
      params.roundsCompleted,
      params.roundsTotal,
      params.setsCompleted,
      params.setsTotal,
      params.wasCompleted ? 1 : 0,
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    ]
  );
}

export async function getWorkoutsByMonth(year: number, month: number): Promise<CalendarDay[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    day: number;
    count: number;
    totalSeconds: number;
    hasCompleted: number;
  }>(
    `SELECT day,
            COUNT(*) as count,
            SUM(total_duration_seconds) as totalSeconds,
            MAX(was_completed) as hasCompleted
     FROM workouts
     WHERE year = ? AND month = ?
     GROUP BY day`,
    [year, month]
  );

  return rows.map(r => ({
    date: `${year}-${String(month).padStart(2, '0')}-${String(r.day).padStart(2, '0')}`,
    workoutCount: r.count,
    totalMinutes: Math.round((r.totalSeconds ?? 0) / 60),
    hasCompletedWorkout: r.hasCompleted === 1,
    workouts: [],
  }));
}

export async function getDayWorkouts(year: number, month: number, day: number): Promise<WorkoutSummary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: string;
    template_name: string;
    template_category: string;
    total_duration_seconds: number;
    was_completed: number;
    started_at: string;
  }>(
    `SELECT id, template_name, template_category, total_duration_seconds, was_completed, started_at
     FROM workouts
     WHERE year = ? AND month = ? AND day = ?
     ORDER BY started_at DESC`,
    [year, month, day]
  );

  return rows.map(r => ({
    id: r.id,
    templateName: r.template_name,
    category: r.template_category as TimerCategory,
    durationSeconds: r.total_duration_seconds,
    wasCompleted: r.was_completed === 1,
    startedAt: r.started_at,
  }));
}

export async function getRecentWorkouts(limit = 3): Promise<WorkoutSummary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: string;
    template_name: string;
    template_category: string;
    total_duration_seconds: number;
    was_completed: number;
    started_at: string;
  }>(
    `SELECT id, template_name, template_category, total_duration_seconds, was_completed, started_at
     FROM workouts
     ORDER BY started_at DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map(r => ({
    id: r.id,
    templateName: r.template_name,
    category: r.template_category as TimerCategory,
    durationSeconds: r.total_duration_seconds,
    wasCompleted: r.was_completed === 1,
    startedAt: r.started_at,
  }));
}

export async function getCompletedCount(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM workouts WHERE was_completed = 1`
  );
  return result?.count ?? 0;
}
