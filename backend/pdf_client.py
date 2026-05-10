"""PDF generators (admit card, receipts) with QR code."""
import io
import qrcode
from reportlab.lib.pagesizes import A5
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

PRIMARY = HexColor("#002FA7")
ACCENT = HexColor("#FFC107")
TEXT = HexColor("#0F172A")
MUTED = HexColor("#475569")
LINE = HexColor("#E2E8F0")

def _qr_bytes(data: str) -> ImageReader:
    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return ImageReader(buf)

def admit_card_pdf(application_no: str, name: str, school: str, standard: str, target_exam: str, exam_date: str, center: str = "Srinagar – Lal Chowk") -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # Header band
    c.setFillColor(PRIMARY)
    c.rect(0, H - 32 * mm, W, 32 * mm, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, H - 12 * mm, "NORTHEND SCHOLARSHIP TEST 2026")
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(15 * mm, H - 20 * mm, "Admit Card")
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, H - 27 * mm, "Authorized Unacademy Franchise · Kashmir")

    # QR code
    qr = _qr_bytes(f"NEW|{application_no}|{name}")
    c.drawImage(qr, W - 38 * mm, H - 30 * mm, 24 * mm, 24 * mm, mask='auto')

    # Body
    y = H - 50 * mm
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, y, "APPLICATION NO.")
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(15 * mm, y - 7 * mm, application_no)

    y -= 18 * mm
    fields = [
        ("CANDIDATE NAME", name),
        ("SCHOOL / COLLEGE", school),
        ("STANDARD", standard),
        ("TARGET EXAM", target_exam),
        ("EXAM DATE", exam_date),
        ("REPORTING CENTER", center),
    ]
    for label, val in fields:
        c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
        c.drawString(15 * mm, y, label)
        c.setFillColor(TEXT); c.setFont("Helvetica", 11)
        c.drawString(15 * mm, y - 5 * mm, str(val) or "—")
        c.setStrokeColor(LINE); c.setLineWidth(0.5)
        c.line(15 * mm, y - 7 * mm, W - 15 * mm, y - 7 * mm)
        y -= 13 * mm

    # Footer notes
    y -= 4 * mm
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, y, "INSTRUCTIONS")
    y -= 5 * mm
    c.setFont("Helvetica", 8); c.setFillColor(TEXT)
    notes = [
        "1. Carry a printed copy of this admit card and a valid school ID.",
        "2. Reach the reporting center 30 minutes before the exam.",
        "3. Calculators, mobiles and smart watches are not allowed.",
        "4. Result will be available 3 days after the exam on the website.",
    ]
    for n in notes:
        c.drawString(15 * mm, y, n)
        y -= 4.5 * mm

    # Signature box
    c.setStrokeColor(LINE)
    c.rect(W - 50 * mm, 18 * mm, 35 * mm, 18 * mm, stroke=1, fill=0)
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
    c.drawString(W - 48 * mm, 20 * mm, "CANDIDATE SIGNATURE")

    c.showPage()
    c.save()
    return buf.getvalue()
