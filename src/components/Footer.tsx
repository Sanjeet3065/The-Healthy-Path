import { Leaf, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onSelectCorridor?: (fromName: string, toName: string) => void;
}

export default function Footer({ onSelectCorridor }: FooterProps) {
  const quickCorridors = [
    { from: 'Lucknow', to: 'Kanpur' },
    { from: 'Noida', to: 'Agra' },
    { from: 'Varanasi', to: 'Prayagraj' },
    { from: 'Bareilly', to: 'Moradabad' },
    { from: 'Gorakhpur', to: 'Ayodhya' },
    { from: 'Meerut', to: 'Ghaziabad' },
  ];

  const handleCorridorClick = (from: string, to: string) => {
    if (onSelectCorridor) {
      onSelectCorridor(from, to);
    }
    const planner = document.getElementById('route-planner');
    if (planner) {
      planner.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600 mt-8 sm:mt-12">
      <div className="container mx-auto px-3.5 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-sm sm:text-base text-slate-900 tracking-tight">
                The Healthy Path
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Uttar Pradesh
              </span>
            </div>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Empowering commuters across Uttar Pradesh to make healthier travel choices by identifying routes with lower particulate exposure, real-time AQI, and atmospheric wind dispersal.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Public Health & Clean Mobility Initiative</span>
            </div>
          </div>

          {/* Quick UP Corridors (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 block">
              Popular Travel Corridors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickCorridors.map((c) => (
                <button
                  key={`${c.from}-${c.to}`}
                  type="button"
                  onClick={() => handleCorridorClick(c.from, c.to)}
                  className="text-left text-xs px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/70 text-slate-700 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{c.from} → {c.to}</span>
                  <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Data Sources & Transparency (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 block">
              Atmospheric & Spatial Data
            </span>
            <ul className="text-xs space-y-1.5 text-slate-500">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Copernicus CAMS European Reanalysis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Open-Meteo Air Quality & Wind</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>OpenStreetMap & Esri World Street</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Project OSRM Routing Engine</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} The Healthy Path. Free & open environmental mobility tool for Uttar Pradesh.</p>
          <div className="flex items-center gap-1">
            <span>Built for clean travel across 75 UP districts</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
