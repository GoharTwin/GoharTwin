"""Dashboard stats endpoints."""

from ...repositories.equipment_repo import EquipmentRepository
from ...services import knowledge_service
from ...services.health_service import platform_health

equipment_repo = EquipmentRepository()


def stats_payload() -> dict:
    equipment = equipment_repo.get_all()
    library = knowledge_service.list_knowledge()
    running = [e for e in equipment if e.get("status") == "operational"]
    health = platform_health()
    return {
        "equipmentCount": len(equipment),
        "runningEquipment": len(running),
        "knowledgeItemCount": len(library),
        "aiRequestCount": 0,
        "healthIndex": health["healthIndex"],
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
