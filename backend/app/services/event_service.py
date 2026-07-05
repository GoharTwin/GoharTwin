"""In-memory event engine skeleton."""

from datetime import datetime, timezone
from typing import Callable

_subscribers: list[Callable] = []
_events: list[dict] = [
    {
        "id": "evt-platform-001",
        "type": "system",
        "title": "GoharTwin v0.3 started",
        "titleFa": "گوهرتوین نسخه ۰.۳ راه‌اندازی شد",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "severity": "info",
    }
]


def publish(event: dict) -> dict:
    event.setdefault("timestamp", datetime.now(timezone.utc).isoformat())
    event.setdefault("id", f"evt-{len(_events)+1}")
    _events.insert(0, event)
    for handler in _subscribers:
        handler(event)
    return event


def subscribe(handler: Callable) -> None:
    _subscribers.append(handler)


def list_events(limit: int = 50) -> list[dict]:
    return _events[:limit]
