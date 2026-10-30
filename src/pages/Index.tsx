import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import InteractiveMap from '@/components/Map/InteractiveMap';
import LocationSearchInput from '@/components/RouteSearch/LocationSearchInput';
import RouteComparisonPanel from '@/components/RouteComparison/RouteComparisonPanel';
import StatewideAqiMonitor from '@/components/Dashboard/StatewideAqiMonitor';
import AirQualityGuide from '@/components/Dashboard/AirQualityGuide';
import MethodologySection from '@/components/Dashboard/MethodologySection';
import { reverseGeocodeLocation, type LocationItem } from '@/lib/geocoding';
import { fetchAlternativeRoutes } from '@/lib/routing';
import { evaluateRoutesPollution, type EvaluatedRoute } from '@/lib/pollution-service';
import { AlertCircle, Leaf, Compass, ShieldCheck } from 'lucide-react';

export default function Index() {
  // Default to Lucknow -> Kanpur as initial showcase
  const [origin, setOrigin] = useState<LocationItem | null>({
    id: 'dist-lucknow',
    name: 'Lucknow',
    displayName: 'Lucknow, Lucknow Division, Uttar Pradesh',
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
    displayName: 'Kanpur, Kanpur Division, Uttar Pradesh',
    lat: 26.4499,
    lng: 80.3319,
    district: 'Kanpur',
    state: 'Uttar Pradesh',
    country: 'India',
    type: 'district',
    isWithinUP: true,
  });

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
      setErrorMsg(
        'Both locations must be within Uttar Pradesh state boundary. Please adjust your selection.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Fetch real alternative route geometries from OSRM
      const rawRoutes = await fetchAlternativeRoutes(origin, destination);

      if (!rawRoutes || rawRoutes.length === 0) {
        setErrorMsg('Could not calculate a road path between these two points. Please try nearby towns or highways.');
        setRoutes([]);
        setSelectedRouteId(null);
        return;
      }

      // 2. Sample atmospheric air quality along each route and calculate cumulative exposure
      const evaluated = await evaluateRoutesPollution(rawRoutes);
      setRoutes(evaluated);

      // Select recommended route by default
      const recommended = evaluated.find((r) => r.pollution?.recommendation === 'recommended');
      setSelectedRouteId(recommended ? recommended.id : evaluated[0].id);
    } catch (err: any) {
      console.error('Route calculation error:', err);
      setErrorMsg('An unexpected error occurred while analyzing routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial route evaluation on first load so user immediately sees live data
  useEffect(() => {
    handleSearchRoutes();
  }, []);

  // Map click handler to reverse geocode clicked point as destination if none, or update
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      const loc = await reverseGeocodeLocation(lat, lng);
      if (loc && loc.isWithinUP) {
        setDestination(loc);
      }
    } catch (e) {
      console.warn('Map click reverse geocode notice:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Navbar />

      <HeroSection />

      <main className="container mx-auto px-4 py-8 space-y-8 flex-1">
        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-semibold block">Notice</span>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* Primary Interactive Section: Search Panel, Map, and Route Comparison */}
        <section id="route-planner" className="space-y-6">
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Search Form & Route Comparison Cards */}
            <div className="lg:col-span-5 space-y-6">
              <LocationSearchInput
                origin={origin}
                destination={destination}
                onSelectOrigin={setOrigin}
                onSelectDestination={setDestination}
                onSearchRoutes={handleSearchRoutes}
                isLoading={isLoading}
              />

              {routes.length > 0 ? (
                <RouteComparisonPanel
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={setSelectedRouteId}
                />
              ) : (
                !isLoading && (
                  <div className="bg-white rounded-xl border border-slate-200/90 p-8 text-center shadow-card">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                      <Compass className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Select Origin & Destination</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Choose any two locations across Uttar Pradesh to generate alternative highway routes and compare cumulative air pollution exposure.
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Right Column: Full Interactive Map */}
            <div className="lg:col-span-7 sticky top-20">
              <InteractiveMap
                origin={origin}
                destination={destination}
                routes={routes}
                selectedRouteId={selectedRouteId}
                onSelectRoute={setSelectedRouteId}
                onMapClick={handleMapClick}
              />
            </div>
          </div>
        </section>

        {/* Live Statewide Air Quality Monitor Section */}
        <section id="statewide-monitor">
          <StatewideAqiMonitor
            onSelectCityAsDestination={(city) => {
              setDestination(city);
              const el = document.getElementById('route-planner');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </section>

        {/* Scientific Methodology & Data Transparency */}
        <section id="methodology">
          <MethodologySection />
        </section>

        {/* Air Quality Guide & Traveler Health Recommendations */}
        <section id="aqi-guide">
          <AirQualityGuide />
        </section>
      </main>

      {/* Modern, Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-700 text-white flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-800">The Healthy Path — Uttar Pradesh 2.0</span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p>
              Open Data Attribution: &copy; OpenStreetMap contributors • Open Source Routing Machine (OSRM) • Copernicus CAMS & Open-Meteo
            </p>
            <p className="text-slate-400">
              Environmental intelligence prototype designed for cleaner transit decisions across Uttar Pradesh.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
