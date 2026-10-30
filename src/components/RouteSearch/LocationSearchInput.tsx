import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Building2,
  TreePine,
  Landmark,
  Compass,
  Car,
  Bike,
  Activity,
} from 'lucide-react';
import { searchLocationsAcrossUP, type LocationItem } from '@/lib/geocoding';
import type { TravelMode } from '@/lib/pollution-service';
import { Button } from '@/components/ui/button';

interface LocationSearchInputProps {
  origin: LocationItem | null;
  destination: LocationItem | null;
  onSelectOrigin: (loc: LocationItem | null) => void;
  onSelectDestination: (loc: LocationItem | null) => void;
  onSearchRoutes: () => void;
  isLoading: boolean;
  travelMode?: TravelMode;
  onSelectTravelMode?: (mode: TravelMode) => void;
}

export default function LocationSearchInput({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSearchRoutes,
  isLoading,
  travelMode = 'car',
  onSelectTravelMode,
}: LocationSearchInputProps) {
  // Text input state
  const [originQuery, setOriginQuery] = useState(origin?.name || '');
  const [destQuery, setDestQuery] = useState(destination?.name || '');

  // Autocomplete dropdowns
  const [originResults, setOriginResults] = useState<LocationItem[]>([]);
  const [destResults, setDestResults] = useState<LocationItem[]>([]);
  const [isOriginSearching, setIsOriginSearching] = useState(false);
  const [isDestSearching, setIsDestSearching] = useState(false);
  const [showOriginMenu, setShowOriginMenu] = useState(false);
  const [showDestMenu, setShowDestMenu] = useState(false);

  const originBoxRef = useRef<HTMLDivElement>(null);
  const destBoxRef = useRef<HTMLDivElement>(null);

  // Sync when props change from external presets
  useEffect(() => {
    if (origin) setOriginQuery(origin.name);
  }, [origin]);

  useEffect(() => {
    if (destination) setDestQuery(destination.name);
  }, [destination]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (originBoxRef.current && !originBoxRef.current.contains(event.target as Node)) {
        setShowOriginMenu(false);
      }
      if (destBoxRef.current && !destBoxRef.current.contains(event.target as Node)) {
        setShowDestMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for Origin
  useEffect(() => {
    if (!originQuery || originQuery.length < 2 || (origin && origin.name === originQuery)) {
      setOriginResults([]);
      setIsOriginSearching(false);
      return;
    }

    setIsOriginSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchLocationsAcrossUP(originQuery);
        setOriginResults(res);
        setShowOriginMenu(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsOriginSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [originQuery, origin]);

  // Debounced search for Destination
  useEffect(() => {
    if (!destQuery || destQuery.length < 2 || (destination && destination.name === destQuery)) {
      setDestResults([]);
      setIsDestSearching(false);
      return;
    }

    setIsDestSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchLocationsAcrossUP(destQuery);
        setDestResults(res);
        setShowDestMenu(true);
      } catch (e) {
        console.error(e);
      } finally {
        setIsDestSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [destQuery, destination]);

  // Swap Origin and Destination
  const handleSwap = () => {
    const tempOrigin = origin;
    const tempQuery = originQuery;

    onSelectOrigin(destination);
    setOriginQuery(destQuery);

    onSelectDestination(tempOrigin);
    setDestQuery(tempQuery);
  };

  // Quick preset destinations in UP
  const presets = [
    { from: 'Lucknow', to: 'Kanpur', fromCoords: [26.8467, 80.9462], toCoords: [26.4499, 80.3319] },
    { from: 'Lucknow', to: 'Varanasi', fromCoords: [26.8467, 80.9462], toCoords: [25.3176, 82.9739] },
    { from: 'Noida', to: 'Agra', fromCoords: [28.5355, 77.391], toCoords: [27.1767, 78.0081] },
    { from: 'Gorakhpur', to: 'Prayagraj', fromCoords: [26.7606, 83.3732], toCoords: [25.4358, 81.8463] },
    { from: 'Meerut', to: 'Bareilly', fromCoords: [28.9845, 77.7064], toCoords: [28.367, 79.4304] },
    { from: 'Ayodhya', to: 'Gorakhpur', fromCoords: [26.7922, 82.1998], toCoords: [26.7606, 83.3732] },
  ];

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    const origItem: LocationItem = {
      id: `preset-${p.from.toLowerCase()}`,
      name: p.from,
      displayName: `${p.from}, Uttar Pradesh`,
      lat: p.fromCoords[0],
      lng: p.fromCoords[1],
      district: p.from,
      state: 'Uttar Pradesh',
      type: 'city',
      isWithinUP: true,
    };

    const destItem: LocationItem = {
      id: `preset-${p.to.toLowerCase()}`,
      name: p.to,
      displayName: `${p.to}, Uttar Pradesh`,
      lat: p.toCoords[0],
      lng: p.toCoords[1],
      district: p.to,
      state: 'Uttar Pradesh',
      type: 'city',
      isWithinUP: true,
    };

    onSelectOrigin(origItem);
    setOriginQuery(p.from);
    onSelectDestination(destItem);
    setDestQuery(p.to);
  };

  const getLocationIcon = (type: LocationItem['type']) => {
    switch (type) {
      case 'district':
      case 'city':
        return <Building2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />;
      case 'village':
        return <TreePine className="h-4 w-4 text-teal-600 flex-shrink-0" />;
      case 'landmark':
        return <Landmark className="h-4 w-4 text-amber-600 flex-shrink-0" />;
      default:
        return <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />;
    }
  };

  const isFormValid =
    origin &&
    destination &&
    origin.isWithinUP &&
    destination.isWithinUP &&
    origin.id !== destination.id;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Compass className="h-4 w-4 text-emerald-600" />
          <span>Plan Route</span>
        </h2>
        <span className="text-xs text-slate-400">Uttar Pradesh</span>
      </div>

      {/* Travel Mode Selector (Feature: Commuter Calibration) */}
      <div className="mb-4 p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-1 flex items-center justify-between">
          <span>Travel Mode</span>
          <span className="text-[10px] text-slate-500 font-normal">Calibrates Particulate Inhalation</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => onSelectTravelMode?.('car')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'car'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Car / Cab</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTravelMode?.('bike')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'bike'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
            }`}
          >
            <Bike className="h-3.5 w-3.5" />
            <span>Two-Wheeler</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTravelMode?.('bicycle')}
            className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              travelMode === 'bicycle'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Bicycle</span>
          </button>
        </div>
        <div className="mt-1.5 px-1 text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {travelMode === 'car' && <span>Cabin air filter active • Lower direct PM exposure (0.8x)</span>}
          {travelMode === 'bike' && <span>Direct road dust & exhaust exposure (~1.25x inhalation)</span>}
          {travelMode === 'bicycle' && <span>High respiration rate on active commute (~1.45x intake)</span>}
        </div>
      </div>

      {/* Input Group with Swap Button */}
      <div className="space-y-3 relative">
        {/* Origin Field */}
        <div ref={originBoxRef} className="relative">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Starting Point (Origin)</span>
            {origin && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> UP Verified
              </span>
            )}
          </label>

          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
            </div>

            <input
              type="text"
              value={originQuery}
              onChange={(e) => {
                setOriginQuery(e.target.value);
                if (origin && origin.name !== e.target.value) {
                  onSelectOrigin(null);
                }
              }}
              onFocus={() => {
                if (originResults.length > 0) setShowOriginMenu(true);
              }}
              placeholder="e.g. Lucknow, Pipraich, Malihabad, Sector 18 Noida..."
              className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />

            {isOriginSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
            )}

            {!isOriginSearching && originQuery && (
              <button
                type="button"
                onClick={() => {
                  setOriginQuery('');
                  onSelectOrigin(null);
                  setOriginResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Origin Autocomplete Results Dropdown */}
          {showOriginMenu && originResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-lg border border-slate-200 shadow-hover max-h-60 overflow-y-auto divide-y divide-slate-100">
              {originResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (!item.isWithinUP) return;
                    onSelectOrigin(item);
                    setOriginQuery(item.name);
                    setShowOriginMenu(false);
                  }}
                  disabled={!item.isWithinUP}
                  className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors ${
                    !item.isWithinUP
                      ? 'opacity-60 bg-slate-50/80 cursor-not-allowed'
                      : 'hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="mt-0.5">{getLocationIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">{item.displayName}</div>
                    {!item.isWithinUP && (
                      <div className="text-[11px] font-medium text-amber-700 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Outside Uttar Pradesh state boundary</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Swap Control Divider */}
        <div className="flex items-center justify-center my-0.5">
          <button
            type="button"
            onClick={handleSwap}
            title="Swap Origin and Destination"
            className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-500 text-slate-600 hover:text-emerald-700 shadow-sm transition-all"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Destination Field */}
        <div ref={destBoxRef} className="relative">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
            <span>Destination</span>
            {destination && (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> UP Verified
              </span>
            )}
          </label>

          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-slate-100" />
            </div>

            <input
              type="text"
              value={destQuery}
              onChange={(e) => {
                setDestQuery(e.target.value);
                if (destination && destination.name !== e.target.value) {
                  onSelectDestination(null);
                }
              }}
              onFocus={() => {
                if (destResults.length > 0) setShowDestMenu(true);
              }}
              placeholder="e.g. Kanpur, Varanasi, Agra, Gorakhpur, Dalmau..."
              className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-emerald-600 rounded-lg pl-9 pr-9 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/15 transition-all"
            />

            {isDestSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
            )}

            {!isDestSearching && destQuery && (
              <button
                type="button"
                onClick={() => {
                  setDestQuery('');
                  onSelectDestination(null);
                  setDestResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Destination Autocomplete Results Dropdown */}
          {showDestMenu && destResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-lg border border-slate-200 shadow-hover max-h-60 overflow-y-auto divide-y divide-slate-100">
              {destResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (!item.isWithinUP) return;
                    onSelectDestination(item);
                    setDestQuery(item.name);
                    setShowDestMenu(false);
                  }}
                  disabled={!item.isWithinUP}
                  className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors ${
                    !item.isWithinUP
                      ? 'opacity-60 bg-slate-50/80 cursor-not-allowed'
                      : 'hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="mt-0.5">{getLocationIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">{item.name}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">{item.displayName}</div>
                    {!item.isWithinUP && (
                      <div className="text-[11px] font-medium text-amber-700 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Outside Uttar Pradesh state boundary</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Submit Route Search Button */}
        <Button
          onClick={onSearchRoutes}
          disabled={!isFormValid || isLoading}
          className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing Atmospheric Exposure...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Find Lowest Pollution Route</span>
            </>
          )}
        </Button>
      </div>

      {/* Quick Example Trips Across UP */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Popular UP Travel Corridors
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={`${p.from}-${p.to}`}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/80 text-slate-700 transition-colors"
            >
              {p.from} → {p.to}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
