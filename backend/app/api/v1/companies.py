"""Company endpoints."""

from fastapi import APIRouter, HTTPException

from ...repositories.company_repo import CompanyRepository
from ...repositories.config_repo import ConfigRepository

router = APIRouter(prefix="/companies", tags=["companies"])
company_repo = CompanyRepository()
config_repo = ConfigRepository()


@router.get("")
def list_companies():
    return {"companies": company_repo.get_all()}


@router.get("/{company_id}")
def get_company(company_id: str):
    company = company_repo.get_by_id(company_id)
    if company is None:
        raise HTTPException(status_code=404, detail=f"Company '{company_id}' not found")
    hierarchy = config_repo.get_company_hierarchy(company["id"])
    return {"company": company, "hierarchy": hierarchy}
