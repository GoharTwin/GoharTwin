"""Application configuration — paths and feature flags from knowledge JSON."""

import json
import os
from functools import lru_cache
from pathlib import Path


def _resolve_root() -> Path:
    env_root = os.environ.get("GOHARTWIN_ROOT")
    if env_root:
        return Path(env_root)
    return Path(__file__).resolve().parent.parent.parent.parent


ROOT = _resolve_root()
KNOWLEDGE_ROOT = ROOT / "knowledge"
CONFIG_ROOT = KNOWLEDGE_ROOT / "config"
FRONTEND_DIST = ROOT / "frontend" / "dist"

JWT_SECRET = "gohartwin-dev-secret-change-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24


def load_json(relative_path: str) -> dict | list | None:
    file_path = KNOWLEDGE_ROOT / relative_path
    if not file_path.exists():
        alt = CONFIG_ROOT / relative_path.replace("config/", "")
        if alt.exists():
            file_path = alt
        else:
            return None
    with open(file_path, encoding="utf-8") as handle:
        return json.load(handle)


@lru_cache
def get_feature_flags() -> dict:
    data = load_json("config/feature-flags.json")
    return data.get("features", {}) if isinstance(data, dict) else {}


@lru_cache
def get_themes() -> dict:
    data = load_json("config/themes.json")
    return data if isinstance(data, dict) else {"themes": {}, "defaultTheme": "dark"}
