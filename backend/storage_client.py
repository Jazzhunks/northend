"""Object storage helper using Emergent's built-in storage."""
import os
import requests
import logging

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = os.environ.get("APP_NAME", "northend")
log = logging.getLogger("storage")

_storage_key = None

def init_storage():
    global _storage_key
    if _storage_key:
        return _storage_key
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        log.warning("EMERGENT_LLM_KEY missing; storage disabled.")
        return None
    try:
        r = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": key}, timeout=30)
        r.raise_for_status()
        _storage_key = r.json()["storage_key"]
        log.info("Storage init OK")
        return _storage_key
    except Exception as e:
        log.error(f"Storage init failed: {e}")
        return None

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise RuntimeError("Storage not initialised")
    r = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    if r.status_code == 403:
        # try refreshing once
        global _storage_key
        _storage_key = None
        key = init_storage()
        r = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data, timeout=120
        )
    r.raise_for_status()
    return r.json()

def get_object(path: str):
    key = init_storage()
    if not key:
        raise RuntimeError("Storage not initialised")
    r = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")
