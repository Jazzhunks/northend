import io
import os
import re
import json
import csv
import uuid
import logging
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any, Tuple

import httpx
import openpyxl
from pydantic import BaseModel, Field
from fastapi import Request

logger = logging.getLogger("whatsapp_broadcast")

VERSION = os.environ.get("GRAPH_API_VERSION", "v20.0")


# ============================================================================
# Helpers
# ============================================================================

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


def clean_phone(phone: Any) -> Optional[str]:
    if phone is None:
        return None
    raw = str(phone).split(".")[0].strip()
    digits = "".join(filter(str.isdigit, raw))
    if len(digits) == 10:
        digits = f"91{digits}"
    if len(digits) >= 10:
        return digits
    return None


# ============================================================================
# Meta template helpers
# ============================================================================

async def fetch_approved_templates(token: str, waba_id: str) -> List[Dict[str, Any]]:
    url = f"https://graph.facebook.com/{VERSION}/{waba_id}/message_templates?limit=100"
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, headers={"Authorization": f"Bearer {token}"})
    resp.raise_for_status()
    data = resp.json()
    return [
        {
            "name": t.get("name"),
            "language": t.get("language"),
            "category": t.get("category"),
            "components": t.get("components"),
            "status": t.get("status"),
        }
        for t in (data.get("data") or [])
        if (t.get("status") or "").upper() == "APPROVED"
    ]


