"""PDF generators (admit card, result card) with QR code."""
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
GREEN = HexColor("#10B981")
RED = HexColor("#EF4444")

def _qr_bytes(data: str) -> ImageReader:
    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return ImageReader(buf)

def admit_card_pdf(application_no, name, school, standard, target_exam,
                   exam_date, venue=None, exam_time=None, scholarship_title=None) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # Header band
    c.setFillColor(PRIMARY); c.rect(0, H - 32 * mm, W, 32 * mm, stroke=0, fill=1)
    c.setFillColor(ACCENT); c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, H - 12 * mm, "NORTHEND EDUCATIONAL WORLD")
    c.setFillColor(HexColor("#FFFFFF")); c.setFont("Helvetica-Bold", 18)
    c.drawString(15 * mm, H - 20 * mm, "Admit Card")
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, H - 27 * mm, scholarship_title or "Scholarship Test")

    # QR
    qr = _qr_bytes(f"NEW|{application_no}|{name}")
    c.drawImage(qr, W - 38 * mm, H - 30 * mm, 24 * mm, 24 * mm, mask='auto')

    # Body
    y = H - 50 * mm
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, y, "APPLICATION NO.")
    c.setFillColor(PRIMARY); c.setFont("Helvetica-Bold", 16)
    c.drawString(15 * mm, y - 7 * mm, application_no)

    y -= 18 * mm
    fields = [
        ("CANDIDATE NAME", name),
        ("SCHOOL / COLLEGE", school),
        ("STANDARD", standard),
        ("TARGET EXAM", target_exam),
        ("EXAM DATE", exam_date or "TBA"),
        ("EXAM TIME", exam_time or "10:00 AM"),
        ("VENUE", venue or "Northend Srinagar – Lal Chowk"),
    ]
    for label, val in fields:
        c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
        c.drawString(15 * mm, y, label)
        c.setFillColor(TEXT); c.setFont("Helvetica", 11)
        c.drawString(15 * mm, y - 5 * mm, str(val) or "—")
        c.setStrokeColor(LINE); c.setLineWidth(0.5)
        c.line(15 * mm, y - 7 * mm, W - 15 * mm, y - 7 * mm)
        y -= 11 * mm

    y -= 2 * mm
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, y, "INSTRUCTIONS")
    y -= 5 * mm
    c.setFont("Helvetica", 7); c.setFillColor(TEXT)
    notes = [
        "1. Carry a printed copy of this admit card and a valid school ID.",
        "2. Reach the venue 30 minutes before the exam time.",
        "3. Calculators, mobiles and smart watches are not allowed.",
        "4. Result will be available 3 days after the exam at northendedu.com.",
    ]
    for n in notes:
        c.drawString(15 * mm, y, n); y -= 4 * mm

    c.setStrokeColor(LINE)
    c.rect(W - 50 * mm, 14 * mm, 35 * mm, 16 * mm, stroke=1, fill=0)
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
    c.drawString(W - 48 * mm, 16 * mm, "CANDIDATE SIGNATURE")

    c.showPage(); c.save()
    return buf.getvalue()


