import { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lucknowLocations, generateRoutes, type Route } from '@/lib/pollution-data';

interface RouteFinderProps {
  onRoutesFound: (routes: Route[]) => void;
}

const RouteFinder = ({ onRoutesFound }: RouteFinderProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const locationNames = lucknowLocations.map(l => l.name);

  const handleSearch = () => {
    const routes = generateRoutes(from, to);
    onRoutesFound(routes);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="card-gradient rounded-lg border border-border p-6 glow-border">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg text-foreground">Find Your Green Path</h2>
      </div>
      <p className="text-muted-foreground text-sm mb-6">Choose start and end points to discover the cleanest route</p>

      <div className="space-y-4">
        <div className="relative">
          <label className="text-xs text-muted-foreground mb-1 block">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
            <input
              type="text"
              value={from}
              readOnly
              onClick={() => { setFromOpen(!fromOpen); setToOpen(false); }}
              placeholder="Select starting point"
              className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
            />
          </div>
          {fromOpen && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {locationNames.map(name => (
                <button
                  key={name}
                  onClick={() => { setFrom(name); setFromOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/80 transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"/></svg>
          </button>
        </div>

        <div className="relative">
          <label className="text-xs text-muted-foreground mb-1 block">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-danger" />
            <input
              type="text"
              value={to}
              readOnly
              onClick={() => { setToOpen(!toOpen); setFromOpen(false); }}
              placeholder="Select destination"
              className="w-full bg-muted/50 border border-border rounded-md pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
            />
          </div>
          {toOpen && (
            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {locationNames.map(name => (
                <button
                  key={name}
                  onClick={() => { setTo(name); setToOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/80 transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSearch}
          disabled={!from || !to || from === to}
          className="w-full py-3 font-display text-sm tracking-wider"
        >
          <Search className="h-4 w-4 mr-2" />
          Find Cleanest Route
        </Button>
      </div>
    </div>
  );
};

export default RouteFinder;
