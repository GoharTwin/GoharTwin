# GoharTwin

**Industrial Digital Twin Platform — bilingual (فارسی / English)**

Version: **0.2.0**

## Overview

GoharTwin is an industrial digital twin platform for the Gohar / Golgohar
industrial region: mines, concentrators, pellet plants, direct reduction and
steel plants — with knowledge-driven AI assistance.

Version 0.2 delivers:

- **Branding** — GoharTwin logo (SVG), splash screen with animation, favicon,
  faint page watermark
- **i18n** — full Persian/English UI (i18next), RTL/LTR switching, Vazirmatn
  font for Persian, language persisted in localStorage (default fa)
- **Landing page** — hero + six capability cards (Digital Twin, Industrial AI,
  Knowledge Graph, Predictive Maintenance, Digital Factory, Process Intelligence)
- **Site selection** — 4 industrial companies (GZMICO, GMICO, GISDCO, Jahan
  Foolad) served from `knowledge/sites.json`
- **Dynamic navigation** — Site → Plant → Area → System → Equipment with
  breadcrumbs, fully driven by the API (GZMICO → Pellet Plant → Grate-Kiln
  Furnace → Windbox Zone 11 → FAN-11)
- **AI Engineer** — chat UI with conversation list (create/rename/delete,
  localStorage), streaming replies, markdown + syntax highlighting, attachment
  chips; backend stub streams knowledge-driven bilingual answers (FAN-11
  questions answered from the real passport)
- **Dashboard** — stat cards, health gauge, recent assets/documents, alarm
  summary from `GET /api/stats`
- **Knowledge Center** — 8 categories (Documents, P&ID, Manuals, Photos,
  Videos, Drawings, Standards, Lessons Learned) with search, served from
  `knowledge/library.json`
- **FAN-11 passport redesign** — tabs: Overview, Specifications, Sensors,
  Documents, History, Maintenance, Knowledge, AI Assistant
- **Dark industrial theme** — glass-morphism cards, blue + gold palette,
  responsive with mobile menu

## Project Structure

```
GoharTwin/
├── frontend/          # React + Vite + TypeScript UI (i18n fa/en)
├── backend/           # FastAPI REST API + AI stub
├── knowledge/         # Sites, hierarchy, library, equipment passports (JSON)
├── data/              # Runtime / imported plant data
├── docs/              # Handbook, architecture, knowledge model
├── assets/            # Branding (logo)
└── scripts/           # Dev & deploy scripts
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+ with `fastapi` and `uvicorn` (a venv exists at `backend/.venv`)

### 1. Backend

```powershell
backend\.venv\Scripts\python.exe backend\main.py
```

### 2. Frontend

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
```

### 3. Open

- UI: http://127.0.0.1:5173
- API: http://127.0.0.1:8000 (docs at /docs)
- API Health: http://127.0.0.1:8000/api/health

### Production build

```powershell
cd frontend
npm run build   # TypeScript strict check + Vite build → dist/
```

## Version Roadmap

| Version | Focus |
|---------|-------|
| v0.1 | ✅ Platform shell, Fan 11 passport, API skeleton |
| v0.2 | ✅ Branding, i18n (fa/en), landing, sites, dynamic navigation, AI chat, dashboard, knowledge center |
| v0.3 | Real plant tag list & P&ID data import, furnace SVG, search |
| v1.0 | 3D plant scenes, live process data, AI on real LLM |

## License

Proprietary — GoharTwin Organization
