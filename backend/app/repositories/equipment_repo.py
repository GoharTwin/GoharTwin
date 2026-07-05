"""Equipment passport repository."""

import json
from typing import Any

from ..core.config import KNOWLEDGE_ROOT
from .base import Repository


CATEGORY_MAP = {
    "fans": "fans",
    "furnace": "furnace",
    "windboxes": "windboxes",
    "sensors": "sensors",
    "process": "process",
}


class EquipmentRepository(Repository):
    def get_all(self) -> list[dict[str, Any]]:
        items = []
        for category, folder in CATEGORY_MAP.items():
            category_path = KNOWLEDGE_ROOT / folder
            if not category_path.exists():
                continue
            for file in sorted(category_path.glob("*.json")):
                with open(file, encoding="utf-8") as handle:
                    data = json.load(handle)
                data["_category"] = category
                data["_id"] = file.stem
                items.append(data)
        return items

    def get_by_id(self, equipment_id: str) -> dict[str, Any] | None:
        normalized = equipment_id.lower().replace("_", "-")
        for category in CATEGORY_MAP.values():
            file_path = KNOWLEDGE_ROOT / category / f"{normalized}.json"
            if file_path.exists():
                with open(file_path, encoding="utf-8") as handle:
                    return json.load(handle)
        return None

    def get_relationships(self, equipment_id: str) -> dict | None:
        normalized = equipment_id.lower().replace("_", "-")
        file_path = KNOWLEDGE_ROOT / "relationships" / f"{normalized}.json"
        if not file_path.exists():
            return None
        with open(file_path, encoding="utf-8") as handle:
            return json.load(handle)
