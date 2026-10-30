import {
  Clock,
  Navigation,
  Wind,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Info,
} from 'lucide-react';
import type { EvaluatedRoute, CorridorWeather } from '@/lib/pollution-service';

interface RouteComparisonPanelProps {
  routes: EvaluatedRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
  corridorAtmosphere?: CorridorWeather | null;
  originName?: string;
  destinationName?: string;
}

export default function RouteComparisonPanel({
  routes,
  selectedRouteId,
  onSelectRoute,
  corridorAtmosphere,
  originName,
  destinationName,
}: RouteComparisonPanelProps) {
  if (!routes || routes.length === 0) return null;

  const recommendedRoute = routes.find((r) => r.pollution?.recommendation === 'recommended') || routes[0];
  const alternativeRoutes = routes.filter((r) => r.id !== recommendedRoute.id);

  return (
    <div className="space-y-3">
      {/* Feature 2: Corridor Atmospheric Ventilation & Smog Dispersal */}
      {corridorAtmosphere && (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-3.5 shadow-soft transition-colors duration-200">
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100 min-w-0">
              <Wind className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="text-xs font-bold truncate">Atmospheric Smog Dispersal</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                corridorAtmosphere.ventilationStatus === 'Good Dispersal'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                  : corridorAtmosphere.ventilationStatus === 'Stagnant Smog Trap'
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/60'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              {corridorAtmosphere.ventilationStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1.5 px-2 rounded-md bg-slate-50 dark:bg-slate-800/60 text-center text-xs mb-2 border border-slate-100 dark:border-slate-800">
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 block truncate">Wind Speed</span>
              <strong className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm block truncate">{corridorAtmosphere.windSpeed} km/h</strong>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 block truncate">Temp</span>
              <strong className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm block truncate">{corridorAtmosphere.temperature}°C</strong>
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 dark:text-slate-400 block truncate">Humidity</span>
              <strong className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm block truncate">{corridorAtmosphere.humidity}%</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
            {corridorAtmosphere.ventilationNote}
          </p>
        </div>
      )}

      {/* Recommended Route Card (Cleanest Path) */}
      <div
        onClick={() => onSelectRoute(recommendedRoute.id)}
        className={`rounded-xl border p-3 sm:p-4 md:p-5 transition-all cursor-pointer ${
          selectedRouteId === recommendedRoute.id
            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/30 ring-1 ring-emerald-600 dark:ring-emerald-500 shadow-sm'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 truncate">
              Cleanest Path
            </span>
          </div>

          <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
            Score {recommendedRoute.pollution.healthScore}/100
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">{recommendedRoute.name}</h3>
        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-2.5 sm:mb-3">{recommendedRoute.summary}</p>

        {/* Responsive Metrics Strip */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 py-2 sm:py-2.5 px-1 sm:px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 block truncate">Duration</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {recommendedRoute.durationMins}m
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 block truncate">Distance</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {recommendedRoute.distanceKm}km
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 block truncate">Avg AQI</span>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 block truncate">
              {recommendedRoute.pollution.avgAqi}
            </span>
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-400 block truncate">PM2.5</span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {recommendedRoute.pollution.avgPm25}
            </span>
          </div>
        </div>

        {/* Scientific Recommendation Reason */}
        <p className="mt-2.5 text-[11px] sm:text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 px-2.5 sm:px-3 py-2 rounded-md border border-emerald-100/80 dark:border-emerald-900/60 leading-relaxed">
          {recommendedRoute.pollution.recommendationReason}
        </p>

        {/* Travel Mode Exposure Advice */}
        {recommendedRoute.pollution.travelModeAdvice && (
          <div className="mt-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 sm:px-3 py-2 rounded-md border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{recommendedRoute.pollution.travelModeAdvice}</span>
          </div>
        )}

        {/* Action: Open in Google Maps */}
        {originName && destinationName && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">Live Navigation</span>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originName)}&destination=${encodeURIComponent(destinationName)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-lg sm:rounded-md bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors min-h-[40px] sm:min-h-[32px] w-full sm:w-auto"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Open in Google Maps</span>
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          </div>
        )}
      </div>

      {/* Alternative Routes List */}
      {alternativeRoutes.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block px-1">
            Alternative Routes ({alternativeRoutes.length})
          </span>

          {alternativeRoutes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isHigh = route.pollution?.recommendation === 'high_exposure';

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`rounded-xl border p-3 sm:p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-600 dark:border-sky-500 bg-sky-50/20 dark:bg-sky-950/30 ring-1 ring-sky-600 dark:ring-sky-500 shadow-sm'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 shadow-soft'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{route.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                      isHigh
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isHigh ? 'Higher Pollution' : 'Moderate'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                  <span className="truncate">
                    {route.durationMins} mins • {route.distanceKm} km
                  </span>
                  <span className="shrink-0">
                    Avg AQI <strong className="text-slate-800 dark:text-slate-200">{route.pollution.avgAqi}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
