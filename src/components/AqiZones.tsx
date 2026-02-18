import { Wind, Gauge, TreePine, AlertTriangle } from 'lucide-react';
import { lucknowLocations, getZoneColor, getAqiLabel } from '@/lib/pollution-data';

const AqiZones = () => {
  const sorted = [...lucknowLocations].sort((a, b) => a.aqi - b.aqi);

  return (
    <div className="card-gradient rounded-lg border border-border p-6 glow-border">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg text-foreground">Lucknow AQI Zones</h2>
      </div>
      <p className="text-muted-foreground text-sm mb-4">Real-time air quality across key locations</p>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {sorted.map((loc) => (
          <div
            key={loc.id}
            className="flex items-center justify-between rounded-md bg-muted/50 px-4 py-3 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              {loc.zone === 'low' && <TreePine className="h-4 w-4 text-success" />}
              {loc.zone === 'moderate' && <Gauge className="h-4 w-4 text-warning" />}
              {(loc.zone === 'high' || loc.zone === 'severe') && <AlertTriangle className="h-4 w-4 text-danger" />}
              <span className="text-sm text-foreground">{loc.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${getZoneColor(loc.zone)}`}>
                AQI {loc.aqi}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {getAqiLabel(loc.aqi)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Good (0-50)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
          <span className="text-xs text-muted-foreground">Unhealthy (101-150)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-danger" />
          <span className="text-xs text-muted-foreground">Severe (150+)</span>
        </div>
      </div>
    </div>
  );
};

export default AqiZones;
