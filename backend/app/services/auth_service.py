"""Authentication service — JWT tokens from config users."""

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from ..core.config import JWT_ALGORITHM, JWT_EXPIRE_HOURS, JWT_SECRET
from ..core.logging import auth_log
from ..repositories.auth_repo import AuthRepository
from ..repositories.company_repo import CompanyRepository

auth_repo = AuthRepository()
company_repo = CompanyRepository()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def create_token(user: dict) -> str:
    payload = {
        "sub": user["id"],
        "username": user["username"],
        "companyId": user["companyId"],
        "roleId": user["roleId"],
        "displayName": user.get("displayName"),
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        return None


def authenticate(username: str, password: str, company_id: str | None = None) -> dict | None:
    resolved = company_repo.resolve_id(company_id) if company_id else None
    user = auth_repo.get_by_username(username, resolved)
    if user is None:
        auth_log.warning("Login failed: user not found %s", username)
        return None
    if not verify_password(password, user["passwordHash"]):
        auth_log.warning("Login failed: bad password for %s", username)
        return None
    token = create_token(user)
    auth_log.info("Login success: %s @ %s", username, user["companyId"])
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "displayName": user.get("displayName"),
            "displayNameFa": user.get("displayNameFa"),
        },
        "companyId": user["companyId"],
        "roleId": user["roleId"],
    }


def get_current_user(token: str) -> dict | None:
    payload = decode_token(token)
    if not payload:
        return None
    user = auth_repo.get_by_id(payload["sub"])
    if not user:
        return payload
    return {
        "id": user["id"],
        "username": user["username"],
        "displayName": user.get("displayName"),
        "displayNameFa": user.get("displayNameFa"),
        "companyId": user["companyId"],
        "roleId": user["roleId"],
    }
