"""PDF generators (admit card, result card) with QR code."""
import io
import qrcode
from reportlab.lib.pagesizes import A5
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# Design Palette
PRIMARY = HexColor("#002FA7")
ACCENT = HexColor("#FFC107")
TEXT = HexColor("#0F172A")
MUTED = HexColor("#64748B")
LINE = HexColor("#E2E8F0")
BG_LIGHT = HexColor("#F8FAFC")
WHITE = HexColor("#FFFFFF")
GREEN = HexColor("#10B981")
RED = HexColor("#EF4444")

def _qr_bytes(data: str) -> ImageReader:
    """Generate QR code and return as ReportLab ImageReader."""
    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return ImageReader(buf)

def admit_card_pdf(application_no, name, school, standard, target_exam,
                   exam_date, venue=None, exam_time=None, scholarship_title=None) -> bytes:
    """Generate a modern Admit Card A5 PDF."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # ---- Header Band ----
    c.setFillColor(PRIMARY)
    c.rect(0, H - 30 * mm, W, 30 * mm, stroke=0, fill=1)
    
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, H - 12 * mm, "NORTHEND EDUCATIONAL WORLD")
    
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(15 * mm, H - 20 * mm, "Admit Card")
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, H - 26 * mm, scholarship_title or "Scholarship Test")

    # ---- Candidate Profile Block ----
    y = H - 35 * mm
    box1_h = 42 * mm
    box1_y = y - box1_h
    c.setFillColor(BG_LIGHT)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(10 * mm, box1_y, W - 20 * mm, box1_h, 4, stroke=1, fill=1)

    # QR Code inside the profile block
    qr = _qr_bytes(f"NEW|{application_no}|{name}")
    c.drawImage(qr, W - 38 * mm, box1_y + 8 * mm, 24 * mm, 24 * mm, mask='auto')

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box1_y + 34 * mm, "APPLICATION NO.")
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(15 * mm, box1_y + 29 * mm, str(application_no))

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box1_y + 20 * mm, "CANDIDATE NAME")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(15 * mm, box1_y + 15 * mm, str(name)[:30])

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box1_y + 6 * mm, "SCHOOL & STANDARD")
    c.setFillColor(TEXT)
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, box1_y + 2 * mm, f"{str(school)[:35]} | Class {standard}")

    # ---- Exam Details Block ----
    y2 = box1_y - 5 * mm
    box2_h = 45 * mm
    box2_y = y2 - box2_h
    
    c.setFillColor(WHITE)
    c.roundRect(10 * mm, box2_y, W - 20 * mm, box2_h, 4, stroke=1, fill=1)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box2_y + 37 * mm, "TARGET EXAM")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(15 * mm, box2_y + 32 * mm, str(target_exam))

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(W/2, box2_y + 37 * mm, "DATE & TIME")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(W/2, box2_y + 32 * mm, f"{exam_date or 'TBA'} • {exam_time or '10:00 AM'}")

    c.setStrokeColor(LINE)
    c.line(15 * mm, box2_y + 26 * mm, W - 15 * mm, box2_y + 26 * mm)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box2_y + 19 * mm, "EXAM VENUE")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(15 * mm, box2_y + 14 * mm, str(venue or "Northend Srinagar – Lal Chowk"))
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, box2_y + 9 * mm, "Please arrive at the venue 30 minutes prior to exam time.")

    # ---- Instructions ----
    y3 = box2_y - 8 * mm
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(12 * mm, y3, "EXAM INSTRUCTIONS")
    y3 -= 6 * mm
    
    c.setFont("Helvetica", 7.5)
    c.setFillColor(TEXT)
    notes = [
        "• Carry a printed copy of this admit card and a valid school ID.",
        "• Electronic gadgets, smart watches, and calculators are strictly prohibited.",
        "• Late entries will not be permitted under any circumstances.",
        "• Result will be available 3-7 working days after the exam at northendedu.com.",
    ]
    for n in notes:
        c.drawString(12 * mm, y3, n)
        y3 -= 4.5 * mm

    # ---- Signature ----
    c.setStrokeColor(LINE)
    c.rect(W - 45 * mm, 12 * mm, 35 * mm, 12 * mm, stroke=1, fill=0)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6)
    c.drawCentredString(W - 27.5 * mm, 9 * mm, "CANDIDATE SIGNATURE")

    c.showPage()
    c.save()
    return buf.getvalue()


def result_card_pdf(application_no, name, school, standard, target_exam,
                    marks_obtained, total_marks, rank, percentile,
                    scholarship_percentage, remarks=None,
                    scholarship_title=None) -> bytes:
    """Generate a modern Result Card A5 PDF."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # ---- Header Band ----
    c.setFillColor(PRIMARY)
    c.rect(0, H - 30 * mm, W, 30 * mm, stroke=0, fill=1)
    
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, H - 12 * mm, "NORTHEND EDUCATIONAL WORLD")
    
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(15 * mm, H - 20 * mm, "Result Card")
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, H - 26 * mm, scholarship_title or "Scholarship Test")

    # ---- Candidate Profile Block ----
    y = H - 35 * mm
    box1_h = 42 * mm
    box1_y = y - box1_h
    c.setFillColor(BG_LIGHT)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(10 * mm, box1_y, W - 20 * mm, box1_h, 4, stroke=1, fill=1)

    qr = _qr_bytes(f"NER|{application_no}|{name}|{scholarship_percentage}%")
    c.drawImage(qr, W - 38 * mm, box1_y + 8 * mm, 24 * mm, 24 * mm, mask='auto')

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box1_y + 34 * mm, "APPLICATION NO.")
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(15 * mm, box1_y + 29 * mm, str(application_no))

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box1_y + 20 * mm, "CANDIDATE NAME")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(15 * mm, box1_y + 15 * mm, str(name)[:30])

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, box1_y + 6 * mm, "SCHOOL & STANDARD")
    c.setFillColor(TEXT)
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, box1_y + 2 * mm, f"{str(school)[:35]} | Class {standard}")

    # ---- Score & Scholarship Block ----
    y2 = box1_y - 5 * mm
    score_h = 42 * mm
    score_y = y2 - score_h
    
    c.setFillColor(WHITE)
    c.roundRect(10 * mm, score_y, W - 20 * mm, score_h, 4, stroke=1, fill=1)
    
    # Divider
    c.setStrokeColor(LINE)
    c.line(W/2, score_y + 5 * mm, W/2, score_y + score_h - 5 * mm)

    # Left: Marks
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(W/4 + 5 * mm, score_y + 32 * mm, "MARKS OBTAINED")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(W/4 + 5 * mm, score_y + 18 * mm, f"{marks_obtained:g}")

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(W/4 + 5 * mm, score_y + 11 * mm, f"out of {total_marks:g}")

    # Right: Scholarship
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(3 * W/4 - 5 * mm, score_y + 32 * mm, "SCHOLARSHIP AWARD")

    award_color = GREEN if scholarship_percentage >= 25 else RED if scholarship_percentage == 0 else PRIMARY
    c.setFillColor(award_color)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(3 * W/4 - 5 * mm, score_y + 16 * mm, f"{int(scholarship_percentage)}%")

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(3 * W/4 - 5 * mm, score_y + 9 * mm, "OFF ON TUITION FEE")

    # ---- Stats Row ----
    y3 = score_y - 5 * mm
    stat_h = 16 * mm
    stat_y = y3 - stat_h
    c.setFillColor(BG_LIGHT)
    c.roundRect(10 * mm, stat_y, W - 20 * mm, stat_h, 4, stroke=1, fill=1)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(15 * mm, stat_y + 10 * mm, "RANK")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(15 * mm, stat_y + 4 * mm, str(rank) if rank else "—")

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(W/2, stat_y + 10 * mm, "PERCENTILE")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(W/2, stat_y + 4 * mm, f"{percentile:.2f}" if percentile is not None else "—")

    # ---- Remarks ----
    if remarks:
        rem_y = stat_y - 8 * mm
        c.setFillColor(PRIMARY)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(12 * mm, rem_y, "REMARKS")
        rem_y -= 5 * mm
        
        c.setFillColor(TEXT)
        c.setFont("Helvetica", 8)
        for line in str(remarks).split("\n")[:3]:
            c.drawString(12 * mm, rem_y, line[:80])
            rem_y -= 4 * mm

    # ---- Footer ----
    c.setStrokeColor(LINE)
    c.line(10 * mm, 16 * mm, W - 10 * mm, 16 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(W/2, 11 * mm, "This is a system-generated document. Verify authenticity by scanning the QR code.")
    c.drawCentredString(W/2, 7 * mm, "Authorized Unacademy Franchise · Kashmir · northendedu.com")

    c.showPage()
    c.save()
    return buf.getvalue()