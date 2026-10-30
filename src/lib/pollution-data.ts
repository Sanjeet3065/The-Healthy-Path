// Backward-compatibility bridge and re-exports for The Healthy Path UP Engine
export * from './geo';
export * from './geocoding';
export * from './routing';
export * from './pollution-service';
export * from './up-districts';

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
  { id: '2', name: 'Gomti Nagar', lat: 26.8563, lng: 80.992, aqi: 72, zone: 'moderate' },
  { id: '3', name: 'Hazratganj', lat: 26.8498, lng: 80.9464, aqi: 95, zone: 'moderate' },
  { id: '4', name: 'Charbagh', lat: 26.8393, lng: 80.9231, aqi: 142, zone: 'high' },
  { id: '5', name: 'Indira Nagar', lat: 26.872, lng: 80.985, aqi: 62, zone: 'moderate' },
  { id: '6', name: 'Aliganj', lat: 26.883, lng: 80.938, aqi: 88, zone: 'moderate' },
  { id: '7', name: 'Mahanagar', lat: 26.87, lng: 80.929, aqi: 110, zone: 'high' },
  { id: '8', name: 'Aminabad', lat: 26.851, lng: 80.928, aqi: 135, zone: 'high' },
  { id: '9', name: 'Alambagh', lat: 26.815, lng: 80.911, aqi: 152, zone: 'severe' },
  { id: '10', name: 'Vikas Nagar', lat: 26.848, lng: 81.005, aqi: 58, zone: 'moderate' },
  { id: '11', name: 'Talkatora Industrial', lat: 26.8601, lng: 80.9089, aqi: 168, zone: 'severe' },
  { id: '12', name: 'Polytechnic Chauraha', lat: 26.8365, lng: 80.8953, aqi: 148, zone: 'high' },
];

export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getZoneColor(zone: Location['zone']): string {
  switch (zone) {
    case 'low':
      return 'text-emerald-600';
    case 'moderate':
      return 'text-amber-600';
    case 'high':
      return 'text-orange-600';
    case 'severe':
      return 'text-red-600';
  }
}
