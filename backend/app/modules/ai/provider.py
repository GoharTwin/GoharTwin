"""AI module — framework only, no fake responses."""

from ..core.logging import ai_log
from ..domain.models import AIStatusResponse, ChatRequest


def get_status() -> AIStatusResponse:
    return AIStatusResponse(
        provider="none",
        online=False,
        connected=False,
        knowledgeDriven=True,
        message="AI provider not connected",
        messageFa="ارائه‌دهنده هوش مصنوعی متصل نیست",
    )


def chat_not_connected(request: ChatRequest) -> dict:
    ai_log.info("Chat rejected — provider not connected: %s", request.message[:50])
    return {
        "error": "provider_not_connected",
        "message": "AI provider not connected. Configure an LLM provider to enable chat.",
        "messageFa": "ارائه‌دهنده هوش مصنوعی متصل نیست. برای فعال‌سازی چت، یک ارائه‌دهنده LLM پیکربندی کنید.",
    }
