"""Knowledge library repository."""

from typing import Any

from .base import Repository
from .json_repository import JsonRepository


class KnowledgeRepository(Repository, JsonRepository):
    def __init__(self):
        JsonRepository.__init__(self, "library.json", "items")

    def get_all(self) -> list[dict[str, Any]]:
        return self.get_list()

    def get_by_id(self, item_id: str) -> dict[str, Any] | None:
        for item in self.get_all():
            if item["id"] == item_id:
                return item
        return None

    def get_by_category(self, category: str | None) -> list[dict[str, Any]]:
        items = self.get_all()
        if not category:
            return items
        return [item for item in items if item.get("category") == category]
