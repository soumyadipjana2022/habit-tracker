import { useEffect, useState } from 'react';
import api from '../api/client.js';
import AppShell from '../components/AppShell.jsx';
import ProgressChart from '../components/ProgressChart.jsx';
import { normalizeHabits } from '../utils/habits.js';

export default function Progress() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <AppShell onCreate={() => {}}>
      <div id="progress" className="mx-auto max-w-7xl min-w-0">
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm shadow-slate-950/[0.03] backdrop-blur sm:mb-7 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/45">
          <div className="min-w-0">
            <p className="eyebrow">Track your journey</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 min-[380px]:text-3xl sm:text-4xl dark:text-white">Weekly Progress</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-[15px]">
              Visualize your habit completion patterns and see your weekly achievements at a glance.
            </p>
          </div>
        </section>

        {error ? (
          <div className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</div>
        ) : null}

        {loading ? (
          <div className="panel p-6 text-sm text-slate-500 dark:text-zinc-400">Loading progress data...</div>
        ) : habits.length ? (
          <section className="grid gap-5 xl:gap-6">
            <ProgressChart habits={habits} />
            
            <div className="grid gap-5 xl:grid-cols-2">
              <div className="panel p-4 sm:p-6">
                <p className="eyebrow">Habit Overview</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight mb-4">Statistics</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
                    <span className="text-sm font-medium">Total Habits</span>
                    <span className="text-lg font-bold">{habits.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
                    <span className="text-sm font-medium">Daily Habits</span>
                    <span className="text-lg font-bold">{habits.filter(h => h.frequency === 'daily').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
                    <span className="text-sm font-medium">Scheduled Habits</span>
                    <span className="text-lg font-bold">{habits.filter(h => h.frequency === 'weekdays').length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
                    <span className="text-sm font-medium">Goal-based Habits</span>
                    <span className="text-lg font-bold">{habits.filter(h => ['weekly', 'monthly'].includes(h.frequency)).length}</span>
                  </div>
                </div>
              </div>

              <div className="panel p-4 sm:p-6">
                <p className="eyebrow">Top Performers</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight mb-4">Highest Streaks</h2>
                <div className="space-y-3">
                  {habits
                    .sort((a, b) => b.stats.streak - a.stats.streak)
                    .slice(0, 5)
                    .map((habit) => (
                      <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-zinc-800">
                        <span className="text-sm font-medium truncate">{habit.name}</span>
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{habit.stats.streak}🔥</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="panel p-6 text-center">
            <h3 className="text-lg font-bold">No habits yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-zinc-400">
              Create some habits on the Home page to see your progress here.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
