// Lucknow location data and pollution simulation
export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  zone: 'low' | 'moderate' | 'high' | 'severe';
}

export interface Route {
  id: string;
  name: string;
  waypoints: string[];
  distance: string;
  duration: string;
  healthScore: number;
  avgAqi: number;
  pollutionFactors: string[];
  recommendation: 'best' | 'moderate' | 'avoid';
}

export const lucknowLocations: Location[] = [
  { id: '1', name: 'Janeshwar Mishra Park', lat: 26.8467, lng: 80.9462, aqi: 45, zone: 'low' },
  { id: '2', name: 'Gomti Nagar', lat: 26.8563, lng: 80.9920, aqi: 78, zone: 'moderate' },
  { id: '3', name: 'Hazratganj', lat: 26.8498, lng: 80.9464, aqi: 110, zone: 'high' },
  { id: '4', name: 'Charbagh', lat: 26.8393, lng: 80.9231, aqi: 185, zone: 'severe' },
  { id: '5', name: 'Polytechnic Chauraha', lat: 26.8365, lng: 80.8953, aqi: 195, zone: 'severe' },
  { id: '6', name: 'Talkatora', lat: 26.8601, lng: 80.9089, aqi: 210, zone: 'severe' },
  { id: '7', name: 'Aliganj', lat: 26.8830, lng: 80.9380, aqi: 95, zone: 'moderate' },
  { id: '8', name: 'Indira Nagar', lat: 26.8720, lng: 80.9850, aqi: 65, zone: 'low' },
  { id: '9', name: 'Mahanagar', lat: 26.8700, lng: 80.9290, aqi: 120, zone: 'high' },
  { id: '10', name: 'Aminabad', lat: 26.8510, lng: 80.9280, aqi: 155, zone: 'high' },
  { id: '11', name: 'Alambagh', lat: 26.8150, lng: 80.9110, aqi: 175, zone: 'severe' },
  { id: '12', name: 'Vikas Nagar', lat: 26.8480, lng: 81.0050, aqi: 55, zone: 'low' },
];

export function generateRoutes(from: string, to: string): Route[] {
  if (!from || !to || from === to) return [];

  const fromLoc = lucknowLocations.find(l => l.name === from);
  const toLoc = lucknowLocations.find(l => l.name === to);
  if (!fromLoc || !toLoc) return [];

  // Simulate 3 different routes
  const routes: Route[] = [
    {
      id: '1',
      name: 'Green Route (Recommended)',
      waypoints: [from, 'Janeshwar Mishra Park', 'Indira Nagar', to],
      distance: `${(Math.random() * 5 + 8).toFixed(1)} km`,
      duration: `${Math.floor(Math.random() * 10 + 25)} mins`,
      healthScore: Math.floor(Math.random() * 15 + 82),
      avgAqi: Math.floor(Math.random() * 30 + 40),
      pollutionFactors: ['Low traffic zone', 'Park corridor', 'Residential area'],
      recommendation: 'best',
    },
    {
      id: '2',
      name: 'Balanced Route',
      waypoints: [from, 'Gomti Nagar', to],
      distance: `${(Math.random() * 3 + 5).toFixed(1)} km`,
      duration: `${Math.floor(Math.random() * 8 + 18)} mins`,
      healthScore: Math.floor(Math.random() * 15 + 55),
      avgAqi: Math.floor(Math.random() * 40 + 80),
      pollutionFactors: ['Moderate traffic', 'Some construction zones'],
      recommendation: 'moderate',
    },
    {
      id: '3',
      name: 'Fastest Route',
      waypoints: [from, 'Charbagh', 'Aminabad', to],
      distance: `${(Math.random() * 2 + 4).toFixed(1)} km`,
      duration: `${Math.floor(Math.random() * 5 + 12)} mins`,
      healthScore: Math.floor(Math.random() * 15 + 25),
      avgAqi: Math.floor(Math.random() * 50 + 150),
      pollutionFactors: ['Heavy traffic congestion', 'Construction zone (Metro)', 'Industrial proximity'],
      recommendation: 'avoid',
    },
  ];

  return routes;
}

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
}

export function getZoneColor(zone: Location['zone']): string {
  switch (zone) {
    case 'low': return 'text-success';
    case 'moderate': return 'text-warning';
    case 'high': return 'text-orange-400';
    case 'severe': return 'text-danger';
  }
}
