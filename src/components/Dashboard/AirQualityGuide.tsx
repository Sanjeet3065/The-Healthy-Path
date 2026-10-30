import { Shield, AlertCircle, HeartPulse, Sparkles } from 'lucide-react';

export default function AirQualityGuide() {
  const brackets = [
    {
      range: '0 – 50',
      category: 'Good',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      desc: 'Minimal impact. Air quality is considered satisfactory, and air pollution poses little or no risk.',
    },
    {
      range: '51 – 100',
      category: 'Satisfactory',
      color: 'bg-teal-500',
      textColor: 'text-teal-700',
      bgColor: 'bg-teal-50',
      desc: 'Minor breathing discomfort to sensitive people. Generally acceptable for outdoor travel.',
    },
    {
      range: '101 – 200',
      category: 'Moderate',
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      desc: 'Breathing discomfort to people with lungs, asthma, and heart diseases upon prolonged exposure.',
    },
    {
      range: '201 – 300',
      category: 'Poor',
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      desc: 'Breathing discomfort to most people on prolonged exposure. Commuters should keep vehicle windows closed.',
    },
    {
      range: '301 – 400',
      category: 'Very Poor',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      desc: 'Respiratory illness on prolonged exposure. Avoid open two-wheeler travel or use an N95 respirator.',
    },
    {
      range: '401+',
      category: 'Severe',
      color: 'bg-purple-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      desc: 'Affects healthy people and seriously impacts those with existing diseases. Minimize non-essential transit.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 md:p-6 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <HeartPulse className="h-5 w-5 text-emerald-600" />
        <h3 className="text-base font-bold text-slate-900">National Air Quality Index (NAQI) Guide</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Official benchmark standards defined by Central Pollution Control Board (CPCB) for India
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {brackets.map((b) => (
          <div key={b.category} className={`p-3.5 rounded-lg border border-slate-100 ${b.bgColor}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold ${b.textColor}`}>{b.category}</span>
              <span className="text-xs font-mono font-bold text-slate-700">{b.range} AQI</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Health Tips for Commuters */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Two-Wheeler Commuters:</strong> Wear an anti-pollution N95 mask along high-AQI highway corridors.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Car AC Recirculation:</strong> Set vehicle ventilation to 'recirculation mode' when driving through industrial zones.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Children & Seniors:</strong> Prioritize green routes with lowest cumulative exposure time to protect lungs.
          </span>
        </div>
      </div>
    </div>
  );
}
