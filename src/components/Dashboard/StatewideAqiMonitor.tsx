import { useEffect, useState } from 'react';
import {
  Wind,
  RefreshCw,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  fetchStatewideAqiSnapshots,
  type CityAqiSnapshot,
  getCategoryBadgeClass,
} from '@/lib/pollution-service';
import type { LocationItem } from '@/lib/geocoding';

interface StatewideAqiMonitorProps {
  onSelectCityAsDestination?: (city: LocationItem) => void;
}

export default function StatewideAqiMonitor({
  onSelectCityAsDestination,
}: StatewideAqiMonitorProps) {
  const [snapshots, setSnapshots] = useState<CityAqiSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchStatewideAqiSnapshots();
      setSnapshots(data);
      setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
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
    if (!onSelectCityAsDestination) return;
    onSelectCityAsDestination({
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

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 md:p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Uttar Pradesh Statewide Air Quality Snapshot
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real atmospheric data across major regional districts • Copernicus CAMS & Open-Meteo
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lastRefreshed && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated {lastRefreshed}</span>
            </span>
          )}
          <button
            onClick={loadData}
            disabled={isLoading}
            title="Refresh Air Quality"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Cities */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {snapshots.map((city) => (
          <div
            key={city.cityName}
            onClick={() => handleCityClick(city)}
            className="group relative p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-emerald-300 hover:shadow-soft transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                {city.cityName}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                  city.category
                )}`}
              >
                {city.category}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="text-lg font-extrabold text-slate-900">{city.aqi}</span>
                <span className="text-[10px] text-slate-400 ml-1">AQI</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">
                  PM2.5: <strong className="text-slate-800">{city.pm25}</strong>
                </span>
                <span className="text-[9px] text-slate-400">μg/m³</span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-emerald-700 transition-colors">
              <span>Set as route</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
