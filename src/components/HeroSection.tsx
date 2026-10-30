import { ShieldCheck, Compass, Wind, Sparkles, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative border-b border-slate-200/80 bg-gradient-to-b from-emerald-50/50 via-white to-slate-50/40 py-10 md:py-14">
      <div className="container mx-auto px-4 text-center">
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>Uttar Pradesh Environmental & Travel Intelligence</span>
        </div>

        {/* Primary Heading */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Navigate Through Cleaner Air Across{' '}
          <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2 underline-offset-4">
            Uttar Pradesh
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Standard GPS apps prioritize only speed—often sending you through hazardous smog and congested industrial corridors. The Healthy Path evaluates real atmospheric air quality along alternative routes to recommend the path with the lowest estimated pollution exposure.
        </p>

        {/* Feature Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-soft">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>All 75 Districts & Towns</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-soft">
            <Wind className="h-3.5 w-3.5 text-emerald-600" />
            <span>Copernicus CAMS Sampling</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-soft">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Cumulative Inhalation Scoring</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-soft">
            <Compass className="h-3.5 w-3.5 text-emerald-600" />
            <span>OSRM Alternative Corridors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
