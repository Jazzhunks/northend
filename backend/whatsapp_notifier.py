import asyncio
import logging
from whatsapp_client import send_whatsapp_exam_notification
from pdf_client import admit_card_pdf

log = logging.getLogger("whatsapp_notifier")

async def broadcast_scholarship_details(scholarship_id: str, job_id: str = None):
    from server import db 
    
    """Fetches campaign details, generates PDFs, and sends notification to all applicants."""
    campaign = await db.scholarships.find_one({"id": scholarship_id}, {"_id": 0})
    
    if not campaign:
        log.error(f"Broadcast failed: Campaign {scholarship_id} not found.")
        if job_id:
            await db.bulk_jobs.update_one(
                {"id": job_id}, 
                {"$set": {"status": "failed"}, "$push": {"recent_logs": {"$each": ["❌ Campaign not found"], "$slice": -15}}}
            )
        return

    if job_id:
        await db.bulk_jobs.update_one({"id": job_id}, {"$set": {"status": "processing"}})

    scholarship_title = campaign.get("title", "Scholarship Test")
    exam_date = campaign.get("exam_date", "TBA")
    exam_time = campaign.get("exam_time", "10:00 AM")

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
    
    default_map = "https://maps.app.goo.gl/ehUGrY51uL8Dputz5"

    cursor = db.scholarship_applications.find({"scholarship_id": scholarship_id})
    applications = await cursor.to_list(length=None)

    log.info(f"Starting WhatsApp Notification broadcast for {len(applications)} applicants...")

    for app in applications:
        try:
            app_venue = app.get("venue", "TBA")
            map_url = venue_maps.get(app_venue, default_map)
            
            app_no = app.get("application_no", "")
            name = app.get("name", "Applicant")
            phone = app.get("phone", "")
            standard = app.get("standard", "N/A")

            # 1. Generate the PDF dynamically in a background thread
            pdf_bytes = await asyncio.to_thread(
                admit_card_pdf,
                application_no=app_no,
                name=name,
                phone=phone,
                school=app.get("school", ""),
                standard=standard,
                target_exam=app.get("target_exam", "N/A"),
                exam_date=exam_date,
                venue=app_venue,
                exam_time=exam_time,
                scholarship_title=scholarship_title,
            )

            # 2. Push the EXAM NOTIFICATION template directly to WhatsApp
            await send_whatsapp_exam_notification(
                phone=phone,
                name=name,
                scholarship_title=scholarship_title,
                application_no=app_no,
                standard=standard,
                exam_date=exam_date,
                venue=app_venue,
                map_url=map_url,
                pdf_bytes=pdf_bytes,
            )
            
            if job_id:
                await db.bulk_jobs.update_one({"id": job_id}, {
                    "$inc": {"processed": 1, "success": 1},
                    "$push": {"recent_logs": {"$each": [f"✅ Sent Notification to {name} ({app_no})"], "$slice": -15}}
                })
            
            await asyncio.sleep(0.1)
            
        except Exception as e:
            log.error(f"Error sending WhatsApp notification to {app.get('application_no')}: {e}")
            if job_id:
                await db.bulk_jobs.update_one({"id": job_id}, {
                    "$inc": {"processed": 1, "errors": 1},
                    "$push": {"recent_logs": {"$each": [f"❌ Failed for {app.get('name', 'Applicant')} ({app.get('application_no')}): {str(e)}"], "$slice": -15}}
                })

    if job_id:
        await db.bulk_jobs.update_one(
            {"id": job_id}, 
            {
                "$set": {"status": "completed"}, 
                "$push": {"recent_logs": {"$each": ["✨ Broadcast Completed Successfully!"], "$slice": -15}}
            }
        )