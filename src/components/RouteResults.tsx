import { Clock, Route as RouteIcon, Heart, Wind, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { Route } from '@/lib/pollution-data';

interface RouteResultsProps {
  routes: Route[];
}

const RouteResults = ({ routes }: RouteResultsProps) => {
  if (routes.length === 0) return null;

  const getBadge = (rec: Route['recommendation']) => {
    switch (rec) {
      case 'best':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-success/20 text-success">
            <CheckCircle className="h-3 w-3" /> Recommended
          </span>
        );
      case 'moderate':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-warning/20 text-warning">
            <AlertTriangle className="h-3 w-3" /> Moderate
          </span>
        );
      case 'avoid':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-danger/20 text-danger">
            <XCircle className="h-3 w-3" /> High Pollution
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-danger';
  };

  const getBarColor = (score: number) => {
    if (score >= 75) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="card-gradient rounded-lg border border-border p-6 glow-border">
      <div className="flex items-center gap-2 mb-4">
        <RouteIcon className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg text-foreground">Route Comparison</h2>
      </div>
      <p className="text-muted-foreground text-sm mb-4">Routes ranked by Health Score — higher is better</p>

      <div className="space-y-4">
        {routes.map((route, i) => (
          <div
            key={route.id}
            className={`rounded-lg border p-4 transition-all ${
              route.recommendation === 'best'
                ? 'border-success/40 bg-success/5'
                : 'border-border bg-muted/30'
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">{route.name}</h3>
              {getBadge(route.recommendation)}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground block">Duration</span>
                <span className="text-sm font-semibold text-foreground">{route.duration}</span>
              </div>
              <div className="text-center">
                <RouteIcon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground block">Distance</span>
                <span className="text-sm font-semibold text-foreground">{route.distance}</span>
              </div>
              <div className="text-center">
                <Wind className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground block">Avg AQI</span>
                <span className="text-sm font-semibold text-foreground">{route.avgAqi}</span>
              </div>
            </div>

            {/* Health Score Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Heart className="h-3 w-3" /> Health Score
                </span>
                <span className={`text-sm font-bold ${getScoreColor(route.healthScore)}`}>
                  {route.healthScore}/100
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(route.healthScore)}`}
                  style={{ width: `${route.healthScore}%` }}
                />
              </div>
            </div>

            {/* Waypoints */}
            <div className="mb-2">
              <span className="text-xs text-muted-foreground">Via: </span>
              <span className="text-xs text-foreground">{route.waypoints.join(' → ')}</span>
            </div>

            {/* Pollution Factors */}
            <div className="flex flex-wrap gap-1.5">
              {route.pollutionFactors.map((factor) => (
                <span
                  key={factor}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteResults;
