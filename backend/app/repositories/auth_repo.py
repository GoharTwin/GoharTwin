"""Auth user repository — reads knowledge/config/auth-users.json."""

from typing import Any

from .base import Repository
from .json_repository import JsonRepository


class AuthRepository(Repository, JsonRepository):
    def __init__(self):
        JsonRepository.__init__(self, "config/auth-users.json", "users")

    def get_all(self) -> list[dict[str, Any]]:
        return self.get_list()

    def get_by_id(self, user_id: str) -> dict[str, Any] | None:
        for user in self.get_all():
            if user["id"] == user_id:
                return user
        return None

    def get_by_username(self, username: str, company_id: str | None = None) -> dict[str, Any] | None:
        for user in self.get_all():
            if user["username"] != username or not user.get("active", True):
                continue
            if company_id and user.get("companyId") != company_id:
                continue
            return user
        return None
