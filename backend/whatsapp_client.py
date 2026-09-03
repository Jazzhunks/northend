import logging
import os
import httpx
import uuid
from datetime import datetime, timezone

log = logging.getLogger("whatsapp")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


async def _log_automated_message_to_inbox(
    clean_phone: str, 
    wa_msg_id: str, 
    preview_text: str, 
    msg_type: str,
    text: str = None,
    caption: str = None,
    document_url: str = None,
    document_filename: str = None,
    linked_app_no: str = None,
    linked_title: str = None,
    linked_name: str = None
):
    from server import db 

    wa_id = clean_phone
    ts = now_iso()
    
    contact = await db.wa_contacts.find_one({"wa_id": wa_id})
    patch = {"updated_at": ts}
    if linked_app_no:
        patch["linked_application_no"] = linked_app_no
        patch["linked_scholarship_title"] = linked_title
        patch["linked_name"] = linked_name

    if not contact:
        contact = {
            "id": new_id(),
            "wa_id": wa_id,
            "phone_e164": f"+{wa_id}",
            "profile_name": "Applicant", 
            "created_at": ts,
            **patch
        }
        await db.wa_contacts.insert_one(contact)
        contact.pop("_id", None)
    else:
        await db.wa_contacts.update_one({"wa_id": wa_id}, {"$set": patch})
        contact.update(patch)

    thread = await db.wa_threads.find_one({"contact_id": contact["id"]})
    if not thread:
        thread = {
            "id": new_id(),
            "contact_id": contact["id"],
            "wa_id": contact["wa_id"],
            "last_message_at": ts,
            "last_message_preview": preview_text[:200],
            "unread_count": 0,
            "created_at": ts,
        }
        await db.wa_threads.insert_one(thread)
    else:
        await db.wa_threads.update_one(
            {"id": thread["id"]},
            {"$set": {"last_message_at": ts, "last_message_preview": preview_text[:200]}}
        )
        thread["id"] = thread["id"]

    body_payload = {}
    if msg_type == "document":
        body_payload = {
            "document": {
                "link": document_url,
                "filename": document_filename
            }
        }
    elif msg_type == "text":
        body_payload = {
            "text": {"body": text}
        }

    doc = {
        "id": new_id(),
        "thread_id": thread["id"],
        "wa_message_id": wa_msg_id,
        "direction": "outbound",
        "type": msg_type,
        "body": body_payload,
        "text": text,            
        "caption": caption,      
        "status": "accepted",
        "wa_timestamp": ts,
        "created_at": ts,
    }
    await db.wa_messages.insert_one(doc)

# ---------------------------------------------------------
# TEMPLATE 1: ADMIT CARD REGISTRATION (5 Variables)
# ---------------------------------------------------------
async def send_whatsapp_admit_card(
    phone: str,
    name: str,
    application_no: str,
    scholarship_title: str,
    exam_date: str,       
    venue: str,           
    pdf_bytes: bytes,
    **kwargs # Safely catch any extra arguments server.py passes
) -> bool:
    
    phone_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    access_token = os.environ.get("WHATSAPP_ACCESS_TOKEN")

    if not phone_id or not access_token:
        log.warning("WhatsApp credentials missing; skipping WhatsApp send.")
        return False

    clean_phone = str(phone).split(".")[0].strip()
    clean_phone = "".join(filter(str.isdigit, clean_phone))
    if len(clean_phone) == 10:
        clean_phone = f"91{clean_phone}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            upload_url = f"https://graph.facebook.com/v18.0/{phone_id}/media"
            files = {
                "file": (f"AdmitCard_{application_no}.pdf", pdf_bytes, "application/pdf")
            }
            data = {"messaging_product": "whatsapp", "type": "application/pdf"}
            headers = {"Authorization": f"Bearer {access_token}"}

            media_res = await client.post(upload_url, data=data, files=files, headers=headers)
            media_res.raise_for_status()
            media_id = media_res.json().get("id")

            if not media_id:
                return False

            msg_url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": clean_phone,
                "type": "template",
                "template": {
                    "name": "admit_card_notification", 
                    "language": {"code": "en"},
                    "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {"type": "document", "document": {"id": media_id, "filename": f"AdmitCard_{application_no}.pdf"}}
                            ],
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": name},                 # {{1}}
                                {"type": "text", "text": scholarship_title},    # {{2}}
                                {"type": "text", "text": application_no},       # {{3}}
                                {"type": "text", "text": exam_date},            # {{4}}
                                {"type": "text", "text": venue},                # {{5}}
                            ],
                        },
                    ],
                },
            }

            msg_res = await client.post(msg_url, json=payload, headers=headers)
            msg_res.raise_for_status()
            
            result = msg_res.json()
            wa_msg_id = (result.get("messages") or [{}])[0].get("id")
            
            if wa_msg_id:
                preview = f"📄 [Admit Card Sent] {scholarship_title} - App No: {application_no}"
                caption_text = (
                    f"*Name:* {name}\n"
                    f"*Campaign:* {scholarship_title}\n"
                    f"*App No:* {application_no}\n"
                    f"*Date:* {exam_date}\n"
                    f"*Venue:* {venue}\n"
                )
                
                await _log_automated_message_to_inbox(
                    clean_phone=clean_phone,
                    wa_msg_id=wa_msg_id,
                    preview_text=preview,
                    msg_type="document",
                    caption=caption_text,
                    document_url=f"/api/scholarship-applications/{application_no}/admit-card",
                    document_filename=f"AdmitCard_{application_no}.pdf",
                    linked_app_no=application_no,
                    linked_title=scholarship_title,
                    linked_name=name
                )

            log.info("WhatsApp admit card sent successfully to %s", clean_phone)
            return True

        except httpx.HTTPStatusError as e:
            log.error(f"Meta Graph API HTTP Error for {clean_phone}: {e.response.status_code} - {e.response.text}")
            return False
        except Exception as e:
            log.error("WhatsApp delivery failed for %s: %s", clean_phone, str(e))
            return False

