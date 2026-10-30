import {
  FileText,
  Search,
  Route,
  Activity,
  Calculator,
  Database,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function MethodologySection() {
  const steps = [
    {
      num: '01',
      title: 'Statewide Geocoding & Boundary Validation',
      desc: 'Searches across all 75 districts, tehsils, towns, and villages in Uttar Pradesh using OpenStreetMap Photon and Nominatim with a ray-casting point-in-polygon test against the official Uttar Pradesh state boundary polygon.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Alternative Driving Route Generation',
      desc: 'Retrieves actual road geometries, distances, and traffic durations using the Open Source Routing Machine (OSRM) engine, generating genuine alternate highway corridors and arterial bypasses.',
      icon: Route,
    },
    {
      num: '03',
      title: 'Point-by-Point Route Sampling',
      desc: 'Samples representative geographic coordinates at regular intervals along each route geometry rather than assuming uniform air quality across hundreds of kilometers of highway.',
      icon: Activity,
    },
    {
      num: '04',
      title: 'Copernicus Atmospheric Reanalysis',
      desc: 'Queries Copernicus Atmosphere Monitoring Service (CAMS) and Open-Meteo regional reanalysis for PM2.5, PM10, NO2, and US AQI at each sampled coordinate with real timestamps.',
      icon: Database,
    },
    {
      num: '05',
      title: 'Cumulative Inhalation Exposure Calculation',
      desc: 'Scientifically integrates pollution concentration over travel duration: Exposure = Avg AQI × (Duration / 60). This accounts for both ambient smog density and total lung exposure time.',
      icon: Calculator,
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-5 w-5 text-emerald-600" />
        <h3 className="text-base font-bold text-slate-900">
          Scientific Methodology & Data Transparency
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-6 max-w-3xl">
        The Healthy Path adheres to strict environmental data transparency. We do not fabricate live sensor readings or claim unverified health miracles. Here is exactly how our route evaluation works:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="p-4 rounded-lg border border-slate-100 bg-slate-50/60 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Step {s.num}
                  </span>
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Data Disclosures */}
      <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0" />
          <span>Understanding Modeled Data vs. Fixed Sensor Stations</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          While major urban centers like Lucknow, Kanpur, and Noida have continuous ambient air monitoring stations (CAAQMS) operated by CPCB and UPPCB, rural highways and village connector roads do not have physical sensor towers every 500 meters. For statewide coverage, atmospheric science relies on high-resolution reanalysis models (such as Copernicus CAMS and European SILAM) that combine satellite observations, weather physics, and ground sensor data. The Healthy Path clearly presents modeled data as estimates and never simulates fake live hardware meters.
        </p>
      </div>
    </div>
  );
}
