from fastapi import APIRouter, HTTPException

from . import VERSION
from .knowledge import get_equipment_by_id, load_equipment_files, load_hierarchy
from .models import EquipmentSummary, PlatformModule

router = APIRouter(prefix="/api")

MODULES: list[PlatformModule] = [
    PlatformModule(
        id="pellet",
        name="Pellet Plant",
        nameFa="کارخانه گندله",
        icon="factory",
        status="active",
        route="/pellet",
    ),
    PlatformModule(
        id="concentrate",
        name="Concentrate Plant",
        nameFa="کارخانه کنسانتره",
        icon="factory",
        status="planned",
        route="/concentrate",
    ),
    PlatformModule(
        id="steel",
        name="Steel Plant",
        nameFa="فولادسازی",
        icon="factory",
        status="planned",
        route="/steel",
    ),
    PlatformModule(
        id="utilities",
        name="Utilities",
        nameFa="تاسیسات",
        icon="settings",
        status="planned",
        route="/utilities",
    ),
    PlatformModule(
        id="ai-engineer",
        name="AI Engineer",
        nameFa="مهندس هوش مصنوعی",
        icon="bot",
        status="planned",
        route="/ai",
    ),
    PlatformModule(
        id="knowledge",
        name="Knowledge Center",
        nameFa="مرکز دانش",
        icon="book",
        status="active",
        route="/knowledge",
    ),
    PlatformModule(
        id="settings",
        name="Settings",
        nameFa="تنظیمات",
        icon="gear",
        status="planned",
        route="/settings",
    ),
]


@router.get("/health")
def health():
    return {"status": "ok", "version": VERSION}


@router.get("/modules")
def modules():
    return {"modules": MODULES}


@router.get("/equipment")
def equipment_list():
    items = [
        EquipmentSummary(
            id=item["_id"],
            tag=item.get("tag"),
            name=item.get("name"),
            nameFa=item.get("nameFa"),
            type=item.get("type"),
            plant=item.get("plant"),
            area=item.get("area"),
            status=item.get("status"),
            category=item["_category"],
        )
        for item in load_equipment_files()
    ]
    return {"count": len(items), "items": items}


@router.get("/equipment/{equipment_id}")
def equipment_detail(equipment_id: str):
    equipment = get_equipment_by_id(equipment_id)
    if equipment is None:
        raise HTTPException(status_code=404, detail=f"Equipment '{equipment_id}' not found")
    return equipment


@router.get("/hierarchy")
def hierarchy():
    tree = load_hierarchy()
    if tree is None:
        raise HTTPException(status_code=404, detail="Hierarchy not found")
    return tree
