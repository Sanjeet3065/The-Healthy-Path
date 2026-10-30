export default function HeroSection() {
  return (
    <div className="border-b border-slate-200/60 bg-white py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find the Cleanest Route Across <span className="text-emerald-700">Uttar Pradesh</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Compare road routes by estimated particulate inhalation and real atmospheric air quality across all 75 districts.
        </p>
      </div>
    </div>
  );
}
