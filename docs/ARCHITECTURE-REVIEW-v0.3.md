# Architecture Review — GoharTwin v0.3

## What Changed

### Data Layer
- Introduced `companies.json` as company master (replaces `sites.json` as source of truth)
- Rewrote `hierarchy.json` to universal Company→Site→Plant→Area→Unit→Equipment model
- Added config JSON: roles, permissions, auth-users, feature-flags, themes
- Expanded `library.json` metadata; added `relationships/fan-11.json`
- GMICO absorbs GZMICO; SJSCO replaces Jahan Foolad

### Backend
- Monolithic `api.py` → Clean Architecture under `app/core|domain|repositories|services|api/v1`
- JWT auth from config (bcrypt), no hardcoded credentials
- Removed fake AI streaming; AI returns 503 "provider not connected"
- Legacy `/api/*` aliases preserved
- New endpoints: search, auth, integrations, events, equipment relationships/timeline/context

### Frontend
- API client migrated to `/api/v1/`
- Auth flow: GMICO login → dashboard
- Companies page, settings, integrations pages
- Global search in header
- 3D placeholder scene on plant page (Three.js)
- Relationships tab on equipment passport
- Legacy `/sites/*` redirects to `/companies/*`

### Desktop
- Electron wrapper in `desktop/` with build script
- Python launcher fallback in `desktop/launcher.py`

## Why

v0.3 establishes the **final architecture foundation** before scaling to the full Gol-Gohar complex. Repository pattern, API v1, and data-driven config ensure v1.0 features (DB, live data, real AI) plug in without rewrites.

## Risks

| Risk | Mitigation |
|---|---|
| JWT secret hardcoded in dev config | Move to env var before production |
| JSON auth users not suitable for production | Repository interface ready for DB auth |
| 3D scene is placeholder boxes | Feature-flagged; real models in v1.0 |
| Electron portable build requires manual venv | Documented in README; CI not configured |
| Hierarchy legacy mapping complexity | `legacyAliases` + redirect routes |

## Tech Debt

- Old backend files (`app/api.py`, `app/ai.py`, `app/knowledge.py`) should be removed after verification
- Theme engine reads JSON but CSS still uses static variables in base.css
- Search index built at runtime; no persisted `search-index.json`
- Audit log, notifications, tasks are dummy data
- Ingestion pipeline is stub only

## Recommendation for v0.4

Import real plant tag lists and motor lists; add all windbox fan passports; interactive furnace SVG.
