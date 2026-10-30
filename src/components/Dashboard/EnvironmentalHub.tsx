import { useState, useEffect } from 'react';
import {
  Wind,
  Calculator,
  Shield,
  RefreshCw,
  Building2,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchStatewideAqiSnapshots,
  type CityAqiSnapshot,
  getCategoryBadgeClass,
} from '@/lib/pollution-service';
import type { LocationItem } from '@/lib/geocoding';

interface EnvironmentalHubProps {
  onSelectCity?: (city: LocationItem) => void;
}

export default function EnvironmentalHub({ onSelectCity }: EnvironmentalHubProps) {
  const [activeTab, setActiveTab] = useState<'live_aqi' | 'methodology' | 'standards'>('live_aqi');
  const [snapshots, setSnapshots] = useState<CityAqiSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStatewideAqiSnapshots();
      // Show top 8 primary cities for clean minimalism
      setSnapshots(data.slice(0, 8));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCityClick = (city: CityAqiSnapshot) => {
    if (!onSelectCity) return;
    onSelectCity({
      id: `city-${city.cityName.toLowerCase()}`,
      name: city.cityName,
      displayName: `${city.cityName}, Uttar Pradesh`,
      lat: city.lat,
      lng: city.lng,
      district: city.cityName,
      state: 'Uttar Pradesh',
      country: 'India',
      type: 'city',
      isWithinUP: true,
    });
  };

  const naqiLevels = [
    { label: 'Good', range: '0–50', color: 'bg-emerald-500', desc: 'Minimal respiratory impact' },
    { label: 'Satisfactory', range: '51–100', color: 'bg-teal-500', desc: 'Minor discomfort to sensitive individuals' },
    { label: 'Moderate', range: '101–200', color: 'bg-amber-500', desc: 'Discomfort on prolonged exposure' },
    { label: 'Poor', range: '201–300', color: 'bg-orange-500', desc: 'Breathing discomfort to most people' },
    { label: 'Very Poor', range: '301–400', color: 'bg-red-500', desc: 'High respiratory illness risk' },
    { label: 'Severe', range: '401+', color: 'bg-purple-600', desc: 'Serious health impact on all groups' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden transition-colors duration-200 w-full min-w-0 max-w-full">
      {/* Sleek Minimalist Tab Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 p-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 text-xs font-semibold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('live_aqi')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-xs ${
              activeTab === 'live_aqi'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Wind className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">Live <span className="hidden min-[400px]:inline">UP </span>Air</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-xs ${
              activeTab === 'methodology'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">How <span className="hidden min-[400px]:inline">It's </span>Calculated</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`px-2 sm:px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-xs ${
              activeTab === 'standards'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">NAQI <span className="hidden min-[400px]:inline">Standards</span></span>
          </button>
        </div>

        {activeTab === 'live_aqi' && (
          <div className="flex items-center justify-between sm:justify-end gap-2 text-[11px] pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden xs:inline sm:hidden">
              Copernicus CAMS Live
            </span>
            <button
              onClick={loadData}
              disabled={isLoading}
              title="Refresh Live Data"
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors ml-auto sm:ml-0 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
              <span>Refresh Readings</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab 1: Live UP Air Quality Grid (Intelligently Responsive: 1 col on mobile, 2 cols on tablet, 3-4 on desktop) */}
      {activeTab === 'live_aqi' && (
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-3.5">
            {snapshots.map((city) => (
              <div
                key={city.cityName}
                onClick={() => handleCityClick(city)}
                className="group p-3 sm:p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50/80 dark:hover:bg-slate-800/90 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-soft transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Row: City Icon + Name (never clipped or cut off) & Category Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/90 transition-colors">
                      <Building2 className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
                        {city.cityName}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block leading-tight">
                        Uttar Pradesh
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 whitespace-nowrap self-start ${getCategoryBadgeClass(
                      city.category
                    )}`}
                  >
                    {city.category}
                  </span>
                </div>

                {/* Bottom Row: AQI Big Number & PM2.5 Metric */}
                <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 mt-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-50 font-display">
                      {city.aqi}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      AQI
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="text-slate-400 dark:text-slate-500">PM2.5:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">{city.pm25}</strong>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden min-[360px]:inline">µg/m³</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-right mt-3 sm:mt-4">
            Copernicus CAMS & Open-Meteo Atmospheric Reanalysis • Tap any city to route
          </p>
        </div>
      )}

      {/* Tab 2: Scientific Methodology (3 concise pillars) */}
      {activeTab === 'methodology' && (
        <div className="p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                1. Road Network Routing
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Queries OSRM driving engine for real alternative highway and expressway corridors, distances, and travel durations.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                2. Point-by-Point Sampling
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Samples representative coordinates along each route to query real atmospheric PM2.5, PM10, and NO2 via Copernicus CAMS.
              </p>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                3. Cumulative Inhalation Dose
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Evaluates total lung exposure: Exposure = Avg AQI × Duration. Recommends the route with the lowest cumulative particulate dose.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
            <Info className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Scientific Transparency:</strong> For continuous highways and rural links without fixed CAAQMS physical towers, atmospheric reanalysis models blend satellite data with ground observations.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: NAQI Standards & Health */}
      {activeTab === 'standards' && (
        <div className="p-3.5 sm:p-5 md:p-6 space-y-3.5 sm:space-y-4">
          {/* Visual Spectrum Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {naqiLevels.map((lvl) => (
              <div key={lvl.label} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <span className={`w-2.5 h-2.5 rounded-full ${lvl.color} inline-block mb-1`} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{lvl.label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">{lvl.range} AQI</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 block mt-1 leading-tight">{lvl.desc}</span>
              </div>
            ))}
          </div>

          {/* Practical Commuter Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Two-Wheeler Riders:</strong>
              Use N95 respirators when commuting along high-traffic industrial corridors.
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Vehicle Cabin Air:</strong>
              Switch vehicle AC to air recirculation mode to minimize cabin soot intake.
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block mb-0.5">Sensitive Individuals:</strong>
              Choose green routes to minimize cumulative duration in particulate smog.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
