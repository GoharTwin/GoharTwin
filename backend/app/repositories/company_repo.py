"""Company repository — reads knowledge/companies.json."""

from typing import Any

from .base import Repository
from .json_repository import JsonRepository


class CompanyRepository(Repository, JsonRepository):
    def __init__(self):
        JsonRepository.__init__(self, "companies.json", "companies")

    def get_all(self) -> list[dict[str, Any]]:
        return self.get_list()

    def get_by_id(self, company_id: str) -> dict[str, Any] | None:
        normalized = company_id.lower()
        for company in self.get_all():
            if company["id"] == normalized:
                return company
            aliases = company.get("legacyAliases", [])
            if normalized in aliases:
                return company
        return None

    def resolve_id(self, company_id: str) -> str | None:
        company = self.get_by_id(company_id)
        return company["id"] if company else None

    def to_legacy_sites(self) -> list[dict[str, Any]]:
        """Backward-compatible site list for /api/sites."""
        return [
            {
                "id": c["id"],
                "code": c["code"],
                "name": c["name"],
                "nameFa": c["nameFa"],
                "description": c["description"],
                "descriptionFa": c["descriptionFa"],
                "status": c["status"],
                "icon": c["icon"],
                "units": c.get("units", []),
                "website": c.get("website"),
                "logo": c.get("logo"),
                "loginEnabled": c.get("loginEnabled", False),
            }
            for c in self.get_all()
        ]
