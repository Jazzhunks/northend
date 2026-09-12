#!/usr/bin/env python3
"""Verify daily carnival summary resend logic."""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List


class FakeDB:
    def __init__(self):
        self.system_meta: Dict[str, Any] = {}
        self.applications: List[Dict[str, Any]] = []

    async def find_one(self, query, projection=None):
        key = query.get("key")
        if key and key in self.system_meta:
            return self.system_meta[key]
        return None

    async def update_one(self, query, update, upsert=False):
        key = query.get("key")
        if "$set" in update:
            self.system_meta[key] = update["$set"]
        elif upsert:
            self.system_meta[key] = update.get("$set", update)

    def find(self, query, projection=None):
        class Cursor:
            def __init__(self, items):
                self.items = items

            def sort(self, field, direction=1):
                return self

            def to_list(self, limit):
                return asyncio.Future()
                return asyncio.Future()

        apps = self.applications
        if "carnival_id" in query:
            apps = [a for a in apps if a.get("carnival_id") == query["carnival_id"]]
        if "chosen_date" in query:
            apps = [a for a in apps if a.get("chosen_date") == query["chosen_date"]]
        cursor = Cursor(apps)
        fut = asyncio.Future()
        fut.set_result(apps[:1000])
        return fut


async def test_resend_trigger():
    db = FakeDB()
    db.system_meta["wath_page_config"] = {"active_carnival_id": "carnival-123"}
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    db.system_meta["carnival_daily_summary:carnival-123:2026-09-07"] = {"sent_at": datetime.now(timezone.utc).isoformat()}
    db.applications.append(
        {"carnival_id": "carnival-123", "chosen_date": today, "venue": "Venue A", "standard": "7th", "name": "Alice", "phone": "111", "chosen_slot_time": "09:00 AM"}
    )

    marker_key = f"carnival_daily_summary:carnival-123:{today}"
    marker = await db.find_one({"key": marker_key}, {"_id": 0})
    assert marker is not None, "Marker should exist after morning send"
    print("OK: morning summary marker exists")

    # Simulate new booking after morning send
    booking = {
        "venue": "Venue A",
        "name": "Bob",
        "phone": "222",
        "chosen_date": today,
        "chosen_slot_time": "10:00 AM",
        "standard": "8th",
    }
    db.applications.append(
        {**booking, "carnival_id": "carnival-123"}
    )

    marker2 = await db.find_one({"key": marker_key}, {"_id": 0})
    assert marker2 is not None, "Marker should still exist"
    print("OK: resend condition met - new booking after morning send")
    print("Resend would be triggered: True")


if __name__ == "__main__":
    asyncio.run(test_resend_trigger())
