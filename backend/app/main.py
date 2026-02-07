from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.workflows import router as workflow_router
from app.database.db import init_db

app = FastAPI(title="Simulador de Custos de Workflows", version="0.3.0")

# ✅ CORS (frontend local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(workflow_router)


@app.on_event("startup")
def startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}
