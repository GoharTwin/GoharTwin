"""GoharTwin portable desktop launcher — starts API and opens browser."""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PYTHON = ROOT / "backend" / ".venv" / "Scripts" / "python.exe"
MAIN = ROOT / "backend" / "main.py"
URL = "http://127.0.0.1:8000"


def main() -> None:
    if not PYTHON.exists():
        print("Run: python -m venv backend/.venv && pip install -r backend/requirements.txt")
        sys.exit(1)

    proc = subprocess.Popen(
        [str(PYTHON), str(MAIN)],
        cwd=str(ROOT),
        creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
    )
    time.sleep(2)
    webbrowser.open(URL)
    try:
        proc.wait()
    except KeyboardInterrupt:
        proc.terminate()


if __name__ == "__main__":
    main()