# ---------------------------------------------------------
# TEMPLATE 2: EXAM NOTIFICATION (7 Variables + PDF)
# ---------------------------------------------------------
async def send_whatsapp_exam_notification(
    phone: str,
    name: str,
    scholarship_title: str,
    application_no: str,
    standard: str,
    exam_date: str,
    venue: str,
    map_url: str,
    pdf_bytes: bytes,
) -> bool:
    
    phone_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    access_token = os.environ.get("WHATSAPP_ACCESS_TOKEN")

    if not phone_id or not access_token:
        return False

    clean_phone = str(phone).split(".")[0].strip()
    clean_phone = "".join(filter(str.isdigit, clean_phone))
    if len(clean_phone) == 10:
        clean_phone = f"91{clean_phone}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # 1. Upload PDF
            upload_url = f"https://graph.facebook.com/v18.0/{phone_id}/media"
            files = {
                "file": (f"AdmitCard_{application_no}.pdf", pdf_bytes, "application/pdf")
            }
            data = {"messaging_product": "whatsapp", "type": "application/pdf"}
            headers = {"Authorization": f"Bearer {access_token}"}

            media_res = await client.post(upload_url, data=data, files=files, headers=headers)
            media_res.raise_for_status()
            media_id = media_res.json().get("id")

            if not media_id:
                return False

            # 2. Send Message Payload
            msg_url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": clean_phone,
                "type": "template",
                "template": {
                    "name": "exam_details_notification",
                    "language": {"code": "en"},
                    "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {"type": "document", "document": {"id": media_id, "filename": f"AdmitCard_{application_no}.pdf"}}
                            ],
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": name},                 # {{1}}
                                {"type": "text", "text": scholarship_title},    # {{2}}
                                {"type": "text", "text": application_no},       # {{3}}
                                {"type": "text", "text": standard},             # {{4}}
                                {"type": "text", "text": exam_date},            # {{5}}
                                {"type": "text", "text": venue},                # {{6}}
                                {"type": "text", "text": map_url or "N/A"},     # {{7}}
                            ],
                        }
                    ],
                },
            }

            msg_res = await client.post(msg_url, json=payload, headers=headers)
            msg_res.raise_for_status()
            
            result = msg_res.json()
            wa_msg_id = (result.get("messages") or [{}])[0].get("id")
            
            if wa_msg_id:
                preview = f"📍 [Venue Notification Sent] {venue} - {exam_date}"
                full_text = (
                    f"📍 *Venue Notification*\n\n"
                    f"*Name:* {name}\n"
                    f"*Campaign:* {scholarship_title}\n"
                    f"*App No:* {application_no}\n"
                    f"*Class:* {standard}\n"
                    f"*Date:* {exam_date}\n"
                    f"*Venue:* {venue}\n"
                    f"*Maps:* {map_url or 'N/A'}"
                )
                
                await _log_automated_message_to_inbox(
                    clean_phone=clean_phone,
                    wa_msg_id=wa_msg_id,
                    preview_text=preview,
                    msg_type="document", 
                    caption=full_text,
                    document_url=f"/api/scholarship-applications/{application_no}/admit-card",
                    document_filename=f"AdmitCard_{application_no}.pdf",
                    linked_app_no=application_no,  
                    linked_title=scholarship_title,
                    linked_name=name
                )

            log.info("WhatsApp notification sent to %s", clean_phone)
            return True

        except httpx.HTTPStatusError as e:
            log.error(f"Meta Graph API HTTP Error for {clean_phone}: {e.response.status_code} - {e.response.text}")
            return False
        except Exception as e:
            log.error("WhatsApp delivery failed for %s: %s", clean_phone, str(e))
            return False

