"""Equipment business logic."""

from ..domain.models import EquipmentSummary
from ..repositories.equipment_repo import EquipmentRepository

equipment_repo = EquipmentRepository()


def list_equipment() -> list[EquipmentSummary]:
    return [
        EquipmentSummary(
            id=item["_id"],
            tag=item.get("tag", ""),
            name=item.get("name", ""),
            nameFa=item.get("nameFa"),
            type=item.get("type", ""),
            plant=item.get("plant", ""),
            area=item.get("area", ""),
            status=item.get("status", ""),
            category=item["_category"],
            companyId=item.get("companyId"),
            healthScore=item.get("healthScore"),
        )
        for item in equipment_repo.get_all()
    ]


def get_equipment(equipment_id: str) -> dict | None:
    return equipment_repo.get_by_id(equipment_id)


def get_relationships(equipment_id: str) -> dict | None:
    return equipment_repo.get_relationships(equipment_id)


def get_timeline(equipment_id: str) -> list:
    equipment = equipment_repo.get_by_id(equipment_id)
    if not equipment:
        return []
    thread = equipment.get("digitalThread")
    if isinstance(thread, list):
        return thread
    if isinstance(thread, dict):
        return thread.get("timeline", [])
    return []


def get_ai_context(equipment_id: str) -> dict | None:
    equipment = equipment_repo.get_by_id(equipment_id)
    if not equipment:
        return None
    ctx = equipment.get("aiContext")
    if isinstance(ctx, str):
        return {"summary": ctx, "equipmentId": equipment_id, "tag": equipment.get("tag")}
    if isinstance(ctx, dict):
        return {"equipmentId": equipment_id, "tag": equipment.get("tag"), **ctx}
    return {"equipmentId": equipment_id, "tag": equipment.get("tag"), "summary": ""}
