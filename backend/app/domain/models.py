"""Pydantic domain types for GoharTwin v0.3."""

from typing import Any

from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    username: str
    password: str
    companyId: str | None = None


class LoginResponse(BaseModel):
    token: str
    user: dict[str, Any]
    companyId: str
    roleId: str


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    equipmentId: str | None = None


class PlatformModule(BaseModel):
    id: str
    name: str
    nameFa: str
    icon: str
    status: str
    route: str


class EquipmentSummary(BaseModel):
    id: str
    tag: str
    name: str
    nameFa: str | None = None
    type: str
    plant: str
    area: str
    status: str
    category: str
    companyId: str | None = None
    healthScore: int | None = None


class SearchResult(BaseModel):
    id: str
    type: str
    title: str
    titleFa: str | None = None
    subtitle: str | None = None
    route: str | None = None


class AIStatusResponse(BaseModel):
    provider: str
    online: bool
    connected: bool
    knowledgeDriven: bool
    message: str
    messageFa: str
