"""Search endpoints."""

from fastapi import APIRouter

from ...services import search_service

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
def universal_search(q: str = "", limit: int = 20):
    results = search_service.search(q, limit)
    return {"query": q, "count": len(results), "results": results}
