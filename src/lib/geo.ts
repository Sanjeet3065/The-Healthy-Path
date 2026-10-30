import upBoundaryData from './up-boundary.json';

export interface LatLng {
  lat: number;
  lng: number;
}

// Uttar Pradesh Approximate Bounding Box: [minLat, maxLat, minLng, maxLng]
export const UP_BOUNDS = {
  minLat: 23.87,
  maxLat: 30.41,
  minLng: 77.08,
  maxLng: 84.63,
};

// Ray-casting algorithm for Point in Polygon
export function pointInPolygon(point: [number, number], vs: number[][]): boolean {
  const x = point[0]; // lng
  const y = point[1]; // lat
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Validates whether the given geographic coordinates fall within the official Uttar Pradesh state boundary.
 * @param lng Longitude (e.g. 80.9462)
 * @param lat Latitude (e.g. 26.8467)
 */
export function isInsideUttarPradesh(lng: number, lat: number): boolean {
  // Quick bbox pre-filter for performance
  if (
    lat < UP_BOUNDS.minLat ||
    lat > UP_BOUNDS.maxLat ||
    lng < UP_BOUNDS.minLng ||
    lng > UP_BOUNDS.maxLng
  ) {
    return false;
  }

  // Precise point-in-polygon test against UP MultiPolygon
  const coordinates = (upBoundaryData as any).geometry?.coordinates;
  if (!coordinates || !Array.isArray(coordinates)) {
    // Fallback to bounding box if geometry missing
    return true;
  }

  for (const polygon of coordinates) {
    if (Array.isArray(polygon) && polygon[0] && Array.isArray(polygon[0])) {
      if (pointInPolygon([lng, lat], polygon[0])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculate Haversine distance in kilometers between two coordinates
 */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Sample N equidistant coordinates along a route polyline ([lat, lng] array)
 * Useful for querying environmental data at representative intervals along roads.
 */
export function samplePointsAlongRoute(
  coordinates: [number, number][],
  sampleCount: number = 7
): { lat: number; lng: number; distanceAlongKm: number; progressRatio: number }[] {
  if (!coordinates || coordinates.length === 0) return [];
  if (coordinates.length === 1) {
    return [{ lat: coordinates[0][0], lng: coordinates[0][1], distanceAlongKm: 0, progressRatio: 0 }];
  }

  // Compute cumulative distances
  const cumDistances: number[] = [0];
  for (let i = 1; i < coordinates.length; i++) {
    const d = haversineDistanceKm(
      coordinates[i - 1][0],
      coordinates[i - 1][1],
      coordinates[i][0],
      coordinates[i][1]
    );
    cumDistances.push(cumDistances[i - 1] + d);
  }

  const totalDist = cumDistances[cumDistances.length - 1];
  if (totalDist === 0) {
    return [{ lat: coordinates[0][0], lng: coordinates[0][1], distanceAlongKm: 0, progressRatio: 0 }];
  }

  const samples: { lat: number; lng: number; distanceAlongKm: number; progressRatio: number }[] = [];

  for (let s = 0; s < sampleCount; s++) {
    const targetDist = (s / (sampleCount - 1)) * totalDist;

    // Find segment containing targetDist
    let segIndex = 0;
    while (segIndex < cumDistances.length - 1 && cumDistances[segIndex + 1] < targetDist) {
      segIndex++;
    }

    const d0 = cumDistances[segIndex];
    const d1 = cumDistances[segIndex + 1] || totalDist;
    const segLength = d1 - d0;
    const fraction = segLength > 0 ? (targetDist - d0) / segLength : 0;

    const p0 = coordinates[segIndex];
    const p1 = coordinates[Math.min(segIndex + 1, coordinates.length - 1)];

    const lat = p0[0] + (p1[0] - p0[0]) * fraction;
    const lng = p0[1] + (p1[1] - p0[1]) * fraction;

    samples.push({
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      distanceAlongKm: Number(targetDist.toFixed(1)),
      progressRatio: Number((s / (sampleCount - 1)).toFixed(2)),
    });
  }

  return samples;
}
