"""Health score engine — stub structure for v0.3."""

from ..repositories.equipment_repo import EquipmentRepository

equipment_repo = EquipmentRepository()


def platform_health() -> dict:
    equipment = equipment_repo.get_all()
    scores = [e.get("healthScore") for e in equipment if e.get("healthScore") is not None]
    avg = round(sum(scores) / len(scores)) if scores else 92
    return {
        "status": "ok",
        "healthIndex": avg,
        "equipmentCount": len(equipment),
        "monitoredCount": len(scores),
    }


def equipment_health(equipment_id: str) -> dict | None:
    equipment = equipment_repo.get_by_id(equipment_id)
    if not equipment:
        return None
    return {
        "equipmentId": equipment_id,
        "tag": equipment.get("tag"),
        "healthScore": equipment.get("healthScore", 0),
        "status": equipment.get("status"),
        "factors": [
            {"name": "Vibration", "score": 88, "weight": 0.3},
            {"name": "Temperature", "score": 95, "weight": 0.3},
            {"name": "Availability", "score": 94, "weight": 0.4},
        ],
    }
