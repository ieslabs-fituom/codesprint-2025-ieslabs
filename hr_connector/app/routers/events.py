from fastapi import APIRouter
from ..models import FingerprintEvent
from ..services import push_time_event

router = APIRouter(
    prefix="/events",
    tags=["events"]
)

@router.post("/", summary="Push a fingerprint IN/OUT event to Workday")
async def create_event(event: FingerprintEvent):
    result = await push_time_event(event)
    return {"status": "ok", "detail": result}