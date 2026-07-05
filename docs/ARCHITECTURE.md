# GoharTwin Architecture

## 1. Folder Structure

```
GoharTwin/
├── frontend/            # React 18 + Vite + TypeScript SPA
│   └── src/
│       ├── api/         # REST client (client.ts) — single integration point
│       ├── assets/      # logo.svg (single brand source)
│       ├── components/  # Layout, Breadcrumbs, SiteIcon, chat/, equipment/
│       ├── hooks/       # useConversations (localStorage chat store)
│       ├── i18n/        # i18next config + locales/fa.json, locales/en.json
│       ├── pages/       # Landing, Sites, Site, Plant, Equipment, Dashboard, Knowledge, AI
│       ├── types/       # API response types
│       └── styles/      # base / layout / components / pages / chat CSS
├── backend/             # FastAPI application
│   ├── main.py          # entry point (runs uvicorn)
│   └── app/
│       ├── api.py       # routes
│       ├── ai.py        # AI provider interface + knowledge-driven stub
│       ├── knowledge.py # knowledge base loaders
│       └── models.py    # Pydantic models
├── knowledge/           # the knowledge base (JSON, versioned in git)
│   ├── schema/          # JSON Schemas (equipment.schema.json)
│   ├── sites.json       # industrial companies / sites
│   ├── hierarchy.json   # per-site asset hierarchy trees
│   ├── library.json     # knowledge center items (documents, P&ID, standards, ...)
│   └── fans/            # equipment passports by category
├── assets/branding/     # brand assets (logo copies)
└── docs/                # engineering handbook
```

## 2. Tech Stack

| Layer | v0.2 | Later |
|---|---|---|
| Frontend | React 18 + Vite + TypeScript, react-router-dom, i18next (fa/en, RTL), react-markdown + highlight.js | 3D scenes (three.js/Cesium), realtime charts |
| Backend | FastAPI + uvicorn (Python), streaming AI stub | auth, WebSocket live data, real LLM provider |
| Knowledge | JSON files in `knowledge/` | SQLite → PostgreSQL, document store |
| Data | static passports, stub stats/alarms | plant historian / OPC-UA import |

The frontend dev server (127.0.0.1:5173) proxies `/api` to the backend
(127.0.0.1:8000), so the client code uses relative URLs and needs no
environment configuration.

## 3. Asset Hierarchy Model

Every physical asset lives in a five-level tree:

```
Site → Plant → Area → System → Equipment
```

Example (v0.2, active path):

```
GZMICO — Gohar Zamin (site)
└── Pellet Plant (plant)
    └── Grate-Kiln Furnace (area)
        └── Windbox Zone 11 (system)
            └── FAN-11 (equipment → knowledge/fans/fan-11.json)
```

`knowledge/hierarchy.json` holds one tree per site (`sites[]`); equipment
nodes carry a `ref` pointing to the passport file id, keeping the hierarchy
thin and the passports authoritative. `knowledge/sites.json` describes the
companies shown on the site-selection screen (GZMICO, GMICO, GISDCO,
Jahan Foolad) with bilingual names and unit counts.

## 4. REST API Surface

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ status, version }` |
| GET | `/api/modules` | `{ modules: PlatformModule[] }` — platform navigation |
| GET | `/api/equipment` | `{ count, items: EquipmentSummary[] }` |
| GET | `/api/equipment/{id}` | full equipment passport (404 if unknown) |
| GET | `/api/hierarchy` | all per-site asset hierarchy trees |
| GET | `/api/sites` | `{ sites: Site[] }` — industrial companies |
| GET | `/api/sites/{id}` | `{ site, hierarchy }` — one site + its tree |
| GET | `/api/knowledge?category=` | `{ count, items }` — knowledge library, filterable |
| GET | `/api/stats` | dashboard stats (equipment, knowledge, AI requests, alarms, health) |
| GET | `/api/ai/status` | `{ provider, online, knowledgeDriven, requestCount }` |
| POST | `/api/ai/chat` | streamed plain-text reply (word-by-word chunks) |

CORS allows `http://localhost:5173` and `http://127.0.0.1:5173` for development.

## 5. AI Provider Interface

`backend/app/ai.py` defines an abstract `AIProvider` with a single
`stream_chat(message, language, equipment_id)` async generator. v0.2 ships
`StubProvider`, which answers only from the knowledge base (FAN-11 questions
are answered from the real passport). A real LLM provider (OpenAI, local
model, RAG pipeline) plugs in by implementing the same interface and swapping
the module-level `provider` instance — no API or frontend change required.

## 6. Extension Points (kept clean for future versions)

- **API client** — all HTTP goes through `frontend/src/api/client.ts`; adding
  WebSocket/live channels touches one module.
- **AI provider** — `AIProvider` interface in `backend/app/ai.py` (see §5).
- **Knowledge loaders** — `backend/app/knowledge.py` isolates file I/O; a
  database or document store replaces it behind the same functions.
- **3D / SCADA / historian / SAP-Maximo / vision / voice / mobile / AR-VR** —
  planned as new modules against the same REST surface and hierarchy model;
  equipment passports (`aiContext`, tags, sensors) are the shared contract.

## 7. Version Roadmap

| Version | Scope |
|---|---|
| **v0.1** | ✅ Platform shell, module grid, Pellet Plant page, FAN-11 passport, handbook |
| **v0.2** | ✅ Delivered — branding & splash, i18n (fa/en, RTL), landing page, site selection (4 companies), dynamic Site→Plant→Area→Equipment navigation, AI Engineer chat (streaming stub), dashboard, knowledge center, tabbed passport |
| **v0.3** | Real tag list & motor list import → passports for all windbox fans; interactive furnace SVG; search |
| **v1.0** | 3D plant scenes, live process data (OPC-UA/MQTT), AI Engineer on a real LLM answering from the knowledge base |
