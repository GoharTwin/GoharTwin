# GoharTwin

**Digital Twin Platform for Gohar Zamin Industrial Complex**

Version: **0.1.0**

## Overview

GoharTwin is an industrial digital twin platform covering pellet plant, concentrate plant, steel plant, utilities, and AI-assisted operations.

Version 0.1 delivers:

- Platform home screen with module navigation
- Pellet Plant furnace overview
- Equipment passport for **Fan 11** (sample data model)
- REST API for equipment knowledge base
- Extensible folder structure for future modules

## Project Structure

```
GoharTwin/
├── frontend/          # React + Vite UI
├── backend/           # FastAPI REST API
├── knowledge/         # Equipment & process knowledge (JSON)
├── data/              # Runtime / imported plant data
├── docs/              # Documentation
├── assets/            # Images, logos, 3D assets
├── scripts/           # Dev & deploy scripts
└── app/               # Future desktop / unified app entry
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+ (stdlib only — no pip packages required for v0.1)

### 1. Backend

```powershell
cd backend
python main.py
```

### 2. Frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

### 3. Open

- UI: http://localhost:5173
- API: http://localhost:8000
- API Health: http://localhost:8000/api/health

## GitHub

```powershell
git remote add origin https://github.com/GoharTwin/GoharTwin.git
git add .
git commit -m "Initial project structure and GoharTwin v0.1"
git push -u origin main
```

## Version Roadmap

| Version | Focus |
|---------|-------|
| v0.1 | Platform shell, Fan 11 passport, API skeleton |
| v0.2 | Real plant tag list & P&ID data import |
| v1.0 | Interactive furnace twin, AI equipment assistant |

## License

Proprietary — GoharTwin Organization
