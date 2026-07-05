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


def _load_json(relative_path: str) -> dict | None:
    file_path = KNOWLEDGE_ROOT / relative_path
    if not file_path.exists():
        return None
    with open(file_path, encoding="utf-8") as handle:
        return json.load(handle)


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
    return _load_json("hierarchy.json")


def load_sites() -> list[dict]:
    data = _load_json("sites.json")
    return data.get("sites", []) if data else []


def get_site_by_id(site_id: str) -> dict | None:
    for site in load_sites():
        if site["id"] == site_id:
            return site
    return None


def get_site_hierarchy(site_id: str) -> dict | None:
    """Return the hierarchy subtree for one site."""
    tree = load_hierarchy()
    if tree is None:
        return None
    for site in tree.get("sites", []):
        if site["id"] == site_id:
            return site
    return None


def load_library(category: str | None = None) -> list[dict]:
    data = _load_json("library.json")
    items = data.get("items", []) if data else []
    if category:
        items = [item for item in items if item.get("category") == category]
    return items
