"""Packaged backend entry — sets GOHARTWIN_ROOT then starts Uvicorn."""

import os
import sys
from pathlib import Path


def resource_root() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys.executable).resolve().parent.parent
    return Path(__file__).resolve().parent.parent


os.environ.setdefault("GOHARTWIN_ROOT", str(resource_root()))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, log_level="info")
