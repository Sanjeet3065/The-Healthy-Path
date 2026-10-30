import { Leaf, MapPin, ShieldCheck, Compass, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onScrollToSection?: (id: string) => void;
}

export default function Navbar({ onScrollToSection }: NavbarProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm ring-4 ring-emerald-50">
            <Leaf className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base md:text-lg text-slate-900 tracking-tight">
                The Healthy Path
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                UP Statewide 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Lowest Pollution Route Engine • All 75 Districts of Uttar Pradesh
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a
            href="#route-planner"
            onClick={(e) => handleNavClick(e, 'route-planner')}
            className="hover:text-emerald-700 transition-colors"
          >
            Route Planner
          </a>
          <a
            href="#statewide-monitor"
            onClick={(e) => handleNavClick(e, 'statewide-monitor')}
            className="hover:text-emerald-700 transition-colors"
          >
            UP Live AQI
          </a>
          <a
            href="#methodology"
            onClick={(e) => handleNavClick(e, 'methodology')}
            className="hover:text-emerald-700 transition-colors"
          >
            Science & Methodology
          </a>
          <a
            href="#aqi-guide"
            onClick={(e) => handleNavClick(e, 'aqi-guide')}
            className="hover:text-emerald-700 transition-colors"
          >
            NAQI Standards
          </a>
        </nav>

        {/* Status indicator badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Coverage:</span>
            <strong className="text-slate-900 font-semibold">Uttar Pradesh</strong>
          </div>
        </div>
      </div>
    </header>
  );
}
