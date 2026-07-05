# GoharTwin

**Industrial Digital Twin Platform — bilingual (فارسی / English)**

Version: **0.3.0**

## Overview

GoharTwin is an Industrial Operating System — a data-driven digital twin platform for the Golgohar industrial complex. v0.3 establishes the final architecture foundation: Clean Architecture backend, API v1, repository pattern, auth, domain model, 3D scene placeholder, and desktop shell.

## Key Features (v0.3)

- **Architecture foundation** — Presentation / Application / Domain / Infrastructure layers
- **Master data** — All companies, hierarchy, config in `knowledge/` JSON
- **API v1** — `/api/v1/*` with legacy `/api/*` aliases
- **Auth** — GMICO login (config-driven bcrypt + JWT)
- **Universal search** — Equipment, documents, companies, hierarchy
- **Equipment passport** — FAN-11 with relationships, health score, digital thread
- **AI framework** — UI shell only; no fake responses
- **3D placeholder** — Three.js orbit scene on plant page
- **Desktop app** — Electron wrapper + portable build script
- **SJSCO** — Replaces all Jahan Foolad references

## Project Structure

```
GoharTwin/
├── frontend/     # React + Vite + TypeScript (fa/en)
├── backend/      # FastAPI Clean Architecture
├── knowledge/    # Master data JSON
├── desktop/      # Electron desktop shell
├── docs/         # Architecture, API, domain model
└── logo/         # Brand logo (optional — falls back to assets/)
```

## Quick Start

### Backend

```powershell
backend\.venv\Scripts\python.exe backend\main.py
```

API: http://127.0.0.1:8000 — Docs: http://127.0.0.1:8000/docs

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

UI: http://127.0.0.1:5173

### Login (GMICO)

- URL: http://127.0.0.1:5173/login?company=gmico
- Username: `1000-1800`
- Password: `Goharzamin`

### Desktop (Dev)

```powershell
# Terminal 1: backend + frontend as above
# Terminal 2:
cd desktop
npm install
npm run dev
```

### Desktop (Portable EXE — no Node/Python required to run)

Download from [GitHub Releases](https://github.com/GoharTwin/GoharTwin/releases) or build locally:

```powershell
.\scripts\build-release.ps1
```

**Deliverable:** `release\output\GoharTwin-0.3.0-portable.exe` (~90 MB, double-click to run)

Build machine requires: Node.js 18+, Python 3.10+ venv at `backend/.venv`, PyInstaller (installed automatically).

### Production Build

```powershell
cd frontend
npm run build
```

## Architecture Summary

See [docs/CORE-PRINCIPLES.md](docs/CORE-PRINCIPLES.md) and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Version Roadmap

| Version | Focus |
|---------|-------|
| v0.1 | ✅ Platform shell, FAN-11 passport |
| v0.2 | ✅ Branding, i18n, sites, AI UI, dashboard |
| v0.3 | ✅ Architecture foundation, auth, API v1, 3D, desktop |
| v1.0 | Live data, real AI, PostgreSQL, full 3D twin |

## License

Proprietary — GoharTwin Organization
