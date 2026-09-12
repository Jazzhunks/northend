"""WhatsApp Cloud API inbox — webhook receiver + outbound send + admin API.

Endpoints (all mounted on the shared /api APIRouter):
    GET  /api/webhooks/whatsapp     — Meta verify handshake
    POST /api/webhooks/whatsapp     — inbound messages + status updates
    GET  /api/whatsapp/threads      — list conversations (super_admin only)
    GET  /api/whatsapp/threads/{id}/messages
    PATCH /api/whatsapp/threads/{id}/read
    POST /api/whatsapp/threads/{id}/messages     — send text / template / media
    GET  /api/whatsapp/templates    — list message templates
"""
from __future__ import annotations

import os
import hmac
import json
import uuid
import hashlib
import logging
import asyncio
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

import httpx
from fastapi import APIRouter, HTTPException, Request, Response, Query, Depends
from pydantic import BaseModel, Field

logger = logging.getLogger("whatsapp")

VERSION = os.environ.get("GRAPH_API_VERSION", "v20.0")


class SendMessageIn(BaseModel):
    kind: str = Field(pattern="^(text|template|image|document|audio|video|interactive)$")
    text: Optional[str] = None
    # template
    template_name: Optional[str] = None
    template_language: str = "en_US"
    template_components: List[Dict[str, Any]] = []
    # media
    media_url: Optional[str] = None
    media_id: Optional[str] = None
    caption: Optional[str] = None
    filename: Optional[str] = None
    # interactive
    interactive_type: Optional[str] = "button" # "button" or "list"
    interactive_buttons: List[Dict[str, str]] = [] # [{"id": "btn1", "title": "Option 1"}]
    interactive_header: Optional[str] = None
    interactive_footer: Optional[str] = None

class CreateTemplateIn(BaseModel):
    name: str
    category: str = "UTILITY" # "MARKETING", "UTILITY", "AUTHENTICATION"
    language: str = "en_US"
    body_text: str
    header_text: Optional[str] = None
    footer_text: Optional[str] = None
    buttons: List[Dict[str, str]] = [] # [{"type": "QUICK_REPLY", "text": "Yes"}]

class BroadcastCampaignIn(BaseModel):
    template_name: str
    template_language: str = "en_US"
    template_components: List[Dict[str, Any]] = []
    target_group: str = "all" # "leads", "students", "all"
    branch_id: Optional[str] = None


def _cfg(key: str) -> str:
    v = os.environ.get(key, "").strip()
    return v


