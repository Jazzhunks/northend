#!/usr/bin/env python3
"""Smoke test for daily carnival summary logic without starting the full server."""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, List


async def build_summary(rows: List[Dict[str, Any]]) -> str:
    venues: Dict[str, Any] = {}
    for row in rows:
        venue = (row.get("venue") or "—").strip()
        standard = (row.get("standard") or "—").strip()
        name = (row.get("name") or "—").strip()
        phone = (row.get("phone") or "—").strip()
        time = (row.get("chosen_slot_time") or "—").strip()
        venues.setdefault(venue, {}).setdefault(standard, []).append({
            "name": name,
            "phone": phone,
            "time": time,
        })

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [f"📋 *Today's Slot Bookings* ({today})\n"]
    for venue, classes in venues.items():
        lines.append(f"🏢 *Venue:* {venue}")
        for standard, entries in classes.items():
            if not entries:
                continue
            lines.append(f"\n*Class {standard}*")
            for entry in entries:
                lines.append(f"{entry['name']} -- {entry['phone']} -- {entry['time']}")
        lines.append("")

    return "\n".join(lines).strip()


def main() -> None:
    rows = [
        {"venue": "Venue A", "standard": "7th", "name": "Alice", "phone": "111", "chosen_slot_time": "09:00 AM"},
        {"venue": "Venue A", "standard": "8th", "name": "Bob", "phone": "222", "chosen_slot_time": "10:00 AM"},
        {"venue": "Venue B", "standard": "9th", "name": "Carol", "phone": "333", "chosen_slot_time": "11:00 AM"},
    ]
    text = asyncio.run(build_summary(rows))
    print(text)
    assert "Venue A" in text
    assert "Class 7th" in text
    assert "Alice -- 111 -- 09:00 AM" in text
    assert "Class 8th" in text
    assert "Bob -- 222 -- 10:00 AM" in text
    assert "Venue B" in text
    assert "Class 9th" in text
    assert "Carol -- 333 -- 11:00 AM" in text


if __name__ == "__main__":
    main()
