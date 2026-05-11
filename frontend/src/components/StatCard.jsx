export default function StatCard({ label, value, helper }) {
  return (
    <div className="panel min-w-0 p-3.5 sm:p-5">
      <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-zinc-500 sm:text-xs">{label}</p>
      <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400 sm:text-sm">{helper}</p>
    </div>
  );
}
