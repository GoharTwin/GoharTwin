"""Auth user repository — reads knowledge/config/auth-users.json."""

from typing import Any

from ..core.config import load_json
from .base import Repository
from .json_repository import JsonRepository


class AuthRepository(Repository, JsonRepository):
    def __init__(self):
        JsonRepository.__init__(self, "config/auth-users.json", "users")

    def get_all(self) -> list[dict[str, Any]]:
        return self.get_list()

    def get_credential_pools(self) -> list[dict[str, Any]]:
        data = load_json("config/auth-users.json")
        if not isinstance(data, dict):
            return []
        pools = data.get("credentialPools", [])
        return pools if isinstance(pools, list) else []

    def get_by_id(self, user_id: str) -> dict[str, Any] | None:
        for user in self.get_all():
            if user["id"] == user_id:
                return user
        return None

    def get_by_username(self, username: str, company_id: str | None = None) -> dict[str, Any] | None:
        normalized = username.strip()
        for user in self.get_all():
            if user["username"] != normalized or not user.get("active", True):
                continue
            if company_id and user.get("companyId") != company_id:
                continue
            return user
        return self._resolve_pool_user(normalized, company_id)

    def _resolve_pool_user(self, username: str, company_id: str | None) -> dict[str, Any] | None:
        for pool in self.get_credential_pools():
            if not pool.get("active", True):
                continue
            if company_id and pool.get("companyId") != company_id:
                continue
            if not self._username_matches_pool(username, pool):
                continue
            display = pool.get("displayNameTemplate", "Operator {username}").replace("{username}", username)
            display_fa = pool.get("displayNameFaTemplate", "اپراتور {username}").replace("{username}", username)
            return {
                "id": f"user-{pool['companyId']}-{username}",
                "username": username,
                "passwordHash": pool["passwordHash"],
                "companyId": pool["companyId"],
                "roleId": pool.get("roleId", "operator"),
                "displayName": display,
                "displayNameFa": display_fa,
                "active": True,
                "poolId": pool["id"],
            }
        return None

    def _username_matches_pool(self, username: str, pool: dict[str, Any]) -> bool:
        legacy = pool.get("legacyUsernames", [])
        if username in legacy:
            return True
        username_range = pool.get("usernameRange")
        if not isinstance(username_range, dict):
            return False
        if not username.isdigit():
            return False
        value = int(username)
        return username_range.get("min", 0) <= value <= username_range.get("max", 0)