def parse_template_variables(components: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    variables: List[Dict[str, Any]] = []
    for comp in components or []:
        if comp.get("type") != "BODY":
            continue
        text = comp.get("text") or ""
        for m in re.finditer(r"\{\{(\d+)\}\}", text):
            idx = m.group(1)
            start = max(0, m.start() - 40)
            end = min(len(text), m.end() + 40)
            context = text[start:end].replace("\n", " ").strip()
            variables.append({"index": idx, "body_context": context})
    seen = set()
    out = []
    for v in variables:
        if v["index"] not in seen:
            seen.add(v["index"])
            out.append(v)
    out.sort(key=lambda x: int(x["index"]))
    return out


# ============================================================================
# Excel / CSV parsing
# ============================================================================

class ExcelParseResult(BaseModel):
    contacts: List[Dict[str, Any]]
    warnings: List[str]
    total_rows: int
    skipped_duplicates: int
    skipped_invalid: int


def _normalize_header(h: str) -> str:
    return str(h or "").strip().lower().replace(" ", "_").replace("-", "_")


def _looks_like_phone_column(h: str) -> bool:
    h = _normalize_header(h)
    return h in {"phone", "mobile", "contact", "phone_number", "mobile_number", "whatsapp", "wa_id"}


def _looks_like_name_column(h: str) -> bool:
    h = _normalize_header(h)
    return h in {"name", "full_name", "customer_name", "contact_name", "recipient_name"}


def parse_excel_contacts(file_bytes: bytes) -> ExcelParseResult:
    try:
        wb = openpyxl.load_workbook(io.BytesIO(file_bytes), read_only=True, data_only=True)
        ws = wb.active
        rows = list(ws.iter_rows(values_only=True))
    except Exception as e:
        raise ValueError(f"Failed to read Excel file: {e}")

    if not rows:
        return ExcelParseResult(contacts=[], warnings=["File is empty"], total_rows=0, skipped_duplicates=0, skipped_invalid=0)

    raw_headers = [_normalize_header(str(h or "")) for h in rows[0]]
    phone_col = next((i for i, h in enumerate(raw_headers) if _looks_like_phone_column(h)), None)
    name_col = next((i for i, h in enumerate(raw_headers) if _looks_like_name_column(h)), None)

    if phone_col is None:
        raise ValueError("Missing required phone column. Expected a column named phone/mobile/contact.")

    contacts: List[Dict[str, Any]] = []
    warnings: List[str] = []
    skipped_duplicates = 0
    skipped_invalid = 0
    seen_phones: Dict[str, int] = {}  # phone -> row number (1-based, header = 1)

    for row_idx, row in enumerate(rows[1:], start=2):
        if all(v is None or str(v).strip() == "" for v in row):
            continue

        phone_raw = row[phone_col] if phone_col < len(row) else None
        phone = clean_phone(phone_raw)
        if not phone:
            skipped_invalid += 1
            warnings.append(f"Row {row_idx}: invalid phone number, skipped")
            continue

        if phone in seen_phones:
            prev_row = seen_phones[phone]
            skipped_duplicates += 1
            warnings.append(
                f"Row {row_idx}: duplicate phone {phone} (first seen at row {prev_row}), skipped due to conflicting duplicate"
            )
            continue

        seen_phones[phone] = row_idx

        name = ""
        if name_col is not None and name_col < len(row):
            name = str(row[name_col] or "").strip()

        variables: Dict[str, str] = {}
        for col_idx, h in enumerate(raw_headers):
            val = row[col_idx] if col_idx < len(row) else None
            variables[h] = str(val or "").strip()

        contacts.append({
            "wa_id": phone,
            "name": name,
            "variables": variables,
            "source": "external_upload",
            "row": row_idx,
        })

    return ExcelParseResult(
        contacts=contacts,
        warnings=warnings,
        total_rows=len(rows) - 1,
        skipped_duplicates=skipped_duplicates,
        skipped_invalid=skipped_invalid,
    )


# ============================================================================
# Internal CRM recipients
# ============================================================================

async def get_internal_recipients(target_group: str, branch_id: Optional[str]) -> List[Dict[str, Any]]:
    recipients: List[Dict[str, Any]] = []
    try:
        from server import db
    except Exception:
        return recipients

    if target_group in ("leads", "all"):
        query: Dict[str, Any] = {}
        if branch_id:
            query["branch_id"] = branch_id
        cursor = db.erp_leads.find(query, {"_id": 0, "phone": 1, "name": 1}).to_list(5000)
        for l in await cursor:
            phone = clean_phone(l.get("phone"))
            if phone:
                recipients.append({
                    "wa_id": phone,
                    "name": l.get("name", "Prospect"),
                    "variables": {"name": l.get("name", "Prospect"), "phone": phone},
                    "source": "crm_lead",
                })

    if target_group in ("students", "all"):
        query = {"status": "active"}
        if branch_id:
            query["branch_id"] = branch_id
        cursor = db.erp_students.find(query, {"_id": 0, "contact_phone": 1, "full_name": 1}).to_list(5000)
        for s in await cursor:
            phone = clean_phone(s.get("contact_phone"))
            if phone:
                recipients.append({
                    "wa_id": phone,
                    "name": s.get("full_name", "Student"),
                    "variables": {"name": s.get("full_name", "Student"), "phone": phone},
                    "source": "crm_student",
                })

    if target_group in ("applicants", "all"):
        query = {}
        if branch_id:
            query["branch_id"] = branch_id
        cursor = db.scholarship_applications.find(query, {"_id": 0, "phone": 1, "name": 1}).to_list(5000)
        for a in await cursor:
            phone = clean_phone(a.get("phone"))
            if phone:
                recipients.append({
                    "wa_id": phone,
                    "name": a.get("name", "Applicant"),
                    "variables": {"name": a.get("name", "Applicant"), "phone": phone},
                    "source": "crm_applicant",
                })

    seen = set()
    unique = []
    for r in recipients:
        if r["wa_id"] not in seen:
            seen.add(r["wa_id"])
            unique.append(r)
    return unique


# ============================================================================
# Variable resolution
# ============================================================================

def resolve_variables(
    contact: Dict[str, Any],
    template_vars: List[Dict[str, Any]],
    defaults: Dict[str, str],
    variable_mappings: Optional[Dict[str, str]] = None,
) -> List[Dict[str, Any]]:
    """
    Resolve template variables for a contact.

    variable_mappings: {"1": "name"} means template {{1}} should be filled from contact.variables["name"].
    """
    resolved = []
    contact_vars = contact.get("variables", {})
    for var in template_vars:
        idx = var["index"]
        value = None
        if variable_mappings and idx in variable_mappings:
            src_key = variable_mappings[idx]
            value = contact_vars.get(src_key)
        if not value:
            value = defaults.get(idx)
        if not value:
            value = f"[missing {idx}]"
        resolved.append({"type": "text", "text": str(value)})
    return resolved


# ============================================================================
# Single message send
# ============================================================================

async def send_broadcast_template(
    wa_id: str,
    template_name: str,
    language: str,
    components: List[Dict[str, Any]],
    variables: List[Dict[str, Any]],
    access_token: str,
    phone_id: str,
) -> Dict[str, Any]:
    url = f"https://graph.facebook.com/{VERSION}/{phone_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": wa_id,
        "type": "template",
        "template": {
            "name": template_name,
            "language": {"code": language},
            "components": [
                {
                    "type": "body",
                    "parameters": variables,
                }
            ],
        },
    }
    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(url, headers={"Authorization": f"Bearer {access_token}"}, json=payload)
    if resp.status_code >= 400:
        try:
            err = resp.json()
        except Exception:
            err = {"raw": resp.text}
        logger.error(f"WhatsApp send failed for {wa_id}: {resp.status_code} {err}")
        return {"ok": False, "status": "failed", "error": err}
    result = resp.json()
    wa_msg_id = (result.get("messages") or [{}])[0].get("id")
    return {"ok": True, "status": "accepted", "wa_message_id": wa_msg_id}


