import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await (isSignup ? signup(form) : login({ email: form.email, password: form.password }));
      navigate('/');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-5 dark:bg-[#09090b] sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-zinc-950">
            <Leaf size={20} />
          </span>
          HabitFlow
        </Link>
        <ThemeToggle />
      </div>

      <section className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="max-w-2xl">
          <p className="eyebrow">Daily progress, calmly tracked</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Build routines that survive real life.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-zinc-300 sm:text-[17px]">
            Track habits, see weekly momentum, protect streaks, and keep reminders close without turning your day into a spreadsheet.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
            {['Private by user', 'Weekly goals', 'Dark mode'].map((item) => (
              <div className="rounded-xl border border-slate-200 bg-white/75 p-3 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-950/[0.03] dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="panel w-full p-5 sm:p-7">
          <div className="mb-6">
            <p className="eyebrow">{isSignup ? 'Start tracking' : 'Secure access'}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{isSignup ? 'Create account' : 'Welcome back'}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {isSignup ? 'Start with a few simple habits.' : 'Pick up right where you left off.'}
            </p>
          </div>

          {error ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-200">{error}</div> : null}

          <form className="space-y-4" onSubmit={submit}>
            {isSignup ? (
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Name</span>
                <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                className="field"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>

            <button className="btn-primary w-full" disabled={submitting} type="submit">
              {isSignup ? <UserPlus size={18} /> : <LogIn size={18} />}
              {submitting ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-zinc-400">
            {isSignup ? 'Already have an account?' : 'New here?'}{' '}
            <Link className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 dark:text-white dark:decoration-zinc-600" to={isSignup ? '/login' : '/signup'}>
              {isSignup ? 'Log in' : 'Create one'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
