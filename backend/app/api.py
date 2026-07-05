from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from . import VERSION, ai
from .knowledge import (
    get_equipment_by_id,
    get_site_by_id,
    get_site_hierarchy,
    load_equipment_files,
    load_hierarchy,
    load_library,
    load_sites,
)
from .models import ChatRequest, EquipmentSummary, PlatformModule

router = APIRouter(prefix="/api")

MODULES: list[PlatformModule] = [
    PlatformModule(
        id="sites",
        name="Industrial Sites",
        nameFa="سایت‌های صنعتی",
        icon="factory",
        status="active",
        route="/sites",
    ),
    PlatformModule(
        id="dashboard",
        name="Dashboard",
        nameFa="داشبورد",
        icon="gauge",
        status="active",
        route="/dashboard",
    ),
    PlatformModule(
        id="ai-engineer",
        name="AI Engineer",
        nameFa="مهندس هوش مصنوعی",
        icon="bot",
        status="active",
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


@router.get("/sites")
def sites():
    return {"sites": load_sites()}


@router.get("/sites/{site_id}")
def site_detail(site_id: str):
    site = get_site_by_id(site_id)
    if site is None:
        raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found")
    tree = get_site_hierarchy(site_id)
    return {"site": site, "hierarchy": tree}


@router.get("/knowledge")
def knowledge_library(category: str | None = None):
    items = load_library(category)
    return {"count": len(items), "items": items}


@router.get("/stats")
def stats():
    equipment = load_equipment_files()
    library = load_library()
    running = [e for e in equipment if e.get("status") == "operational"]
    return {
        "equipmentCount": len(equipment),
        "runningEquipment": len(running),
        "knowledgeItemCount": len(library),
        "aiRequestCount": ai.get_request_count(),
        "healthIndex": 92,
        "recentAssets": [
            {
                "id": e["_id"],
                "tag": e.get("tag"),
                "name": e.get("name"),
                "nameFa": e.get("nameFa"),
                "status": e.get("status"),
            }
            for e in equipment[:5]
        ],
        "recentDocuments": [
            {
                "id": item["id"],
                "title": item["title"],
                "titleFa": item.get("titleFa"),
                "category": item["category"],
                "status": item["status"],
            }
            for item in library[:5]
        ],
        "alarms": {
            "critical": 0,
            "warning": 2,
            "info": 5,
            "recent": [
                {
                    "severity": "warning",
                    "tag": "TT-11A",
                    "message": "Bearing temperature trending high",
                    "messageFa": "روند افزایشی دمای یاتاقان",
                    "time": "08:42",
                },
                {
                    "severity": "warning",
                    "tag": "VT-11A",
                    "message": "Vibration above baseline",
                    "messageFa": "ارتعاش بالاتر از خط مبنا",
                    "time": "06:15",
                },
                {
                    "severity": "info",
                    "tag": "ST-11A",
                    "message": "Fan restart after planned stop",
                    "messageFa": "راه‌اندازی مجدد فن پس از توقف برنامه‌ریزی‌شده",
                    "time": "05:03",
                },
            ],
        },
    }


@router.get("/ai/status")
def ai_status():
    return ai.status()


@router.post("/ai/chat")
async def ai_chat(request: ChatRequest):
    return StreamingResponse(
        ai.stream_chat(request.message, request.language, request.equipmentId),
        media_type="text/plain; charset=utf-8",
    )
