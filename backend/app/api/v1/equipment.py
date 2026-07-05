"""Equipment endpoints."""

from fastapi import APIRouter, HTTPException

from ...services import equipment_service

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("")
def list_equipment():
    items = equipment_service.list_equipment()
    return {"count": len(items), "items": items}


@router.get("/{equipment_id}")
def get_equipment(equipment_id: str):
    equipment = equipment_service.get_equipment(equipment_id)
    if equipment is None:
        raise HTTPException(status_code=404, detail=f"Equipment '{equipment_id}' not found")
    return equipment


@router.get("/{equipment_id}/relationships")
def equipment_relationships(equipment_id: str):
    data = equipment_service.get_relationships(equipment_id)
    if data is None:
        raise HTTPException(status_code=404, detail="Relationships not found")
    return data


@router.get("/{equipment_id}/timeline")
def equipment_timeline(equipment_id: str):
    timeline = equipment_service.get_timeline(equipment_id)
    return {"equipmentId": equipment_id, "timeline": timeline}


@router.get("/{equipment_id}/context")
def equipment_context(equipment_id: str):
    ctx = equipment_service.get_ai_context(equipment_id)
    if ctx is None:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return ctx