def build_whatsapp_router(db, require_super_admin_dep, on_inbound=None) -> APIRouter:
    """Attach the WhatsApp routes to an APIRouter mounted at /api."""
    router = APIRouter()

    # ---------- helpers ----------
    def now_iso() -> str:
        return datetime.now(timezone.utc).isoformat()

    def new_id() -> str:
        return str(uuid.uuid4())

    def _verify_signature(raw: bytes, header: str | None) -> None:
        secret = _cfg("WHATSAPP_APP_SECRET").encode()
        if not secret:
            raise HTTPException(500, "WhatsApp app secret not configured")
        if not header or not header.startswith("sha256="):
            raise HTTPException(401, "missing signature")
        expected = hmac.new(secret, raw, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(header[7:], expected):
            raise HTTPException(401, "invalid signature")

    async def _upsert_contact(wa_id: str, profile_name: Optional[str]) -> Dict[str, Any]:
        existing = await db.wa_contacts.find_one({"wa_id": wa_id})
        if existing:
            patch = {"updated_at": now_iso()}
            if profile_name and profile_name != existing.get("profile_name"):
                patch["profile_name"] = profile_name
            await db.wa_contacts.update_one({"wa_id": wa_id}, {"$set": patch})
            existing.update(patch)
            existing.pop("_id", None)
            # Auto-link to any scholarship applicant with matching phone
            applicant = await db.scholarship_applications.find_one(
                {"phone": wa_id}, {"_id": 0, "application_no": 1, "scholarship_title": 1, "name": 1}
            )
            if applicant and not existing.get("linked_application_no"):
                await db.wa_contacts.update_one(
                    {"wa_id": wa_id},
                    {"$set": {
                        "linked_application_no": applicant.get("application_no"),
                        "linked_scholarship_title": applicant.get("scholarship_title"),
                        "linked_name": applicant.get("name"),
                    }},
                )
            return existing
        applicant = await db.scholarship_applications.find_one(
            {"phone": wa_id}, {"_id": 0, "application_no": 1, "scholarship_title": 1, "name": 1}
        )
        doc = {
            "id": new_id(),
            "wa_id": wa_id,
            "phone_e164": wa_id if wa_id.startswith("+") else f"+{wa_id}",
            "profile_name": profile_name,
            "linked_application_no": (applicant or {}).get("application_no"),
            "linked_scholarship_title": (applicant or {}).get("scholarship_title"),
            "linked_name": (applicant or {}).get("name"),
            "created_at": now_iso(),
            "updated_at": now_iso(),
        }
        await db.wa_contacts.insert_one(doc)
        doc.pop("_id", None)
        return doc

    async def _upsert_thread(contact: Dict[str, Any], last_msg_preview: str, direction: str, msg_ts: str) -> Dict[str, Any]:
        thread = await db.wa_threads.find_one({"contact_id": contact["id"]})
        if not thread:
            thread = {
                "id": new_id(),
                "contact_id": contact["id"],
                "wa_id": contact["wa_id"],
                "last_message_at": msg_ts,
                "last_message_preview": last_msg_preview[:200],
                "unread_count": 1 if direction == "inbound" else 0,
                "created_at": now_iso(),
            }
            await db.wa_threads.insert_one(thread)
            thread.pop("_id", None)
            return thread
        patch = {"last_message_at": msg_ts, "last_message_preview": last_msg_preview[:200]}
        if direction == "inbound":
            patch["unread_count"] = int(thread.get("unread_count", 0)) + 1
        await db.wa_threads.update_one({"id": thread["id"]}, {"$set": patch})
        thread.update(patch)
        thread.pop("_id", None)
        return thread

    def _extract_text_preview(msg: Dict[str, Any]) -> str:
        t = msg.get("type", "")
        if t == "text":
            return (msg.get("text") or {}).get("body", "")
        if t == "image":
            return "📷 Image" + (f" · {msg['image'].get('caption','')}" if msg.get("image", {}).get("caption") else "")
        if t == "document":
            return f"📄 {msg.get('document', {}).get('filename', 'Document')}"
        if t == "audio":
            return "🎙️ Voice message"
        if t == "video":
            return "🎬 Video"
        if t == "location":
            return "📍 Location"
        if t == "sticker":
            return "🖼️ Sticker"
        return f"[{t}]"

    async def _persist_inbound(value: Dict[str, Any], msg: Dict[str, Any]) -> None:
        contacts_meta = value.get("contacts", []) or []
        profile_name = None
        if contacts_meta:
            profile_name = (contacts_meta[0].get("profile") or {}).get("name")
        wa_id = msg.get("from")
        if not wa_id:
            return
        contact = await _upsert_contact(wa_id, profile_name)

        wa_msg_id = msg.get("id")
        if not wa_msg_id:
            return
        # Idempotency: skip if already stored
        if await db.wa_messages.find_one({"wa_message_id": wa_msg_id}):
            return

        preview = _extract_text_preview(msg)
        ts_epoch = int(msg.get("timestamp", 0))
        msg_ts = datetime.fromtimestamp(ts_epoch, tz=timezone.utc).isoformat() if ts_epoch else now_iso()

        thread = await _upsert_thread(contact, preview, "inbound", msg_ts)

        doc = {
            "id": new_id(),
            "thread_id": thread["id"],
            "wa_message_id": wa_msg_id,
            "direction": "inbound",
            "type": msg.get("type", "text"),
            "body": msg,
            "text": preview if msg.get("type") == "text" else None,
            "caption": (msg.get(msg.get("type", ""), {}) or {}).get("caption"),
            "status": "received",
            "wa_timestamp": msg_ts,
            "created_at": now_iso(),
        }
        await db.wa_messages.insert_one(doc)
        if on_inbound is not None:
            asyncio.create_task(on_inbound({
                "wa_id": wa_id,
                "message_id": wa_msg_id,
                "thread_id": thread["id"],
                "type": msg.get("type", "text"),
                "preview": preview,
                "wa_timestamp": msg_ts,
            }))

    _STATUS_ORDER = {"failed": -1, "accepted": 0, "sent": 1, "delivered": 2, "read": 3, "received": 0}

    async def _persist_status(status: Dict[str, Any]) -> None:
        wa_id = status.get("id")
        new_status = status.get("status")
        if not wa_id or not new_status:
            return
        existing = await db.wa_messages.find_one({"wa_message_id": wa_id})
        if not existing:
            return
        cur = _STATUS_ORDER.get(existing.get("status", ""), 0)
        nxt = _STATUS_ORDER.get(new_status, 0)
        if nxt < cur and new_status != "failed":
            # Do not regress e.g. read -> delivered
            return
        patch = {"status": new_status}
        if status.get("errors"):
            patch["status_error"] = status["errors"]
        await db.wa_messages.update_one({"wa_message_id": wa_id}, {"$set": patch})

    # ---------- Webhook ----------
    @router.get("/webhooks/whatsapp")
    async def verify_webhook(
        hub_mode: Optional[str] = Query(None, alias="hub.mode"),
        hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
        hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
    ):
        expected = _cfg("WHATSAPP_WEBHOOK_VERIFY_TOKEN")
        if hub_mode == "subscribe" and expected and hmac.compare_digest(hub_verify_token or "", expected):
            return Response(content=hub_challenge or "", media_type="text/plain")
        raise HTTPException(403, "verification failed")

    @router.post("/webhooks/whatsapp")
    async def whatsapp_webhook(request: Request):
        raw = await request.body()
        # Only enforce signature check when the secret is configured (skipped for dev)
        if _cfg("WHATSAPP_APP_SECRET"):
            _verify_signature(raw, request.headers.get("x-hub-signature-256"))
        try:
            payload = json.loads(raw or b"{}")
        except Exception:
            raise HTTPException(400, "Invalid JSON")

        for entry in payload.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {}) or {}
                for msg in value.get("messages", []) or []:
                    try:
                        await _persist_inbound(value, msg)
                    except Exception as e:
                        logger.exception(f"persist_inbound failed: {e}")
                for st in value.get("statuses", []) or []:
                    try:
                        await _persist_status(st)
                    except Exception as e:
                        logger.exception(f"persist_status failed: {e}")
        return {"ok": True}

    # ---------- Admin (Super Admin) API ----------
    @router.get("/whatsapp/threads")
    async def list_threads(
        limit: int = Query(50, ge=1, le=200),
        _user=Depends(require_super_admin_dep),
    ):
        threads = await db.wa_threads.find({}, {"_id": 0}).sort("last_message_at", -1).to_list(limit)
        contact_ids = [t["contact_id"] for t in threads]
        contacts = {c["id"]: c for c in await db.wa_contacts.find({"id": {"$in": contact_ids}}, {"_id": 0}).to_list(len(contact_ids) or 1)}
        out = []
        for t in threads:
            c = contacts.get(t["contact_id"], {})
            out.append({
                **t,
                "profile_name": c.get("profile_name"),
                "wa_id": c.get("wa_id") or t.get("wa_id"),
                "linked_application_no": c.get("linked_application_no"),
                "linked_scholarship_title": c.get("linked_scholarship_title"),
                "linked_name": c.get("linked_name"),
            })
        return out

    @router.get("/whatsapp/threads/{thread_id}/messages")
    async def get_messages(thread_id: str, limit: int = Query(100, ge=1, le=500), _user=Depends(require_super_admin_dep)):
        thread = await db.wa_threads.find_one({"id": thread_id}, {"_id": 0})
        if not thread:
            raise HTTPException(404, "Thread not found")
        contact = await db.wa_contacts.find_one({"id": thread["contact_id"]}, {"_id": 0})
        msgs = await db.wa_messages.find({"thread_id": thread_id}, {"_id": 0}).sort("wa_timestamp", 1).to_list(limit)
        return {"thread": thread, "contact": contact, "items": msgs}

    @router.patch("/whatsapp/threads/{thread_id}/read")
    async def mark_read(thread_id: str, _user=Depends(require_super_admin_dep)):
        await db.wa_threads.update_one({"id": thread_id}, {"$set": {"unread_count": 0}})
        return {"ok": True}

    # ---------- Send ----------
    @router.post("/whatsapp/threads/{thread_id}/messages")
    async def send_message(thread_id: str, req: SendMessageIn, _user=Depends(require_super_admin_dep)):
        thread = await db.wa_threads.find_one({"id": thread_id}, {"_id": 0})
        if not thread:
            raise HTTPException(404, "Thread not found")
        contact = await db.wa_contacts.find_one({"id": thread["contact_id"]}, {"_id": 0})
        if not contact:
            raise HTTPException(404, "Contact not found")

        token = _cfg("WHATSAPP_ACCESS_TOKEN")
        phone_id = _cfg("WHATSAPP_PHONE_NUMBER_ID")
        if not token or not phone_id:
            raise HTTPException(500, "WhatsApp credentials not configured on server")

        to = contact["wa_id"]
        payload: Dict[str, Any] = {"messaging_product": "whatsapp", "recipient_type": "individual", "to": to, "type": req.kind}
        preview = ""
        if req.kind == "text":
            if not req.text:
                raise HTTPException(400, "text is required for kind=text")
            payload["text"] = {"preview_url": False, "body": req.text}
            preview = req.text
        elif req.kind == "template":
            if not req.template_name:
                raise HTTPException(400, "template_name is required for kind=template")
            payload["template"] = {
                "name": req.template_name,
                "language": {"code": req.template_language},
                "components": req.template_components or [],
            }
            preview = f"[template] {req.template_name}"
        elif req.kind == "interactive":
            buttons = []
            for btn in (req.interactive_buttons or [])[:3]:
                buttons.append({
                    "type": "reply",
                    "reply": {"id": btn.get("id", new_id()[:8]), "title": btn.get("title", "Option")[:20]}
                })
            interactive_obj: Dict[str, Any] = {
                "type": "button",
                "body": {"text": req.text or "Please choose an option:"},
                "action": {"buttons": buttons}
            }
            if req.interactive_header:
                interactive_obj["header"] = {"type": "text", "text": req.interactive_header}
            if req.interactive_footer:
                interactive_obj["footer"] = {"text": req.interactive_footer}
            payload["interactive"] = interactive_obj
            preview = f"[interactive] {req.text or 'Buttons'}"
        else:
            if not (req.media_id or req.media_url):
                raise HTTPException(400, "media_id or media_url required")
            media: Dict[str, Any] = {"id": req.media_id} if req.media_id else {"link": req.media_url}
            if req.caption:
                media["caption"] = req.caption
            if req.kind == "document" and req.filename:
                media["filename"] = req.filename
            payload[req.kind] = media
            preview = f"[{req.kind}] {req.caption or req.filename or ''}".strip()

        url = f"https://graph.facebook.com/{VERSION}/{phone_id}/messages"
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(url, headers={"Authorization": f"Bearer {token}"}, json=payload)
        except Exception as e:
            raise HTTPException(502, f"Graph API request failed: {e}")

        if resp.status_code >= 400:
            try:
                err = resp.json()
            except Exception:
                err = {"raw": resp.text}
            logger.error(f"WhatsApp send failed: {resp.status_code} {err}")
            raise HTTPException(resp.status_code, err.get("error", {}).get("message", "Send failed"))

        result = resp.json()
        wa_msg_id = (result.get("messages") or [{}])[0].get("id") or new_id()
        ts = now_iso()
        doc = {
            "id": new_id(),
            "thread_id": thread["id"],
            "wa_message_id": wa_msg_id,
            "direction": "outbound",
            "type": req.kind,
            "body": payload,
            "text": req.text if req.kind == "text" else None,
            "caption": req.caption,
            "status": "accepted",
            "wa_timestamp": ts,
            "created_at": ts,
        }
        await db.wa_messages.insert_one(doc)
        await db.wa_threads.update_one(
            {"id": thread["id"]},
            {"$set": {"last_message_at": ts, "last_message_preview": preview[:200]}},
        )
        doc.pop("_id", None)
        return doc

    # ---------- Templates ----------
    @router.get("/whatsapp/templates")
    async def list_templates(_user=Depends(require_super_admin_dep)):
        token = _cfg("WHATSAPP_ACCESS_TOKEN")
        waba_id = _cfg("WHATSAPP_BUSINESS_ACCOUNT_ID")
        if not token or not waba_id:
            return {"data": []}
        url = f"https://graph.facebook.com/{VERSION}/{waba_id}/message_templates?limit=100"
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(url, headers={"Authorization": f"Bearer {token}"})
        except Exception as e:
            raise HTTPException(502, f"Graph API request failed: {e}")
        if resp.status_code >= 400:
            try:
                err = resp.json()
            except Exception:
                err = {"raw": resp.text}
            raise HTTPException(resp.status_code, err)
        data = resp.json()
        # Filter to APPROVED templates only, keep essentials
        approved = [
            {"name": t.get("name"), "language": t.get("language"), "category": t.get("category"), "components": t.get("components")}
            for t in (data.get("data") or [])
            if (t.get("status") or "").upper() == "APPROVED"
        ]
        return {"data": approved}

    @router.post("/whatsapp/templates")
    async def create_template(req: CreateTemplateIn, _user=Depends(require_super_admin_dep)):
        token = _cfg("WHATSAPP_ACCESS_TOKEN")
        waba_id = _cfg("WHATSAPP_BUSINESS_ACCOUNT_ID")
        if not token or not waba_id:
            raise HTTPException(500, "WhatsApp credentials not configured")

        components = []
        if req.header_text:
            components.append({"type": "HEADER", "format": "TEXT", "text": req.header_text})
        components.append({"type": "BODY", "text": req.body_text})
        if req.footer_text:
            components.append({"type": "FOOTER", "text": req.footer_text})
        if req.buttons:
            formatted_btns = []
            for b in req.buttons:
                formatted_btns.append({"type": b.get("type", "QUICK_REPLY"), "text": b.get("text", "Click")[:25]})
            components.append({"type": "BUTTONS", "buttons": formatted_btns})

        payload = {
            "name": req.name.lower().replace(" ", "_"),
            "category": req.category,
            "language": req.language,
            "components": components,
        }

        url = f"https://graph.facebook.com/{VERSION}/{waba_id}/message_templates"
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(url, headers={"Authorization": f"Bearer {token}"}, json=payload)
        except Exception as e:
            raise HTTPException(502, f"Meta Graph API template submission failed: {e}")

        if resp.status_code >= 400:
            try:
                err = resp.json()
            except Exception:
                err = {"raw": resp.text}
            raise HTTPException(resp.status_code, err)

        return resp.json()

    @router.post("/whatsapp/broadcast")
    async def trigger_broadcast(req: BroadcastCampaignIn, _user=Depends(require_super_admin_dep)):
        token = _cfg("WHATSAPP_ACCESS_TOKEN")
        phone_id = _cfg("WHATSAPP_PHONE_NUMBER_ID")
        if not token or not phone_id:
            raise HTTPException(500, "WhatsApp credentials not configured")

        recipients = []
        if req.target_group in ("leads", "all"):
            f = {"branch_id": req.branch_id} if req.branch_id else {}
            leads = await db.erp_leads.find(f, {"_id": 0, "phone": 1, "name": 1}).to_list(5000)
            for l in leads:
                recipients.append({"phone": l.get("phone"), "name": l.get("name", "Prospect")})

        if req.target_group in ("students", "all"):
            f = {"branch_id": req.branch_id, "status": "active"} if req.branch_id else {"status": "active"}
            students = await db.erp_students.find(f, {"_id": 0, "contact_phone": 1, "full_name": 1}).to_list(5000)
            for s in students:
                recipients.append({"phone": s.get("contact_phone"), "name": s.get("full_name", "Student")})

        # Deduplicate recipients by clean phone
        seen_phones = set()
        clean_recipients = []
        for r in recipients:
            raw_phone = str(r["phone"] or "").split(".")[0].strip()
            digits = "".join(filter(str.isdigit, raw_phone))
            if len(digits) == 10:
                digits = f"91{digits}"
            if len(digits) >= 10 and digits not in seen_phones:
                seen_phones.add(digits)
                clean_recipients.append({"wa_id": digits, "name": r["name"]})

        if not clean_recipients:
            raise HTTPException(400, "No valid target recipients found for selected broadcast criteria")

        job_id = new_id()
        async def _run_broadcast_bg():
            success_count, fail_count = 0, 0
            for idx, item in enumerate(clean_recipients):
                try:
                    payload = {
                        "messaging_product": "whatsapp",
                        "recipient_type": "individual",
                        "to": item["wa_id"],
                        "type": "template",
                        "template": {
                            "name": req.template_name,
                            "language": {"code": req.template_language},
                            "components": req.template_components,
                        },
                    }
                    url = f"https://graph.facebook.com/{VERSION}/{phone_id}/messages"
                    async with httpx.AsyncClient(timeout=10) as client:
                        resp = await client.post(url, headers={"Authorization": f"Bearer {token}"}, json=payload)
                    if resp.status_code < 400:
                        success_count += 1
                    else:
                        fail_count += 1
                except Exception:
                    fail_count += 1
                await asyncio.sleep(0.05)

            await db.bulk_jobs.update_one(
                {"id": job_id},
                {"$set": {"status": "completed", "success": success_count, "errors": fail_count, "processed": len(clean_recipients)}}
            )

        await db.bulk_jobs.insert_one({
            "id": job_id,
            "type": "whatsapp_broadcast",
            "template_name": req.template_name,
            "status": "processing",
            "total_rows": len(clean_recipients),
            "processed": 0,
            "success": 0,
            "errors": 0,
            "created_at": now_iso(),
        })

        asyncio.create_task(_run_broadcast_bg())

        return {
            "status": "accepted",
            "job_id": job_id,
            "recipient_count": len(clean_recipients),
            "message": f"WhatsApp broadcast dispatched for {len(clean_recipients)} target contacts."
        }

    return router
