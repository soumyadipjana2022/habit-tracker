import { useMemo, useState } from 'react';
import { Bell, Check, ChevronLeft, ChevronRight, Edit2, Flame, Trash2 } from 'lucide-react';
import {
  formatDay,
  formatDayNumber,
  formatMonthYear,
  formatShortDate,
  getMonthDays,
  getMonthKey,
  shiftMonthKey,
  todayKey
} from '../utils/dates.js';
import { getCompletionSet, isHabitScheduledOn } from '../utils/habits.js';

const frequencyLabels = {
  daily: 'Daily',
  weekdays: 'Selected days',
  weekly: 'Weekly goal',
  monthly: 'Monthly goal'
};

const MonthCells = ({ days, habit, onToggleDay }) => {
  const completedDays = getCompletionSet(habit);
  const today = todayKey();

  return (
    <div className="grid min-w-max" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(38px, 1fr))` }}>
      {days.map((day) => {
        const completed = completedDays.has(day);
        const isToday = day === today;
        const isFuture = day > today;
        const isScheduled = isHabitScheduledOn(habit, day);
        const hasRequiredDate = ['daily', 'weekdays'].includes(habit.frequency);
        const isMissed = hasRequiredDate && isScheduled && !completed && day < today;
        const disabled = !isScheduled || isFuture;
        const cellLabel = !isScheduled ? 'Skipped' : isFuture ? 'Future' : isMissed ? 'Missed' : completed ? 'Done' : 'Open';

        return (
          <button
            key={day}
            type="button"
            role="checkbox"
            aria-checked={completed}
            aria-label={`${cellLabel}: ${habit.name} on ${formatDay(day)}, ${formatShortDate(day)}`}
            title={`${cellLabel}: ${formatDay(day)}, ${formatShortDate(day)}`}
            disabled={disabled}
            onClick={() => onToggleDay(habit, { day, completed })}
            className={`grid h-10 min-w-0 place-items-center border-b border-r border-slate-200 text-[11px] font-bold transition hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900 ${
              completed
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
                : isMissed
                  ? 'bg-rose-50 text-rose-400 dark:bg-rose-950/30 dark:text-rose-300'
                  : !isScheduled
                    ? 'bg-slate-50 text-slate-200 dark:bg-zinc-950/60 dark:text-zinc-800'
                    : isFuture
                      ? 'bg-slate-50 text-slate-300 dark:bg-zinc-950 dark:text-zinc-700'
                      : 'bg-white text-slate-300 hover:text-slate-600 dark:bg-zinc-950 dark:text-zinc-600 dark:hover:text-zinc-300'
            } ${isToday ? 'shadow-[inset_0_0_0_2px_rgba(15,23,42,0.85)] dark:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.9)]' : ''}`}
          >
            {completed ? <Check size={15} /> : isMissed ? '!' : ''}
          </button>
        );
      })}
    </div>
  );
};

const MonthHeader = ({ days }) => {
  const today = todayKey();

  return (
    <div className="grid min-w-max" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(38px, 1fr))` }}>
      {days.map((day) => (
        <div
          key={day}
          className={`border-b border-r border-slate-200 bg-slate-50 px-1 py-2 text-center dark:border-zinc-800 dark:bg-zinc-950/80 ${
            day === today ? 'text-slate-950 dark:text-white' : 'text-slate-500 dark:text-zinc-400'
          }`}
        >
          <div className="text-[10px] font-bold uppercase leading-none">{formatDay(day).slice(0, 3)}</div>
          <div className="mt-1 text-sm font-semibold leading-none">{formatDayNumber(day)}</div>
        </div>
      ))}
    </div>
  );
};

export default function HabitList({ habits, onToggleDay, onEdit, onDelete }) {
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());
  const days = useMemo(() => getMonthDays(selectedMonth), [selectedMonth]);

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/50 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Monthly sheet</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{formatMonthYear(selectedMonth)}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn-secondary min-h-10 px-3"
            type="button"
            onClick={() => setSelectedMonth((current) => shiftMonthKey(current, -1))}
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <input
            className="field h-10 min-h-10 w-[150px] py-1.5"
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value || getMonthKey())}
            aria-label="Select month"
          />
          <button
            className="btn-secondary min-h-10 px-3"
            type="button"
            onClick={() => setSelectedMonth((current) => shiftMonthKey(current, 1))}
            aria-label="Next month"
            title="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[260px_1fr_96px_112px]">
            <div className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
              Habit
            </div>
            <MonthHeader days={days} />
            <div className="border-b border-r border-slate-200 bg-slate-50 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
              Streak
            </div>
            <div className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
              Actions
            </div>
          </div>

          {habits.map((habit) => {
            const { stats } = habit;

            return (
              <article className="group grid grid-cols-[260px_1fr_96px_112px] transition" key={habit.id}>
                <div className="sticky left-0 z-10 min-w-0 border-b border-r border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="min-w-0 break-words text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                      {habit.name}
                    </h3>
                    {habit.reminder?.enabled ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                        <Bell size={12} />
                        {habit.reminder.time}
                      </span>
                    ) : null}
                  </div>
                  {habit.description ? (
                    <p className="mt-1 line-clamp-2 break-words text-sm leading-6 text-slate-500 dark:text-zinc-400">
                      {habit.description}
                    </p>
                  ) : null}
                  {!habit.description ? <p className="mt-1 text-sm text-slate-400 dark:text-zinc-500">No description</p> : null}
                  <span className="mt-2 inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    {frequencyLabels[habit.frequency] || habit.frequency}
                  </span>
                </div>

                <MonthCells days={days} habit={habit} onToggleDay={onToggleDay} />

                <div className="grid place-items-center border-b border-r border-slate-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-center">
                    <div className="flex justify-center text-slate-500 dark:text-zinc-400">
                      <Flame size={14} />
                    </div>
                    <p className="mt-1 text-lg font-semibold tracking-tight">{stats.streak}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 border-b border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <button
                    className="btn-secondary min-h-10 px-3"
                    type="button"
                    onClick={() => onEdit(habit)}
                    aria-label={`Edit ${habit.name}`}
                    title="Edit habit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-secondary min-h-10 px-3"
                    type="button"
                    onClick={() => onDelete(habit)}
                    aria-label={`Delete ${habit.name}`}
                    title="Delete habit"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
