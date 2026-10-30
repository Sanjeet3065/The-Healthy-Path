import {
  Clock,
  Navigation,
  Wind,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import type { EvaluatedRoute } from '@/lib/pollution-service';

interface RouteComparisonPanelProps {
  routes: EvaluatedRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (id: string) => void;
}

export default function RouteComparisonPanel({
  routes,
  selectedRouteId,
  onSelectRoute,
}: RouteComparisonPanelProps) {
  if (!routes || routes.length === 0) return null;

  const recommendedRoute = routes.find((r) => r.pollution?.recommendation === 'recommended') || routes[0];
  const alternativeRoutes = routes.filter((r) => r.id !== recommendedRoute.id);

  return (
    <div className="space-y-3">
      {/* Recommended Route Card */}
      <div
        onClick={() => onSelectRoute(recommendedRoute.id)}
        className={`rounded-xl border p-4 sm:p-5 transition-all cursor-pointer ${
          selectedRouteId === recommendedRoute.id
            ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600 shadow-sm'
            : 'border-slate-200 bg-white hover:border-emerald-300 shadow-soft'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Cleanest Path
            </span>
          </div>

          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            Health Score {recommendedRoute.pollution.healthScore}/100
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900">{recommendedRoute.name}</h3>
        <p className="text-xs text-slate-500 mb-3">{recommendedRoute.summary}</p>

        {/* Minimalist Metrics Strip */}
        <div className="grid grid-cols-4 gap-2 py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block">Duration</span>
            <span className="text-xs font-bold text-slate-800">
              {recommendedRoute.durationMins}m
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Distance</span>
            <span className="text-xs font-bold text-slate-800">
              {recommendedRoute.distanceKm}km
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Avg AQI</span>
            <span className="text-xs font-bold text-emerald-700">
              {recommendedRoute.pollution.avgAqi}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">PM2.5</span>
            <span className="text-xs font-bold text-slate-800">
              {recommendedRoute.pollution.avgPm25}
            </span>
          </div>
        </div>

        <p className="mt-2.5 text-xs text-emerald-900 bg-emerald-50/60 px-3 py-2 rounded-md border border-emerald-100/80 leading-relaxed">
          {recommendedRoute.pollution.recommendationReason}
        </p>
      </div>

      {/* Alternative Routes List */}
      {alternativeRoutes.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-1">
            Alternative Routes ({alternativeRoutes.length})
          </span>

          {alternativeRoutes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            const isHigh = route.pollution?.recommendation === 'high_exposure';

            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route.id)}
                className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/20 ring-1 ring-sky-600 shadow-sm'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-soft'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">{route.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      isHigh
                        ? 'bg-red-50 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isHigh ? 'Higher Pollution' : 'Moderate'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {route.durationMins} mins • {route.distanceKm} km
                  </span>
                  <span>
                    Avg AQI <strong className="text-slate-800">{route.pollution.avgAqi}</strong>
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
