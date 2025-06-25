import httpx
from fastapi import HTTPException
from .auth import get_access_token
from .config import settings
from .models import FingerprintEvent

async def push_time_event(event: FingerprintEvent):
    token = await get_access_token()
    url = f"https://{settings.workday_host}/ccx/api/v1/{settings.tenant}/timeClockEvents"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "workerId": event.employee_wid,
        "eventDateTime": event.timestamp,
        "eventType": event.event_type.value
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, headers=headers, timeout=10)

    if resp.status_code == 201:
        return resp.json()
    raise HTTPException(status_code=resp.status_code, detail=resp.text)