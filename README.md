# IoT Dashboard Web Project

This project is a full-stack IoT dashboard built with React, TypeScript, and Vite on the frontend, and an Express API on the backend.

The app provides:
- A modern dashboard UI
- Device control interactions
- Telemetry synchronization
- Humidity data fetching through API endpoints

## Prerequisites

- Node.js 18 or newer
- npm

## Install Dependencies

Run the following command once:

```bash
npm install
```

## Run The Project

Open 2 terminals.

Terminal 1: run frontend with command:

```bash
npm run dev
```

Terminal 2: run backend with command:

```bash
npm run api
```

## Notes

- Frontend runs on Vite development server.
- Backend API runs on port 3000.

## Architecture: Layered Architecture (N-Tier Architecture)
┌─────────────────────────────────────────────┐
│   Frontend Layer (React + TypeScript)       │
│   - Pages: login, register, dashboard, etc  │
│   - Components: UI components               │
│   - React Router (SPA routing)              │
└─────────────────┬───────────────────────────┘
                  │ HTTP/API Calls
                  ↓
┌─────────────────────────────────────────────┐
│   API/Routes Layer (Express.js)             │
│   - sensorRoutes, login, fan, light, etc   │
│   - Route handlers & HTTP endpoints        │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│   Business Logic Layer (Controllers)        │
│   - sensorController                        │
│   - securityController                      │
│   - Request validation & processing         │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│   Service Layer (Services)                  │
│   - mqttService (MQTT communication)        │
│   - adaFruitservice (IoT platform)          │
│   - Business logic & external APIs          │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│   Data Access Layer (Database)              │
│   - db.ts (MySQL connection pool)           │
│   - Direct database queries                 │
│   - yolo_home_db (MySQL database)           │
└─────────────────────────────────────────────┘
                  │
                  ↓
            ┌─────────────┐
            │   MySQL DB  │
            │ (yolo_home_ │
            │     db)     │
            └─────────────┘