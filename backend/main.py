import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app import VERSION
from app.api.legacy import router as legacy_router
from app.api.v1.router import router as v1_router
from app.core.config import FRONTEND_DIST, ROOT

app = FastAPI(title="GoharTwin", version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(v1_router)
app.include_router(legacy_router)

logo_dir = ROOT / "logo"
if logo_dir.exists():
    app.mount("/logo", StaticFiles(directory=str(logo_dir)), name="logo")

branding_dir = ROOT / "assets" / "branding"
if branding_dir.exists():
    app.mount("/assets/branding", StaticFiles(directory=str(branding_dir)), name="branding")

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")
else:

    @app.get("/")
    def root():
        return {"name": "GoharTwin", "version": VERSION, "docs": "/docs", "api": "/api/v1"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
