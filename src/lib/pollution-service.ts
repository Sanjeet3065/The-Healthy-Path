import type { RouteOption, SampledPoint } from './routing';

export type TravelMode = 'car' | 'bike' | 'bicycle';

export interface CorridorWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  ventilationStatus: 'Good Dispersal' | 'Moderate Ventilation' | 'Stagnant Smog Trap';
  ventilationNote: string;
}

export interface PollutionReading {
  lat: number;
  lng: number;
  pm25: number; // μg/m³
  pm10: number; // μg/m³
  no2: number; // μg/m³
  aqi: number;
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  timestamp: string;
  source: string;
}

export interface RoutePollutionAnalysis {
  sampledReadings: {
    lat: number;
    lng: number;
    reading: PollutionReading;
    distanceAlongKm: number;
  }[];
  avgAqi: number;
  avgPm25: number;
  avgPm10: number;
  avgNo2: number;
  peakAqi: number;
  peakPm25: number;
  cumulativeExposureIndex: number; // Integrated exposure = (Avg AQI * hours * modeMultiplier)
  healthScore: number; // 0-100 (higher is cleaner & safer)
  recommendation: 'recommended' | 'moderate' | 'high_exposure';
  recommendationReason: string;
  travelModeAdvice: string;
  confidenceLevel: 'copernicus_live' | 'sensor_model_hybrid' | 'regional_baseline';
  dataTimestamp: string;
}

export interface EvaluatedRoute extends RouteOption {
  pollution: RoutePollutionAnalysis;
}

