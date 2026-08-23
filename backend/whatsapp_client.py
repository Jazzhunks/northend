import logging
import os
import httpx

log = logging.getLogger("whatsapp")

# Credentials loaded strictly from environment variables
PHONE_NUMBER_ID = os.environ.get("WHATSAPP_PHONE_NUMBER_ID")
ACCESS_TOKEN = os.environ.get("WHATSAPP_ACCESS_TOKEN")


async def send_whatsapp_admit_card(
    phone: str,
    name: str,
    application_no: str,
    scholarship_title: str,
    exam_date: str,
    venue: str,
    pdf_bytes: bytes,
) -> bool:
    """Uploads PDF to Meta WhatsApp media endpoint and sends admit card via WhatsApp template."""
    if not PHONE_NUMBER_ID or not ACCESS_TOKEN:
        log.warning("WhatsApp credentials missing; skipping WhatsApp send.")
        return False

    # Format phone number to E.164 without leading '+'
    clean_phone = "".join(filter(str.isdigit, phone))
    if len(clean_phone) == 10:
        clean_phone = f"91{clean_phone}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Step 1: Upload PDF to WhatsApp Media API
            upload_url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/media"
            files = {
                "file": (
                    f"AdmitCard_{application_no}.pdf",
                    pdf_bytes,
                    "application/pdf",
                )
            }
            data = {"messaging_product": "whatsapp", "type": "application/pdf"}
            headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}

            media_res = await client.post(
                upload_url, data=data, files=files, headers=headers
            )
            media_res.raise_for_status()
            media_id = media_res.json().get("id")

            if not media_id:
                log.error(
                    "Failed to retrieve media_id from Meta API upload response."
                )
                return False

            # Step 2: Send Template Message with Attached Document Header
            msg_url = (
                f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
            )
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
                                {
                                    "type": "document",
                                    "document": {
                                        "id": media_id,
                                        "filename": f"AdmitCard_{application_no}.pdf",
                                    },
                                }
                            ],
                        },
                        {
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": name},
                                {"type": "text", "text": scholarship_title},
                                {"type": "text", "text": application_no},
                                {"type": "text", "text": exam_date},
                                {"type": "text", "text": venue},
                            ],
                        },
                    ],
                },
            }

            msg_res = await client.post(msg_url, json=payload, headers=headers)
            msg_res.raise_for_status()
            log.info(
                "WhatsApp admit card sent successfully to %s (App No: %s)",
                clean_phone,
                application_no,
            )
            return True

        except Exception as e:
            log.error(
                "WhatsApp delivery failed for %s: %s", clean_phone, str(e)
            )
            return False


async def send_whatsapp_exam_notification(
    phone: str,
    name: str,
    scholarship_title: str,
    application_no: str,
    standard: str,
    exam_date: str,
    venue: str,
    map_url: str,
) -> bool:
    """Sends bulk exam/venue details notification with Google Maps link to applicants via WhatsApp template."""
    if not PHONE_NUMBER_ID or not ACCESS_TOKEN:
        log.warning("WhatsApp credentials missing; skipping notification.")
        return False

    clean_phone = "".join(filter(str.isdigit, phone))
    if len(clean_phone) == 10:
        clean_phone = f"91{clean_phone}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            msg_url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
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
                            "type": "body",
                            "parameters": [
                                {"type": "text", "text": name},
                                {"type": "text", "text": scholarship_title},
                                {"type": "text", "text": application_no},
                                {"type": "text", "text": standard},
                                {"type": "text", "text": exam_date},
                                {"type": "text", "text": venue},
                                {"type": "text", "text": map_url or "N/A"},
                            ],
                        }
                    ],
                },
            }

            headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
            msg_res = await client.post(msg_url, json=payload, headers=headers)
            msg_res.raise_for_status()
            log.info(
                "WhatsApp notification sent to %s (App No: %s)",
                clean_phone,
                application_no,
            )
            return True

        except Exception as e:
            log.error(
                "WhatsApp broadcast failed for %s: %s", clean_phone, str(e)
            )
            return False