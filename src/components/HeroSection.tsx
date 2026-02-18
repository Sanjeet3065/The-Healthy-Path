import { Leaf, Shield, Database, MapPin } from 'lucide-react';

const HeroSection = () => {
  return (
    <header className="relative overflow-hidden py-16 md:py-24">
      {/* Background effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Leaf className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary tracking-wide uppercase">Lucknow's Clean Air Navigator</span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4 glow-text text-foreground">
          The <span className="text-primary">Green</span> Path
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Find the least-pollution route between two points in Lucknow. 
          Prioritizing your health over speed — because every breath matters.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { icon: Shield, label: 'Health Score', desc: 'Per route' },
            { icon: MapPin, label: 'AQI Zones', desc: '12+ locations' },
            { icon: Database, label: 'Open Data', desc: 'CPCB sourced' },
            { icon: Leaf, label: 'PM2.5 Aware', desc: 'Dust avoidance' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card-gradient rounded-lg border border-border p-4 text-center">
              <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <span className="text-sm font-semibold text-foreground block">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
