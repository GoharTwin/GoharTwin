# GoharTwin Architecture (v0.3)

## 1. Folder Structure

```
GoharTwin/
├── frontend/src/
│   ├── core/           # API client, auth context
│   ├── modules/        # Feature modules (via pages/)
│   ├── scenes/         # Three.js plant scenes
│   ├── components/     # Shared UI (Logo, Layout, equipment tabs)
│   ├── pages/          # Route pages
│   ├── i18n/           # fa/en locales
│   └── api/client.ts   # Re-exports core/api/client
├── backend/
│   ├── main.py         # FastAPI entry
│   └── app/
│       ├── core/       # config, logging
│       ├── domain/     # Pydantic models
│       ├── repositories/  # JSON repos (swap to DB later)
│       ├── services/   # Business logic
│       ├── modules/ai/ # AI framework (no provider)
│       └── api/
│           ├── v1/     # /api/v1/* routes
│           └── legacy.py  # /api/* aliases
├── knowledge/          # Master data (JSON)
│   ├── companies.json
│   ├── hierarchy.json
│   ├── config/         # roles, permissions, auth, themes, flags
│   ├── relationships/
│   └── fans/
├── desktop/            # Electron wrapper
└── docs/
```

## 2. Clean Architecture Layers

| Layer | Backend | Frontend |
|---|---|---|
| Presentation | FastAPI routers | React pages/components |
| Application | services/*.py | hooks, AuthContext |
| Domain | domain/models.py | types/index.ts |
| Infrastructure | repositories/*.py | core/api/client.ts |

## 3. Repository Pattern

All data access goes through repository interfaces. v0.3 uses JSON files; v1.0 swaps to PostgreSQL without changing services or frontend.

## 4. Asset Hierarchy

```
Company → Site → Plant → Area → Unit → Equipment → Component → Sensor → Tag
```

GMICO contains Sirjan site (legacy GZMICO) with full plant structure including active Pellet Plant → FAN-11.

## 5. API Surface

Primary: `/api/v1/*` — see [API-v1.md](./API-v1.md)

Legacy: `/api/*` — backward-compatible aliases

## 6. Plugin System (Skeleton)

- Frontend: `core/plugins/registry.ts` (future)
- Backend: module routers under `app/modules/`
- Feature flags gate module visibility

## 7. Event Engine (Skeleton)

In-memory publish/subscribe in `event_service.py`. Events exposed via `GET /api/v1/events`.

## 8. Integration Layer (Skeleton)

Registry of Parseh, SAP, OPC-UA, PI, CMMS — all disabled. Exposed via `GET /api/v1/integrations`.

## 9. AI Module

Framework only. No fake streaming. Chat returns HTTP 503 with structured message.

## 10. Version Roadmap

| Version | Scope |
|---|---|
| **v0.1** | ✅ Platform shell, FAN-11 passport |
| **v0.2** | ✅ Branding, i18n, sites, AI UI stub, dashboard |
| **v0.3** | ✅ Architecture foundation, domain model, auth, API v1, 3D placeholder, desktop shell |
| **v0.4** | Plant tag import, all windbox fans, furnace SVG |
| **v1.0** | Live OPC-UA/MQTT, real LLM, PostgreSQL, full 3D twin |
