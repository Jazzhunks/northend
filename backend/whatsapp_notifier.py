import asyncio
import logging
from whatsapp_client import send_whatsapp_exam_notification

log = logging.getLogger("whatsapp_notifier")


async def broadcast_scholarship_details(scholarship_id: str):
    # Local import to safely grab the database from your main server file
    # without causing a circular import crash on startup.
    from server import db 
    
    """Fetches campaign details and sends notification to all applicants of the scholarship."""
    campaign = await db.scholarships.find_one({"id": scholarship_id}, {"_id": 0})
    if not campaign:
        log.error(f"Broadcast failed: Campaign {scholarship_id} not found.")
        return

    scholarship_title = campaign.get("title", "Scholarship Test")
    exam_date = campaign.get("exam_date", "TBA")

    # --- HARDCODED VENUE MAP LINKS ---
    venue_maps = {
        "90 Ft": "https://maps.app.goo.gl/ehUGrY51uL8Dputz5",
        "90 FT": "https://maps.app.goo.gl/ehUGrY51uL8Dputz5",
        "Srinagar": "https://maps.app.goo.gl/ehUGrY51uL8Dputz5",
        "Parraypora": "https://maps.app.goo.gl/cWrYBKC7RvX4Ed6GA",
        "Sopore": "https://maps.app.goo.gl/JNXrwZqVf6LFN8rFA",
        "Anantnag": "https://maps.app.goo.gl/U5bV2vv1FW1nhxTC9",
        "Zakura": "https://maps.app.goo.gl/x98VqHhsBvD2AEqZA"
    }
    
    # Fallback link if the venue somehow doesn't match the list above
    default_map = "https://maps.app.goo.gl/ehUGrY51uL8Dputz5"

    cursor = db.scholarship_applications.find({"scholarship_id": scholarship_id})
    applications = await cursor.to_list(length=None)

    log.info(
        f"Starting WhatsApp broadcast for {len(applications)} applicants..."
    )

    for app in applications:
        try:
            app_venue = app.get("venue", "TBA")
            
            # Use the hardcoded dictionary instead of the database campaign object
            map_url = venue_maps.get(app_venue, default_map)

            await send_whatsapp_exam_notification(
                phone=app.get("phone", ""),
                name=app.get("name", "Applicant"),
                scholarship_title=scholarship_title,
                application_no=app.get("application_no", ""),
                standard=app.get("standard", "N/A"),
                exam_date=exam_date,
                venue=app_venue,
                map_url=map_url,
            )
            await asyncio.sleep(0.1)
        except Exception as e:
            log.error(
                f"Error sending WhatsApp notification to {app.get('application_no')}: {e}"
            )