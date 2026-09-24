# 🌿 The Healthy Path

<p align="center">
  <strong>Health-first route planning for cleaner and safer travel in Lucknow.</strong>
</p>

<p align="center">
  <a href="https://the-healthy-path.vercel.app/">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20The%20Healthy%20Path-16a085?style=for-the-badge" alt="Visit the live demo" />
  </a>
  <a href="https://github.com/Sanjeet3065/The-Healthy-Path">
    <img src="https://img.shields.io/badge/⭐%20GitHub-View%20Repository-24292f?style=for-the-badge&logo=github" alt="View GitHub repository" />
  </a>
</p>

The Healthy Path is a health-first route planner for Lucknow that suggests cleaner travel paths instead of simply choosing the fastest route. It compares route options using AQI, traffic intensity, and pollution-prone zones to help users reduce exposure to harmful air pollutants.

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
- Modern UI built with React, Vite, and Tailwind CSS

## How it works

1. Select a source and destination inside Lucknow.
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

The app uses a Lucknow-focused pollution simulation with route scores based on AQI levels, pollution zones, traffic density, construction activity, and industrial proximity.

## Use Cases

- Daily commuters
- Students and office travelers
- Health-conscious riders
- Smart city and environmental awareness initiatives

## Note

This project is a frontend-based prototype that demonstrates a health-first routing concept using curated Lucknow area data and route simulation logic.

---

<p align="center">Built with care for cleaner, healthier commuting in Lucknow. 🌱</p>