# ============================================================================
# Background broadcast worker
# ============================================================================

async def run_broadcast_job(campaign_id: str, job_id: str):
    try:
        from server import db
    except Exception:
        logger.error("Cannot import db from server module")
        return

    await db.bulk_jobs.update_one(
        {"id": job_id},
        {"$set": {"status": "processing", "started_at": now_iso()}},
    )

    campaign = await db.wa_campaigns.find_one({"id": campaign_id}, {"_id": 0})
    if not campaign:
        await db.bulk_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "failed", "recent_logs": ["Campaign not found"]}},
        )
        return

    template_name = campaign.get("template_name", "")
    template_language = campaign.get("template_language", "en_US")
    template_components = campaign.get("template_components") or []
    variable_defaults = campaign.get("variable_defaults") or {}
    variable_mappings = campaign.get("variable_mappings") or {}
    target_group = campaign.get("target_group", "all")
    branch_id = campaign.get("branch_id")
    external_job_id = campaign.get("external_contact_job_id")

    token = os.environ.get("WHATSAPP_ACCESS_TOKEN", "")
    phone_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID", "")

    template_vars = parse_template_variables(template_components)

    # Load recipients
    internal_recipients = await get_internal_recipients(target_group, branch_id)

    external_recipients: List[Dict[str, Any]] = []
    if external_job_id:
        bulk = await db.bulk_jobs.find_one({"id": external_job_id}, {"_id": 0})
        if bulk and bulk.get("status") == "completed":
            ext_cursor = db.wa_broadcast_contacts.find({"upload_job_id": external_job_id}, {"_id": 0}).to_list(None)
            external_recipients = await ext_cursor

    all_recipients = internal_recipients + external_recipients
    total = len(all_recipients)

    await db.bulk_jobs.update_one(
        {"id": job_id},
        {"$set": {"total_rows": total, "processed": 0, "success": 0, "errors": 0}},
    )

    if total == 0:
        await db.bulk_jobs.update_one(
            {"id": job_id},
            {"$set": {"status": "completed", "recent_logs": ["No recipients found"]}},
        )
        return

    success_count = 0
    fail_count = 0
    logs = [f"Starting broadcast to {total} recipients..."]

    for idx, recipient in enumerate(all_recipients, start=1):
        wa_id = recipient.get("wa_id")
        name = recipient.get("name", "Customer")
        variables = resolve_variables(recipient, template_vars, variable_defaults, variable_mappings)

        try:
            result = await send_broadcast_template(
                wa_id=wa_id,
                template_name=template_name,
                language=template_language,
                components=template_components,
                variables=variables,
                access_token=token,
                phone_id=phone_id,
            )

            analytics_doc = {
                "id": new_id(),
                "campaign_id": campaign_id,
                "wa_id": wa_id,
                "wa_message_id": result.get("wa_message_id"),
                "status": result.get("status", "failed"),
                "pricing_category": _extract_category(template_components),
                "sent_at": now_iso(),
                "created_at": now_iso(),
            }
            await db.wa_broadcast_analytics.insert_one(analytics_doc)

            if result.get("ok"):
                success_count += 1
                logs.append(f"✅ Sent to {name} ({wa_id})")
            else:
                fail_count += 1
                logs.append(f"❌ Failed for {name} ({wa_id}): {result.get('error')}")

        except Exception as e:
            fail_count += 1
            logs.append(f"❌ Error for {name} ({wa_id}): {str(e)}")

        await db.bulk_jobs.update_one(
            {"id": job_id},
            {
                "$set": {
                    "processed": idx,
                    "success": success_count,
                    "errors": fail_count,
                    "recent_logs": logs[-15:],
                }
            },
        )

        await asyncio.sleep(0.05)

    await db.bulk_jobs.update_one(
        {"id": job_id},
        {
            "$set": {
                "status": "completed",
                "processed": total,
                "success": success_count,
                "errors": fail_count,
                "completed_at": now_iso(),
                "recent_logs": logs[-15:] + [f"✨ Broadcast completed: {success_count} sent, {fail_count} failed"],
            }
        },
    )

    await db.wa_campaigns.update_one(
        {"id": campaign_id},
        {"$set": {"status": "completed", "completed_at": now_iso(), "total_recipients": total}},
    )


