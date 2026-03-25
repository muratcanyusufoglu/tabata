import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Clock, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/hooks/useTheme';
import { StatCard } from '../../src/components/ui/StatCard';
import { StreakBadge } from '../../src/components/ui/StreakBadge';
import { semantic } from '../../src/constants/colors';
import { layout, spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { getStreakData, getCalendarMonth } from '../../src/services/streakService';
import { StreakData, CalendarDay } from '../../src/types';

function CalendarGrid({ year, month, days }: { year: number; month: number; days: CalendarDay[] }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const daysInMonth = new Date(year, month, 0).getDate();
  // First day of month (0=Sun, convert to Mon-based)
  const firstDay = new Date(year, month - 1, 1).getDay();
  const offset = (firstDay + 6) % 7; // Monday-based offset

  const dayMap = new Map(days.map(d => [d.date.split('-')[2], d]));

  const cells: Array<{ day: number | null; data: CalendarDay | null }> = [];
  for (let i = 0; i < offset; i++) cells.push({ day: null, data: null });
  for (let d = 1; d <= daysInMonth; d++) {
    const key = String(d).padStart(2, '0');
    cells.push({ day: d, data: dayMap.get(key) ?? null });
  }

  return (
    <View>
      <View style={styles.weekRow}>
        {weekdays.map(wd => (
          <Text key={wd} style={[styles.weekday, { color: colors.textTertiary }]}>{wd}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((cell, i) => {
          if (!cell.day) return <View key={`e${i}`} style={styles.cell} />;
          const hasWorkout = cell.data?.hasCompletedWorkout;
          return (
            <View
              key={cell.day}
              style={[
                styles.cell,
                hasWorkout && { backgroundColor: semantic.success + '33' },
              ]}
            >
              <Text style={[
                styles.dayNum,
                { color: hasWorkout ? semantic.success : colors.textTertiary },
                hasWorkout && { fontWeight: '700' },
              ]}>
                {cell.day}
              </Text>
              {hasWorkout && <View style={[styles.dot, { backgroundColor: semantic.success }]} />}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [calDays, setCalDays] = useState<CalendarDay[]>([]);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    getStreakData().then(setStreak).catch(() => {});
  }, []);

  useEffect(() => {
    getCalendarMonth(year, month).then(setCalDays).catch(() => {});
  }, [year, month]);

  function navigateMonth(dir: -1 | 1) {
    setMonth(prevMonth => {
      const next = prevMonth + dir;
      if (next < 1) {
        setYear(y => y - 1);
        return 12;
      }
      if (next > 12) {
        setYear(y => y + 1);
        return 1;
      }
      return next;
    });
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  const monthName = t(`calendar.months.${['january','february','march','april','may','june','july','august','september','october','november','december'][month - 1]}`);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('history.title')}</Text>
          {streak && streak.currentStreak > 0 && (
            <StreakBadge count={streak.currentStreak} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats row */}
          {streak && (
            <View style={styles.statsRow}>
              <StatCard
                value={streak.currentStreak}
                label={t('history.streak', { count: '' }).replace('{{count}}', '').trim() || 'Day Streak'}
                icon={<Flame size={20} color={semantic.streak} />}
                style={styles.statCard}
              />
              <StatCard
                value={streak.totalWorkouts}
                label={t('history.workouts', { count: '' }).replace('{{count}}', '').trim() || 'Workouts'}
                icon={<Dumbbell size={20} color={semantic.accent} />}
                style={styles.statCard}
              />
              <StatCard
                value={`${streak.totalMinutes}m`}
                label="Total Time"
                icon={<Clock size={20} color={semantic.success} />}
                style={styles.statCard}
              />
            </View>
          )}

          {/* Calendar */}
          <View style={[styles.calendarCard, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border }]}>
            <View style={styles.monthNav}>
              <Pressable
                onPress={() => navigateMonth(-1)}
                style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.5 : 1 }]}
                hitSlop={8}
              >
                <ChevronLeft size={22} color={colors.text} />
              </Pressable>
              <Text style={[styles.monthTitle, { color: colors.text }]}>{monthName} {year}</Text>
              <Pressable
                onPress={() => navigateMonth(1)}
                style={({ pressed }) => [styles.navButton, { opacity: isCurrentMonth ? 0.3 : pressed ? 0.5 : 1 }]}
                disabled={isCurrentMonth}
                hitSlop={8}
              >
                <ChevronRight size={22} color={colors.text} />
              </Pressable>
            </View>
            <CalendarGrid year={year} month={month} days={calDays} />
          </View>

          <View style={{ height: layout.tabBarHeight + spacing.xxl }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { ...typography.h2 },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: { flex: 1 },
  calendarCard: {
    borderRadius: layout.cardRadius,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  navButton: {
    padding: spacing.xs,
  },
  monthTitle: {
    ...typography.h3,
    textAlign: 'center',
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginVertical: 2,
  },
  dayNum: {
    ...typography.caption,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
