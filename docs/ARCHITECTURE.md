# GoharTwin Architecture

## 1. Folder Structure

```
GoharTwin/
├── frontend/            # React 18 + Vite + TypeScript SPA
│   └── src/
│       ├── api/         # REST client (client.ts)
│       ├── components/  # Layout, ModuleCard, SpecRow
│       ├── pages/       # HomePage, PelletPlantPage, EquipmentPage, ...
│       ├── types/       # API response types
│       └── styles/      # global.css
├── backend/             # FastAPI application
│   ├── main.py          # entry point (runs uvicorn)
│   └── app/
│       ├── api.py       # routes
│       ├── knowledge.py # knowledge base loader
│       └── models.py    # Pydantic models
├── knowledge/           # the knowledge base (JSON, versioned in git)
│   ├── schema/          # JSON Schemas (equipment.schema.json)
│   ├── hierarchy.json   # asset hierarchy tree
│   └── fans/            # equipment passports by category
└── docs/                # engineering handbook
```

## 2. Tech Stack

| Layer | v0.1 | Later |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript, react-router-dom | 3D scenes (three.js), realtime charts |
| Backend | FastAPI + uvicorn (Python) | auth, WebSocket live data, AI services |
| Knowledge | JSON files in `knowledge/` | SQLite → PostgreSQL, document store |
| Data | static passports, TBD placeholders | plant historian / OPC-UA import |

The frontend dev server (port 5173) proxies `/api` to the backend (port 8000),
so the client code uses relative URLs and needs no environment configuration.

## 3. Asset Hierarchy Model

Every physical asset lives in a five-level tree:

```
Site → Plant → Area → System → Equipment
```

Example (v0.1):

```
Gohar Zamin (site)
└── Pellet Plant (plant)
    └── Grate-Kiln Furnace (area)
        └── Windbox Zone 11 (system)
            └── FAN-11 (equipment → knowledge/fans/fan-11.json)
```

The tree is stored in `knowledge/hierarchy.json`. Equipment nodes carry a `ref`
pointing to the passport file id, keeping the hierarchy thin and the passports
authoritative.

## 4. REST API Surface

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ status, version }` |
| GET | `/api/modules` | `{ modules: PlatformModule[] }` — platform navigation |
| GET | `/api/equipment` | `{ count, items: EquipmentSummary[] }` |
| GET | `/api/equipment/{id}` | full equipment passport (404 if unknown) |
| GET | `/api/hierarchy` | asset hierarchy tree |

CORS allows `http://localhost:5173` for development.

## 5. Version Roadmap

| Version | Scope |
|---|---|
| **v0.1** | Platform shell, module grid, Pellet Plant page, FAN-11 passport, handbook |
| **v0.2** | Import real tag list & motor list → generate passports for all windbox fans |
| **v0.3** | Interactive grate-kiln furnace SVG (clickable windboxes/fans), search |
| **v1.0** | 3D plant scenes, live process data, AI Engineer answering from knowledge base |
