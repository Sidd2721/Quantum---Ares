import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from saas_platform.backend.api.routes import router as api_router
from saas_platform.backend.auth.org_middleware import OrgMiddleware
from quantum_ares_core.advisory.tier2_semantic import SemanticAdvisor

@asynccontextmanager
async def lifespan(app: FastAPI):
    # No heavy services should block or run in background during startup on Render.
    # Models and DBs will lazy load on first request.
    yield

app = FastAPI(
    title="QUANTUM-ARES API",
    version="7.45",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Org Isolation
# app.add_middleware(OrgMiddleware)


# Routes
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Quantum-Ares Backend Running"}

@app.get("/health")
def health():
    return {"status": "ok"}
