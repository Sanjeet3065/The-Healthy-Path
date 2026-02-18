🌿 The Green Path
Least-Pollution Route Finder

📌 Problem Statement

Urban areas like Lucknow face drastic Air Quality Index (AQI) variations across different locations. Current navigation apps optimize for time and distance, but not for health impact.

This project aims to provide the "Cleanest Route" between two points by minimizing exposure to harmful pollutants such as PM2.5.


🎯 Objective

To develop a web/app-based solution that suggests routes prioritizing health over speed, by calculating a Health Score for each possible route.

🚀 Key Features:-  


🌍 Cleanest route suggestion between two points

📊 Health Score calculation for each route

🚦 Real-time traffic congestion analysis

🏗️ Construction zone detection

🏭 Industrial area proximity analysis

📍 Location-specific optimization (Lucknow-based model)

🟢 Simple output comparison

Route A – 20 mins (High Pollution)

Route B – 25 mins (Low Pollution)





🧠 How It Works

The system evaluates multiple route options and assigns a Health Score based on:

Real-time AQI data

Traffic congestion levels

Presence of construction zones

Proximity to industrial areas

Local environmental conditions

The route with the lowest pollution exposure is recommended.




📊 Data Sources

CPCB (Central Pollution Control Board) data

OpenStreetMap

Traffic APIs (Google / Open APIs)

Public environmental datasets




🛠️ Tech Stack (Example)

Frontend: HTML, CSS, JavaScript / React

Backend: Node.js / Python

Maps API: Google Maps / OpenStreetMap

AQI API Integration

Dijkstra / A* Algorithm for optimized routing




🧮 Algorithm Approach

Fetch multiple route options

Assign pollution weight to each route segment

Calculate cumulative Health Score

Compare routes

Suggest least polluted path



🌟 Impact

Reduces public exposure to harmful pollutants

Promotes health-first navigation

Supports smart city initiatives

Encourages data-driven urban mobility