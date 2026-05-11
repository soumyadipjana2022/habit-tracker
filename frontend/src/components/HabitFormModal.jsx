import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const defaultForm = {
  name: '',
  description: '',
  frequency: 'daily',
  scheduledDays: [1, 2, 3, 4, 5],
  weeklyGoal: 5,
  monthlyGoal: 20,
  reminder: { enabled: false, time: '09:00', days: [1, 2, 3, 4, 5] }
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitFormModal({ habit, open, onClose, onSave }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    setForm(
      habit
        ? {
            name: habit.name,
            description: habit.description || '',
            frequency: habit.frequency,
            scheduledDays: habit.scheduledDays?.length ? habit.scheduledDays : defaultForm.scheduledDays,
            weeklyGoal: habit.weeklyGoal || 5,
            monthlyGoal: habit.monthlyGoal || 20,
            reminder: habit.reminder || defaultForm.reminder
          }
        : defaultForm
    );
  }, [habit, open]);

  if (!open) return null;

  const updateReminderDay = (day) => {
    const days = form.reminder.days.includes(day)
      ? form.reminder.days.filter((item) => item !== day)
      : [...form.reminder.days, day].sort();
    setForm({ ...form, reminder: { ...form.reminder, days } });
  };

  const updateScheduledDay = (day) => {
    const scheduledDays = form.scheduledDays.includes(day)
      ? form.scheduledDays.filter((item) => item !== day)
      : [...form.scheduledDays, day].sort();
    setForm({ ...form, scheduledDays });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end overflow-y-auto bg-slate-950/45 p-0 backdrop-blur-sm sm:grid sm:place-items-center sm:p-4 sm:overflow-y-visible">
      <div className="w-full max-h-[92svh] overflow-y-auto rounded-t-2xl border border-slate-200/80 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:max-w-xl sm:rounded-2xl sm:max-h-[90svh] sm:p-6">
        <div className="mb-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{habit ? 'Update routine' : 'Create routine'}</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">{habit ? 'Edit habit' : 'New habit'}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Keep it specific enough to complete today.</p>
          </div>
          <button className="btn-secondary shrink-0 px-3" type="button" onClick={onClose} aria-label="Close dialog" title="Close">
            <X size={18} />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave({
              ...form,
              scheduledDays: form.scheduledDays.length ? form.scheduledDays : defaultForm.scheduledDays
            });
          }}
        >
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Description</span>
            <textarea
              className="field min-h-24 resize-y"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Frequency</span>
              <select className="field" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                <option value="daily">Daily</option>
                <option value="weekdays">Specific weekdays</option>
                <option value="weekly">X times per week</option>
                <option value="monthly">X times per month</option>
              </select>
            </label>
            {form.frequency === 'weekly' ? (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Weekly goal</span>
                <input
                  className="field"
                  type="number"
                  min="1"
                  max="7"
                  value={form.weeklyGoal}
                  onChange={(e) => setForm({ ...form, weeklyGoal: Number(e.target.value) })}
                />
              </label>
            ) : null}
            {form.frequency === 'monthly' ? (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Monthly goal</span>
                <input
                  className="field"
                  type="number"
                  min="1"
                  max="31"
                  value={form.monthlyGoal}
                  onChange={(e) => setForm({ ...form, monthlyGoal: Number(e.target.value) })}
                />
              </label>
            ) : null}
          </div>

          {form.frequency === 'weekdays' ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
              <span className="mb-3 block text-sm font-medium">Active days</span>
              <div className="grid grid-cols-7 gap-1">
                {dayLabels.map((label, day) => (
                  <button
                    className={`min-h-10 min-w-0 rounded-lg text-[11px] font-bold transition sm:text-xs ${
                      form.scheduledDays.includes(day)
                        ? 'bg-slate-950 text-white dark:bg-white dark:text-zinc-950'
                        : 'border border-slate-200 bg-white text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                    key={`${label}-${day}`}
                    type="button"
                    onClick={() => updateScheduledDay(day)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="btn-secondary min-h-9 px-3 text-xs"
                  type="button"
                  onClick={() => setForm({ ...form, scheduledDays: [1, 2, 3, 4, 5] })}
                >
                  Weekdays
                </button>
                <button
                  className="btn-secondary min-h-9 px-3 text-xs"
                  type="button"
                  onClick={() => setForm({ ...form, scheduledDays: [0, 1, 2, 3, 4, 5, 6] })}
                >
                  Every day
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50" id="reminders">
            <label className="flex items-center justify-between gap-3">
              <span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Bell size={17} />
                  Reminder
                </span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-zinc-400">Browser alerts work while the app is open.</span>
              </span>
              <input
                className="h-5 w-5 accent-emerald-600"
                type="checkbox"
                checked={form.reminder.enabled}
                onChange={(e) => setForm({ ...form, reminder: { ...form.reminder, enabled: e.target.checked } })}
              />
            </label>

            {form.reminder.enabled ? (
              <div className="mt-4 space-y-3">
                <input
                  className="field"
                  type="time"
                  value={form.reminder.time}
                  onChange={(e) => setForm({ ...form, reminder: { ...form.reminder, time: e.target.value } })}
                />
                <div className="grid grid-cols-7 gap-1">
                  {dayLabels.map((label, day) => (
                    <button
                      className={`min-h-10 min-w-0 rounded-lg text-[11px] font-bold transition sm:text-xs ${
                        form.reminder.days.includes(day)
                          ? 'bg-slate-950 text-white dark:bg-white dark:text-zinc-950'
                          : 'border border-slate-200 bg-white text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                      }`}
                      key={`${label}-${day}`}
                      type="button"
                      onClick={() => updateReminderDay(day)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="btn-secondary min-h-9 px-3 text-xs"
                    type="button"
                    onClick={() => setForm({ ...form, reminder: { ...form.reminder, days: [1, 2, 3, 4, 5] } })}
                  >
                    Weekdays
                  </button>
                  <button
                    className="btn-secondary min-h-9 px-3 text-xs"
                    type="button"
                    onClick={() => setForm({ ...form, reminder: { ...form.reminder, days: [0, 1, 2, 3, 4, 5, 6] } })}
                  >
                    Every day
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" type="submit">
              Save habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
