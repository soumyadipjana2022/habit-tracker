export const toDayKey = (value = new Date()) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }
  return date.toISOString().slice(0, 10);
};

export const startOfDayUtc = (value = new Date()) => {
  const dayKey = toDayKey(value);
  return new Date(`${dayKey}T00:00:00.000Z`);
};

export const getWeekDays = (value = new Date()) => {
  const date = startOfDayUtc(value);
  const day = date.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() + mondayOffset);

  return Array.from({ length: 7 }, (_item, index) => {
    const next = new Date(monday);
    next.setUTCDate(monday.getUTCDate() + index);
    return toDayKey(next);
  });
};

export const addDays = (dayKey, amount) => {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return toDayKey(date);
};

