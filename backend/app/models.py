from pydantic import BaseModel


class PlatformModule(BaseModel):
    id: str
    name: str
    nameFa: str
    icon: str
    status: str
    route: str


class EquipmentSummary(BaseModel):
    id: str
    tag: str | None = None
    name: str | None = None
    nameFa: str | None = None
    type: str | None = None
    plant: str | None = None
    area: str | None = None
    status: str | None = None
    category: str
