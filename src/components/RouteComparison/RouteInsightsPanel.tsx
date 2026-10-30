import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Wind,
  Car,
  Bike,
  Activity,
  HeartPulse,
  PhoneCall,
  MapPin,
  TrendingDown,
  Sparkles,
  ChevronRight,
  Clock,
  AlertCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import type { EvaluatedRoute, CorridorWeather, TravelMode } from '@/lib/pollution-service';

interface RouteInsightsPanelProps {
  selectedRoute: EvaluatedRoute | null;
  routes: EvaluatedRoute[];
  travelMode: TravelMode;
  corridorAtmosphere: CorridorWeather | null;
  originName?: string;
  destinationName?: string;
}

export default function RouteInsightsPanel({
  selectedRoute,
  routes,
  travelMode,
  corridorAtmosphere,
  originName,
  destinationName,
}: RouteInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState<'advisory' | 'waypoints' | 'helpline'>('advisory');

  if (!selectedRoute) {
    return (
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-soft text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs sm:text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Uttar Pradesh Clean Corridor Intelligence</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select any origin and destination to view real-time waypoint smog progression, commuter health precautions, and air quality advisories across Uttar Pradesh.
        </p>
      </div>
    );
  }

  // Calculate comparative particulate savings if multiple routes exist
  const alternativeRoutes = routes.filter((r) => r.id !== selectedRoute.id);
  const highestPollutionRoute = alternativeRoutes.length > 0
    ? [...routes].sort((a, b) => b.pollution.avgPm25 - a.pollution.avgPm25)[0]
    : null;

  const isCurrentCleanest = selectedRoute.pollution.recommendation === 'recommended';
  const pmDiff = highestPollutionRoute && highestPollutionRoute.id !== selectedRoute.id
    ? Math.max(0, Math.round((highestPollutionRoute.pollution.avgPm25 - selectedRoute.pollution.avgPm25) * 10) / 10)
    : 0;
  const pmPercentSaved = highestPollutionRoute && highestPollutionRoute.id !== selectedRoute.id && highestPollutionRoute.pollution.avgPm25 > 0
    ? Math.round(((highestPollutionRoute.pollution.avgPm25 - selectedRoute.pollution.avgPm25) / highestPollutionRoute.pollution.avgPm25) * 100)
    : 0;

  // Waypoints from sampled readings along the route
  const waypoints = selectedRoute.pollution.sampledReadings || [];

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft overflow-hidden transition-colors duration-200 w-full min-w-0 max-w-full">
      {/* Header with Navigation Tabs */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-900/50 w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 shrink-0">
              <HeartPulse className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Route Environmental & Health Insights
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {originName || 'Origin'} ➔ {destinationName || 'Destination'}
              </p>
            </div>
          </div>

          {/* Clean air health score indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-[10px] sm:text-[11px] font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span>Health Score {selectedRoute.pollution.healthScore}/100</span>
          </div>
        </div>

        {/* 3 Tab Switchers */}
        <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[10px] min-[360px]:text-[11px] sm:text-xs font-semibold w-full min-w-0">
          <button
            type="button"
            onClick={() => setActiveTab('advisory')}
            className={`py-2 px-1 sm:px-2 min-h-[38px] sm:min-h-[34px] rounded-md transition-all flex items-center justify-center text-center truncate min-w-0 ${
              activeTab === 'advisory'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="truncate"><span className="hidden min-[380px]:inline">Commuter </span>Advisory</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('waypoints')}
            className={`py-2 px-1 sm:px-2 min-h-[38px] sm:min-h-[34px] rounded-md transition-all flex items-center justify-center text-center truncate min-w-0 ${
              activeTab === 'waypoints'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="truncate">Waypoints ({waypoints.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('helpline')}
            className={`py-2 px-1 sm:px-2 min-h-[38px] sm:min-h-[34px] rounded-md transition-all flex items-center justify-center text-center truncate min-w-0 ${
              activeTab === 'helpline'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 font-bold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span className="truncate"><span className="hidden min-[380px]:inline">Emergency & </span>Helplines</span>
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3.5 w-full min-w-0">
        {/* TAB 1: COMMUTER HEALTH & SAFETY ADVISORY */}
        {activeTab === 'advisory' && (
          <div className="space-y-3">
            {/* Particulate Exposure Comparison Banner */}
            {isCurrentCleanest && pmPercentSaved > 0 && (
              <div className="p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="p-1 rounded-md bg-emerald-600 text-white shrink-0">
                    <TrendingDown className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block truncate">
                      {pmPercentSaved}% Cleaner Inhalation
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block truncate">
                      Saves approx. {pmDiff} µg/m³ PM2.5 exposure vs. alternative highway
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold shrink-0">
                  Optimal Corridor
                </span>
              </div>
            )}

            {/* Travel Mode Protection Cards */}
            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                {travelMode === 'car' ? (
                  <Car className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : travelMode === 'bike' ? (
                  <Bike className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                ) : (
                  <Activity className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                )}
                <span className="capitalize">{travelMode} Commuter Health Protocol</span>
              </div>

              {travelMode === 'car' && (
                <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Cabin Recirculation ON (↺):</strong> Turn on air recirculation to prevent 70–80% of outdoor highway exhaust and PM2.5 particles from entering the cabin.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Keep Windows Sealed:</strong> Roll up windows through industrial entry points and behind freight diesel vehicles.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Cabin Air Filter:</strong> Ensure your PM2.5 or activated carbon filter has been serviced within the last 10,000 km.
                    </span>
                  </div>
                </div>
              )}

              {travelMode === 'bike' && (
                <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>N95 / FFP2 Mask Recommended:</strong> Direct inhalation of ambient particulate matter is high. Standard cloth masks do not block fine toxic particles.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Full Visor Protection:</strong> Keep helmet visor down to prevent road particulate stinging and dry cornea irritation.
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Trailing Distance:</strong> Maintain at least 15–20 meters distance behind diesel commercial trucks and tractors.
                    </span>
                  </div>
                </div>
              )}

              {travelMode === 'bicycle' && (
                <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Elevated Minute Ventilation:</strong> Strenuous pedaling increases lung air intake 3–4x. Avoid peak vehicular traffic hours (8–10 AM & 6–8 PM).
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Green Buffer Detour:</strong> Where feasible, prefer tree-lined canal roads or secondary rural corridors to avoid heavy highway dust.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Optimal Travel Time & UP Climate Guidance */}
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Cleanest Travel Window</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  <strong>12:00 PM – 3:30 PM:</strong> Peak solar heating raises atmospheric mixing height, providing the lowest ground-level particulate stagnation in UP.
                </p>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                  <Wind className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Vulnerable Travelers</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Elderly commuters, infants, and asthmatic individuals should limit prolonged outdoor halts along industrial highway segments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CORRIDOR WAYPOINT PROGRESSION */}
        {activeTab === 'waypoints' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
              <span>Sampled Points along Corridor</span>
              <span>Avg AQI: <strong className="text-slate-800 dark:text-slate-200">{selectedRoute.pollution.avgAqi}</strong></span>
            </div>

            {waypoints.length > 0 ? (
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {waypoints.map((wp, index) => {
                  const isFirst = index === 0;
                  const isLast = index === waypoints.length - 1;
                  const category = wp.reading.category;
                  const isClean = category === 'Good' || category === 'Satisfactory';

                  return (
                    <div
                      key={index}
                      className="p-2 sm:p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {isFirst ? 'A' : isLast ? 'B' : index}
                        </span>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                            {isFirst
                              ? originName || 'Start Point'
                              : isLast
                              ? destinationName || 'Destination'
                              : `Waypoint ${index} (${wp.distanceAlongKm} km)`}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            Lat: {wp.lat.toFixed(3)}, Lng: {wp.lng.toFixed(3)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden min-[380px]:inline">
                          PM2.5: <strong>{wp.reading.pm25}</strong>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isClean
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          }`}
                        >
                          {wp.reading.aqi} AQI
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                Detailed waypoint sensor points are generated during route evaluation.
              </p>
            )}

            <div className="p-2 rounded-md bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>You can also click on any colored waypoint dot on the map above to inspect local PM2.5 readings.</span>
            </div>
          </div>
        )}

        {/* TAB 3: UP EMERGENCY & CLEAN AIR HELPLINES */}
        {activeTab === 'helpline' && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Direct official assistance numbers for Uttar Pradesh highways, emergency healthcare, and environmental grievances:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:108"
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold mb-0.5">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Ambulance 108</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Free UP Medical Emergency
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">Call 108 ➔</span>
              </a>

              <a
                href="tel:112"
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-bold mb-0.5">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Police & Highway 112</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    UP Emergency Patrol
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">Call 112 ➔</span>
              </a>

              <a
                href="tel:1033"
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-0.5">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Highway Helpline 1033</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    NHAI / Expressway Roadside
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">Call 1033 ➔</span>
              </a>

              <a
                href="tel:18001805304"
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold mb-0.5">
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>UPPCB Citizen Cell</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Toll-Free Air Quality Grievance
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">1800-180-5304 ➔</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
