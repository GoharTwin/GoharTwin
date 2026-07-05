# GoharTwin Core Architecture Principles (Permanent Rules)

GoharTwin is an **Industrial Operating System**, not a website. Every decision must support scaling to dozens of plants, thousands of assets, and multiple companies.

## Mandatory process

Before any feature:

1. Review current architecture against this document.
2. Redesign if the feature creates technical debt.
3. Implement.
4. End each version with an Architecture Review Report.

## Architecture

| Principle | Rule |
|-----------|------|
| Clean Architecture | Presentation → Application → Domain → Infrastructure. UI never touches data files directly. |
| Modular | Auth, Knowledge, Digital Twin, AI, Integrations, Events — independent modules via interfaces. |
| Plugin-ready | New capabilities install without modifying core code. |
| Data-driven | Companies, plants, equipment, users, roles, menus, languages, themes — from JSON/config/DB only. |
| API-first | All features exposed at `/api/v1/`. Versioned. |
| Event-driven | Alarms, trips, maintenance, AI recommendations flow through an event bus. |
| Multi-tenant | Unlimited companies, sites, plants, equipment, users. |
| i18n | No hardcoded UI text. RTL/LTR automatic. |
| AI-first | Every equipment page AI-ready. No fake AI — framework until model connected. |
| Integration layer | External systems (Parseh, SAP, OPC-UA, PI, MQTT) connect only through adapters. |

## Universal asset hierarchy (never break)

```
Company → Site → Plant → Area → Unit → Equipment → Component → Sensor → Tag → Knowledge
```

## Code quality

- TypeScript strict, Python type hints.
- Components & modules under ~300 lines.
- SOLID, DRY, meaningful naming.
- Documentation with every module.

## Future-ready (no redesign later)

Time series, predictive maintenance, knowledge graph, digital thread, 3D (Three.js/GLTF), RAG/LLM, RBAC + permission matrix, audit log, feature flags, offline-first, universal search.

See also: [HANDBOOK.md](HANDBOOK.md), [ARCHITECTURE.md](ARCHITECTURE.md).
