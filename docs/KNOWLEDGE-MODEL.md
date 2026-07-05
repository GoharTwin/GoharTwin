# GoharTwin Knowledge Model

The `knowledge/` folder is the plant's memory: versioned JSON files that describe
every asset. The backend serves it; the frontend renders it; the future AI
Engineer reasons over it. **If it is not in the knowledge base, the platform does
not know it.**

## 1. Equipment Passport

Each equipment item has one JSON file — its **passport** — validating against
`knowledge/schema/equipment.schema.json`.

Required fields:

| Field | Meaning | Example |
|---|---|---|
| `tag` | plant tag (uppercase) | `"FAN-11"` |
| `name` / `nameFa` | bilingual name | `"Windbox Cooling Fan 11"` / `"فن خنک‌کننده ویندباکس ۱۱"` |
| `type` | equipment class | `"centrifugal_fan"` |
| `plant` | owning plant id | `"pellet"` |
| `area` | plant area | `"Grate-Kiln Furnace — Windbox Zone 11"` |
| `status` | `operational` \| `standby` \| `maintenance` \| `fault` \| `offline` | |

Optional sections: `manufacturer/model/serialNumber/installDate`,
`specifications` (units in key names, e.g. `designFlowRate_m3h`), `motor`,
`sensors[]` (tag/name/type/unit/range), `interlocks[]`, `maintenance`
(strategy/intervals/spareParts), `documents[]`, `relatedEquipment[]` (tags),
`aiContext` (free-text summary for the AI Engineer), `version`, `lastUpdated`.

**Rule:** unknown values are `"TBD"` or `null` — never guessed. See
`knowledge/fans/fan-11.json` for the reference example.

## 2. Adding a New Equipment File

1. Pick the category folder under `knowledge/` (`fans/`, `furnace/`,
   `windboxes/`, `sensors/`, `process/`) — create it if new, and register the
   category in `backend/app/knowledge.py` (`CATEGORY_MAP`).
2. Create `<tag-in-kebab-case>.json`, e.g. `knowledge/fans/fan-12.json`.
   The file stem becomes the API id (`/api/equipment/fan-12`).
3. Fill the required fields; mark unknowns as `"TBD"`/`null`.
4. Add the equipment to its `system` node in `knowledge/hierarchy.json`
   (`{ "type": "equipment", "ref": "fan-12", "tag": "FAN-12" }`).
5. Verify: `GET /api/equipment` lists it, `GET /api/equipment/fan-12` returns it.

## 3. Asset Hierarchy (`knowledge/hierarchy.json`)

A single tree with node levels `site → plant → area → system → equipment`.
Non-equipment nodes have `id`, `type`, `name`, `nameFa`, and `children`;
equipment leaves are references:

```json
{
  "id": "gohar-zamin", "type": "site", "name": "Gohar Zamin",
  "children": [{
    "id": "pellet", "type": "plant", "name": "Pellet Plant",
    "children": [{
      "id": "grate-kiln-furnace", "type": "area", "name": "Grate-Kiln Furnace",
      "children": [{
        "id": "windbox-zone-11", "type": "system", "name": "Windbox Zone 11",
        "children": [{ "type": "equipment", "ref": "fan-11", "tag": "FAN-11" }]
      }]
    }]
  }]
}
```

Served at `GET /api/hierarchy`. The hierarchy stores only structure — all
equipment detail stays in the passports.

## 4. Adding a New Plant Module

1. Add the module entry (id, name, nameFa, icon, status, route) to `MODULES`
   in `backend/app/api.py`. Set `status: "active"` when it has a real page.
2. Add a plant node under the site in `knowledge/hierarchy.json`.
3. Create the module page in `frontend/src/pages/` and register its route in
   `frontend/src/App.tsx` (until then, the generic coming-soon page handles it).
4. Store its equipment passports under `knowledge/` with `plant` set to the
   module id.
