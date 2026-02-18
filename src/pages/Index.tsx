import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import RouteFinder from '@/components/RouteFinder';
import RouteResults from '@/components/RouteResults';
import AqiZones from '@/components/AqiZones';
import type { Route } from '@/lib/pollution-data';
import { Leaf } from 'lucide-react';

const Index = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="container mx-auto px-4 pb-16 -mt-4">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <RouteFinder onRoutesFound={setRoutes} />
            <AqiZones />
          </div>
          <div>
            {routes.length > 0 ? (
              <RouteResults routes={routes} />
            ) : (
              <div className="card-gradient rounded-lg border border-border p-12 glow-border flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse-glow">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">Select Your Route</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Choose a starting point and destination to see health-optimized route suggestions for Lucknow.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Built for the Hackathon — Track 4: Public Health & Environment | Data sourced from CPCB & OpenStreetMap
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
