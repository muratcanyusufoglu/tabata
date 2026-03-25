import { getWorkoutsByMonth, getCompletedCount } from '../db/workoutRepository';
import { StreakData, CalendarDay } from '../types';

export async function getCalendarMonth(year: number, month: number): Promise<CalendarDay[]> {
  try {
    return await getWorkoutsByMonth(year, month);
  } catch {
    return [];
  }
}

export async function getStreakData(): Promise<StreakData> {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Get this month and last month for streak calc
    const thisMonth = await getWorkoutsByMonth(year, month);
    const lastMonthDate = new Date(year, month - 2, 1);
    const lastMonth = await getWorkoutsByMonth(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1);

    const allDays = [...lastMonth, ...thisMonth].sort((a, b) => a.date.localeCompare(b.date));
    const completedDates = new Set(allDays.filter(d => d.hasCompletedWorkout).map(d => d.date));

    // Calculate current streak
    // Use local date components to avoid UTC offset issues
    function localDateKey(d: Date): string {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }

    let currentStreak = 0;
    const checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    while (true) {
      const dateKey = localDateKey(checkDate);
      if (completedDates.has(dateKey)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // This week
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const thisWeekDays = thisMonth.filter(d => {
      const date = new Date(d.date);
      return date >= weekStart;
    });
    const thisWeekWorkouts = thisWeekDays.reduce((s, d) => s + d.workoutCount, 0);
    const thisWeekMinutes = thisWeekDays.reduce((s, d) => s + d.totalMinutes, 0);

    const totalWorkouts = await getCompletedCount();

    return {
      currentStreak,
      longestStreak: currentStreak, // simplified
      totalWorkouts,
      totalMinutes: allDays.reduce((s, d) => s + d.totalMinutes, 0),
      thisWeekWorkouts,
      thisWeekMinutes,
    };
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalWorkouts: 0,
      totalMinutes: 0,
      thisWeekWorkouts: 0,
      thisWeekMinutes: 0,
    };
  }
}
