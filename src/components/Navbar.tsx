import { Leaf } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-2.5 sm:px-4 md:px-6 h-14 flex items-center justify-between gap-1.5">
        {/* Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-700 dark:bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Leaf className="h-4 w-4" />
          </div>
          <div className="flex items-baseline min-w-0">
            <span className="font-display font-bold text-xs min-[360px]:text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight truncate">
              The Healthy Path
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 ml-1.5 hidden md:inline shrink-0">
              Uttar Pradesh
            </span>
          </div>
        </div>

        {/* Navigation Links & Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
          <button
            onClick={() => scrollTo('route-planner')}
            className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1.5 px-1.5 sm:px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap text-[11px] sm:text-xs"
          >
            <span className="hidden sm:inline">Route </span>Planner
          </button>
          <button
            onClick={() => scrollTo('environmental-hub')}
            className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1.5 px-1.5 sm:px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap text-[11px] sm:text-xs"
          >
            <span className="hidden sm:inline">Air </span>Insights
          </button>
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>75 Districts Active</span>
          </div>

          {/* Natural Theme Toggle Switch */}
          <div className="pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
