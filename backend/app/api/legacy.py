"""Legacy /api/* routes — aliases to v1 for backward compatibility."""

from fastapi import APIRouter

from ..v1.router import MODULES, company_repo, config_repo
from ..v1.stats import stats_payload
from ... import VERSION
from ...domain.models import EquipmentSummary
from ...modules.ai import provider
from ...domain.models import ChatRequest
from ...services import equipment_service, knowledge_service
from fastapi import HTTPException
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok", "version": VERSION}


@router.get("/modules")
def modules():
    return {"modules": MODULES}


@router.get("/equipment")
def equipment_list():
    items = equipment_service.list_equipment()
    return {"count": len(items), "items": items}


@router.get("/equipment/{equipment_id}")
def equipment_detail(equipment_id: str):
    equipment = equipment_service.get_equipment(equipment_id)
    if equipment is None:
        raise HTTPException(status_code=404, detail=f"Equipment '{equipment_id}' not found")
    return equipment


@router.get("/hierarchy")
def hierarchy():
    return config_repo.get_legacy_hierarchy()


@router.get("/sites")
def sites():
    return {"sites": company_repo.to_legacy_sites()}


@router.get("/sites/{site_id}")
def site_detail(site_id: str):
    company = company_repo.get_by_id(site_id)
    if company is None:
        raise HTTPException(status_code=404, detail=f"Site '{site_id}' not found")
    hierarchy = config_repo.get_company_hierarchy(company["id"])
    site_entry = {
        "id": company["id"],
        "code": company["code"],
        "name": company["name"],
        "nameFa": company["nameFa"],
        "description": company["description"],
        "descriptionFa": company["descriptionFa"],
        "status": company["status"],
        "icon": company["icon"],
        "units": company.get("units", []),
    }
    return {"site": site_entry, "hierarchy": hierarchy}


@router.get("/knowledge")
def knowledge_library(category: str | None = None):
    items = knowledge_service.list_knowledge(category)
    return {"count": len(items), "items": items}


@router.get("/stats")
def stats():
    return stats_payload()


@router.get("/ai/status")
def ai_status():
    return provider.get_status()


@router.post("/ai/chat")
def ai_chat(request: ChatRequest):
    body = provider.chat_not_connected(request)
    return JSONResponse(status_code=503, content=body)
