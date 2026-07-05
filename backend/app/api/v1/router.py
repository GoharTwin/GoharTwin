"""Aggregate v1 API routes."""

from fastapi import APIRouter

from ... import VERSION
from ...domain.models import PlatformModule
from ...repositories.company_repo import CompanyRepository
from ...repositories.config_repo import ConfigRepository
from . import admin, ai, auth, companies, equipment, knowledge, search
from .stats import stats_payload

router = APIRouter(prefix="/api/v1")

MODULES: list[PlatformModule] = [
    PlatformModule(id="companies", name="Industrial Companies", nameFa="شرکت‌های صنعتی", icon="factory", status="active", route="/companies"),
    PlatformModule(id="dashboard", name="Dashboard", nameFa="داشبورد", icon="gauge", status="active", route="/dashboard"),
    PlatformModule(id="ai-engineer", name="AI Engineer", nameFa="مهندس هوش مصنوعی", icon="bot", status="active", route="/ai"),
    PlatformModule(id="knowledge", name="Knowledge Center", nameFa="مرکز دانش", icon="book", status="active", route="/knowledge"),
    PlatformModule(id="integrations", name="Integrations", nameFa="یکپارچه‌سازی", icon="plug", status="active", route="/integrations"),
    PlatformModule(id="settings", name="Settings", nameFa="تنظیمات", icon="settings", status="active", route="/settings"),
]

company_repo = CompanyRepository()
config_repo = ConfigRepository()

router.include_router(auth.router)
router.include_router(companies.router)
router.include_router(equipment.router)
router.include_router(knowledge.router)
router.include_router(search.router)
router.include_router(ai.router)
router.include_router(admin.router)


@router.get("/health")
def health():
    return {"status": "ok", "version": VERSION}


@router.get("/modules")
def modules():
    return {"modules": MODULES}


@router.get("/stats")
def stats():
    return stats_payload()


@router.get("/hierarchy")
def hierarchy():
    return config_repo.get_legacy_hierarchy()


@router.get("/sites")
def sites_legacy():
    return {"sites": company_repo.to_legacy_sites()}


@router.get("/sites/{site_id}")
def site_detail_legacy(site_id: str):
    company = company_repo.get_by_id(site_id)
    if company is None:
        from fastapi import HTTPException
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
