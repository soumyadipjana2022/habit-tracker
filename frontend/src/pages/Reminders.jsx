import { useEffect, useState } from 'react';
import api from '../api/client.js';
import AppShell from '../components/AppShell.jsx';
import RemindersPanel from '../components/RemindersPanel.jsx';
import { normalizeHabits } from '../utils/habits.js';

export default function Reminders() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingHabit, setEditingHabit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadHabits = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/habits');
      setHabits(normalizeHabits(data.habits));
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not load habits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const habitsWithReminders = habits.filter(h => h.reminder?.enabled);
  const habitsWithoutReminders = habits.filter(h => !h.reminder?.enabled);

  return (
    <AppShell onCreate={() => {}}>
      <div id="reminders" className="mx-auto max-w-7xl min-w-0">
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm shadow-slate-950/[0.03] backdrop-blur sm:mb-7 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/45">
          <div className="min-w-0">
            <p className="eyebrow">Stay on track</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 min-[380px]:text-3xl sm:text-4xl dark:text-white">Reminders</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-[15px]">
              Manage your habit reminders and stay notified about your routines at the right time.
            </p>
          </div>
        </section>

        {error ? (
          <div className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</div>
        ) : null}

        {loading ? (
          <div className="panel p-6 text-sm text-slate-500 dark:text-zinc-400">Loading reminders...</div>
        ) : habits.length ? (
          <section className="grid gap-5 xl:grid-cols-2 xl:gap-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                <div>
                  <p className="eyebrow">Active Reminders</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">Enabled</h2>
                </div>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {habitsWithReminders.length}
                </span>
              </div>
              {habitsWithReminders.length ? (
                <RemindersPanel
                  habits={habitsWithReminders}
                  onEdit={(selected) => {
                    setEditingHabit(selected);
                    setModalOpen(true);
                  }}
                />
              ) : (
                <div className="panel p-6 text-center text-slate-500 dark:text-zinc-400">
                  <p>No reminders enabled yet.</p>
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                <div>
                  <p className="eyebrow">No Reminders</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">Disabled</h2>
                </div>
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {habitsWithoutReminders.length}
                </span>
              </div>
              {habitsWithoutReminders.length ? (
                <div className="space-y-3">
                  {habitsWithoutReminders.map((habit) => (
                    <div key={habit.id} className="panel p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-950 dark:text-white truncate">{habit.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Reminder disabled</p>
                        </div>
                        <button
                          className="btn-secondary shrink-0 px-3 text-xs"
                          type="button"
                          onClick={() => {
                            setEditingHabit(habit);
                            setModalOpen(true);
                          }}
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel p-6 text-center text-emerald-600 dark:text-emerald-400">
                  <p className="font-semibold">All habits have reminders enabled! 🎉</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <div className="panel p-6 text-center">
            <h3 className="text-lg font-bold">No habits yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-zinc-400">
              Create some habits on the Home page to set up reminders.
            </p>
          </div>
        )}

        <div className="mt-6 panel p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <p className="eyebrow text-blue-700 dark:text-blue-300">How it works</p>
          <h3 className="mt-1 font-semibold text-slate-950 dark:text-white">Browser Notifications</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-zinc-300">
            <li>✓ Notifications work when the app is open in your browser</li>
            <li>✓ You can choose which days and times to receive reminders</li>
            <li>✓ Browser must have notification permissions enabled</li>
            <li>✓ Check your browser settings to manage app permissions</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