def result_card_pdf(application_no, name, school, standard, target_exam,
                    marks_obtained, total_marks, rank, percentile,
                    scholarship_percentage, remarks=None,
                    scholarship_title=None) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # Header
    c.setFillColor(PRIMARY); c.rect(0, H - 32 * mm, W, 32 * mm, stroke=0, fill=1)
    c.setFillColor(ACCENT); c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, H - 12 * mm, "NORTHEND EDUCATIONAL WORLD")
    c.setFillColor(HexColor("#FFFFFF")); c.setFont("Helvetica-Bold", 18)
    c.drawString(15 * mm, H - 20 * mm, "Result Card")
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, H - 27 * mm, scholarship_title or "Scholarship Test")

    # QR
    qr = _qr_bytes(f"NER|{application_no}|{name}|{scholarship_percentage}%")
    c.drawImage(qr, W - 38 * mm, H - 30 * mm, 24 * mm, 24 * mm, mask='auto')

    # Candidate row
    y = H - 50 * mm
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, y, "APPLICATION NO.")
    c.drawString(80 * mm, y, "CANDIDATE NAME")
    c.setFillColor(PRIMARY); c.setFont("Helvetica-Bold", 12)
    c.drawString(15 * mm, y - 6 * mm, application_no)
    c.setFillColor(TEXT); c.setFont("Helvetica-Bold", 12)
    c.drawString(80 * mm, y - 6 * mm, str(name)[:30])
    c.setStrokeColor(LINE); c.line(15 * mm, y - 8 * mm, W - 15 * mm, y - 8 * mm)

    y -= 16 * mm
    pairs = [
        ("SCHOOL", school), ("STANDARD", standard),
        ("TARGET EXAM", target_exam),
    ]
    x_pos = [15 * mm, 80 * mm]
    for i, (label, val) in enumerate(pairs):
        col = i % 2; row_y = y - (i // 2) * 11 * mm
        c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
        c.drawString(x_pos[col], row_y, label)
        c.setFillColor(TEXT); c.setFont("Helvetica", 10)
        c.drawString(x_pos[col], row_y - 5 * mm, str(val) or "—")
    y -= 22 * mm

    # Big result block
    pct_total = float(total_marks) if total_marks else 100.0
    score_pct = (float(marks_obtained) / pct_total) * 100 if pct_total else 0
    c.setStrokeColor(LINE); c.setLineWidth(0.5)
    c.rect(15 * mm, y - 32 * mm, W - 30 * mm, 32 * mm, stroke=1, fill=0)

    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
    c.drawString(20 * mm, y - 6 * mm, "MARKS OBTAINED")
    c.setFillColor(PRIMARY); c.setFont("Helvetica-Bold", 22)
    c.drawString(20 * mm, y - 16 * mm, f"{marks_obtained:g} / {total_marks:g}")
    c.setFillColor(MUTED); c.setFont("Helvetica", 8)
    c.drawString(20 * mm, y - 22 * mm, f"({score_pct:.1f}%)")

    # Right side: scholarship %
    c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
    c.drawString(W - 70 * mm, y - 6 * mm, "SCHOLARSHIP AWARDED")
    award_color = GREEN if scholarship_percentage >= 25 else RED if scholarship_percentage == 0 else PRIMARY
    c.setFillColor(award_color); c.setFont("Helvetica-Bold", 28)
    c.drawString(W - 70 * mm, y - 18 * mm, f"{int(scholarship_percentage)}%")
    c.setFillColor(MUTED); c.setFont("Helvetica", 8)
    c.drawString(W - 70 * mm, y - 24 * mm, "off on tuition fee")
    y -= 40 * mm

    # Stats row
    stats = []
    if rank: stats.append(("RANK", str(rank)))
    if percentile is not None: stats.append(("PERCENTILE", f"{percentile:.2f}"))
    if stats:
        for i, (l, v) in enumerate(stats):
            x = 15 * mm + i * 50 * mm
            c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
            c.drawString(x, y, l)
            c.setFillColor(TEXT); c.setFont("Helvetica-Bold", 14)
            c.drawString(x, y - 6 * mm, v)
        y -= 14 * mm

    # Remarks
    if remarks:
        c.setFillColor(MUTED); c.setFont("Helvetica-Bold", 7)
        c.drawString(15 * mm, y, "REMARKS")
        y -= 5 * mm
        c.setFillColor(TEXT); c.setFont("Helvetica", 9)
        for line in str(remarks).split("\n")[:3]:
            c.drawString(15 * mm, y, line[:80]); y -= 4 * mm
        y -= 4 * mm

    # Footer
    c.setStrokeColor(LINE); c.line(15 * mm, 18 * mm, W - 15 * mm, 18 * mm)
    c.setFillColor(MUTED); c.setFont("Helvetica", 7)
    c.drawString(15 * mm, 12 * mm, "This is a system-generated result. Verify authenticity by scanning the QR code.")
    c.drawString(15 * mm, 8 * mm, "Authorized Unacademy Franchise · Kashmir · northendedu.com")

    c.showPage(); c.save()
    return buf.getvalue()
