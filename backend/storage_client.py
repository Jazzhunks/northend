"""Async object-storage helper using Emergent's built-in storage (httpx)."""
import os
import asyncio
import logging
import httpx

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = os.environ.get("APP_NAME", "northend")
log = logging.getLogger("storage")

_storage_key: str | None = None
_init_lock = asyncio.Lock()
_client: httpx.AsyncClient | None = None

def _get_client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0))
    return _client

async def init_storage() -> str | None:
    """Idempotent. Safe to call concurrently."""
    global _storage_key
    if _storage_key:
        return _storage_key
    async with _init_lock:
        if _storage_key:
            return _storage_key
        key = os.environ.get("EMERGENT_LLM_KEY")
        if not key:
            log.warning("EMERGENT_LLM_KEY missing; storage disabled.")
            return None
        try:
            r = await _get_client().post(f"{STORAGE_URL}/init", json={"emergent_key": key})
            r.raise_for_status()
            _storage_key = r.json()["storage_key"]
            log.info("Storage init OK")
            return _storage_key
        except Exception as e:
            log.error(f"Storage init failed: {e}")
            return None

async def _refresh_key() -> str:
    global _storage_key
    _storage_key = None
    k = await init_storage()
    if not k:
        raise RuntimeError("Storage not initialised")
    return k

async def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = await init_storage()
    if not key:
        raise RuntimeError("Storage not initialised")
    client = _get_client()
    r = await client.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        content=data,
    )
    if r.status_code == 403:
        key = await _refresh_key()
        r = await client.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            content=data,
        )
    r.raise_for_status()
    return r.json()

async def get_object(path: str) -> tuple[bytes, str]:
    key = await init_storage()
    if not key:
        raise RuntimeError("Storage not initialised")
    client = _get_client()
    r = await client.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key})
    if r.status_code == 403:
        key = await _refresh_key()
        r = await client.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key})
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")

async def aclose():
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None
