"""Authentication endpoints."""

from fastapi import APIRouter, Header, HTTPException

from ...domain.models import LoginRequest
from ...services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(request: LoginRequest):
    result = auth_service.authenticate(request.username, request.password, request.companyId)
    if result is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return result


@router.get("/me")
def me(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    user = auth_service.get_current_user(token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"user": user}
