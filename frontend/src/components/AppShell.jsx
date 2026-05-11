import { BarChart3, Home, Leaf, LogOut, Plus, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

const nav = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Progress', icon: BarChart3, href: '/progress' },
  { label: 'Reminders', icon: Settings, href: '/reminders' }
];

export default function AppShell({ children, onCreate }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (href) => location.pathname === href;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f8fb] dark:bg-[#09090b]">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200/80 bg-white/90 p-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80 overflow-y-auto xl:w-72 lg:block">
        <div className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-zinc-950">
            <Leaf size={20} />
          </span>
          <span className="truncate">HabitFlow</span>
        </div>

        <nav className="mt-9 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-slate-100 text-slate-950 dark:bg-zinc-800 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
                href={item.href}
                key={item.label}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 space-y-3">
          <button className="btn-primary w-full" type="button" onClick={onCreate}>
            <Plus size={18} />
            New habit
          </button>
          <div className="flex min-w-0 flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/80">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-zinc-400">{user?.email}</p>
            </div>
            <button className="btn-secondary w-full" type="button" onClick={logout} aria-label="Log out" title="Log out">
              <LogOut size={17} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 font-bold tracking-tight">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-zinc-950">
              <Leaf size={18} />
            </span>
            <span className="truncate">HabitFlow</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button className="btn-secondary px-3" type="button" onClick={logout} aria-label="Log out" title="Log out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="w-full min-w-0 px-3 pb-24 pt-4 sm:px-5 md:px-6 md:pb-28 md:pt-6 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-6 lg:pb-8 lg:pt-6 xl:ml-72 xl:w-[calc(100%-18rem)] xl:px-8" style={{ paddingLeft: 'max(var(--tw-space-px) * 3, env(safe-area-inset-left))', paddingRight: 'max(var(--tw-space-px) * 3, env(safe-area-inset-right))' }}>
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 px-2 py-2 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 safe-bottom lg:hidden" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <div className="mt-9 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                href={item.href}
                className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[10px] font-semibold transition min-[380px]:text-[11px] ${
                  isActive(item.href)
                    ? 'bg-slate-100 text-slate-950 dark:bg-zinc-800 dark:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white'
                }`}
                key={item.label}
              >
                <Icon size={18} />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
          <button
            className="flex min-h-12 min-w-0 w-full flex-col items-center justify-center gap-1 rounded-lg bg-slate-950 px-1 text-[10px] font-semibold text-white shadow-sm dark:bg-white dark:text-zinc-950 min-[380px]:text-[11px]"
            type="button"
            onClick={onCreate}
            aria-label="Add new habit"
            title="Add new habit"
          >
            <Plus size={18} />
            <span>Add</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
