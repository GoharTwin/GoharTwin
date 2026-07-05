# GoharTwin Engineering Handbook

> The single source of truth for how we build GoharTwin.
> کتابچه مهندسی گوهرتوین — مرجع اصلی قواعد توسعه پلتفرم

## 1. Vision

GoharTwin is an **industrial Digital Twin platform** for the Gohar Zamin iron ore
complex (Sirjan, Iran). We start small — one plant, one piece of equipment — and
grow into a full digital replica of the site.

- **Today (v0.1):** platform shell + the Pellet Plant module + one fully modelled
  equipment item (FAN-11, windbox cooling fan).
- **Tomorrow:** Concentrate Plant, Steel Plant, Utilities, the Mine — every asset
  browsable, every datasheet queryable, live process data, 3D scenes, and an AI
  Engineer that answers questions from the plant knowledge base.

The platform is bilingual by design: every human-facing entity carries an English
`name` and a Persian `nameFa`.

## 2. Core Principles

1. **Modular** — each plant is a module with the same contract (id, name, nameFa,
   icon, status, route). Adding a plant must never require touching another plant.
2. **API-First** — the frontend only talks to the backend through the REST API.
   No knowledge files are read directly by the UI.
3. **Knowledge-Driven** — plant truth lives in the `knowledge/` base as versioned,
   schema-validated JSON "equipment passports". Code renders knowledge; it never
   embeds it.
4. **Bilingual** — English for engineering artifacts (code, docs, tags), Persian
   alongside English in the UI (`name` / `nameFa`).
5. **Future-Proof** — v0.1 choices (JSON files, single FastAPI app) are deliberate
   simplifications, but the *interfaces* (REST surface, passport schema, asset
   hierarchy) are designed for the full complex.

## 3. Development Rules

- **The Golden Question:** before merging any feature, ask —
  *"Can the whole Gol-Gohar complex be added later without rewriting this?"*
  If the answer is no, redesign the interface (not necessarily the implementation).
- Keep v0.x implementations small and boring. No premature abstraction, no
  speculative configuration, no framework ceremony.
- Every equipment item must validate against `knowledge/schema/equipment.schema.json`.
- Unknown values are written as `"TBD"` or `null` — never invented.
- Frontend types (`frontend/src/types/index.ts`) must mirror the API responses.
- New endpoints are added to `docs/ARCHITECTURE.md` in the same commit.

## 4. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Equipment tag | Plant tag, uppercase, hyphenated | `FAN-11`, `WB-11`, `M-11` |
| Knowledge file | kebab-case, lowercase tag | `knowledge/fans/fan-11.json` |
| React component | PascalCase | `ModuleCard.tsx`, `SpecRow.tsx` |
| Route / module id | kebab-case | `/pellet`, `ai-engineer` |
| Python module | snake_case | `app/knowledge.py` |
| JSON keys | camelCase | `nameFa`, `ratedPower_kW` |

Units are embedded in the key name with an underscore suffix (`designFlowRate_m3h`,
`ratedPower_kW`) so values stay plain numbers.

## 5. AI Rules

The future **AI Engineer** module must obey these rules from day one:

1. It answers **only** from the knowledge base (equipment passports, hierarchy,
   documents). It never invents plant data, setpoints, or vendor facts.
2. If the knowledge base does not contain the answer, it replies exactly:
   **"Knowledge not available"** (دانش موجود نیست) — and may suggest which
   passport or document should be added.
3. Every answer must be traceable to a knowledge source (file + field).
4. The `aiContext` field in each passport is the entry point for AI reasoning
   about that equipment.

## 6. Definition of Done (v0.x)

- Backend starts with one command; frontend builds with `npm run build`.
- All endpoints return correct JSON for the sample knowledge base.
- No secrets, no `.venv`, no `node_modules` in git.
- Docs updated in the same commit as the behavior they describe.
