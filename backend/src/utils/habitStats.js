import { addDays, getWeekDays, toDayKey } from './dateUtils.js';

const completionSet = (habit) => new Set(habit.completions.map((date) => toDayKey(date)));

const isScheduledOn = (habit, dayKey) => {
  if (habit.frequency === 'weekdays') {
    const day = new Date(`${dayKey}T00:00:00.000Z`).getUTCDay();
    const scheduledDays = habit.scheduledDays || [];
    return scheduledDays.length ? scheduledDays.includes(day) : true;
  }

  return true;
};

export const buildHabitStats = (habit, now = new Date()) => {
  const completedDays = completionSet(habit);
  const today = toDayKey(now);
  const weekDays = getWeekDays(now);
  const weekCompleted = weekDays.filter((day) => completedDays.has(day)).length;
  const weeklyTarget =
    habit.frequency === 'weekly'
      ? habit.weeklyGoal
      : habit.frequency === 'weekdays'
        ? weekDays.filter((day) => isScheduledOn(habit, day)).length
        : 7;

  let streak = 0;
  let cursor = today;

  while (!isScheduledOn(habit, cursor) || completedDays.has(cursor)) {
    if (isScheduledOn(habit, cursor)) {
      streak += 1;
    }
    cursor = addDays(cursor, -1);
  }

  const totalTrackedDays = Math.max(1, Math.ceil((new Date(today) - habit.createdAt) / 86400000) + 1);
  const completionPercentage = Math.min(100, Math.round((habit.completions.length / totalTrackedDays) * 100));

  return {
    streak,
    completedToday: completedDays.has(today),
    weekDays: weekDays.map((day) => ({ day, completed: completedDays.has(day) })),
    weekCompleted,
    weeklyTarget,
    weeklyGoalMet: weekCompleted >= weeklyTarget,
    completionPercentage,
    motivation:
      streak >= 14 ? 'Momentum master' : streak >= 7 ? 'One week strong' : streak >= 3 ? 'Building rhythm' : 'Fresh start'
  };
};

export const serializeHabit = (habit) => {
  const object = habit.toObject();
  return {
    ...object,
    id: object._id,
    stats: buildHabitStats(habit)
  };
};
