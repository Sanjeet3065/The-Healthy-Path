import { Sparkles, Wind, ShieldCheck, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/30 py-5 sm:py-7 md:py-8">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-36 bg-emerald-100/30 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto px-3 sm:px-4 max-w-4xl text-center relative z-10">
        {/* Sleek Mini Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[10px] sm:text-[11px] font-semibold mb-2.5 sm:mb-3 border border-emerald-200/80 shadow-xs">
          <Sparkles className="h-3 w-3 text-emerald-700" />
          <span>Real-Time Environmental Route Intelligence • Uttar Pradesh</span>
        </div>

        {/* Clean, Impactful Heading */}
        <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug sm:leading-tight">
          Find the Cleanest Route Across{' '}
          <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy underline-offset-4">
            Uttar Pradesh
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Don't just choose the fastest highway. Compare routes by cumulative particulate inhalation,
          real Copernicus CAMS air quality, and atmospheric smog dispersal across all 75 districts.
        </p>

        {/* 3 Compact Micro-Features Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs font-medium">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>75 Districts & Towns</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span>Live Copernicus CAMS AQI</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs font-medium">
            <Wind className="h-3.5 w-3.5 text-sky-600" />
            <span>Corridor Wind & Smog Dispersal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
