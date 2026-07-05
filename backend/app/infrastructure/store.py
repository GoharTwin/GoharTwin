"""JSON file data access — swap implementations for PostgreSQL later."""

import json
from pathlib import Path
from typing import Any


class JsonStore:
    def __init__(self, root: Path):
        self.root = root

    def read(self, relative: str) -> Any | None:
        path = self.root / relative
        if not path.exists():
            return None
        with open(path, encoding="utf-8") as handle:
            return json.load(handle)

    def write(self, relative: str, data: Any) -> None:
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as handle:
            json.dump(data, handle, ensure_ascii=False, indent=2)
