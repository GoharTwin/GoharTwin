# GoharTwin API v1 Reference

Base URL: `http://127.0.0.1:8000/api/v1`

Legacy aliases: `/api/*` (same responses, maintained for backward compatibility)

## Health & Platform

| Method | Path | Description |
|---|---|---|
| GET | `/health` | `{ status, version }` |
| GET | `/modules` | Platform navigation modules |
| GET | `/stats` | Dashboard statistics |
| GET | `/feature-flags` | Feature toggles |
| GET | `/roles` | Roles + permission matrix |
| GET | `/themes` | Theme definitions |
| GET | `/monitoring/health` | Platform health index |

## Auth

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/auth/login` | `{ username, password, companyId? }` | Returns JWT token |
| GET | `/auth/me` | Header: `Authorization: Bearer <token>` | Current user |

## Companies & Hierarchy

| Method | Path | Description |
|---|---|---|
| GET | `/companies` | All companies |
| GET | `/companies/{id}` | Company + hierarchy |
| GET | `/hierarchy` | Legacy sites[] format |
| GET | `/sites` | Alias → companies |
| GET | `/sites/{id}` | Alias → company detail |

## Equipment

| Method | Path | Description |
|---|---|---|
| GET | `/equipment` | Equipment list |
| GET | `/equipment/{id}` | Full passport |
| GET | `/equipment/{id}/relationships` | Relationship graph |
| GET | `/equipment/{id}/timeline` | Digital thread |
| GET | `/equipment/{id}/context` | AI context builder |

## Knowledge & Search

| Method | Path | Description |
|---|---|---|
| GET | `/knowledge?category=` | Knowledge library |
| GET | `/search?q=` | Universal search |

## AI (Framework Only)

| Method | Path | Description |
|---|---|---|
| GET | `/ai/status` | Provider status (not connected) |
| POST | `/ai/chat` | Returns 503 — provider not connected |

## Integrations & Events

| Method | Path | Description |
|---|---|---|
| GET | `/integrations` | Connector registry (all disabled) |
| GET | `/events` | Event stream skeleton |
| GET | `/notifications` | Dummy notifications |
| GET | `/tasks` | Dummy tasks |
| GET | `/audit-log` | Audit stub |
| GET | `/ingestion/status` | Ingestion pipeline skeleton |
