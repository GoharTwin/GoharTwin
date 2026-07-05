# GoharTwin Domain Model (v0.3)

## Asset Hierarchy

```
Company → Site → Plant → Area → Unit → Equipment → Component → Sensor → Tag
```

### Active Path (GMICO / Sirjan)

```
GMICO (company, loginEnabled)
└── Sirjan Complex (site, legacy alias GZMICO)
    └── Pellet Plant (plant, active)
        └── Grate-Kiln Furnace (area)
            └── Windbox Zone 11 (unit)
                └── FAN-11 (equipment → knowledge/fans/fan-11.json)
                    ├── M-11 (component)
                    ├── VFD-11 (component)
                    └── sensors: PT-11A, TT-11A, VT-11A, ...
```

**Note:** GZMICO is deprecated as a separate company. It remains as `legacyAliases: ["gzmico"]` on GMICO and as site code `GZMICO` under the Sirjan site.

## Companies

| ID | Code | Status | Login |
|---|---|---|---|
| gmico | GMICO | active | yes |
| gisdco | GISDCO | coming-soon | no |
| sjsco | SJSCO | coming-soon | no |

SJSCO replaces all former "Jahan Foolad" / SJF references.

## Master Data Files

| File | Purpose |
|---|---|
| `knowledge/companies.json` | Company master |
| `knowledge/hierarchy.json` | Full asset trees |
| `knowledge/fans/fan-11.json` | Equipment passport |
| `knowledge/relationships/fan-11.json` | Relationship graph |
| `knowledge/library.json` | Knowledge center documents |
| `knowledge/config/roles.json` | RBAC roles |
| `knowledge/config/permissions.json` | Permission matrix |
| `knowledge/config/auth-users.json` | Auth credentials |
| `knowledge/config/feature-flags.json` | Feature toggles |
| `knowledge/config/themes.json` | Theme CSS variables |

## Equipment Passport Fields (v0.3)

- Hierarchy IDs: `companyId`, `siteId`, `plantId`, `areaId`, `unitId`
- `healthScore`, `versionHistory`, `relationships[]`
- `aiContext` (object or string)
- `digitalThread` (timeline array)

## RBAC Roles

Administrator, CompanyManager, PlantManager, MaintenanceEngineer, ProcessEngineer, Operator, Guest