# ---------------------------------------------------------
# TEMPLATE 3: WATH CARNIVAL (5 Variables + PDF)
# ---------------------------------------------------------
async def send_whatsapp_wath_carnival(
    phone: str,
    name: str,
    application_no: str,
    exam_date: str,
    exam_time: str,
    venue: str,
    pdf_bytes: bytes,
    **kwargs # Safely catch any extra arguments server.py passes
) -> bool:
    """
    Sends the 'wath_carnival' WhatsApp template message with the PDF admit card attached.
    Template ID: 2255670248530219
    Parameters mapping:
      {{1}} -> Name
      {{2}} -> Roll No / Application No
      {{3}} -> Date
      {{4}} -> Time Slot
      {{5}} -> Venue
    """
    phone_id = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
    access_token = os.environ.get("WHATSAPP_ACCESS_TOKEN")

    if not phone_id or not access_token:
        log.warning("WhatsApp credentials missing; skipping WATH Carnival send.")
        return False

    clean_phone = str(phone).split(".")[0].strip()
    clean_phone = "".join(filter(str.isdigit, clean_phone))
    if len(clean_phone) == 10:
        clean_phone = f"91{clean_phone}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # 1. Upload PDF
            upload_url = f"https://graph.facebook.com/v18.0/{phone_id}/media"
            filename = f"WATH_Carnival_{application_no}.pdf"
            files = {
                "file": (filename, pdf_bytes, "application/pdf")
            }
            data = {"messaging_product": "whatsapp", "type": "application/pdf"}
            headers = {"Authorization": f"Bearer {access_token}"}

            media_res = await client.post(upload_url, data=data, files=files, headers=headers)
            media_res.raise_for_status()
            media_id = media_res.json().get("id")

            if not media_id:
                return False

            # 2. Send Message Payload
            msg_url = f"https://graph.facebook.com/v18.0/{phone_id}/messages"
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": clean_phone,
                "type": "template",
                "template": {
                    "name": "wath_carnival",
                    "language": {"code": "en"},
                    "components": [
                        {
                            "type": "header",
                            "parameters": [
                                {"type": "document", "document": {"id": media_id, "filename": filename}}
                            ],
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": name},            # {{1}}
                                {"type": "text", "text": application_no},  # {{2}}
                                {"type": "text", "text": exam_date},       # {{3}}
                                {"type": "text", "text": exam_time},       # {{4}}
                                {"type": "text", "text": venue}            # {{5}}
                            ],
                        }
                    ],
                },
            }

            msg_res = await client.post(msg_url, json=payload, headers=headers)
            msg_res.raise_for_status()
            
            result = msg_res.json()
            wa_msg_id = (result.get("messages") or [{}])[0].get("id")
            
            if wa_msg_id:
                preview = f"🎪 [WATH Carnival Admit Card] App No: {application_no}"
                caption_text = (
                    f"🎪 *WATH Carnival Pass*\n\n"
                    f"*Name:* {name}\n"
                    f"*App No:* {application_no}\n"
                    f"*Date:* {exam_date}\n"
                    f"*Time:* {exam_time}\n"
                    f"*Venue:* {venue}\n"
                )
                
                await _log_automated_message_to_inbox(
                    clean_phone=clean_phone,
                    wa_msg_id=wa_msg_id,
                    preview_text=preview,
                    msg_type="document",
                    caption=caption_text,
                    document_url=f"/api/scholarship-applications/{application_no}/admit-card",
                    document_filename=filename,
                    linked_app_no=application_no,
                    linked_title="WATH Carnival",
                    linked_name=name
                )

            log.info("WATH Carnival WhatsApp message sent successfully to %s", clean_phone)
            return True

        except httpx.HTTPStatusError as e:
            log.error(f"Meta Graph API HTTP Error for {clean_phone}: {e.response.status_code} - {e.response.text}")
            return False
        except Exception as e:
            log.error("WATH Carnival WhatsApp delivery failed for %s: %s", clean_phone, str(e))
            return False