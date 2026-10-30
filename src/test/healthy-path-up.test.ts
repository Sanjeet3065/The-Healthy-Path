import { describe, it, expect } from 'vitest';
import { isInsideUttarPradesh, haversineDistanceKm, samplePointsAlongRoute } from '@/lib/geo';
import { UP_DISTRICTS, searchUPDistricts } from '@/lib/up-districts';
import { getAqiCategory, evaluateRoutesPollution } from '@/lib/pollution-service';
import type { RouteOption } from '@/lib/routing';

describe('Uttar Pradesh Geographic Boundary Validation', () => {
  it('should verify cities within Uttar Pradesh as true', () => {
    // Lucknow
    expect(isInsideUttarPradesh(80.9462, 26.8467)).toBe(true);
    // Kanpur
    expect(isInsideUttarPradesh(80.3319, 26.4499)).toBe(true);
    // Varanasi
    expect(isInsideUttarPradesh(82.9739, 25.3176)).toBe(true);
    // Noida / Gautam Buddha Nagar
    expect(isInsideUttarPradesh(77.391, 28.5355)).toBe(true);
    // Gorakhpur
    expect(isInsideUttarPradesh(83.3732, 26.7606)).toBe(true);
    // Jhansi (Bundelkhand)
    expect(isInsideUttarPradesh(78.5685, 25.4484)).toBe(true);
    // Bareilly (Rohilkhand)
    expect(isInsideUttarPradesh(79.4304, 28.367)).toBe(true);
  });

  it('should reject coordinates outside Uttar Pradesh boundary as false', () => {
    // New Delhi
    expect(isInsideUttarPradesh(77.209, 28.6139)).toBe(false);
    // Patna (Bihar)
    expect(isInsideUttarPradesh(85.1376, 25.5941)).toBe(false);
    // Jaipur (Rajasthan)
    expect(isInsideUttarPradesh(75.7873, 26.9124)).toBe(false);
    // Bhopal (Madhya Pradesh)
    expect(isInsideUttarPradesh(77.4126, 23.2599)).toBe(false);
    // Mumbai (Maharashtra)
    expect(isInsideUttarPradesh(72.8777, 19.076)).toBe(false);
  });
});

describe('Uttar Pradesh Districts Directory', () => {
  it('should contain all 75 districts of Uttar Pradesh', () => {
    expect(UP_DISTRICTS.length).toBe(75);
  });

  it('should find districts matching search query', () => {
    const kanpurMatches = searchUPDistricts('Kanpur');
    expect(kanpurMatches.length).toBeGreaterThanOrEqual(2); // Kanpur Nagar & Kanpur Dehat
    expect(kanpurMatches.some((d) => d.name === 'Kanpur')).toBe(true);

    const lucknowMatches = searchUPDistricts('Lucknow');
    expect(lucknowMatches.length).toBeGreaterThanOrEqual(1);
    expect(lucknowMatches[0].name).toBe('Lucknow');

    const ayodhyaMatches = searchUPDistricts('Ayodhya');
    expect(ayodhyaMatches.length).toBeGreaterThanOrEqual(1);
    expect(ayodhyaMatches[0].name).toBe('Ayodhya');
  });

  it('should find districts by prominent town or tehsil', () => {
    const akbarpurMatches = searchUPDistricts('Akbarpur');
    expect(akbarpurMatches.length).toBeGreaterThan(0);
  });
});

describe('Route Coordinate Sampling & Distance Calculation', () => {
  it('should calculate accurate Haversine distances', () => {
    // Lucknow to Kanpur ~77-80 km direct distance
    const dist = haversineDistanceKm(26.8467, 80.9462, 26.4499, 80.3319);
    expect(dist).toBeGreaterThan(70);
    expect(dist).toBeLessThan(90);
  });

  it('should sample equidistant points along a route geometry', () => {
    const dummyPath: [number, number][] = [
      [26.8467, 80.9462],
      [26.74, 80.8],
      [26.6, 80.6],
      [26.4499, 80.3319],
    ];

    const samples = samplePointsAlongRoute(dummyPath, 5);
    expect(samples.length).toBe(5);
    expect(samples[0].progressRatio).toBe(0);
    expect(samples[samples.length - 1].progressRatio).toBe(1);
  });
});

describe('National Air Quality Index (NAQI) Brackets', () => {
  it('should accurately categorize AQI according to Indian standards', () => {
    expect(getAqiCategory(35)).toBe('Good');
    expect(getAqiCategory(50)).toBe('Good');
    expect(getAqiCategory(75)).toBe('Satisfactory');
    expect(getAqiCategory(100)).toBe('Satisfactory');
    expect(getAqiCategory(150)).toBe('Moderate');
    expect(getAqiCategory(200)).toBe('Moderate');
    expect(getAqiCategory(250)).toBe('Poor');
    expect(getAqiCategory(350)).toBe('Very Poor');
    expect(getAqiCategory(450)).toBe('Severe');
  });
});

describe('Pollution Evaluation & Recommendation Engine', () => {
  it('should evaluate and rank routes by cumulative exposure', async () => {
    const testRoutes: RouteOption[] = [
      {
        id: 'route-clean',
        name: 'Green Expressway Path',
        summary: 'Via Expressway Corridor',
        distanceKm: 85,
        durationMins: 60,
        coordinates: [
          [26.8467, 80.9462],
          [26.6, 80.6],
          [26.4499, 80.3319],
        ],
        sampledPoints: [
          { lat: 26.8467, lng: 80.9462, distanceAlongKm: 0, progressRatio: 0 },
          { lat: 26.6, lng: 80.6, distanceAlongKm: 42, progressRatio: 0.5 },
          { lat: 26.4499, lng: 80.3319, distanceAlongKm: 85, progressRatio: 1 },
        ],
        highwayNames: ['Expressway'],
      },
      {
        id: 'route-congested',
        name: 'Congested Arterial Path',
        summary: 'Via Old GT Road',
        distanceKm: 80,
        durationMins: 110, // Longer exposure duration!
        coordinates: [
          [26.8467, 80.9462],
          [26.55, 80.7],
          [26.4499, 80.3319],
        ],
        sampledPoints: [
          { lat: 26.8467, lng: 80.9462, distanceAlongKm: 0, progressRatio: 0 },
          { lat: 26.55, lng: 80.7, distanceAlongKm: 40, progressRatio: 0.5 },
          { lat: 26.4499, lng: 80.3319, distanceAlongKm: 80, progressRatio: 1 },
        ],
        highwayNames: ['GT Road'],
      },
    ];

    const results = await evaluateRoutesPollution(testRoutes);
    expect(results.length).toBe(2);

    // One route must be recommended
    const recommended = results.find((r) => r.pollution.recommendation === 'recommended');
    expect(recommended).toBeDefined();

    // Health score must be valid 0-100
    expect(results[0].pollution.healthScore).toBeGreaterThanOrEqual(0);
    expect(results[0].pollution.healthScore).toBeLessThanOrEqual(100);

    // Cumulative exposure index must be calculated
    expect(results[0].pollution.cumulativeExposureIndex).toBeGreaterThan(0);
    expect(results[0].pollution.recommendationReason.length).toBeGreaterThan(10);
  }, 15000);
});
