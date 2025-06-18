import time
import httpx
from fastapi import HTTPException
from .config import settings

# Simple in-memory cache for token
_token_cache = {"expires_at": 0, "access_token": ""}

async def get_access_token() -> str:
    now = time.time()
    # reuse token until 60s before expiry
    if _token_cache["expires_at"] > now + 60:
        return _token_cache["access_token"]

    url = f"https://{settings.workday_host}/ccx/oauth2/{settings.tenant}/token"
    auth = (settings.client_id, settings.client_secret)
    data = {"grant_type": "client_credentials"}

    async with httpx.AsyncClient() as client:
        resp = await client.post(url, data=data, auth=auth, timeout=10)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch Workday token")

    token_data = resp.json()
    _token_cache.update({
        "access_token": token_data["access_token"],
        "expires_at": now + token_data.get("expires_in", 3600)
    })
    return _token_cache["access_token"]