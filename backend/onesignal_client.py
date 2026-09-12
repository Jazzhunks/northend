"""OneSignal REST API client for sending push notifications."""

import json
import logging
import os
from typing import Any, Dict, List, Optional

import httpx

logger = logging.getLogger("onesignal")

ONESIGNAL_APP_ID = os.getenv("ONESIGNAL_APP_ID", "41952295-559a-4ac1-9431-36443a3195ee")
ONESIGNAL_API_KEY = os.getenv("ONESIGNAL_API_KEY")
ONESIGNAL_API_URL = "https://api.onesignal.com/notifications"


async def send_onesignal_notification(
    headings: Dict[str, str],
    contents: Dict[str, str],
    *,
    included_segments: Optional[List[str]] = None,
    include_external_user_ids: Optional[List[str]] = None,
    filters: Optional[List[Dict[str, Any]]] = None,
    data: Optional[Dict[str, Any]] = None,
    url: Optional[str] = None,
    image: Optional[str] = None,
    name: Optional[str] = None,
) -> Dict[str, Any]:
    """Send a OneSignal push notification.

    Exactly one of `included_segments`, `include_external_user_ids`, or `filters`
    must be provided to target recipients.
    """
    if not ONESIGNAL_API_KEY:
        logger.warning("ONESIGNAL_API_KEY not configured; skipping push notification")
        return {"skipped": True}

    payload: Dict[str, Any] = {
        "app_id": ONESIGNAL_APP_ID,
        "headings": headings,
        "contents": contents,
        "priority": 10,
    }

    if included_segments is not None:
        payload["included_segments"] = included_segments
    if include_external_user_ids is not None:
        payload["include_external_user_ids"] = include_external_user_ids
    if filters is not None:
        payload["filters"] = filters
    if data is not None:
        payload["data"] = data
    if url is not None:
        payload["url"] = url
    if image is not None:
        payload["chrome_web_image"] = image
    if name is not None:
        payload["name"] = name

    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": f"Basic {ONESIGNAL_API_KEY}",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(ONESIGNAL_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            result = response.json()
            logger.info("OneSignal notification sent: %s", result.get("id"))
            return result
    except Exception as exc:
        logger.error("Failed to send OneSignal notification: %s", exc)
        return {"error": str(exc)}


async def notify_admins(
    title: str,
    message: str,
    *,
    data: Optional[Dict[str, Any]] = None,
    url: Optional[str] = None,
) -> Dict[str, Any]:
    """Send a push notification to all admin-tagged subscribers."""
    return await send_onesignal_notification(
        headings={"en": title},
        contents={"en": message},
        filters=[
            {"field": "tag", "key": "role", "value": "admin"},
        ],
        data=data or {},
        url=url or "/admin",
    )


async def notify_students(
    title: str,
    message: str,
    *,
    data: Optional[Dict[str, Any]] = None,
    url: Optional[str] = None,
) -> Dict[str, Any]:
    """Send a push notification to all student-tagged subscribers."""
    return await send_onesignal_notification(
        headings={"en": title},
        contents={"en": message},
        filters=[
            {"field": "tag", "key": "role", "value": "student"},
        ],
        data=data or {},
        url=url or "/",
    )
