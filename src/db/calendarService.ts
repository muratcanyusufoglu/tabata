import { getDatabase } from './database';
import { CalendarDay } from '../types';
import { getDayWorkouts, getWorkoutsByMonth } from './workoutRepository';

export async function getCalendarMonth(year: number, month: number): Promise<CalendarDay[]> {
  return getWorkoutsByMonth(year, month);
}

export async function getDayDetail(year: number, month: number, day: number): Promise<CalendarDay> {
  const db = await getDatabase();
  const workouts = await getDayWorkouts(year, month, day);
  const totalMinutes = workouts.reduce((sum, w) => sum + Math.round(w.durationSeconds / 60), 0);

  return {
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    workoutCount: workouts.length,
    totalMinutes,
    hasCompletedWorkout: workouts.some(w => w.wasCompleted),
    workouts,
  };
}
