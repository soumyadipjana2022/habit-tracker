import { getCurrentWeekDays, getWeekdayNumber, todayKey } from './dates.js';

export const completionDayKey = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
};

export const getCompletionSet = (habit) => new Set((habit.completions || []).map(completionDayKey));

export const isHabitCompletedOn = (habit, dayKey) => getCompletionSet(habit).has(dayKey);

export const isHabitScheduledOn = (habit, dayKey) => {
  if (habit.frequency === 'weekdays') {
    const scheduledDays = habit.scheduledDays?.length ? habit.scheduledDays : [1, 2, 3, 4, 5];
    return scheduledDays.includes(getWeekdayNumber(dayKey));
  }

  return true;
};

const addDays = (dayKey, amount) => {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const buildClientStats = (habit) => {
  const completedDays = getCompletionSet(habit);
  const today = todayKey();
  const weekDays = getCurrentWeekDays();
  const weekCompleted = weekDays.filter((day) => completedDays.has(day)).length;
  const weeklyTarget =
    habit.frequency === 'weekly'
      ? habit.weeklyGoal || 1
      : habit.frequency === 'weekdays'
        ? weekDays.filter((day) => isHabitScheduledOn(habit, day)).length
        : 7;

  let streak = 0;
  let cursor = today;
  while (!isHabitScheduledOn(habit, cursor) || completedDays.has(cursor)) {
    if (isHabitScheduledOn(habit, cursor)) {
      streak += 1;
    }
    cursor = addDays(cursor, -1);
  }

  const createdAt = habit.createdAt ? new Date(habit.createdAt) : new Date();
  const createdDay = new Date(createdAt.getUTCFullYear(), createdAt.getUTCMonth(), createdAt.getUTCDate());
  const currentDay = new Date(`${today}T00:00:00.000Z`);
  const trackedDays = Math.max(1, Math.floor((currentDay - createdDay) / 86400000) + 1);
  const completionPercentage = Math.min(100, Math.round(((habit.completions || []).length / trackedDays) * 100));

  return {
    ...(habit.stats || {}),
    streak,
    completedToday: isHabitCompletedOn(habit, today),
    weekDays: weekDays.map((day) => ({ day, completed: completedDays.has(day) })),
    weekCompleted,
    weeklyTarget,
    weeklyGoalMet: weekCompleted >= weeklyTarget,
    completionPercentage,
    motivation:
      streak >= 14 ? 'Momentum master' : streak >= 7 ? 'One week strong' : streak >= 3 ? 'Building rhythm' : 'Fresh start'
  };
};

export const normalizeHabit = (habit) => ({
  ...habit,
  id: habit.id || habit._id,
  stats: buildClientStats(habit)
});

export const normalizeHabits = (habits = []) => habits.map(normalizeHabit);

export const setHabitCompletionForDay = (habit, dayKey, completed) => {
  const existing = new Set((habit.completions || []).map(completionDayKey));

  if (completed) {
    existing.add(dayKey);
  } else {
    existing.delete(dayKey);
  }

  return normalizeHabit({
    ...habit,
    completions: Array.from(existing).sort()
  });
};
