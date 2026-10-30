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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft overflow-hidden">
      {/* Sleek Minimalist Tab Header */}
      <div className="border-b border-slate-100 px-3.5 sm:px-5 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/50">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-200/60 text-xs font-semibold overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('live_aqi')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap text-[11px] sm:text-xs ${
              activeTab === 'live_aqi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Live <span className="hidden sm:inline">UP </span>Air Quality</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap text-[11px] sm:text-xs ${
              activeTab === 'methodology'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span><span className="hidden sm:inline">How It's </span>Calculated</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap text-[11px] sm:text-xs ${
              activeTab === 'standards'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>NAQI <span className="hidden sm:inline">Standards</span></span>
          </button>
        </div>

        {activeTab === 'live_aqi' && (
          <button
            onClick={loadData}
            disabled={isLoading}
            title="Refresh Live Data"
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-emerald-700 transition-colors ml-auto sm:ml-0"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Tab 1: Live UP Air Quality Grid */}
      {activeTab === 'live_aqi' && (
        <div className="p-3.5 sm:p-5 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {snapshots.map((city) => (
              <div
                key={city.cityName}
                onClick={() => handleCityClick(city)}
                className="group p-2.5 sm:p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-soft transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1 truncate">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                    <span className="truncate">{city.cityName}</span>
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${getCategoryBadgeClass(
                      city.category
                    )}`}
                  >
                    {city.category}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">{city.aqi}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 ml-1">AQI</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                    PM2.5: <strong className="text-slate-800">{city.pm25}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 text-center sm:text-right mt-3">
            Copernicus CAMS & Open-Meteo Atmospheric Reanalysis • Click city to route
          </p>
        </div>
      )}

      {/* Tab 2: Scientific Methodology (3 concise pillars) */}
      {activeTab === 'methodology' && (
        <div className="p-5 md:p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-emerald-800 block mb-1">
                1. Road Network Routing
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Queries OSRM driving engine for real alternative highway and expressway corridors, distances, and travel durations.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-emerald-800 block mb-1">
                2. Point-by-Point Sampling
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Samples representative coordinates along each route to query real atmospheric PM2.5, PM10, and NO2 via Copernicus CAMS.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-emerald-800 block mb-1">
                3. Cumulative Inhalation Dose
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates total lung exposure: Exposure = Avg AQI × Duration. Recommends the route with the lowest cumulative particulate dose.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
            <Info className="h-4 w-4 text-emerald-700 flex-shrink-0" />
            <span>
              <strong>Scientific Transparency:</strong> For continuous highways and rural links without fixed CAAQMS physical towers, atmospheric reanalysis models blend satellite data with ground observations.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: NAQI Standards & Health */}
      {activeTab === 'standards' && (
        <div className="p-5 md:p-6 space-y-4">
          {/* Visual Spectrum Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {naqiLevels.map((lvl) => (
              <div key={lvl.label} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center">
                <span className={`w-2.5 h-2.5 rounded-full ${lvl.color} inline-block mb-1`} />
                <span className="text-xs font-bold text-slate-800 block">{lvl.label}</span>
                <span className="text-[10px] text-slate-500 font-mono block">{lvl.range} AQI</span>
                <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{lvl.desc}</span>
              </div>
            ))}
          </div>

          {/* Practical Commuter Advice */}
          <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <div>
              <strong className="text-slate-800 block mb-0.5">Two-Wheeler Riders:</strong>
              Use N95 respirators when commuting along high-traffic industrial corridors.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">Vehicle Cabin Air:</strong>
              Switch vehicle AC to air recirculation mode to minimize cabin soot intake.
            </div>
            <div>
              <strong className="text-slate-800 block mb-0.5">Sensitive Individuals:</strong>
              Choose green routes to minimize cumulative duration in particulate smog.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
