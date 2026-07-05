"""Knowledge library endpoints."""

from fastapi import APIRouter

from ...services import knowledge_service

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.get("")
def knowledge_library(category: str | None = None):
    items = knowledge_service.list_knowledge(category)
    return {"count": len(items), "items": items}
