"""AI framework — no fake responses."""

from ..knowledge import get_equipment_by_id, load_library
from ..infrastructure.store import JsonStore
from ..core.config import KNOWLEDGE_ROOT

_store = JsonStore(KNOWLEDGE_ROOT)


def status() -> dict:
    return {
        "connected": False,
        "provider": None,
        "message": "AI model not connected yet",
        "messageFa": "مدل هوش مصنوعی هنوز متصل نشده است",
        "capabilities": [
            "equipment_chat", "fault_diagnosis", "knowledge_search",
            "document_search", "recommendations", "reasoning",
        ],
    }


def build_context(equipment_id: str) -> dict:
    equipment = get_equipment_by_id(equipment_id)
    if not equipment:
        return {"sources": [], "equipmentId": equipment_id}

    related_docs = [
        d for d in load_library()
        if d.get("equipmentId") == equipment_id or equipment_id in d.get("equipmentIds", [])
    ]
    relationships = _store.read(f"relationships/{equipment_id}.json") or {}

    return {
        "equipmentId": equipment_id,
        "sources": [
            {"type": "passport", "id": equipment_id},
            {"type": "relationships", "id": equipment_id},
            {"type": "documents", "count": len(related_docs)},
            {"type": "digitalThread", "count": len(equipment.get("digitalThread", []))},
            {"type": "sensors", "count": len(equipment.get("sensors", []))},
        ],
        "relationships": relationships.get("nodes", []),
        "aiContext": equipment.get("aiContext"),
    }


def chat_response(message: str, language: str, equipment_id: str | None) -> dict:
    context = build_context(equipment_id) if equipment_id else {"sources": []}
    if language == "fa":
        text = (
            "مدل هوش مصنوعی هنوز متصل نشده است. "
            "زمینه آماده‌شده برای این گفتگو شامل منابع زیر است."
        )
    else:
        text = (
            "AI model is not connected yet. "
            "The following context sources would be used for this conversation."
        )
    return {"message": text, "context": context, "connected": False}
