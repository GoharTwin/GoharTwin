"""AI framework endpoints — no fake streaming."""

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from ...domain.models import ChatRequest
from ...modules.ai import provider

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/status")
def ai_status():
    return provider.get_status()


@router.post("/chat")
def ai_chat(request: ChatRequest):
    body = provider.chat_not_connected(request)
    return JSONResponse(status_code=503, content=body)
