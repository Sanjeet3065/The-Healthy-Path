import { isInsideUttarPradesh } from './geo';
import { UP_DISTRICTS, searchUPDistricts } from './up-districts';

export interface LocationItem {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  district?: string;
  state?: string;
  country?: string;
  type: 'district' | 'city' | 'town' | 'village' | 'landmark' | 'locality';
  isWithinUP: boolean;
  warningNote?: string;
}

// In-memory cache for fast repeat searches
const geocodeCache = new Map<string, LocationItem[]>();

/**
 * Searches for any geographic location across Uttar Pradesh:
 * - 75 Districts & administrative centers (instant match)
 * - Towns, kasbas, villages, tehsils, landmarks, railway stations, roads via Photon (OSM)
 * - Fallback to Nominatim OSM if required
 * - Strict verification against official Uttar Pradesh state boundary polygon
 */
export async function searchLocationsAcrossUP(query: string): Promise<LocationItem[]> {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = trimmed.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  const results: LocationItem[] = [];
  const seenCoords = new Set<string>();

  // 1. Check instant local index of UP districts & prominent places first
  const districtMatches = searchUPDistricts(trimmed);
  for (const dist of districtMatches.slice(0, 3)) {
    const key = `${dist.lat.toFixed(3)},${dist.lng.toFixed(3)}`;
    if (!seenCoords.has(key)) {
      seenCoords.add(key);
      results.push({
        id: `dist-${dist.id}`,
        name: dist.name,
        displayName: `${dist.name}, ${dist.division} Division, Uttar Pradesh`,
        lat: dist.lat,
        lng: dist.lng,
        district: dist.name,
        state: 'Uttar Pradesh',
        country: 'India',
        type: 'district',
        isWithinUP: true,
      });
    }
  }

  // 2. Query Photon Geocoder (OSM-based, high performance, UP bounding box)
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&bbox=77.08,23.87,84.63,30.41&lang=en&limit=8`;
    const resp = await fetch(photonUrl, {
      headers: { Accept: 'application/json' },
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data && Array.isArray(data.features)) {
        for (const feat of data.features) {
          const props = feat.properties || {};
          const geom = feat.geometry || {};
          const coords = geom.coordinates; // [lng, lat]
          if (!coords || coords.length < 2) continue;

          const lng = Number(coords[0]);
          const lat = Number(coords[1]);
          const coordKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;

          if (seenCoords.has(coordKey)) continue;
          seenCoords.add(coordKey);

          // Verify with actual UP boundary polygon
          const inUP = isInsideUttarPradesh(lng, lat);
          const stateName = props.state || (inUP ? 'Uttar Pradesh' : 'Unknown State');

          let locType: LocationItem['type'] = 'town';
          if (props.osm_key === 'railway' || props.osm_value === 'station') locType = 'landmark';
          else if (props.osm_value === 'village') locType = 'village';
          else if (props.osm_value === 'city' || props.type === 'city') locType = 'city';
          else if (props.osm_value === 'suburb' || props.osm_value === 'neighbourhood') locType = 'locality';
          else if (props.type === 'district') locType = 'district';

          const title = props.name || trimmed;
          const county = props.county || props.district || props.city || '';
          const addressParts = [
            county && county !== title ? county : null,
            stateName,
          ].filter(Boolean);

          const displayName = `${title}, ${addressParts.join(', ')}`;

          results.push({
            id: `photon-${props.osm_id || Math.random().toString(36).substr(2, 9)}`,
            name: title,
            displayName,
            lat,
            lng,
            district: props.county || props.district,
            state: stateName,
            country: props.country || 'India',
            type: locType,
            isWithinUP: inUP,
            warningNote: !inUP ? `Location is in ${stateName}. The Healthy Path focuses on Uttar Pradesh.` : undefined,
          });
        }
      }
    }
  } catch (err) {
    console.warn('Photon geocoding network notice:', err);
  }

  // 3. Fallback to OpenStreetMap Nominatim if fewer than 2 results found
  if (results.length < 2) {
    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        trimmed + ', Uttar Pradesh'
      )}&format=json&addressdetails=1&countrycodes=in&viewbox=77.08,30.41,84.63,23.87&limit=5`;

      const resp = await fetch(nominatimUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TheHealthyPath-UP/2.0',
        },
      });

      if (resp.ok) {
        const items = await resp.json();
        if (Array.isArray(items)) {
          for (const item of items) {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            const coordKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
            if (seenCoords.has(coordKey)) continue;
            seenCoords.add(coordKey);

            const inUP = isInsideUttarPradesh(lng, lat);
            const addr = item.address || {};
            const title = item.name || addr.city || addr.town || addr.village || trimmed;
            const district = addr.state_district || addr.county || addr.city;
            const state = addr.state || 'Uttar Pradesh';

            results.push({
              id: `nom-${item.osm_id || Math.random().toString(36).substr(2, 9)}`,
              name: title,
              displayName: item.display_name,
              lat,
              lng,
              district,
              state,
              country: addr.country || 'India',
              type: item.type === 'village' ? 'village' : item.type === 'city' ? 'city' : 'town',
              isWithinUP: inUP,
              warningNote: !inUP ? `Coordinates fall outside UP boundary.` : undefined,
            });
          }
        }
      }
    } catch (nomErr) {
      console.warn('Nominatim fallback notice:', nomErr);
    }
  }

  // Cache results for 5 minutes
  geocodeCache.set(cacheKey, results);
  return results;
}

/**
 * Reverse geocode a latitude & longitude back to a readable location name
 */
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<LocationItem | null> {
  const inUP = isInsideUttarPradesh(lng, lat);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const resp = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'TheHealthyPath-UP/2.0',
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      const addr = data.address || {};
      const name = addr.road || addr.suburb || addr.village || addr.town || addr.city || 'Pinpoint Location';
      const district = addr.state_district || addr.county || addr.city;
      const state = addr.state || (inUP ? 'Uttar Pradesh' : 'Unknown');

      return {
        id: `rev-${Date.now()}`,
        name,
        displayName: data.display_name || `${name}, ${state}`,
        lat,
        lng,
        district,
        state,
        country: addr.country || 'India',
        type: 'landmark',
        isWithinUP: inUP,
        warningNote: !inUP ? `Selected point is outside Uttar Pradesh state boundary.` : undefined,
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback:', e);
  }

  return {
    id: `rev-${Date.now()}`,
    name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    displayName: `${lat.toFixed(4)}, ${lng.toFixed(4)} (Uttar Pradesh)`,
    lat,
    lng,
    type: 'landmark',
    isWithinUP: inUP,
    warningNote: !inUP ? `Coordinates are outside Uttar Pradesh.` : undefined,
  };
}
