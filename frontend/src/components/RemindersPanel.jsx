import { Bell, BellRing, Clock } from 'lucide-react';
import { formatTime } from '../utils/dates.js';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const notify = async (habitName) => {
  if (!('Notification' in window)) return;

  const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
  if (permission === 'granted') {
    new Notification('Habit reminder', {
      body: `Time for ${habitName}.`,
      tag: `habit-test-${habitName}`
    });
  }
};

export default function RemindersPanel({ habits, onEdit }) {
  const reminders = habits.filter((habit) => habit.reminder?.enabled);
  const permission = 'Notification' in window ? Notification.permission : 'unsupported';
  const today = new Date().getDay();
  const dueToday = reminders.filter((habit) => habit.reminder.days.includes(today));

  return (
    <div className="panel p-4 sm:p-5" id="reminders">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Reminders</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Reminder center</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            {permission === 'granted' ? 'Browser notifications are enabled.' : 'Enable browser notifications to get alerts while the app is open.'}
          </p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950">
          <Bell size={18} />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Active</p>
          <p className="mt-1 text-xl font-semibold tracking-tight">{reminders.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Today</p>
          <p className="mt-1 text-xl font-semibold tracking-tight">{dueToday.length}</p>
        </div>
      </div>

      {reminders.length ? (
        <div className="space-y-3">
          {reminders.map((habit) => (
            <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950" key={habit.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{habit.name}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-zinc-400">
                    <Clock size={13} />
                    {formatTime(habit.reminder.time)}
                  </p>
                </div>
                <button className="btn-secondary min-h-9 px-3 text-xs" type="button" onClick={() => notify(habit.name)}>
                  <BellRing size={14} />
                  Test
                </button>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1">
                {dayNames.map((day, index) => (
                  <span
                    className={`grid h-7 place-items-center rounded-md text-[10px] font-bold ${
                      habit.reminder.days.includes(index)
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-zinc-950'
                        : 'border border-slate-200 bg-slate-50 text-slate-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600'
                    }`}
                    key={`${habit.id}-${day}`}
                  >
                    {day.slice(0, 1)}
                  </span>
                ))}
              </div>
              <button className="mt-3 text-xs font-semibold text-slate-500 underline decoration-slate-300 underline-offset-4 dark:text-zinc-400" type="button" onClick={() => onEdit(habit)}>
                Edit reminder
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm leading-6 text-slate-500 dark:border-zinc-700 dark:text-zinc-400">
          No reminders yet. Edit a habit and turn on Reminder to choose time and days.
        </div>
      )}
    </div>
  );
}

