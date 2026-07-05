"""Loads the JSON knowledge base from the knowledge/ folder."""

import json
from pathlib import Path

KNOWLEDGE_ROOT = Path(__file__).resolve().parent.parent.parent / "knowledge"

CATEGORY_MAP = {
    "fans": "fans",
    "furnace": "furnace",
    "windboxes": "windboxes",
    "sensors": "sensors",
    "process": "process",
}


def load_equipment_files() -> list[dict]:
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


def get_equipment_by_id(equipment_id: str) -> dict | None:
    normalized = equipment_id.lower().replace("_", "-")
    for category in CATEGORY_MAP.values():
        file_path = KNOWLEDGE_ROOT / category / f"{normalized}.json"
        if file_path.exists():
            with open(file_path, encoding="utf-8") as handle:
                return json.load(handle)
    return None


def load_hierarchy() -> dict | None:
    file_path = KNOWLEDGE_ROOT / "hierarchy.json"
    if not file_path.exists():
        return None
    with open(file_path, encoding="utf-8") as handle:
        return json.load(handle)
