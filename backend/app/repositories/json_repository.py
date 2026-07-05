"""JSON file repository base implementation."""

import json
from pathlib import Path
from typing import Any

from ..core.config import KNOWLEDGE_ROOT


class JsonRepository:
    def __init__(self, relative_path: str, list_key: str | None = None):
        self.file_path = KNOWLEDGE_ROOT / relative_path
        self.list_key = list_key

    def _load(self) -> dict | list | None:
        if not self.file_path.exists():
            return None
        with open(self.file_path, encoding="utf-8") as handle:
            return json.load(handle)

    def get_raw(self) -> dict | list | None:
        return self._load()

    def get_list(self) -> list[dict[str, Any]]:
        data = self._load()
        if data is None:
            return []
        if isinstance(data, list):
            return data
        if self.list_key and isinstance(data, dict):
            return data.get(self.list_key, [])
        return []