def _extract_category(components: List[Dict[str, Any]]) -> Optional[str]:
    for comp in components or []:
        if comp.get("type") == "BODY":
            return "service"
    return "marketing"


# ============================================================================
# SSE streaming
# ============================================================================

async def broadcast_analytics_stream(campaign_id: str, request: Request):
    async def event_generator():
        client_queue: asyncio.Queue = asyncio.Queue(maxsize=200)
        try:
            from server import db
        except Exception:
            yield "data: {\"error\": \"db unavailable\"}\n\n"
            return

        # In a production system, you'd maintain a global queue registry.
        # For this implementation, we poll the bulk job and yield updates.
        last_processed = -1
        last_status = ""
        try:
            yield "retry: 2000\ndata: {\"system_status\": \"connected\"}\n\n"
            while True:
                if await request.is_disconnected():
                    break
                try:
                    camp = await db.wa_campaigns.find_one({"id": campaign_id}, {"_id": 0})
                    job_id = camp.get("external_contact_job_id") if camp else None
                    if not job_id:
                        # Try to find latest bulk job for campaign
                        bulk = await db.bulk_jobs.find_one(
                            {"type": "whatsapp_broadcast", "$or": [{"campaign_id": campaign_id}]},
                            {"_id": 0},
                        )
                        if bulk:
                            job_id = bulk["id"]

                    if job_id:
                        job = await db.bulk_jobs.find_one({"id": job_id}, {"_id": 0})
                        if job:
                            status = job.get("status", "")
                            processed = job.get("processed", 0)
                            if processed != last_processed or status != last_status:
                                last_processed = processed
                                last_status = status
                                yield f"event: job_update\ndata: {json.dumps(job)}\n\n"
                            if status in ("completed", "failed"):
                                yield f"event: job_complete\ndata: {json.dumps(job)}\n\n"
                                break
                    await asyncio.sleep(1)
                except asyncio.CancelledError:
                    break
                except Exception as e:
                    yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"
                    break
        finally:
            pass

    return event_generator()


# ============================================================================
# Cost tracking
# ============================================================================

WA_PRICING = {
    "IN": {
        "marketing": 0.0084,
        "utility": 0.0042,
        "service": 0.0000,
        "authentication": 0.0000,
    },
    "US": {
        "marketing": 0.024,
        "utility": 0.012,
        "service": 0.006,
        "authentication": 0.005,
    },
    "GB": {
        "marketing": 0.033,
        "utility": 0.021,
        "service": 0.012,
        "authentication": 0.010,
    },
}

DEFAULT_COUNTRY_PRICING = {
    "marketing": 0.01,
    "utility": 0.005,
    "service": 0.001,
    "authentication": 0.0,
}


def get_message_cost(country_code: str, category: str) -> float:
    cc = (country_code or "IN").upper()
    pricing = WA_PRICING.get(cc, DEFAULT_COUNTRY_PRICING)
    cat = (category or "marketing").lower()
    return pricing.get(cat, 0.01)


async def calculate_campaign_cost(campaign_id: str, country_code: str = "IN") -> Dict[str, Any]:
    try:
        from server import db
    except Exception:
        return {"total_cost": 0.0, "by_category": {}}

    cursor = db.wa_broadcast_analytics.find({"campaign_id": campaign_id}, {"_id": 0}).to_list(None)
    messages = await cursor

    total = 0.0
    by_category: Dict[str, float] = {}
    for m in messages:
        cat = (m.get("pricing_category") or "marketing").lower()
        cost = get_message_cost(country_code, cat)
        total += cost
        by_category[cat] = by_category.get(cat, 0.0) + cost

    return {"total_cost": round(total, 4), "by_category": {k: round(v, 4) for k, v in by_category.items()}, "message_count": len(messages)}
