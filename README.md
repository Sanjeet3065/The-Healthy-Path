# 🌿 The Healthy Path

A health-first route planner for Lucknow that suggests the cleanest travel path instead of the fastest one. It compares route options using AQI, traffic intensity, and pollution-prone zones to help users reduce exposure to harmful air pollutants.

Live Demo: https://the-healthy-path.vercel.app/

## Why this project?

Most navigation apps optimize for distance and time. But in polluted urban areas, the fastest route can also be the most harmful route.

The Healthy Path helps users choose routes that minimize exposure to:

- PM2.5 and airborne pollutants
- High-AQI zones
- Congested and pollution-heavy corridors
- Industrial and construction-heavy areas

## Key Features

- Cleanest route recommendations between two locations
- Health score comparison for each route
- AQI-aware route evaluation
- Lucknow-specific pollution data model
- Traffic and environmental risk indicators
- Clear route ranking: Best, Moderate, or Avoid
- Modern UI built with React + Vite + Tailwind

## How it works

1. The user selects a source and destination inside Lucknow.
2. The app evaluates multiple route options.
3. Each route is scored based on pollution exposure factors.
4. The route with the lowest health risk is recommended.

This creates a smarter travel decision: not just the shortest route, but the safest and healthiest route.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- React Router
- TanStack Query

## Project Structure

```bash
.
├── src/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Sanjeet3065/The-Healthy-Path.git
cd The-Healthy-Path
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

## Data Model

The app uses a Lucknow-focused pollution simulation with route scores based on:

- AQI levels across areas
- Moderate and severe pollution zones
- Traffic density and congestion
- Construction activity and industrial proximity

## Use Case

This project is useful for:

- Daily commuters
- Students and office travelers
- Health-conscious riders
- Smart city and environmental awareness initiatives

## Impact

The Healthy Path aims to support cleaner urban mobility by encouraging travel decisions that prioritize health, especially in cities where air pollution is a daily risk.

## Note

This project is designed as a frontend-based prototype and demonstrates a health-first routing concept using curated Lucknow area data and route simulation logic.

---

Built with care for cleaner, healthier commuting in Lucknow. 🌱