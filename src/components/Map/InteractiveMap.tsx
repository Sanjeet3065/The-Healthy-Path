import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import upBoundaryData from '@/lib/up-boundary.json';
import type { LocationItem } from '@/lib/geocoding';
import type { EvaluatedRoute } from '@/lib/pollution-service';
import { Maximize2, RotateCcw, Info, Layers, Map as MapIcon } from 'lucide-react';

interface InteractiveMapProps {
  origin: LocationItem | null;
  destination: LocationItem | null;
  routes: EvaluatedRoute[];
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
}

// Uttar Pradesh default center & zoom
const UP_CENTER: [number, number] = [26.8467, 80.9462]; // Lucknow / Central UP
const UP_DEFAULT_ZOOM = 7;

export default function InteractiveMap({
  origin,
  destination,
  routes,
  selectedRouteId,
  onSelectRoute,
  onMapClick,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Active Tile Layer reference
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const satelliteLabelsRef = useRef<L.TileLayer | null>(null);

  // Layer groups to update dynamically
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const samplesLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeBaseLayer, setActiveBaseLayer] = useState<'osm' | 'esri_street' | 'satellite'>('osm');
  const [showLegend, setShowLegend] = useState(false);

  // Switch base map tiles
  const switchBaseLayer = (layerType: 'osm' | 'esri_street' | 'satellite') => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }
    if (satelliteLabelsRef.current) {
      map.removeLayer(satelliteLabelsRef.current);
      satelliteLabelsRef.current = null;
    }

    let newLayer: L.TileLayer;

    if (layerType === 'osm') {
      // OpenStreetMap Standard Tiles: Complete place names (cities, towns, villages, roads, landmarks)
      newLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
    } else if (layerType === 'esri_street') {
      // Esri World Street Map: Clean navigation map with all highway numbers and city labels
      newLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap',
          maxZoom: 19,
        }
      );
    } else {
      // Esri Satellite Imagery + Hybrid Labels
      newLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
          maxZoom: 19,
        }
      );
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
      labelsLayer.addTo(map);
      satelliteLabelsRef.current = labelsLayer;
    }

    newLayer.addTo(map);
    currentTileLayerRef.current = newLayer;
    setActiveBaseLayer(layerType);
  };

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Leaflet map instance with touch and wheel optimizations
    const map = L.map(mapContainerRef.current, {
      center: UP_CENTER,
      zoom: UP_DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // Prevents mobile and trackpad scroll trap
    });

    // Default: OpenStreetMap standard with full place names, towns, roads, villages
    const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    osmLayer.addTo(map);
    currentTileLayerRef.current = osmLayer;

    // Zoom control at bottomleft to prevent collision with top mobile controls
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Create layer groups
    const boundaryLayer = L.geoJSON(upBoundaryData as any, {
      style: {
        color: '#059669',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.04,
      },
      interactive: false,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);
    const samplesGroup = L.layerGroup().addTo(map);

    boundaryLayerRef.current = boundaryLayer;
    markersLayerRef.current = markersGroup;
    routesLayerRef.current = routesGroup;
    samplesLayerRef.current = samplesGroup;
    mapInstanceRef.current = map;

    // Optional click handler
    map.on('click', (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    });

    // Auto-invalidate size on viewport or container resize
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers (Origin & Destination)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Origin Marker (Emerald Green Pin)
    if (origin) {
      const originIcon = L.divIcon({
        className: 'custom-map-pin origin-pin',
        html: `
          <div style="background-color: #059669; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(5,150,105,0.45); border: 2.5px solid #ffffff;">
            <div style="transform: rotate(45deg); color: #ffffff; font-weight: 800; font-size: 13px; line-height: 1;">A</div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });

      const m = L.marker([origin.lat, origin.lng], { icon: originIcon });
      m.bindPopup(`
        <div style="padding: 10px 14px; min-width: 170px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 0.5px;">Starting Point (Origin)</div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">${origin.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${origin.displayName}</div>
        </div>
      `);
      markersGroup.addLayer(m);
    }

    // Destination Marker (Navy/Slate Pin)
    if (destination) {
      const destIcon = L.divIcon({
        className: 'custom-map-pin dest-pin',
        html: `
          <div style="background-color: #0f172a; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(15,23,42,0.45); border: 2.5px solid #ffffff;">
            <div style="transform: rotate(45deg); color: #ffffff; font-weight: 800; font-size: 13px; line-height: 1;">B</div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -34],
      });

      const m = L.marker([destination.lat, destination.lng], { icon: destIcon });
      m.bindPopup(`
        <div style="padding: 10px 14px; min-width: 170px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Destination</div>
          <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px;">${destination.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${destination.displayName}</div>
        </div>
      `);
      markersGroup.addLayer(m);
    }
  }, [origin, destination]);

  // Update Routes & Sampled Pollution Points
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routesGroup = routesLayerRef.current;
    const samplesGroup = samplesLayerRef.current;
    if (!map || !routesGroup || !samplesGroup) return;

    routesGroup.clearLayers();
    samplesGroup.clearLayers();

    if (!routes || routes.length === 0) return;

    // Draw unselected routes first, then selected on top
    const sortedToDraw = [...routes].sort((a, b) => {
      if (a.id === selectedRouteId) return 1;
      if (b.id === selectedRouteId) return -1;
      return 0;
    });

    sortedToDraw.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      const isRecommended = route.pollution?.recommendation === 'recommended';

      // Route styling
      let strokeColor = '#64748b'; // default slate
      let strokeOpacity = 0.7;
      let strokeWeight = 4.5;

      if (isRecommended) {
        strokeColor = '#059669'; // Emerald
        strokeWeight = isSelected ? 7 : 5;
        strokeOpacity = isSelected ? 0.95 : 0.8;
      } else if (isSelected) {
        strokeColor = '#0284c7'; // Active secondary
        strokeWeight = 6.5;
        strokeOpacity = 0.95;
      }

      // Outer casing for selected route for crisp depth
      if (isSelected) {
        const casing = L.polyline(route.coordinates, {
          color: '#ffffff',
          weight: strokeWeight + 3.5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routesGroup.addLayer(casing);
      }

      const polyline = L.polyline(route.coordinates, {
        color: strokeColor,
        weight: strokeWeight,
        opacity: strokeOpacity,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.on('click', () => {
        onSelectRoute(route.id);
      });

      polyline.bindTooltip(
        `<strong>${route.name}</strong><br/>${route.distanceKm} km • ${route.durationMins} mins • Avg AQI ${route.pollution?.avgAqi ?? 'N/A'}`,
        { sticky: true }
      );

      routesGroup.addLayer(polyline);

      // Render sampled pollution dots ONLY on the active selected route
      if (isSelected && route.pollution?.sampledReadings) {
        route.pollution.sampledReadings.forEach((sample, idx) => {
          const aqi = sample.reading.aqi;

          // Color by AQI bracket
          let dotColor = '#10b981'; // Good <= 50
          if (aqi > 200) dotColor = '#9333ea'; // Severe
          else if (aqi > 150) dotColor = '#ef4444'; // Very poor
          else if (aqi > 100) dotColor = '#f97316'; // Poor
          else if (aqi > 50) dotColor = '#f59e0b'; // Moderate

          const circle = L.circleMarker([sample.lat, sample.lng], {
            radius: 6.5,
            fillColor: dotColor,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.95,
          });

          circle.bindPopup(`
            <div style="padding: 12px 14px; min-width: 200px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 11px; font-weight: 600; color: #64748b;">Sample Point #${idx + 1}</span>
                <span style="font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; background: ${dotColor}18; color: ${dotColor};">
                  ${sample.reading.category}
                </span>
              </div>
              <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">
                AQI ${aqi} <span style="font-size: 12px; font-weight: 500; color: #64748b;">(US AQI)</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 8px; background: #f8fafc; border-radius: 6px; font-size: 11px; text-align: center;">
                <div>
                  <div style="color: #64748b; font-size: 10px;">PM2.5</div>
                  <div style="font-weight: 700; color: #0f172a;">${sample.reading.pm25}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 10px;">PM10</div>
                  <div style="font-weight: 700; color: #0f172a;">${sample.reading.pm10}</div>
                </div>
                <div>
                  <div style="color: #64748b; font-size: 10px;">NO2</div>
                  <div style="font-weight: 700; color: #0f172a;">${sample.reading.no2}</div>
                </div>
              </div>
              <div style="font-size: 10px; color: #94a3b8; margin-top: 8px; text-align: right;">
                Source: ${sample.reading.source} • ${sample.reading.timestamp}
              </div>
            </div>
          `);

          samplesGroup.addLayer(circle);
        });
      }
    });

    // Auto-fit bounds to the selected route or all routes
    const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    if (activeRoute && activeRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds(activeRoute.coordinates);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
    }
  }, [routes, selectedRouteId]);

  // Reset to full Uttar Pradesh view
  const handleResetToUP = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(UP_CENTER, UP_DEFAULT_ZOOM, { animate: true });
  };

  // Re-fit current route
  const handleFitRoute = () => {
    if (!mapInstanceRef.current || !routes || routes.length === 0) return;
    const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    if (activeRoute && activeRoute.coordinates.length > 0) {
      const bounds = L.latLngBounds(activeRoute.coordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
    }
  };

  return (
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-soft transition-colors duration-200">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Indicator (Top Left) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-[400] flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-[10px] sm:text-[11px] font-semibold text-slate-800 dark:text-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500 animate-pulse" />
        <span>Uttar Pradesh</span>
      </div>

      {/* Floating Map Controls & Layer Switcher (Top Right) */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-[400] flex items-center gap-1 sm:gap-1.5">
        <div className="flex items-center rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-xs p-0.5 text-[11px] sm:text-xs">
          <button
            onClick={() => switchBaseLayer('osm')}
            className={`px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeBaseLayer === 'osm'
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Street<span className="hidden sm:inline"> Map</span>
          </button>
          <button
            onClick={() => switchBaseLayer('satellite')}
            className={`px-2 sm:px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeBaseLayer === 'satellite'
                ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sat<span className="hidden sm:inline">ellite</span>
          </button>
        </div>

        <button
          onClick={handleFitRoute}
          disabled={routes.length === 0}
          title="Fit Route Bounds"
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
        >
          <Maximize2 className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
          <span className="hidden md:inline">Fit</span>
        </button>

        <button
          onClick={handleResetToUP}
          title="Reset to UP View"
          className="p-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Responsive Floating Map Legend (Bottom Right) */}
      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-[400] text-xs">
        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          className="sm:hidden px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-xs text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
        >
          <Info className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <span>Legend</span>
        </button>

        {/* Legend Box: Always visible on tablet/desktop, toggleable on phone */}
        <div
          className={`${
            showLegend ? 'block' : 'hidden'
          } sm:block mt-1 sm:mt-0 p-2.5 sm:p-3 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-soft text-slate-700 dark:text-slate-300 max-w-[200px] sm:max-w-[220px] transition-all`}
        >
          <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] sm:text-xs">Map Legend</span>
            </div>
            <button
              onClick={() => setShowLegend(false)}
              className="sm:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px]"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded-full bg-emerald-600 dark:bg-emerald-500 shrink-0" />
              <span>Cleanest Route</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 rounded-full bg-slate-500 shrink-0" />
              <span>Alternative Path</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400">Sampled AQI Dots</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
