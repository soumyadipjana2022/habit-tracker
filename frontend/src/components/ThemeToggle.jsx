import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <button className="btn-secondary px-3" type="button" onClick={toggleTheme} aria-label="Toggle dark mode" title="Toggle dark mode">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

