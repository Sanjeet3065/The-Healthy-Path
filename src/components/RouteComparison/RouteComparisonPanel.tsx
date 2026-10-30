import {
  Clock,
  Navigation,
  Wind,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  ChevronRight,
} from 'lucide-react';
import type { EvaluatedRoute } from '@/lib/pollution-service';
import { getCategoryBadgeClass } from '@/lib/pollution-service';

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

  const getScoreBadge = (score: number) => {
    if (score >= 75) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        label: 'Optimal Health Choice',
      };
    }
    if (score >= 50) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        label: 'Moderate Environmental Risk',
      };
    }
    return {
      bg: 'bg-red-50 text-red-800 border-red-200',
      label: 'High Pollution Corridor',
    };
  };

  return (
    <div className="space-y-4">
      {/* Recommended Route Hero Card */}
      <div
        onClick={() => onSelectRoute(recommendedRoute.id)}
        className={`rounded-xl border p-5 md:p-6 transition-all cursor-pointer shadow-card ${
          selectedRouteId === recommendedRoute.id
            ? 'border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/15'
            : 'border-emerald-200 bg-white hover:border-emerald-400'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Recommended Clean Path</span>
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">• Lowest Cumulative Exposure</span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                getScoreBadge(recommendedRoute.pollution.healthScore).bg
              }`}
            >
              Score: {recommendedRoute.pollution.healthScore}/100
            </span>
          </div>
        </div>

        {/* Route Title & Summary */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900">{recommendedRoute.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{recommendedRoute.summary}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Avg AQI</span>
            <span className="text-base font-extrabold text-slate-900">
              {recommendedRoute.pollution.avgAqi}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Along route</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Avg PM2.5</span>
            <span className="text-base font-extrabold text-slate-900">
              {recommendedRoute.pollution.avgPm25}{' '}
              <span className="text-[10px] font-normal text-slate-500">μg/m³</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Fine particles</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Duration</span>
            <span className="text-base font-extrabold text-slate-900">
              {recommendedRoute.durationMins}{' '}
              <span className="text-[10px] font-normal text-slate-500">mins</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Est. travel time</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Distance</span>
            <span className="text-base font-extrabold text-slate-900">
              {recommendedRoute.distanceKm}{' '}
              <span className="text-[10px] font-normal text-slate-500">km</span>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Total road length</span>
          </div>
        </div>

        {/* Why this route was recommended */}
        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-emerald-700 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-emerald-900 block mb-0.5">
              Why this route is recommended:
            </span>
            <span>{recommendedRoute.pollution.recommendationReason}</span>
          </div>
        </div>
      </div>

      {/* Alternative Routes Comparison */}
      {alternativeRoutes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pt-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Navigation className="h-4 w-4 text-slate-500" />
              <span>Alternative Routes for Comparison</span>
            </h4>
            <span className="text-xs text-slate-500">Click to view on map</span>
          </div>

          <div className="space-y-2.5">
            {alternativeRoutes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const isHighExposure = route.pollution?.recommendation === 'high_exposure';

              return (
                <div
                  key={route.id}
                  onClick={() => onSelectRoute(route.id)}
                  className={`rounded-xl border p-4 bg-white transition-all cursor-pointer shadow-soft hover:shadow-card ${
                    isSelected
                      ? 'border-sky-600 ring-2 ring-sky-600/15 bg-sky-50/15'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{route.name}</h4>
                        {isHighExposure ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Higher Pollution
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Moderate
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{route.summary}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700">
                        Health Score: {route.pollution.healthScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 py-2 border-y border-slate-100 text-center my-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Duration</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {route.durationMins} mins
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Distance</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {route.distanceKm} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Avg AQI</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {route.pollution.avgAqi}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">PM2.5</span>
                      <span className="text-xs font-semibold text-slate-800">
                        {route.pollution.avgPm25} μg/m³
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">{route.pollution.recommendationReason}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
