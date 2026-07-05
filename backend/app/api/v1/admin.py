"""Integration, events, admin stub endpoints."""

from fastapi import APIRouter

from ...repositories.config_repo import ConfigRepository
from ...services import event_service, ingestion_service, integration_service

router = APIRouter(tags=["platform"])
config_repo = ConfigRepository()


@router.get("/integrations")
def integrations():
    return {"integrations": integration_service.list_integrations()}


@router.get("/events")
def events(limit: int = 50):
    return {"events": event_service.list_events(limit)}


@router.get("/feature-flags")
def feature_flags():
    return {"features": config_repo.get_feature_flags()}


@router.get("/roles")
def roles():
    return {"roles": config_repo.get_roles(), "permissions": config_repo.get_permissions()}


@router.get("/themes")
def themes():
    return config_repo.get_themes()


@router.get("/notifications")
def notifications():
    return {
        "count": 3,
        "items": [
            {"id": "n1", "title": "Vibration warning VT-11A", "titleFa": "هشدار ارتعاش VT-11A", "severity": "warning", "read": False},
            {"id": "n2", "title": "Knowledge document pending approval", "titleFa": "سند دانش در انتظار تأیید", "severity": "info", "read": False},
            {"id": "n3", "title": "Platform v0.3 deployed", "titleFa": "پلتفرم نسخه ۰.۳ مستقر شد", "severity": "info", "read": True},
        ],
    }


@router.get("/tasks")
def tasks():
    return {
        "count": 2,
        "items": [
            {"id": "t1", "title": "Review FAN-11 datasheet", "titleFa": "بازبینی دیتاشیت FAN-11", "status": "open", "priority": "medium"},
            {"id": "t2", "title": "Update vibration baseline", "titleFa": "به‌روزرسانی خط مبنای ارتعاش", "status": "in_progress", "priority": "high"},
        ],
    }


@router.get("/audit-log")
def audit_log():
    return {"entries": [], "message": "Audit log stub — connect to database in v1.0"}


@router.get("/monitoring/health")
def monitoring_health():
    from ...services.health_service import platform_health
    return platform_health()


@router.get("/ingestion/status")
def ingestion_status():
    return ingestion_service.get_pipeline_status()
