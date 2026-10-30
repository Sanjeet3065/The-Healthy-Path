# 🌿 The Healthy Path (Uttar Pradesh 2.0)

<p align="center">
  <strong>Statewide Low-Pollution Route Navigation & Environmental Intelligence for Uttar Pradesh</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Statewide%20Coverage-75%20Districts%20of%20UP-059669?style=for-the-badge" alt="75 Districts of Uttar Pradesh" />
  <img src="https://img.shields.io/badge/Routing-OSRM%20Alternatives-0284c7?style=for-the-badge" alt="OSRM Routing Engine" />
  <img src="https://img.shields.io/badge/Air%20Quality-Copernicus%20CAMS%20%26%20Open--Meteo-0f766e?style=for-the-badge" alt="Copernicus Atmospheric Reanalysis" />
</p>

---

## 🎯 Overview

Most navigation applications optimize exclusively for travel time or distance. In heavily industrialized or traffic-congested regions, the fastest route is frequently the most hazardous to human respiratory health, funneling commuters directly through dense particulate plumes, construction dust, and freight diesel emissions.

**The Healthy Path** transforms travel planning across **all 75 districts, cities, towns, and villages of Uttar Pradesh**. It compares multiple road routes between any two locations in the state, samples atmospheric air quality point-by-point along available corridors, and recommends the path with the **lowest estimated cumulative pollution exposure**.

---

## 🚀 Key Upgrades in Version 2.0

### 1. Complete Uttar Pradesh Statewide Search Coverage
- **Dynamic Geocoding**: Search any district, city, kasba, rural village, neighborhood, railway station, or landmark across UP.
- **75 UP Districts Instant Index**: Zero-latency autocomplete for all 75 Uttar Pradesh administrative districts and tehsils.
- **Official State Boundary Validation**: Integrated GeoJSON MultiPolygon boundary with a ray-casting point-in-polygon verification algorithm. Locations outside Uttar Pradesh are clearly flagged with friendly explanations.

### 2. Multi-Route Generation Engine
- **Real Road Geometries**: Powered by OpenStreetMap and OSRM (Open Source Routing Machine).
- **Alternative Corridors**: Evaluates multiple alternative driving paths (e.g., Expressways vs. National Highways vs. Regional Bypasses).
- **Accurate Distance & Duration**: Preserves actual road winding, highway legs, and driving duration.

### 3. Scientific Inhalation Exposure Scoring
- **Point-by-Point Sampling**: Samples coordinates at regular intervals along each route geometry rather than assuming uniform air quality across hundreds of kilometers.
- **Atmospheric Data**: Real-time atmospheric reanalysis (PM2.5, PM10, NO2, US AQI, EAQI) powered by Copernicus Atmosphere Monitoring Service (CAMS) & Open-Meteo.
- **Cumulative Inhalation Dose Model**:
  $$\text{Cumulative Exposure Index} = \text{Average AQI} \times \left(\frac{\text{Duration in Minutes}}{60}\right)$$
- **Health Score (0–100)**: Transparent score penalizing high particulate concentration and prolonged travel exposure.
- **Transparent Rationale**: Every recommendation clearly explains *why* a route is recommended over alternatives without fabricated percentages or fake live hardware claims.

### 4. Interactive Map Experience
- **CartoDB Positron Basemap**: Clean, high-performance light aesthetic tailored for environmental intelligence.
- **Uttar Pradesh State Outline**: Subtle emerald dashed boundary overlay indicating the active geographic scope.
- **Custom Map Markers**: Clear green start pin (A) and dark destination marker (B).
- **Active Route Polylines**: Distinct, accessible styling highlighting the recommended path in emerald and alternatives in slate/sky blue.
- **Interactive AQI Waypoint Dots**: Clickable sampled pollution markers along the route displaying localized PM2.5, PM10, NO2, AQI, and data timestamps.

### 5. Statewide Live AQI Monitor & Guides
- **Live Regional Snapshot**: Real-time air quality monitor across 12 major UP urban centers (Lucknow, Kanpur, Varanasi, Prayagraj, Agra, Noida, Gorakhpur, Bareilly, Meerut, Ayodhya, Jhansi, Moradabad) with click-to-route integration.
- **National Air Quality Index (NAQI) Guide**: Official Central Pollution Control Board (CPCB) category definitions (Good, Satisfactory, Moderate, Poor, Very Poor, Severe) and commuter health precautions.
- **Methodology & Data Transparency**: Comprehensive 5-step explanation distinguishing modeled atmospheric reanalysis from fixed CAAQMS sensor towers.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI components, Lucide Icons
- **Interactive Mapping**: Leaflet, CartoDB Positron tiles
- **Routing Engine**: OSRM (Open Source Routing Machine) API
- **Geocoding Engine**: Photon (OSM-based) + OpenStreetMap Nominatim + UP 75 Districts Index
- **Air Quality & Pollution Engine**: Open-Meteo Air Quality API (Copernicus CAMS & SILAM European/Global reanalysis)
- **Validation**: Ray-casting Point-in-Polygon (PIP) against simplified Uttar Pradesh GeoJSON
- **Testing**: Vitest, React Testing Library

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone https://github.com/Sanjeet3065/The-Healthy-Path.git
cd The-Healthy-Path
npm install
```

### Run Locally
```bash
npm run dev
```
Open `http://localhost:8080` in your web browser.

### Run Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
```

---

## 📍 Geographic Search Examples

- **Lucknow → Kanpur** (NH 27 vs. Unnao Bypass Corridor)
- **Lucknow → Varanasi** (Purvanchal Expressway vs. Sultanpur Highway)
- **Noida → Agra** (Yamuna Expressway vs. NH 19)
- **Gorakhpur → Prayagraj** (Via Ayodhya / Sultanpur vs. Azamgarh)
- **Meerut → Bareilly** (Via Moradabad vs. Sambhal)
- **Small Towns & Villages**: Malihabad, Pipraich, Dalmau, Bikapur, Saidpur, Chandauli, Karwi, and all rural settlements across Uttar Pradesh.

---

## 📄 Open Data & Attribution

- **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/) contributors
- **Map Tiles**: © [CARTO](https://carto.com/) Positron
- **Routing Engine**: [Project OSRM](http://project-osrm.org/)
- **Atmospheric Data**: Copernicus Atmosphere Monitoring Service (CAMS) & [Open-Meteo](https://open-meteo.com/)
- **Air Quality Benchmarks**: Central Pollution Control Board (CPCB), Ministry of Environment, Forest and Climate Change, Government of India