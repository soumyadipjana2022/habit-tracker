import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../api/client.js';
import AppShell from '../components/AppShell.jsx';
import GoalPieCard from '../components/GoalPieCard.jsx';
import HabitFormModal from '../components/HabitFormModal.jsx';
import HabitList from '../components/HabitList.jsx';
import StatCard from '../components/StatCard.jsx';
import { todayKey } from '../utils/dates.js';
import { isHabitCompletedOn, normalizeHabit, normalizeHabits, setHabitCompletionForDay } from '../utils/habits.js';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

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

  const stats = useMemo(() => {
    const today = todayKey();
    const total = habits.length;
    const completedToday = habits.filter((habit) => isHabitCompletedOn(habit, today)).length;
    const weeklyGoalsMet = habits.filter((habit) => habit.stats.weeklyGoalMet).length;
    const weeklyTargetTotal = habits.reduce((sum, habit) => sum + habit.stats.weeklyTarget, 0);
    const weeklyCompletedTotal = habits.reduce((sum, habit) => sum + Math.min(habit.stats.weekCompleted, habit.stats.weeklyTarget), 0);
    const dailyProgress = total ? Math.round((completedToday / total) * 100) : 0;

    return { total, completedToday, weeklyGoalsMet, weeklyTargetTotal, weeklyCompletedTotal, dailyProgress };
  }, [habits]);

  const saveHabit = async (payload) => {
    try {
      setError('');
      const { data } = editingHabit ? await api.put(`/habits/${editingHabit.id}`, payload) : await api.post('/habits', payload);
      const habit = normalizeHabit(data.habit);
      setHabits((current) => (editingHabit ? current.map((item) => (item.id === editingHabit.id ? habit : item)) : [habit, ...current]));
      setModalOpen(false);
      setEditingHabit(null);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not save habit.');
    }
  };

  const completeHabit = async (habit, date = todayKey()) => {
    const previousHabits = habits;
    setHabits((current) => current.map((item) => (item.id === habit.id ? setHabitCompletionForDay(item, date, true) : item)));

    try {
      setError('');
      const { data } = await api.post(`/habits/${habit.id}/complete`, { date });
      const updatedHabit = setHabitCompletionForDay(data.habit, date, true);
      setHabits((current) => current.map((item) => (item.id === habit.id ? updatedHabit : item)));
    } catch (apiError) {
      if (apiError.response?.status === 409) {
        setHabits((current) => current.map((item) => (item.id === habit.id ? setHabitCompletionForDay(item, date, true) : item)));
        return;
      }
      setError(apiError.response?.data?.message || 'Could not update habit completion.');
      setHabits(previousHabits);
    }
  };

  const uncompleteHabit = async (habit, date = todayKey()) => {
    const previousHabits = habits;
    setHabits((current) => current.map((item) => (item.id === habit.id ? setHabitCompletionForDay(item, date, false) : item)));

    try {
      setError('');
      const { data } = await api.delete(`/habits/${habit.id}/complete`, { data: { date } });
      const updatedHabit = setHabitCompletionForDay(data.habit, date, false);
      setHabits((current) => current.map((item) => (item.id === habit.id ? updatedHabit : item)));
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not update habit completion.');
      setHabits(previousHabits);
    }
  };

  const toggleHabitDay = (habit, day) => {
    if (day.completed) {
      return uncompleteHabit(habit, day.day);
    }
    return completeHabit(habit, day.day);
  };

  const deleteHabit = async (habit) => {
    const confirmed = window.confirm(`Delete "${habit.name}"?`);
    if (!confirmed) return;
    try {
      setError('');
      await api.delete(`/habits/${habit.id}`);
      setHabits((current) => current.filter((item) => item.id !== habit.id));
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not delete habit.');
    }
  };

  const openCreate = () => {
    setEditingHabit(null);
    setModalOpen(true);
  };

  return (
    <AppShell onCreate={openCreate}>
      <div id="home" className="mx-auto max-w-7xl min-w-0">
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm shadow-slate-950/[0.03] backdrop-blur sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/45">
          <div className="min-w-0">
            <p className="eyebrow">Your dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 min-[380px]:text-3xl sm:text-4xl dark:text-white">Today&apos;s habits</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400 sm:text-[15px]">
              Check off what matters. View weekly progress and reminders in their dedicated sections.
            </p>
          </div>
          <button className="btn-primary hidden sm:inline-flex" type="button" onClick={openCreate}>
            <Plus size={18} />
            Add habit
          </button>
        </section>

        {error ? (
          <div className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</div>
        ) : null}

        <section className="mb-5 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-3 xl:grid-cols-4">
          <StatCard label="Active habits" value={stats.total} helper="Across all routines" />
          <StatCard label="Done today" value={`${stats.completedToday}/${stats.total || 0}`} helper="Habits checked today" />
          <GoalPieCard
            completed={stats.weeklyCompletedTotal}
            target={stats.weeklyTargetTotal}
            goalsMet={stats.weeklyGoalsMet}
            totalHabits={stats.total}
          />
          <StatCard label="Daily progress" value={`${stats.dailyProgress}%`} helper="All habits checked today" />
        </section>

        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
            <div>
              <p className="eyebrow">Workspace</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">Habits</h2>
            </div>
          </div>

          {loading ? (
            <div className="panel p-6 text-sm text-slate-500 dark:text-zinc-400">Loading habits...</div>
          ) : habits.length ? (
            <HabitList
              habits={habits}
              onComplete={completeHabit}
              onUncomplete={uncompleteHabit}
              onToggleDay={toggleHabitDay}
              onEdit={(selected) => {
                setEditingHabit(selected);
                setModalOpen(true);
              }}
              onDelete={deleteHabit}
            />
          ) : (
            <div className="panel p-6 text-center">
              <h3 className="text-lg font-bold">No habits yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-zinc-400">
                Start with one habit that is small enough to finish on a busy day.
              </p>
              <button className="btn-primary mt-5" type="button" onClick={openCreate}>
                <Plus size={18} />
                Create your first habit
              </button>
            </div>
          )}
        </section>

        <section className="mt-6 panel p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
          <p className="eyebrow text-emerald-700 dark:text-emerald-300">Quick tip</p>
          <h3 className="mt-1 font-semibold text-slate-950 dark:text-white">You're on track!</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
            {stats.completedToday === stats.total && stats.total > 0
              ? '✅ Everything is complete today. Great work!'
              : `${Math.max(stats.total - stats.completedToday, 0)} habit${stats.total - stats.completedToday === 1 ? '' : 's'} left today. You can do it!`}
          </p>
        </section>
      </div>

      <HabitFormModal
        habit={editingHabit}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={saveHabit}
      />
    </AppShell>
  );
}
