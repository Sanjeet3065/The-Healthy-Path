import { Sparkles, Wind, ShieldCheck, MapPin } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50/30 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900/40 py-4 sm:py-6 md:py-8 transition-colors duration-200">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-36 bg-emerald-100/30 dark:bg-emerald-900/20 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto px-3 sm:px-4 max-w-4xl text-center relative z-10">
        {/* Sleek Mini Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] sm:text-[11px] font-semibold mb-2 sm:mb-3 border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs max-w-full">
          <Sparkles className="h-3 w-3 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="truncate">
            Real-Time Clean Route Intelligence<span className="hidden sm:inline"> • Uttar Pradesh</span>
          </span>
        </div>

        {/* Clean, Impactful Heading */}
        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug sm:leading-tight px-1">
          Find the Cleanest Route Across{' '}
          <span className="text-emerald-700 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-600 decoration-wavy underline-offset-4">
            Uttar Pradesh
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-1">
          Don't just choose the fastest highway. Compare routes by cumulative particulate inhalation,
          real Copernicus CAMS air quality, and atmospheric smog dispersal across all 75 districts.
        </p>

        {/* 3 Compact Micro-Features Pills */}
        <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs font-medium">
            <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>75 Districts & Towns</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Live Copernicus CAMS AQI</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs font-medium">
            <Wind className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>Corridor Wind & Smog Dispersal</span>
          </div>
        </div>
      </div>
    </section>
  );
}
