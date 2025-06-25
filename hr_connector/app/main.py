from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from .config import settings
from .routers.events import router as events_router

app = FastAPI(
    title="Workday Fingerprint Connector",
    version="1.0.0"
)

# CORS – tighten origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/health", summary="Service health check")
async def healthy():
    return {"status": "healthy"}

# Mount fingerprint events router
app.include_router(events_router)