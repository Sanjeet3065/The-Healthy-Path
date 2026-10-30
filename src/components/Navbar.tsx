import { Leaf } from 'lucide-react';

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-sm">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <span className="font-display font-bold text-base text-slate-900 tracking-tight">
              The Healthy Path
            </span>
            <span className="text-[11px] text-slate-400 ml-2 hidden sm:inline">Uttar Pradesh</span>
          </div>
        </div>

        {/* Minimal Navigation Links */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <button
            onClick={() => scrollTo('route-planner')}
            className="hover:text-emerald-700 transition-colors"
          >
            Route Planner
          </button>
          <button
            onClick={() => scrollTo('environmental-hub')}
            className="hover:text-emerald-700 transition-colors"
          >
            Environmental Insights
          </button>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 text-emerald-700 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>75 Districts Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
