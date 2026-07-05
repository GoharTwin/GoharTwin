import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import VERSION
from app.api import router

app = FastAPI(title="GoharTwin", version=VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"name": "GoharTwin", "version": VERSION, "docs": "/docs"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
