"""Configuration repository — roles, permissions, themes, feature flags."""

from typing import Any

from .json_repository import JsonRepository


class ConfigRepository:
    def __init__(self):
        self._roles = JsonRepository("config/roles.json", "roles")
        self._permissions = JsonRepository("config/permissions.json")
        self._features = JsonRepository("config/feature-flags.json")
        self._themes = JsonRepository("config/themes.json")

    def get_roles(self) -> list[dict[str, Any]]:
        return self._roles.get_list()

    def get_permissions(self) -> dict[str, Any]:
        data = self._permissions.get_raw()
        return data if isinstance(data, dict) else {"permissions": [], "matrix": {}}

    def get_feature_flags(self) -> dict[str, Any]:
        data = self._features.get_raw()
        return data.get("features", {}) if isinstance(data, dict) else {}

    def get_themes(self) -> dict[str, Any]:
        data = self._themes.get_raw()
        return data if isinstance(data, dict) else {"themes": {}, "defaultTheme": "dark"}

    def get_hierarchy(self) -> dict | None:
        repo = JsonRepository("hierarchy.json")
        data = repo.get_raw()
        return data if isinstance(data, dict) else None

    def get_company_hierarchy(self, company_id: str) -> dict | None:
        tree = self.get_hierarchy()
        if not tree:
            return None
        for company in tree.get("companies", []):
            if company["id"] == company_id:
                return company
        return None

    def get_legacy_hierarchy(self) -> dict:
        """Map v0.3 company hierarchy to v0.2 sites[] format."""
        tree = self.get_hierarchy()
        if not tree:
            return {"version": "0.3.0", "sites": []}
        sites = []
        for company in tree.get("companies", []):
            for site in company.get("children", []):
                sites.append({
                    "id": company["id"] if site.get("code") else site["id"],
                    **({"code": site["code"]} if site.get("code") else {}),
                    "type": "site",
                    "name": site.get("name", company.get("name")),
                    "nameFa": site.get("nameFa", company.get("nameFa")),
                    "children": site.get("children", []),
                })
        return {"version": tree.get("version", "0.3.0"), "sites": sites}
