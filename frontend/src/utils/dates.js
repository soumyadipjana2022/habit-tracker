// Convert date to YYYY-MM-DD format in UTC to match backend
export const toUTCDayKey = (date = new Date()) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Keep for backward compatibility
export const toLocalDayKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayKey = () => toUTCDayKey();

export const getCurrentWeekDays = () => {
  const today = new Date();
  const day = today.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() + mondayOffset);

  return Array.from({ length: 7 }, (_item, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);
    return toUTCDayKey(date);
  });
};

export const getMonthKey = (date = new Date()) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getMonthDays = (monthKey = getMonthKey()) => {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const nextMonth = new Date(Date.UTC(year, month, 1));
  const dayCount = Math.round((nextMonth - firstDay) / 86400000);

  return Array.from({ length: dayCount }, (_item, index) => {
    const date = new Date(firstDay);
    date.setUTCDate(index + 1);
    return toUTCDayKey(date);
  });
};

export const shiftMonthKey = (monthKey, amount) => {
  const [year, month] = monthKey.split('-').map(Number);
  return getMonthKey(new Date(Date.UTC(year, month - 1 + amount, 1)));
};

export const formatMonthYear = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(Date.UTC(year, month - 1, 1)));
};

export const formatDay = (dayKey) =>
  new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${dayKey}T00:00:00.000Z`));

export const formatDayNumber = (dayKey) => String(new Date(`${dayKey}T00:00:00.000Z`).getUTCDate());

export const getWeekdayNumber = (dayKey) => new Date(`${dayKey}T00:00:00.000Z`).getUTCDay();

export const formatShortDate = (dayKey) =>
  new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${dayKey}T00:00:00.000Z`));

export const formatTime = (time) => {
  const [hour = '0', minute = '0'] = time.split(':');
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(2000, 0, 1, Number(hour), Number(minute))
  );
};
