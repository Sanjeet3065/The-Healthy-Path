import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RouteInsightsPanel from '../components/RouteComparison/RouteInsightsPanel';
import type { EvaluatedRoute } from '../lib/pollution-service';

const mockRoute: EvaluatedRoute = {
  id: 'route-test-1',
  name: 'Via Test Highway',
  summary: 'Cleanest test highway',
  distanceKm: 95.5,
  durationMins: 90,
  coordinates: [[26.8, 80.9], [26.4, 80.3]],
  geometry: {
    type: 'LineString',
    coordinates: [[80.9, 26.8], [80.3, 26.4]],
  },
  sampledPoints: [],
  pollution: {
    sampledReadings: [
      {
        lat: 26.84,
        lng: 80.94,
        distanceAlongKm: 0,
        reading: {
          lat: 26.84,
          lng: 80.94,
          pm25: 42.1,
          pm10: 80.0,
          no2: 20.0,
          aqi: 65,
          category: 'Satisfactory',
          timestamp: '2026-10-30T10:00:00Z',
          source: 'cams',
        },
      },
      {
        lat: 26.44,
        lng: 80.33,
        distanceAlongKm: 95.5,
        reading: {
          lat: 26.44,
          lng: 80.33,
          pm25: 55.4,
          pm10: 105.0,
          no2: 28.0,
          aqi: 95,
          category: 'Satisfactory',
          timestamp: '2026-10-30T10:00:00Z',
          source: 'cams',
        },
      },
    ],
    avgAqi: 80,
    avgPm25: 48.7,
    avgPm10: 92.5,
    avgNo2: 24.0,
    peakAqi: 95,
    peakPm25: 55.4,
    cumulativeExposureIndex: 120,
    healthScore: 78,
    recommendation: 'recommended',
    recommendationReason: 'Lowest estimated exposure across UP corridor.',
    travelModeAdvice: 'Cabin air filter recommended.',
    confidenceLevel: 'copernicus_live',
    dataTimestamp: '2026-10-30T10:00:00Z',
  },
};

describe('RouteInsightsPanel', () => {
  it('renders commuter advisory tab by default', () => {
    render(
      <RouteInsightsPanel
        selectedRoute={mockRoute}
        routes={[mockRoute]}
        travelMode="car"
        corridorAtmosphere={null}
        originName="Lucknow"
        destinationName="Kanpur"
      />
    );

    expect(screen.getByText('Route Environmental & Health Insights')).toBeInTheDocument();
    expect(screen.getByText(/Health Score 78\/100/i)).toBeInTheDocument();
    expect(screen.getByText(/Cabin Recirculation ON/i)).toBeInTheDocument();
  });

  it('switches between tabs cleanly', () => {
    render(
      <RouteInsightsPanel
        selectedRoute={mockRoute}
        routes={[mockRoute]}
        travelMode="bike"
        corridorAtmosphere={null}
        originName="Lucknow"
        destinationName="Kanpur"
      />
    );

    // Click Waypoints tab
    const waypointsTab = screen.getByRole('button', { name: /Waypoints/i });
    fireEvent.click(waypointsTab);
    expect(screen.getByText(/Sampled Points along Corridor/i)).toBeInTheDocument();

    // Click Emergency tab
    const emergencyTab = screen.getByRole('button', { name: /Emergency & Helplines/i });
    fireEvent.click(emergencyTab);
    expect(screen.getByText(/Ambulance 108/i)).toBeInTheDocument();
    expect(screen.getByText(/Police & Highway 112/i)).toBeInTheDocument();
  });
});
