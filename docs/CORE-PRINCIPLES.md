# GoharTwin Core Principles

> Permanent architecture rules — Industrial OS, not a website.

## 1. Data-Driven

- No hardcoded plant data, companies, or equipment in Python/TypeScript logic.
- Master data lives in `knowledge/` JSON (companies, hierarchy, passports, config).
- Repository pattern isolates storage — swap JSON → PostgreSQL with zero frontend changes.

## 2. Clean Architecture

```
Presentation (React) → Application (services) → Domain (models) → Infrastructure (repositories)
```

## 3. API-First

- All UI reads through `/api/v1/` REST endpoints.
- Legacy `/api/*` aliases maintained during migration.
- Plugin-ready modules register against the same API surface.

## 4. Bilingual by Design

- Every entity: `name` + `nameFa`.
- UI strings in i18n JSON only — zero hardcoded user-facing text.

## 5. No Fake AI

- AI module is framework-only until a real provider is connected.
- Endpoints return structured "provider not connected" — never invented answers.

## 6. Event-Driven Skeleton

- In-memory event bus (v0.3) → message queue (v1.0).
- Digital thread timeline per equipment passport.

## 7. Integration Layer

- External systems (Parseh, SAP, OPC-UA, PI, CMMS) registered as disabled stubs.
- Enabled via feature flags + integration service.

## 8. Theme Engine

- CSS variables from `knowledge/config/themes.json`.
- No hardcoded colors in components.

## 9. Security

- Auth users in `knowledge/config/auth-users.json` (bcrypt hashes).
- JWT tokens — architecture allows DB auth later without frontend rewrite.

## 10. The Golden Question

*"Can the whole Gol-Gohar complex be added later without rewriting this?"*