// Indian NAQI / CPCB standard classification
export function getAqiCategory(aqi: number): PollutionReading['category'] {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

export function getCategoryBadgeClass(category: PollutionReading['category']): string {
  switch (category) {
    case 'Good':
      return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    case 'Satisfactory':
      return 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/60';
    case 'Moderate':
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    case 'Poor':
      return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60';
    case 'Very Poor':
      return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/60';
    case 'Severe':
      return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
  }
}

// Cache for pollution queries by coordinate grid (10 min TTL)
const pollutionCache = new Map<string, { reading: PollutionReading; time: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

async function fetchWithTimeout(url: string, timeoutMs = 4500): Promise<Response> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const isSignal = controller?.signal && typeof (controller.signal as any).aborted === 'boolean';
    return await fetch(url, isSignal && controller.signal instanceof Object ? { signal: controller.signal as any } : undefined);
  } catch (e) {
    throw e;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Batched retrieval of air quality readings along routes using Open-Meteo Air Quality API
 * (Copernicus Atmosphere Monitoring Service - CAMS European & Global Reanalysis).
 */
export async function evaluateRoutesPollution(
  routes: RouteOption[],
  travelMode: TravelMode = 'car'
): Promise<EvaluatedRoute[]> {
  if (!routes || routes.length === 0) return [];

  // 1. Gather all sampled points from all routes
  const allPoints: { lat: number; lng: number }[] = [];
  routes.forEach((r) => {
    r.sampledPoints.forEach((p) => {
      allPoints.push({ lat: p.lat, lng: p.lng });
    });
  });

  const readingsMap = new Map<string, PollutionReading>();
  const pointsToFetch: { lat: number; lng: number; key: string }[] = [];

  const now = Date.now();
  for (const pt of allPoints) {
    const key = `${pt.lat.toFixed(3)},${pt.lng.toFixed(3)}`;
    const cached = pollutionCache.get(key);
    if (cached && now - cached.time < CACHE_TTL_MS) {
      readingsMap.set(key, cached.reading);
    } else {
      pointsToFetch.push({ lat: pt.lat, lng: pt.lng, key });
    }
  }

  // 2. Fetch fresh readings from Open-Meteo in batched call if any
  let confidence: RoutePollutionAnalysis['confidenceLevel'] = 'copernicus_live';
  let fetchedTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (pointsToFetch.length > 0) {
    try {
      const lats = pointsToFetch.map((p) => p.lat).join(',');
      const lngs = pointsToFetch.map((p) => p.lng).join(',');
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=pm10,pm2_5,nitrogen_dioxide,us_aqi`;

      const resp = await fetchWithTimeout(url, 4500);
      if (resp.ok) {
        const data = await resp.json();
        const resultsArray = Array.isArray(data) ? data : [data];

        resultsArray.forEach((item: any, idx: number) => {
          const reqPt = pointsToFetch[idx];
          if (!reqPt) return;

          const current = item.current || {};
          const pm25 = Number((current.pm2_5 ?? 28).toFixed(1));
          const pm10 = Number((current.pm10 ?? 45).toFixed(1));
          const no2 = Number((current.nitrogen_dioxide ?? 15).toFixed(1));
          const aqi = Math.round(current.us_aqi ?? Math.max(pm25 * 2.2, 40));

          if (current.time) {
            fetchedTimeStr = new Date(current.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          }

          const reading: PollutionReading = {
            lat: reqPt.lat,
            lng: reqPt.lng,
            pm25,
            pm10,
            no2,
            aqi,
            category: getAqiCategory(aqi),
            timestamp: fetchedTimeStr,
            source: 'Copernicus CAMS & Open-Meteo Reanalysis',
          };

          pollutionCache.set(reqPt.key, { reading, time: now });
          readingsMap.set(reqPt.key, reading);
        });
      }
    } catch (err) {
      console.warn('Live pollution API error, using regional baseline fallback:', err);
      confidence = 'regional_baseline';
    }
  }

  // Mode exposure factors
  // Car: closed cabin + filter ~0.8
  // Two-wheeler: direct unshielded exposure ~1.25
  // Cycle: elevated breathing rate ~1.45
  const modeMultiplier = travelMode === 'bike' ? 1.25 : travelMode === 'bicycle' ? 1.45 : 0.8;

  const modeAdvice =
    travelMode === 'bike'
      ? '🛵 Two-Wheeler transit: Direct respiratory exposure to road exhaust. Wear an N95 anti-pollution mask.'
      : travelMode === 'bicycle'
      ? '🚴 Bicycle transit: High ventilation rate increases inhaled volume; green bypass corridors strongly advised.'
      : '🚗 Car transit: Cabin filter provides ~20-30% attenuation if windows remain closed in traffic.';

  // 3. Analyze each route with its sampled points
  const analyzedRoutes = routes.map((route) => {
    const sampledReadings: {
      lat: number;
      lng: number;
      reading: PollutionReading;
      distanceAlongKm: number;
    }[] = [];

    let totalAqi = 0;
    let totalPm25 = 0;
    let totalPm10 = 0;
    let totalNo2 = 0;
    let peakAqi = 0;
    let peakPm25 = 0;

    route.sampledPoints.forEach((pt, idx) => {
      const key = `${pt.lat.toFixed(3)},${pt.lng.toFixed(3)}`;
      let reading = readingsMap.get(key);

      if (!reading) {
        // Fallback baseline for UP corridor (modelling rural/highway vs urban)
        const isMiddle = idx > 1 && idx < route.sampledPoints.length - 2;
        const baseAqi = isMiddle ? 65 : 85;
        reading = {
          lat: pt.lat,
          lng: pt.lng,
          pm25: isMiddle ? 22 : 32,
          pm10: isMiddle ? 40 : 58,
          no2: isMiddle ? 12 : 22,
          aqi: baseAqi,
          category: getAqiCategory(baseAqi),
          timestamp: fetchedTimeStr,
          source: 'CPCB Seasonal Baseline Model',
        };
      }

      sampledReadings.push({
        lat: pt.lat,
        lng: pt.lng,
        reading,
        distanceAlongKm: pt.distanceAlongKm,
      });

      totalAqi += reading.aqi;
      totalPm25 += reading.pm25;
      totalPm10 += reading.pm10;
      totalNo2 += reading.no2;

      if (reading.aqi > peakAqi) peakAqi = reading.aqi;
      if (reading.pm25 > peakPm25) peakPm25 = reading.pm25;
    });

    const count = Math.max(1, sampledReadings.length);
    const avgAqi = Math.round(totalAqi / count);
    const avgPm25 = Number((totalPm25 / count).toFixed(1));
    const avgPm10 = Number((totalPm10 / count).toFixed(1));
    const avgNo2 = Number((totalNo2 / count).toFixed(1));

    // Cumulative exposure: concentration * time spent (in hours) * mode factor
    const hours = route.durationMins / 60;
    const cumulativeExposureIndex = Number((avgAqi * hours * modeMultiplier).toFixed(1));

    // Health Score: 0 to 100 scale.
    const rawHealth = 100 - (avgAqi * 0.35 + cumulativeExposureIndex * 0.18 + avgPm25 * 0.4);
    const healthScore = Math.max(12, Math.min(97, Math.round(rawHealth)));

    const pollution: RoutePollutionAnalysis = {
      sampledReadings,
      avgAqi,
      avgPm25,
      avgPm10,
      avgNo2,
      peakAqi,
      peakPm25,
      cumulativeExposureIndex,
      healthScore,
      recommendation: 'moderate',
      recommendationReason: '',
      travelModeAdvice: modeAdvice,
      confidenceLevel: confidence,
      dataTimestamp: fetchedTimeStr,
    };

    return {
      ...route,
      pollution,
    };
  });

  // 4. Rank and generate transparent recommendations
  // Sort by cumulative exposure (lowest exposure = best health choice)
  const sorted = [...analyzedRoutes].sort(
    (a, b) => a.pollution.cumulativeExposureIndex - b.pollution.cumulativeExposureIndex
  );

  const bestExposure = sorted[0].pollution.cumulativeExposureIndex;

  analyzedRoutes.forEach((route) => {
    const isBest = route.id === sorted[0].id;
    const diffPct =
      bestExposure > 0
        ? Math.round(((route.pollution.cumulativeExposureIndex - bestExposure) / bestExposure) * 100)
        : 0;

    if (isBest) {
      route.pollution.recommendation = 'recommended';
      if (sorted.length > 1 && diffPct === 0 && sorted[1].pollution.cumulativeExposureIndex > bestExposure) {
        const altDiff = Math.round(
          ((sorted[1].pollution.cumulativeExposureIndex - bestExposure) / bestExposure) * 100
        );
        route.pollution.recommendationReason = `Lowest estimated pollution exposure (${altDiff}% lower particulate intake than alternative route). Optimal balance of cleaner air corridor and travel duration.`;
      } else {
        route.pollution.recommendationReason =
          'Lowest estimated cumulative particulate inhalation. Recommended for minimizing respiratory exposure during transit.';
      }
    } else if (diffPct > 25) {
      route.pollution.recommendation = 'high_exposure';
      route.pollution.recommendationReason = `Estimated +${diffPct}% higher cumulative particulate inhalation compared to recommended route due to elevated ambient AQI and travel duration.`;
    } else {
      route.pollution.recommendation = 'moderate';
      route.pollution.recommendationReason = `Moderate pollution exposure (+${diffPct}% vs recommended path). Viable alternate if primary route experiences localized traffic delays.`;
    }
  });

  return analyzedRoutes;
}

/**
 * Live air quality monitor across major Uttar Pradesh regions
 */
export interface CityAqiSnapshot {
  cityName: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  category: PollutionReading['category'];
  updatedTime: string;
}

export async function fetchStatewideAqiSnapshots(): Promise<CityAqiSnapshot[]> {
  const keyCities = [
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Prayagraj', lat: 25.4358, lng: 81.8463 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910 },
    { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732 },
    { name: 'Bareilly', lat: 28.3670, lng: 79.4304 },
    { name: 'Meerut', lat: 28.9845, lng: 77.7064 },
    { name: 'Ayodhya', lat: 26.7922, lng: 82.1998 },
    { name: 'Jhansi', lat: 25.4484, lng: 78.5685 },
    { name: 'Moradabad', lat: 28.8386, lng: 78.7733 },
  ];

  try {
    const lats = keyCities.map((c) => c.lat).join(',');
    const lngs = keyCities.map((c) => c.lng).join(',');
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lngs}&current=pm10,pm2_5,nitrogen_dioxide,us_aqi`;

    const resp = await fetchWithTimeout(url, 4500);
    if (resp.ok) {
      const data = await resp.json();
      const arr = Array.isArray(data) ? data : [data];

      return arr.map((item: any, idx: number) => {
        const city = keyCities[idx];
        const current = item.current || {};
        const pm25 = Number((current.pm2_5 ?? 30).toFixed(1));
        const pm10 = Number((current.pm10 ?? 50).toFixed(1));
        const no2 = Number((current.nitrogen_dioxide ?? 15).toFixed(1));
        const aqi = Math.round(current.us_aqi ?? Math.max(pm25 * 2.2, 45));
        const updatedTime = current.time
          ? new Date(current.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          : 'Live';

        return {
          cityName: city.name,
          lat: city.lat,
          lng: city.lng,
          aqi,
          pm25,
          pm10,
          no2,
          category: getAqiCategory(aqi),
          updatedTime,
        };
      });
    }
  } catch (err) {
    console.warn('City AQI snapshot fallback:', err);
  }

  // Fallback defaults if offline
  return keyCities.map((c) => ({
    cityName: c.name,
    lat: c.lat,
    lng: c.lng,
    aqi: 68,
    pm25: 24.5,
    pm10: 48.0,
    no2: 14.2,
    category: 'Satisfactory',
    updatedTime: 'Historical baseline',
  }));
}

/**
 * Fetches corridor atmospheric and wind dispersal conditions for the route
 */
export async function fetchCorridorAtmosphere(lat: number, lng: number): Promise<CorridorWeather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      const cur = data.current || {};
      const temp = Number((cur.temperature_2m ?? 24).toFixed(1));
      const humidity = Math.round(cur.relative_humidity_2m ?? 65);
      const windSpeed = Number((cur.wind_speed_10m ?? 12).toFixed(1));
      const windDir = Math.round(cur.wind_direction_10m ?? 80);

      let status: CorridorWeather['ventilationStatus'] = 'Moderate Ventilation';
      let note = 'Moderate atmospheric ventilation along transit corridor.';

      if (windSpeed >= 12) {
        status = 'Good Dispersal';
        note = 'Active wind speed is aiding rapid dispersion of vehicular particulate plumes.';
      } else if (windSpeed <= 6) {
        status = 'Stagnant Smog Trap';
        note = 'Low wind speed is trapping road-level emissions; higher ground-level particulate concentration.';
      }

      return {
        temperature: temp,
        humidity,
        windSpeed,
        windDirection: windDir,
        ventilationStatus: status,
        ventilationNote: note,
      };
    }
  } catch (e) {
    console.warn('Corridor weather notice:', e);
  }

  return {
    temperature: 24.5,
    humidity: 68,
    windSpeed: 11.2,
    windDirection: 75,
    ventilationStatus: 'Moderate Ventilation',
    ventilationNote: 'Normal atmospheric air dispersal along highway corridor.',
  };
}
