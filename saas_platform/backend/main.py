import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from saas_platform.backend.api.routes import router as api_router
from saas_platform.backend.auth.org_middleware import OrgMiddleware
from quantum_ares_core.advisory.tier2_semantic import SemanticAdvisor

import asyncio

def initialize_service():
    advisor = SemanticAdvisor()
    try:
        advisor.initialize()
    except Exception as e:
        print("Optional service failed to start:", e)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize optional heavy services in background to avoid Render timeout port binding
    asyncio.create_task(asyncio.to_thread(initialize_service))
    yield
    # Cleanup logic here

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
