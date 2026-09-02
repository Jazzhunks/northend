"""SMTP email helper using Gmail / Google Workspace."""
import os
import smtplib
import logging
from email.message import EmailMessage

log = logging.getLogger("email")

def _smtp_config():
    return {
        "host": os.environ.get("SMTP_HOST", "smtp.gmail.com"),
        "port": int(os.environ.get("SMTP_PORT", "587")),
        "user": os.environ.get("SMTP_USER"),
        "password": os.environ.get("SMTP_PASSWORD"),
        "from_name": os.environ.get("SMTP_FROM_NAME", "Unacademy Offline Centre"),
    }

def send_email(
    to_email: str, 
    subject: str, 
    html_body: str, 
    text_body: str | None = None,
    attachments: list[tuple[bytes, str, str]] | None = None  # [(file_bytes, filename, mime_type)]
):
    cfg = _smtp_config()
    if not cfg["user"] or not cfg["password"]:
        log.warning("SMTP creds missing; skipping email to %s", to_email)
        return False
        
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f'{cfg["from_name"]} <{cfg["user"]}>'
    msg["To"] = to_email
    msg.set_content(text_body or "Please view this email in HTML.")
    msg.add_alternative(html_body, subtype="html")

    # Handle PDF / file attachments
    if attachments:
        for file_bytes, filename, mime_type in attachments:
            maintype, subtype = mime_type.split("/", 1) if "/" in mime_type else ("application", "octet-stream")
            msg.add_attachment(
                file_bytes,
                maintype=maintype,
                subtype=subtype,
                filename=filename
            )

    try:
        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=20) as s:
            s.ehlo()
            s.starttls()
            s.login(cfg["user"], cfg["password"])
            s.send_message(msg)
        log.info("Email sent to %s subject=%s", to_email, subject)
        return True
    except Exception as e:
        log.error("Email send failed (%s): %s", to_email, e)
        return False

# Templates
def _wrap(title: str, body_html: str) -> str:
    return f"""\
<!doctype html><html><body style="margin:0;padding:0;background:#f8fafc;font-family:Helvetica,Arial,sans-serif;color:#0f172a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
  <tr><td style="background:#002FA7;padding:20px 28px;color:#ffffff;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:bold;color:#FFC107;">Unacademy Offline Centre</div>
    <div style="font-size:22px;font-weight:900;margin-top:6px;">{title}</div>
  </td></tr>
  <tr><td style="padding:28px;line-height:1.6;font-size:15px;">{body_html}</td></tr>
  <tr><td style="background:#f8fafc;padding:18px 28px;color:#475569;font-size:12px;text-align:center;border-top:1px solid #e2e8f0;">
    Unacademy Offline Centre · Kashmir · +91-8766238623
  </td></tr>
</table></td></tr></table></body></html>"""

def email_enrollment_received(to_email: str, name: str, receipt_no: str, course_title: str, center: str):
    body = f"""<p>Hi {name},</p>
<p>We have received your enrollment for <b>{course_title}</b> at <b>{center}</b>.</p>
<p>Receipt No: <b style="font-family:monospace;font-size:16px;color:#002FA7;">{receipt_no}</b></p>
<p>An admissions counselor will contact you within 24 hours to complete the formalities.</p>
<p>Thanks,<br/>Unacademy Admissions Team</p>"""
    return send_email(to_email, "Enrollment received — Unacademy Offline Centre", _wrap("Enrollment Received", body))

def email_scholarship_received(
    to_email: str, 
    name: str, 
    application_no: str, 
    target_exam: str,
    admit_card_bytes: bytes | None = None
):
    body = f"""<p>Hi {name},</p>
<p>Your application for the <b>Unacademy Offline Centre Scholarship Test ({target_exam})</b> has been successfully registered.</p>
<p>Application No: <b style="font-family:monospace;font-size:16px;color:#002FA7;">{application_no}</b></p>
<p><b>Your Admit Card PDF is attached to this email.</b> Please download, print a hard copy, and bring it along with a valid photo ID on examination day.</p>
<p>Best of luck,<br/>Unacademy Academic Team</p>"""
    
    attachments = []
    if admit_card_bytes:
        attachments.append((admit_card_bytes, f"AdmitCard_{application_no}.pdf", "application/pdf"))

    return send_email(
        to_email, 
        f"Registration Successful – Admit Card #{application_no} | Unacademy", 
        _wrap("Scholarship Admit Card", body),
        attachments=attachments
    )

def email_job_app_received(to_email: str, name: str, job_title: str):
    body = f"""<p>Hi {name},</p>
<p>Thanks for applying for the <b>{job_title}</b> position at Unacademy Offline Centre.</p>
<p>Our HR team will review your application and reach out shortly if your profile fits.</p>
<p>Regards,<br/>Unacademy HR Team</p>"""
    return send_email(to_email, "Application received — Unacademy Offline Centre", _wrap("Application Received", body))

def email_scholarship_result_published(to_email: str, name: str, application_no: str,
                                       scholarship_percentage: int,
                                       marks_obtained, total_marks, rank=None,
                                       result_card_url: str | None = None):
    rank_html = f"<p>Rank: <b>{rank}</b></p>" if rank else ""
    cta = f'<p style="text-align:center;margin-top:16px;"><a href="{result_card_url}" style="display:inline-block;background:#002FA7;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Download Result Card (PDF)</a></p>' if result_card_url else ""
    body = f"""<p>Hi {name},</p>
<p>Your <b>Unacademy Offline Centre Scholarship Test</b> result has been declared.</p>
<p>Application No: <b style="font-family:monospace;font-size:15px;color:#002FA7;">{application_no}</b></p>
<p>Marks: <b>{marks_obtained} / {total_marks}</b></p>
{rank_html}
<p style="margin-top:14px;font-size:18px;">Scholarship awarded:
  <b style="color:#10B981;font-size:24px;">{scholarship_percentage}%</b> off on tuition fee.</p>
{cta}
<p style="margin-top:20px;">Visit your nearest Unacademy Offline Centre within 7 days to claim your scholarship and complete enrollment.</p>
<p>Congratulations,<br/>Unacademy Academic Team</p>"""
    return send_email(to_email, "🎉 Scholarship Result Declared — Unacademy Offline Centre",
                      _wrap("Your Result is Out", body))

def email_admin_notification(subject: str, html_body: str):
    to = os.environ.get("ADMIN_NOTIFY_EMAIL")
    if not to:
        return False
    return send_email(to, subject, _wrap("Admin Notification", html_body))