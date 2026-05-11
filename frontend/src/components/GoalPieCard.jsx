import { ArcElement, Chart as ChartJS, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

export default function GoalPieCard({ completed, target, goalsMet, totalHabits }) {
  const safeTarget = Math.max(0, target);
  const safeCompleted = Math.min(completed, safeTarget);
  const remaining = Math.max(safeTarget - safeCompleted, 0);
  const percent = safeTarget ? Math.round((safeCompleted / safeTarget) * 100) : 0;

  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: safeTarget ? [safeCompleted, remaining] : [1, 0],
        backgroundColor: safeTarget ? ['#0f172a', '#e2e8f0'] : ['#e2e8f0', '#e2e8f0'],
        borderWidth: 0,
        hoverOffset: 2
      }
    ]
  };

  return (
    <div className="panel min-w-0 p-3.5 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-500 sm:text-xs">Weekly goals</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">{percent}%</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400 sm:text-sm">
            {safeCompleted}/{safeTarget || 0} weekly checks
          </p>
        </div>
        <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
          <Doughnut
            data={data}
            options={{
              cutout: '72%',
              responsive: true,
              maintainAspectRatio: false,
              plugins: { tooltip: { enabled: safeTarget > 0 } }
            }}
          />
          <div className="absolute inset-0 grid place-items-center text-xs font-bold text-slate-700 dark:text-zinc-200">{percent}%</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400">
        {goalsMet}/{totalHabits || 0} habits reached their weekly target
      </p>
    </div>
  );
}

