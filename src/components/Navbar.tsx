import { useState } from 'react';
import { Leaf, Menu, X, Compass, Wind, HeartPulse, ShieldCheck, MapPin } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-2.5 sm:px-4 md:px-6 h-14 flex items-center justify-between gap-1.5">
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-0">
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

        {/* Desktop Navigation Links (md and above) */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => scrollTo('route-planner')}
            className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1.5 px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap text-xs"
          >
            Route Planner
          </button>
          <button
            onClick={() => scrollTo('environmental-hub')}
            className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-1.5 px-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 whitespace-nowrap text-xs"
          >
            Live UP Air
          </button>

          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="hidden lg:inline">75 Districts Active</span>
            <span className="lg:hidden">75 UP</span>
          </div>

          {/* Theme Toggle */}
          <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Controls: Theme Toggle & Hamburger Button (< md) */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-3 shadow-lg space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2 py-1 mb-2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <span>Active across all 75 Uttar Pradesh Districts</span>
          </div>

          <button
            onClick={() => scrollTo('route-planner')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors min-h-[44px]"
          >
            <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Route Planner & Highway Compare</span>
          </button>

          <button
            onClick={() => scrollTo('environmental-hub')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors min-h-[44px]"
          >
            <Wind className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Live UP Air Quality (City Cards)</span>
          </button>

          <button
            onClick={() => scrollTo('route-planner')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-2.5 transition-colors min-h-[44px]"
          >
            <HeartPulse className="h-4 w-4 text-rose-500 shrink-0" />
            <span>Commuter Health & Smog Protection</span>
          </button>
        </div>
      )}
    </header>
  );
}
