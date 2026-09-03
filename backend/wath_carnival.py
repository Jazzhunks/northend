"""WATH page + Carnival domain module.

Provides:
- /api/wath/page              (public) — returns the current page mode + exam / carnival payload
- /api/wath/carnivals/{id}    (public) — carnival with fresh capacity snapshot
- /api/admin/wath/*           (admin)  — CRUD + config toggle

The WATH page has three modes controlled by system_meta.wath_page_config:
    mode: "exam" | "carnival" | "disabled"
    active_carnival_id: <id> when mode="carnival"
"""
from __future__ import annotations
import uuid
import hashlib
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field


PAGE_CONFIG_KEY = "wath_page_config"


class WathSlot(BaseModel):
    time: str  # human "10:00 AM"
    capacity: int = Field(ge=1)
    is_open: bool = True


class WathExamDate(BaseModel):
    date: str  # YYYY-MM-DD
    slots: List[WathSlot]


class WathCarnivalIn(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    start_date: str  # YYYY-MM-DD (campaign period begins)
    end_date: str    # YYYY-MM-DD (campaign period ends)
    exam_dates: List[WathExamDate] = []
    banner_url: Optional[str] = None
    active: bool = True


class WathPageConfigIn(BaseModel):
    mode: str = Field(pattern="^(exam|carnival|disabled)$")
    active_carnival_id: Optional[str] = None
    disabled_message: Optional[str] = None


def build_wath_router(db, require_admin_dep) -> APIRouter:
    router = APIRouter()

    def _iso() -> str:
        return datetime.now(timezone.utc).isoformat()

    def _new_id() -> str:
        return str(uuid.uuid4())

    async def _get_page_config() -> Dict[str, Any]:
        cfg = await db.system_meta.find_one({"key": PAGE_CONFIG_KEY}, {"_id": 0})
        if not cfg:
            return {"key": PAGE_CONFIG_KEY, "mode": "exam", "active_carnival_id": None, "disabled_message": None}
        return cfg

    async def _hydrate_carnival(carnival: Dict[str, Any], pad: bool = False) -> Dict[str, Any]:
        """Merge live booked_count from wath_slot_counts into the carnival's exam_dates.

        When pad=True (public views only), the DISPLAYED booked_count / remaining are
        inflated so slots appear ~50-70% full to create urgency ("booking fast"),
        while `available` and real capacity stay truthful so genuine registrations
        are NEVER blocked until the real capacity is reached. Admin views pass pad=False
        and always see the real numbers.
        """
        def _fill_fraction(cid: str, date: str, time: str) -> float:
            h = int(hashlib.md5(f"{cid}|{date}|{time}".encode()).hexdigest(), 16)
            return 0.50 + (h % 21) / 100.0  # deterministic 0.50 .. 0.70

        counts = await db.wath_slot_counts.find({"carnival_id": carnival["id"]}, {"_id": 0}).to_list(500)
        by_key = {f"{c['date']}|{c['time']}": c["booked_count"] for c in counts}
        for d in carnival.get("exam_dates", []):
            for s in d.get("slots", []):
                k = f"{d['date']}|{s['time']}"
                capacity = int(s.get("capacity", 0))
                real_booked = int(by_key.get(k, 0))
                real_remaining = max(0, capacity - real_booked)
                # `available` is ALWAYS based on the real remaining capacity.
                s["available"] = bool(s.get("is_open", True)) and real_remaining > 0
                if pad and capacity > 0:
                    if not s["available"]:
                        # Public view: closed/full slots read "Full" and add 0 to date totals.
                        s["booked_count"] = capacity
                        s["remaining"] = 0
                    else:
                        padded_booked = max(real_booked, round(capacity * _fill_fraction(carnival["id"], d["date"], s["time"])))
                        padded_booked = min(padded_booked, capacity - 1)  # always show ≥1 left while real seats exist
                        s["booked_count"] = padded_booked
                        s["remaining"] = max(0, capacity - padded_booked)
                else:
                    # Admin view: always real numbers.
                    s["booked_count"] = real_booked
                    s["remaining"] = real_remaining
        return carnival

    async def _get_wath_exam_campaign() -> Optional[Dict[str, Any]]:
        """The permanent WATH exam campaign (kind=wath). If none present, fall back to the newest active scholarship whose title contains WATH."""
        camp = await db.scholarships.find_one({"kind": "wath", "active": True}, {"_id": 0}, sort=[("created_at", -1)])
        if not camp:
            camp = await db.scholarships.find_one({"title": {"$regex": "WATH", "$options": "i"}, "active": True}, {"_id": 0}, sort=[("created_at", -1)])
        return camp

    # ---------- Public: read page state ----------
    @router.get("/wath/page")
    async def wath_page():
        cfg = await _get_page_config()
        mode = cfg.get("mode", "exam")
        payload: Dict[str, Any] = {"mode": mode, "disabled_message": cfg.get("disabled_message")}
        if mode == "carnival":
            car = None
            if cfg.get("active_carnival_id"):
                car = await db.wath_carnivals.find_one({"id": cfg["active_carnival_id"]}, {"_id": 0})
            if not car:
                # fallback: newest active carnival
                car = await db.wath_carnivals.find_one({"active": True}, {"_id": 0}, sort=[("created_at", -1)])
            if car:
                payload["carnival"] = await _hydrate_carnival(car, pad=True)
            else:
                # No carnival configured — degrade gracefully to exam mode
                payload["mode"] = "exam"
        if payload["mode"] == "exam":
            payload["exam"] = await _get_wath_exam_campaign()
        return payload

    @router.get("/wath/carnivals/{cid}")
    async def get_carnival(cid: str):
        car = await db.wath_carnivals.find_one({"id": cid}, {"_id": 0})
        if not car:
            raise HTTPException(404, "Carnival not found")
        return await _hydrate_carnival(car, pad=True)

    # ---------- Admin: page config ----------
    @router.get("/admin/wath/page-config")
    async def get_page_config(_admin=Depends(require_admin_dep)):
        return await _get_page_config()

    @router.post("/admin/wath/page-config")
    async def set_page_config(payload: WathPageConfigIn, _admin=Depends(require_admin_dep)):
        # Validate active carnival exists when mode=carnival
        if payload.mode == "carnival":
            if not payload.active_carnival_id:
                raise HTTPException(400, "active_carnival_id is required when mode=carnival")
            car = await db.wath_carnivals.find_one({"id": payload.active_carnival_id})
            if not car:
                raise HTTPException(404, "Carnival not found")
        doc = payload.model_dump()
        doc["key"] = PAGE_CONFIG_KEY
        doc["updated_at"] = _iso()
        await db.system_meta.update_one({"key": PAGE_CONFIG_KEY}, {"$set": doc}, upsert=True)
        return await _get_page_config()

    # ---------- Admin: carnival CRUD ----------
    @router.get("/admin/wath/carnivals")
    async def list_carnivals(_admin=Depends(require_admin_dep)):
        rows = await db.wath_carnivals.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
        for r in rows:
            await _hydrate_carnival(r)
        return rows

    @router.get("/admin/wath/carnivals/{cid}")
    async def get_carnival_admin(cid: str, _admin=Depends(require_admin_dep)):
        car = await db.wath_carnivals.find_one({"id": cid}, {"_id": 0})
        if not car:
            raise HTTPException(404, "Carnival not found")
        return await _hydrate_carnival(car)

    @router.post("/admin/wath/carnivals")
    async def create_carnival(payload: WathCarnivalIn, _admin=Depends(require_admin_dep)):
        doc = payload.model_dump()
        doc["id"] = _new_id()
        doc["kind"] = "carnival"
        doc["created_at"] = _iso()
        await db.wath_carnivals.insert_one(doc)
        doc.pop("_id", None)
        return await _hydrate_carnival(doc)

    @router.put("/admin/wath/carnivals/{cid}")
    async def update_carnival(cid: str, payload: WathCarnivalIn, _admin=Depends(require_admin_dep)):
        data = payload.model_dump()
        data["updated_at"] = _iso()
        res = await db.wath_carnivals.update_one({"id": cid}, {"$set": data})
        if not res.matched_count:
            raise HTTPException(404, "Carnival not found")
        car = await db.wath_carnivals.find_one({"id": cid}, {"_id": 0})
        return await _hydrate_carnival(car)

    @router.delete("/admin/wath/carnivals/{cid}")
    async def delete_carnival(cid: str, _admin=Depends(require_admin_dep)):
        # Un-set active_carnival_id if we're deleting the active one
        cfg = await _get_page_config()
        if cfg.get("active_carnival_id") == cid:
            await db.system_meta.update_one({"key": PAGE_CONFIG_KEY}, {"$set": {"active_carnival_id": None, "mode": "exam"}})
        await db.wath_carnivals.delete_one({"id": cid})
        await db.wath_slot_counts.delete_many({"carnival_id": cid})
        return {"ok": True}

    # ---------- Admin: per-carnival registrations ----------
    @router.get("/admin/wath/carnivals/{cid}/registrations")
    async def list_registrations(cid: str, _admin=Depends(require_admin_dep)):
        return await db.scholarship_applications.find(
            {"carnival_id": cid}, {"_id": 0}
        ).sort("created_at", -1).to_list(2000)

    return router


async def try_reserve_slot(db, carnival_id: str, date: str, time: str) -> bool:
    """Atomically increment a slot's booked_count if capacity remains.

    Returns True on success, False if slot is full/closed/nonexistent.

    Strategy (safe under high concurrency and against the earlier upsert-bypass bug):
      1. Verify the slot exists and is_open on the carnival document.
      2. Try to increment an EXISTING counter row where booked_count < capacity.
         (No upsert — if the row doesn't exist yet, this returns None.)
      3. If step 2 didn't match, try to INSERT a fresh counter with booked_count=1.
         A unique index on (carnival_id,date,time) makes the insert fail with
         DuplicateKey if another concurrent request already inserted it — in
         that case we retry step 2 once, which will now find the existing row.
    """
    car = await db.wath_carnivals.find_one({"id": carnival_id}, {"_id": 0})
    if not car:
        return False
    slot = None
    for d in car.get("exam_dates", []):
        if d.get("date") == date:
            for s in d.get("slots", []):
                if s.get("time") == time:
                    slot = s
                    break
    if not slot or not slot.get("is_open", True):
        return False
    capacity = int(slot.get("capacity", 0))
    if capacity <= 0:
        return False

    # Best-effort unique index (idempotent — safe to call every time).
    try:
        await db.wath_slot_counts.create_index(
            [("carnival_id", 1), ("date", 1), ("time", 1)],
            unique=True, name="uniq_carnival_date_time"
        )
    except Exception:
        pass

    async def _increment_existing() -> bool:
        res = await db.wath_slot_counts.find_one_and_update(
            {"carnival_id": carnival_id, "date": date, "time": time, "booked_count": {"$lt": capacity}},
            {"$inc": {"booked_count": 1}, "$set": {"capacity": capacity}},
            return_document=True,
        )
        return res is not None

    if await _increment_existing():
        return True

    # Row either doesn't exist yet, or exists and is full.
    from pymongo.errors import DuplicateKeyError
    try:
        await db.wath_slot_counts.insert_one({
            "carnival_id": carnival_id, "date": date, "time": time,
            "capacity": capacity, "booked_count": 1,
        })
        return True
    except DuplicateKeyError:
        # Another request inserted first — try incrementing again.
        return await _increment_existing()


async def release_slot(db, carnival_id: str, date: str, time: str) -> None:
    await db.wath_slot_counts.update_one(
        {"carnival_id": carnival_id, "date": date, "time": time, "booked_count": {"$gt": 0}},
        {"$inc": {"booked_count": -1}},
    )
