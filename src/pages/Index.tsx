import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import InteractiveMap from '@/components/Map/InteractiveMap';
import LocationSearchInput from '@/components/RouteSearch/LocationSearchInput';
import RouteComparisonPanel from '@/components/RouteComparison/RouteComparisonPanel';
import RouteInsightsPanel from '@/components/RouteComparison/RouteInsightsPanel';
import EnvironmentalHub from '@/components/Dashboard/EnvironmentalHub';
import { reverseGeocodeLocation, type LocationItem } from '@/lib/geocoding';
import { fetchAlternativeRoutes } from '@/lib/routing';
import {
  evaluateRoutesPollution,
  fetchCorridorAtmosphere,
  type EvaluatedRoute,
  type TravelMode,
  type CorridorWeather,
} from '@/lib/pollution-service';
import { UP_DISTRICTS } from '@/lib/up-districts';
import { AlertCircle, Compass } from 'lucide-react';

export default function Index() {
  // Default to Lucknow -> Kanpur as initial showcase
  const [origin, setOrigin] = useState<LocationItem | null>({
    id: 'dist-lucknow',
    name: 'Lucknow',
    displayName: 'Lucknow, Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'district',
    isWithinUP: true,
  });

  const [destination, setDestination] = useState<LocationItem | null>({
    id: 'dist-kanpur-nagar',
    name: 'Kanpur',
    displayName: 'Kanpur, Uttar Pradesh',
    lat: 26.4499,
    lng: 80.3319,
    district: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'district',
    isWithinUP: true,
  });

  const [travelMode, setTravelMode] = useState<TravelMode>('car');
  const [corridorAtmosphere, setCorridorAtmosphere] = useState<CorridorWeather | null>(null);
  const [routes, setRoutes] = useState<EvaluatedRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Search and evaluate routes
  const handleSearchRoutes = async () => {
    if (!origin || !destination) {
      setErrorMsg('Please select both a valid origin and destination in Uttar Pradesh.');
      return;
    }

    if (!origin.isWithinUP || !destination.isWithinUP) {
      setErrorMsg('Both locations must be within Uttar Pradesh.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const [rawRoutes, weather] = await Promise.all([
        fetchAlternativeRoutes(origin, destination),
        fetchCorridorAtmosphere(origin.lat, origin.lng),
      ]);

      setCorridorAtmosphere(weather);

      if (!rawRoutes || rawRoutes.length === 0) {
        setErrorMsg('Could not find road path. Please try another location.');
        setRoutes([]);
        setSelectedRouteId(null);
        return;
      }

      const evaluated = await evaluateRoutesPollution(rawRoutes, travelMode);
      setRoutes(evaluated);

      const recommended = evaluated.find((r) => r.pollution?.recommendation === 'recommended');
      setSelectedRouteId(recommended ? recommended.id : evaluated[0].id);
    } catch (err: any) {
      console.error('Route calculation error:', err);
      setErrorMsg('Unable to analyze routes at this moment. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Recalibrate when travel mode is switched
  const handleSelectTravelMode = async (mode: TravelMode) => {
    setTravelMode(mode);
    if (routes.length > 0) {
      setIsLoading(true);
      try {
        const reEvaluated = await evaluateRoutesPollution(routes, mode);
        setRoutes(reEvaluated);
        const recommended = reEvaluated.find((r) => r.pollution?.recommendation === 'recommended');
        setSelectedRouteId(recommended ? recommended.id : reEvaluated[0].id);
      } catch (err) {
        console.error('Recalibration error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle corridor preset selection from footer or presets
  const handleSelectCorridor = (fromName: string, toName: string) => {
    const fromDist = UP_DISTRICTS.find((d) => d.name.toLowerCase().includes(fromName.toLowerCase()));
    const toDist = UP_DISTRICTS.find((d) => d.name.toLowerCase().includes(toName.toLowerCase()));

    if (fromDist) {
      setOrigin({
        id: `dist-${fromDist.id}`,
        name: fromDist.name,
        displayName: `${fromDist.name}, Uttar Pradesh`,
        lat: fromDist.lat,
        lng: fromDist.lng,
        district: fromDist.name,
        state: 'Uttar Pradesh',
        country: 'India',
        type: 'district',
        isWithinUP: true,
      });
    }

    if (toDist) {
      setDestination({
        id: `dist-${toDist.id}`,
        name: toDist.name,
        displayName: `${toDist.name}, Uttar Pradesh`,
        lat: toDist.lat,
        lng: toDist.lng,
        district: toDist.name,
        state: 'Uttar Pradesh',
        country: 'India',
        type: 'district',
        isWithinUP: true,
      });
    }
  };

  useEffect(() => {
    handleSearchRoutes();
  }, []);

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const loc = await reverseGeocodeLocation(lat, lng);
      if (loc && loc.isWithinUP) {
        setDestination(loc);
      }
    } catch (e) {
      console.warn('Map click notice:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 w-full overflow-x-hidden">
      <Navbar />

      {/* Upgraded Compact Hero Section */}
      <HeroSection />

      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 py-3.5 sm:py-5 md:py-6 space-y-4 sm:space-y-6 flex-1 min-w-0">
        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Route Planner Experience */}
        <section id="route-planner" className="space-y-4 sm:space-y-5 w-full min-w-0">
          {/* Top Row: Route Planner (Left) and Interactive Map (Right) - Perfectly Aligned Top & Equal Height */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch w-full min-w-0">
            {/* Search Input (Top on Mobile, Left Column on Desktop) */}
            <div className="w-full min-w-0 lg:col-span-5 flex flex-col">
              <LocationSearchInput
                className="h-full flex flex-col justify-between"
                origin={origin}
                destination={destination}
                onSelectOrigin={setOrigin}
                onSelectDestination={setDestination}
                onSearchRoutes={handleSearchRoutes}
                isLoading={isLoading}
                travelMode={travelMode}
                onSelectTravelMode={handleSelectTravelMode}
              />
            </div>

            {/* Interactive Map (Right Column on Desktop, directly below Planner on Mobile) */}
            <div className="w-full min-w-0 lg:col-span-7 flex flex-col">
              <InteractiveMap
                className="h-full min-h-[320px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[510px]"
                origin={origin}
                destination={destination}
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
                onMapClick={handleMapClick}
              />
            </div>
          </div>

          {/* Bottom Row: Route Comparison & Environmental Health Insights (Both start at same vertical position) */}
          {routes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start w-full min-w-0">
              {/* Left Column (5 cols): Route Comparison (Cleanest Path, Smog Dispersal, Alternatives) */}
              <div className="w-full min-w-0 lg:col-span-5 space-y-4">
                <RouteComparisonPanel
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={setSelectedRouteId}
                  corridorAtmosphere={corridorAtmosphere}
                  originName={origin?.name}
                  destinationName={destination?.name}
                />
              </div>

              {/* Right Column (7 cols): Route Environmental & Health Insights */}
              <div className="w-full min-w-0 lg:col-span-7 space-y-4">
                <RouteInsightsPanel
                  selectedRoute={routes.find((r) => r.id === selectedRouteId) || routes[0] || null}
                  routes={routes}
                  travelMode={travelMode}
                  corridorAtmosphere={corridorAtmosphere}
                  originName={origin?.name}
                  destinationName={destination?.name}
                />
              </div>
            </div>
          ) : (
            !isLoading && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-6 text-center shadow-soft transition-colors duration-200">
                <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">Select Locations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Choose any starting point and destination in Uttar Pradesh to compare route pollution.
                </p>
              </div>
            )
          )}
        </section>

        {/* Unified Minimalist Environmental Intelligence Hub */}
        <section id="environmental-hub">
          <EnvironmentalHub
            onSelectCity={(city) => {
              setDestination(city);
              const el = document.getElementById('route-planner');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>
      </main>

      {/* Upgraded Compact Footer */}
      <Footer onSelectCorridor={handleSelectCorridor} />
    </div>
  );
}
