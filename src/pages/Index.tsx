import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import InteractiveMap from '@/components/Map/InteractiveMap';
import LocationSearchInput from '@/components/RouteSearch/LocationSearchInput';
import RouteComparisonPanel from '@/components/RouteComparison/RouteComparisonPanel';
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
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      <Navbar />

      {/* Upgraded Compact Hero Section */}
      <HeroSection />

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 flex-1">
        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary Route Planner Experience */}
        <section id="route-planner" className="space-y-4">
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-5 items-start">
            {/* Search Input (Top on Mobile, Left Column on Desktop) */}
            <div className="lg:col-span-5 space-y-4">
              <LocationSearchInput
                origin={origin}
                destination={destination}
                onSelectOrigin={setOrigin}
                onSelectDestination={setDestination}
                onSearchRoutes={handleSearchRoutes}
                isLoading={isLoading}
                travelMode={travelMode}
                onSelectTravelMode={handleSelectTravelMode}
              />

              {/* Desktop-only Route Comparison (side-by-side with map) */}
              <div className="hidden lg:block space-y-4">
                {routes.length > 0 ? (
                  <RouteComparisonPanel
                    routes={routes}
                    selectedRouteId={selectedRouteId}
                    onSelectRoute={setSelectedRouteId}
                    corridorAtmosphere={corridorAtmosphere}
                    originName={origin?.name}
                    destinationName={destination?.name}
                  />
                ) : (
                  !isLoading && (
                    <div className="bg-white rounded-xl border border-slate-200/80 p-6 text-center shadow-soft">
                      <Compass className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                      <h3 className="text-xs font-bold text-slate-800 mb-1">Select Locations</h3>
                      <p className="text-xs text-slate-500">
                        Choose any starting point and destination in Uttar Pradesh to compare route pollution.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Interactive Map (Middle on Mobile, Sticky Right Column on Desktop) */}
            <div className="lg:col-span-7 lg:sticky lg:top-16 space-y-4">
              <InteractiveMap
                origin={origin}
                destination={destination}
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
                onMapClick={handleMapClick}
              />

              {/* Mobile/Tablet Route Comparison (directly below the map for intuitive mobile UX) */}
              <div className="block lg:hidden space-y-4">
                {routes.length > 0 ? (
                  <RouteComparisonPanel
                    routes={routes}
                    selectedRouteId={selectedRouteId}
                    onSelectRoute={setSelectedRouteId}
                    corridorAtmosphere={corridorAtmosphere}
                    originName={origin?.name}
                    destinationName={destination?.name}
                  />
                ) : (
                  !isLoading && (
                    <div className="bg-white rounded-xl border border-slate-200/80 p-5 text-center shadow-soft">
                      <Compass className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                      <h3 className="text-xs font-bold text-slate-800 mb-1">Select Locations</h3>
                      <p className="text-xs text-slate-500">
                        Choose any starting point and destination in Uttar Pradesh to compare route pollution.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
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
