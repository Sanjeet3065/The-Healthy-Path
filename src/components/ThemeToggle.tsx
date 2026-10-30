import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="relative p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs transition-all duration-200 flex items-center justify-center group"
    >
      <div className="relative w-4 h-4">
        {/* Sun Icon (Visible in Dark Mode) */}
        <Sun
          className={`h-4 w-4 text-amber-500 absolute inset-0 transition-transform duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon Icon (Visible in Light Mode) */}
        <Moon
          className={`h-4 w-4 text-slate-700 absolute inset-0 transition-transform duration-300 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}
