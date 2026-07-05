"""AI Engineer module.

Defines a provider interface so a real LLM (OpenAI, local model, ...) can be
plugged in later. v0.2 ships a knowledge-driven stub provider that streams
canned bilingual answers, and answers FAN-11 questions from the real passport.
"""

import asyncio
from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

from .knowledge import get_equipment_by_id

# In-memory counter of AI chat requests (reported by /api/stats).
_request_count = 0


def get_request_count() -> int:
    return _request_count


def _bump_request_count() -> None:
    global _request_count
    _request_count += 1


class AIProvider(ABC):
    """Interface every AI backend must implement."""

    name: str = "base"

    @abstractmethod
    def stream_chat(
        self, message: str, language: str = "fa", equipment_id: str | None = None
    ) -> AsyncIterator[str]:
        """Yield the assistant reply as small text chunks."""


class StubProvider(AIProvider):
    """Offline provider: answers only from the knowledge base, per the handbook."""

    name = "stub"

    async def stream_chat(
        self, message: str, language: str = "fa", equipment_id: str | None = None
    ) -> AsyncIterator[str]:
        reply = self._build_reply(message, language, equipment_id)
        for word in reply.split(" "):
            yield word + " "
            await asyncio.sleep(0.03)

    def _build_reply(self, message: str, language: str, equipment_id: str | None) -> str:
        lowered = message.lower()
        mentions_fan = (
            "fan-11" in lowered
            or "fan 11" in lowered
            or "فن" in message
            or equipment_id == "fan-11"
        )
        if mentions_fan:
            passport = get_equipment_by_id("fan-11")
            if passport:
                return self._fan11_reply(passport, language)
        if language == "fa":
            return (
                "من **مهندس هوش مصنوعی گوهرتوین** هستم و فقط از پایگاه دانش کارخانه پاسخ می‌دهم.\n\n"
                "در نسخه ۰٫۲ شناسنامه کامل تجهیز **FAN-11** (فن خنک‌کننده ویندباکس ۱۱ کارخانه گندله) "
                "در دسترس من است. درباره مشخصات، سنسورها، اینترلاک‌ها یا برنامه نگهداری آن بپرسید.\n\n"
                "برای سایر تجهیزات: **دانش موجود نیست** — ابتدا شناسنامه آن تجهیز باید به پایگاه دانش اضافه شود."
            )
        return (
            "I am the **GoharTwin AI Engineer** and I answer only from the plant knowledge base.\n\n"
            "In v0.2 I have the full passport of **FAN-11** (Windbox Cooling Fan 11, Pellet Plant). "
            "Ask me about its specifications, sensors, interlocks or maintenance plan.\n\n"
            "For other equipment: **Knowledge not available** — its passport must be added to the knowledge base first."
        )

    def _fan11_reply(self, p: dict, language: str) -> str:
        motor = p.get("motor", {})
        sensors = p.get("sensors", [])
        maintenance = p.get("maintenance", {})
        sensor_lines = "\n".join(
            f"- `{s['tag']}` — {s['name']} ({s['unit']})" for s in sensors
        )
        interval_lines = "\n".join(
            f"- {i['task']}: **{i['frequency']}**" for i in maintenance.get("intervals", [])
        )
        if language == "fa":
            return (
                f"**{p['tag']} — {p.get('nameFa', p['name'])}**\n\n"
                f"این فن هوای خنک‌کننده ویندباکس ۱۱ کوره گریت-کیلن کارخانه گندله را تامین می‌کند "
                f"و وضعیت فعلی آن **{p['status']}** است.\n\n"
                f"**موتور محرک:** تگ `{motor.get('tag', 'TBD')}`، ولتاژ {motor.get('voltage_V', 'TBD')} ولت، "
                f"راه‌انداز {motor.get('starterType', 'TBD')}، کلاس بازده {motor.get('efficiencyClass', 'TBD')}.\n\n"
                f"**سنسورهای نصب‌شده:**\n{sensor_lines}\n\n"
                f"**برنامه نگهداری ({maintenance.get('strategy', 'TBD')}):**\n{interval_lines}\n\n"
                f"_منبع: شناسنامه دانش `knowledge/fans/fan-11.json` نسخه {p.get('version', '?')}_"
            )
        return (
            f"**{p['tag']} — {p['name']}**\n\n"
            f"This fan supplies cooling air to Windbox 11 of the grate-kiln furnace in the Pellet Plant. "
            f"Current status: **{p['status']}**.\n\n"
            f"**Drive motor:** tag `{motor.get('tag', 'TBD')}`, {motor.get('voltage_V', 'TBD')} V, "
            f"{motor.get('starterType', 'TBD')} starter, efficiency class {motor.get('efficiencyClass', 'TBD')}.\n\n"
            f"**Installed sensors:**\n{sensor_lines}\n\n"
            f"**Maintenance plan ({maintenance.get('strategy', 'TBD')}):**\n{interval_lines}\n\n"
            f"_Source: knowledge passport `knowledge/fans/fan-11.json` v{p.get('version', '?')}_"
        )


# Active provider — swap this for a real LLM provider later.
provider: AIProvider = StubProvider()


async def stream_chat(
    message: str, language: str = "fa", equipment_id: str | None = None
) -> AsyncIterator[str]:
    _bump_request_count()
    async for chunk in provider.stream_chat(message, language, equipment_id):
        yield chunk


def status() -> dict:
    return {
        "provider": provider.name,
        "online": True,
        "knowledgeDriven": True,
        "requestCount": _request_count,
    }
