import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatDay, formatShortDate, getCurrentWeekDays } from '../utils/dates.js';
import { getCompletionSet } from '../utils/habits.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function ProgressChart({ habits }) {
  const weekDays = getCurrentWeekDays();
  const labels = weekDays.map((day) => formatDay(day));
  const values = weekDays.map((day) =>
    habits.reduce((sum, habit) => sum + (getCompletionSet(habit).has(day) ? 1 : 0), 0)
  );
  const totalCompletions = values.reduce((sum, value) => sum + value, 0);
  const maxDayValue = Math.max(1, habits.length);

  const data = {
    labels,
    datasets: [
      {
        label: 'Completed habits',
        data: values,
        borderRadius: 8,
        backgroundColor: '#0f172a'
      }
    ]
  };

  return (
    <div className="panel p-4 sm:p-5" id="progress">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">Weekly progress</h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Habits marked done, Monday through Sunday</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-right dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Total</p>
          <p className="text-lg font-semibold tracking-tight">{totalCompletions}</p>
        </div>
      </div>
      <div className="mb-4 grid grid-cols-7 gap-1.5">
        {weekDays.map((day, index) => (
          <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-center dark:border-zinc-800 dark:bg-zinc-950/60" key={day}>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500">{formatDay(day).slice(0, 3)}</p>
            <p className="mt-1 text-base font-semibold tracking-tight">{values[index]}</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">{formatShortDate(day)}</p>
          </div>
        ))}
      </div>
      <div className="h-64 sm:h-72">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 12, weight: 600 } } },
              y: {
                beginAtZero: true,
                suggestedMax: maxDayValue,
                precision: 0,
                grid: { color: 'rgba(148, 163, 184, 0.16)' },
                ticks: { color: '#64748b', font: { size: 12 } }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
