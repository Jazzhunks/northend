"""PDF generators (admit card, result card) with QR code."""
import io
import re
import logging
import qrcode
from reportlab.lib.pagesizes import A5
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

logger = logging.getLogger(__name__)

# Design Palette
PRIMARY = HexColor("#002FA7")
PRIMARY_LIGHT = HexColor("#EEF2FF")
ACCENT = HexColor("#FFC107")
TEXT = HexColor("#0F172A")
MUTED = HexColor("#64748B")
LINE = HexColor("#E2E8F0")
BG_LIGHT = HexColor("#F8FAFC")
WHITE = HexColor("#FFFFFF")
GREEN = HexColor("#10B981")
BLUE_BRAND = HexColor("#2D81F7")
GREEN_BRAND = HexColor("#08BD80")
RED = HexColor("#EF4444")

ALLOWED_VENUES = {"90 FT", "Anantnag", "Sopore", "Soura", "Zakura", "Parraypora"}

# Official Unacademy SVG Vector Paths (Emblem + Wordmark)
UNACADEMY_SVG_PATHS = [
    ("#08BD80", "M34.7,12.5c0,3,1.2,5.2,4.6,5.2c2.5,0,3.9-1.5,3.9-1.5l0.2,0.7c0.1,0.3,0.2,0.5,0.5,0.5h0.6c0.3,0,0.6-0.3,0.6-0.5V6.5c0-0.3-0.3-0.5-0.6-0.5h-0.9c-0.3,0-0.6,0.3-0.6,0.5v7.7c0,0-1.3,1.6-3.5,1.6c-1.7,0-2.7-1.1-2.7-3.2V6.5c0-0.3-0.3-0.5-0.6-0.5h-1c-0.3,0-0.6,0.3-0.6,0.5V12.5z"),
    ("#2D81F7", "M66,10.1c-3.1,0-4.8,1.6-4.8,3.8c0,2.3,1.6,3.8,3.7,3.8c1.8,0,3.1-0.9,3.7-1.5l0.2,0.8c0.1,0.3,0.2,0.4,0.5,0.4h0.6c0.3,0,0.6-0.3,0.6-0.5v-6.4c0-3.4-0.7-4.9-3.8-4.9c-2.2,0-4,0.7-4.1,0.7c-0.3,0.1-0.4,0.3-0.3,0.6l0.2,0.7C62.6,8,62.7,8.1,63,8c0.5-0.2,1.9-0.6,3.6-0.6c1.7,0,2,1,1.9,3.1C68.5,10.5,67.3,10.1,66,10.1z M65.2,16c-1.3,0-2.1-0.9-2.1-2c0-1.5,1.2-2.3,2.9-2.3c1.3,0,2.1,0.3,2.5,0.5v2.3C68,15.1,66.7,16,65.2,16z"),
    ("#2D81F7", "M73.2,11.7c0,3.4,2.8,6,6.1,6c2,0,3.7-1,4.5-2.4c0.2-0.3,0.1-0.6-0.2-0.8l-0.3-0.2C83,14,82.8,14,82.4,14.3c-0.7,0.6-1.4,1.5-3.2,1.5c-2.2,0-3.9-1.8-3.9-4.1c0-2.3,1.7-4.1,4-4.1c1.2,0,2.1,0.5,2.7,1.2c0.3,0.2,0.4,0.5,0.9,0.1l0.6-0.5c0.3-0.2,0.3-0.5,0.1-0.8c-1.1-1.3-2.5-2-4.2-2C76.1,5.6,73.2,8.3,73.2,11.7z"),
    ("#2D81F7", "M91.5,10.1c-3.1,0-4.8,1.6-4.8,3.8c0,2.3,1.6,3.8,3.7,3.8c1.8,0,3.1-0.9,3.7-1.5l0.2,0.8c0.1,0.3,0.2,0.4,0.5,0.4h0.6c0.3,0,0.6-0.3,0.6-0.5v-6.4c0-3.4-0.7-4.9-3.8-4.9c-2.2,0-4,0.7-4.1,0.7c-0.3,0.1-0.4,0.3-0.3,0.6l0.2,0.7C88,8,88.2,8.1,88.5,8c0.5-0.2,1.9-0.6,3.6-0.6c1.7,0,2,1,1.9,3.1C94,10.5,92.8,10.1,91.5,10.1z M90.7,16c-1.3,0-2.1-0.9-2.1-2c0-1.5,1.2-2.3,2.9-2.3c1.3,0,2.1,0.3,2.5,0.5v2.3C93.5,15.1,92.2,16,90.7,16z"),
    ("#2D81F7", "M104.4,5.6c-3.6,0-5.7,2.6-5.7,6c0,3.3,2.4,6.1,5.4,6.1c2.2,0,3.7-1.5,3.7-1.5l0.2,0.8c0.1,0.3,0.2,0.5,0.5,0.5h0.6c0.3,0,0.6-0.3,0.6-0.5V0.5c0-0.3-0.3-0.5-0.6-0.5h-0.9c-0.3,0-0.6,0.3-0.6,0.5v5.8C107.6,6.4,106.4,5.6,104.4,5.6z M104.3,15.9c-2.2,0-3.5-2-3.5-4.2c0-2.3,1.3-4.1,3.9-4.1c1.6,0,2.9,0.7,2.9,0.7V14C107.6,14,106.5,15.9,104.3,15.9z"),
    ("#2D81F7", "M118.2,5.6c-3.6,0-5.8,2.8-5.8,6c0,3.3,2.2,6,5.8,6c2.1,0,3.7-0.8,4.4-1.3c0.4-0.3,0.3-0.5,0.1-0.7c-0.1-0.1-0.2-0.2-0.3-0.3c-0.1-0.1-0.2-0.2-0.3-0.3c-0.2-0.3-0.4-0.2-0.7,0c0,0-0.1,0-0.1,0.1c-0.7,0.4-1.7,0.9-2.9,0.9c-2.1,0-3.9-1.8-4-3.7h8.6c0.3,0,0.5-0.2,0.5-0.5c0-0.2,0.1-0.6,0.1-0.8C123.6,7.9,121.4,5.6,118.2,5.6z M121.6,10.5h-7.1c0.2-1.8,1.8-3.2,3.7-3.2C120,7.4,121.5,8.9,121.6,10.5z"),
    ("#2D81F7", "M126.4,16.9c0,0.3,0.3,0.5,0.6,0.5h0.9c0.3,0,0.6-0.3,0.6-0.5V9.2c0,0,1.3-1.6,3.4-1.6c1.8,0,2.8,1.1,2.8,3.2v6.1c0,0.3,0.3,0.5,0.6,0.5h1c0.3,0,0.6-0.3,0.6-0.5v-6.1c0-0.6-0.1-1.1-0.1-1.6c0.4-0.4,1.7-1.6,3.6-1.6c1.7,0,2.7,1.1,2.7,3.2v6.1c0,0.3,0.3,0.5,0.6,0.5h1c0.3,0,0.6-0.3,0.6-0.5v-6.1c0-3-1.2-5.2-4.6-5.2c-2.4,0-4.3,1.8-4.4,1.9c-0.8-1.2-2.1-1.9-3.8-1.9c-2.5,0-3.9,1.5-3.9,1.5L128,6.3c-0.1-0.2-0.2-0.3-0.5-0.3h-0.6c-0.3,0-0.6,0.3-0.6,0.5V16.9z"),
    ("#2D81F7", "M153.3,17.4l-2.4,5.9c-0.2,0.4,0,0.7,0.5,0.7h1.1c0.2,0,0.4-0.2,0.5-0.3l7.7-17.1c0.2-0.4,0-0.7-0.4-0.7h-1.1c-0.2,0-0.4,0.1-0.5,0.3l-4.2,8.8l-4.4-8.8c-0.1-0.2-0.3-0.3-0.5-0.3h-1.3c-0.4,0-0.6,0.3-0.4,0.6L153.3,17.4z"),
    ("#08BD80", "M47.8,16.9c0,0.3,0.3,0.5,0.6,0.5h0.9c0.3,0,0.6-0.3,0.6-0.5V9.2c0,0,1.6-1.6,3.8-1.6c1.7,0,2.7,1.1,2.7,3.2v6.1c0,0.3,0.3,0.5,0.6,0.5h1c0.3,0,0.6-0.3,0.6-0.5v-6.1c0-3-1.2-5.2-4.6-5.2c-2.5,0-4.2,1.5-4.2,1.5l-0.3-0.9C49.4,6,49.2,5.9,49,5.9h-0.6c-0.3,0-0.6,0.3-0.6,0.5V16.9z"),
    ("#2D81F7", "M0.2,2.2c1.1,6.8,7.2,12,14.5,12c7.2,0,13.3-5.1,14.5-11.8c0.2-0.6,0.2-1.1,0.2-1.6c0-0.5-0.4-0.9-0.9-0.9h-0.8H1.8H0.9C0.4,0,0,0.4,0,0.9c0,0,0,0,0,0c0,0,0,0,0,0C0,1.3,0,1.7,0.2,2.2L0.2,2.2z"),
    ("#08BD80", "M21.9,22.9c-0.6-3.4-3.6-6-7.2-6c-3.6,0-6.6,2.5-7.2,5.9c-0.1,0.3-0.1,0.6-0.1,0.8c0,0.2,0.2,0.4,0.4,0.4h0.4H21h0.5c0.3,0,0.4-0.2,0.4-0.4c0,0,0,0,0,0c0,0,0,0,0,0C21.9,23.3,21.9,23.1,21.9,22.9z")
]

def _render_svg_path(c: canvas.Canvas, color_hex: str, d: str, X0: float, Ytop: float, S: float):
    """Accurately parse and draw an SVG path d-string natively to ReportLab Canvas."""
    c.setFillColor(HexColor(color_hex))
    p = c.beginPath()
    
    tokens = re.findall(r'([A-Za-z])|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)', d)
    
    cmd = None
    args = []
    cx, cy = X0, Ytop
    start_x, start_y = X0, Ytop
    
    def exec_cmd(command, params):
        nonlocal cx, cy, start_x, start_y
        if not command: return
        
        c_upper = command.upper()
        is_rel = command.islower()
        idx = 0
        n_params = len(params)
        
        while idx < n_params or c_upper == 'Z':
            if c_upper == 'M':
                x_val, y_val = params[idx], params[idx+1]
                idx += 2
                if is_rel:
                    cx += x_val * S
                    cy -= y_val * S
                else:
                    cx = X0 + x_val * S
                    cy = Ytop - y_val * S
                p.moveTo(cx, cy)
                start_x, start_y = cx, cy
                c_upper = 'L'
            elif c_upper == 'L':
                x_val, y_val = params[idx], params[idx+1]
                idx += 2
                if is_rel:
                    cx += x_val * S
                    cy -= y_val * S
                else:
                    cx = X0 + x_val * S
                    cy = Ytop - y_val * S
                p.lineTo(cx, cy)
            elif c_upper == 'H':
                x_val = params[idx]
                idx += 1
                cx = (cx + x_val * S) if is_rel else (X0 + x_val * S)
                p.lineTo(cx, cy)
            elif c_upper == 'V':
                y_val = params[idx]
                idx += 1
                cy = (cy - y_val * S) if is_rel else (Ytop - y_val * S)
                p.lineTo(cx, cy)
            elif c_upper == 'C':
                x1, y1 = params[idx], params[idx+1]
                x2, y2 = params[idx+2], params[idx+3]
                x, y = params[idx+4], params[idx+5]
                idx += 6
                if is_rel:
                    px1, py1 = cx + x1 * S, cy - y1 * S
                    px2, py2 = cx + x2 * S, cy - y2 * S
                    cx += x * S
                    cy -= y * S
                else:
                    px1, py1 = X0 + x1 * S, Ytop - y1 * S
                    px2, py2 = X0 + x2 * S, Ytop - y2 * S
                    cx = X0 + x * S
                    cy = Ytop - y * S
                p.curveTo(px1, py1, px2, py2, cx, cy)
            elif c_upper == 'Z':
                p.close()
                cx, cy = start_x, start_y
                if idx < n_params:
                    idx += 1
                else:
                    break
            else:
                idx += 1

    for t_cmd, t_num in tokens:
        if t_cmd:
            if cmd: exec_cmd(cmd, args)
            cmd = t_cmd
            args = []
        elif t_num:
            args.append(float(t_num))
            
    if cmd: exec_cmd(cmd, args)
    c.drawPath(p, fill=1, stroke=0)

def _draw_unacademy_logo(c: canvas.Canvas, X0: float, Ytop: float, target_width: float = 33 * mm):
    """Draw official vector Unacademy logo."""
    native_width = 160.8
    scale = target_width / native_width
    
    for fill_hex, path_d in UNACADEMY_SVG_PATHS:
        _render_svg_path(c, fill_hex, path_d, X0, Ytop, scale)

def _sanitize_venue(venue: str | None) -> str:
    """Ensure venue is strictly one of the allowed locations."""
    if venue and venue.strip().title() in ALLOWED_VENUES:
        return venue.strip().title()
    if venue:
        for allowed in ALLOWED_VENUES:
            if allowed.lower() in venue.strip().lower():
                return allowed
    return "Srinagar"

def _qr_bytes(data: str) -> ImageReader:
    """Generate QR code and return as ReportLab ImageReader."""
    img = qrcode.make(data)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return ImageReader(buf)

def admit_card_pdf(application_no, name, phone, school, standard, target_exam,
                   exam_date, venue=None, exam_time=None, scholarship_title=None) -> bytes:
    """Generate a modern, highly detailed Admit Card A5 PDF."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # Safe fallback string handling
    app_no_str = str(application_no or "")
    name_str = str(name or "")[:30]
    phone_str = str(phone or "N/A")
    school_str = str(school or "")[:30]
    
    clean_std = str(standard or "").strip()
    std_display = clean_std if clean_std.lower().startswith("class") else f"Class {clean_std}"
    
    target_exam_str = str(target_exam or "N/A")
    exam_date_str = str(exam_date or "TBA")
    exam_time_str = str(exam_time or "10:00 AM")
    title_str = str(scholarship_title or "Scholarship Aptitude Test")
    
    valid_venue = _sanitize_venue(venue)

    # ---- Outer Decorative Border ----
    c.setStrokeColor(PRIMARY)
    c.setLineWidth(0.8)
    c.rect(4 * mm, 4 * mm, W - 8 * mm, H - 8 * mm, stroke=1, fill=0)

    # ---- Header Band ----
    c.setFillColor(PRIMARY)
    c.rect(5 * mm, H - 32 * mm, W - 10 * mm, 27 * mm, stroke=0, fill=1)
    
    # Left Header Text
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(10 * mm, H - 11 * mm, "UNACADEMY OFFLINE CENTRE")
    
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(10 * mm, H - 19 * mm, "EXAMINATION ADMIT CARD")
    c.setFont("Helvetica", 8.5)
    c.drawString(10 * mm, H - 26 * mm, title_str)

    # Top-Right Header Container + Vector Unacademy Logo
    c.setFillColor(WHITE)
    c.roundRect(W - 44 * mm, H - 25 * mm, 38 * mm, 14 * mm, 3, stroke=0, fill=1)
    _draw_unacademy_logo(c, X0=W - 41.5 * mm, Ytop=H - 15 * mm, target_width=33 * mm)

    # ---- Candidate Profile Block ----
    box1_y = H - 82 * mm
    box1_h = 47 * mm
    c.setFillColor(BG_LIGHT)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(8 * mm, box1_y, W - 16 * mm, box1_h, 4, stroke=1, fill=1)

    # QR Code Block Encoding Results URL + Application Info
    # (Phone Camera -> opens results page; Attendance Scanner App -> reads app_no to mark attendance)
    qr_url = f"https://northendedu.com/wath?app_no={app_no_str}&phone={phone_str}#result"
    c.setFillColor(WHITE)
    c.roundRect(W - 35 * mm, box1_y + 8 * mm, 23 * mm, 23 * mm, 3, stroke=1, fill=1)
    qr = _qr_bytes(qr_url)
    c.drawImage(qr, W - 34 * mm, box1_y + 9 * mm, 21 * mm, 21 * mm, mask='auto')

    # Candidate Profile Fields (Grid)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(12 * mm, box1_y + 39 * mm, "APPLICATION NO.")
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(12 * mm, box1_y + 33 * mm, app_no_str)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(62 * mm, box1_y + 39 * mm, "MOBILE / PHONE")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(62 * mm, box1_y + 33 * mm, phone_str)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(12 * mm, box1_y + 25 * mm, "CANDIDATE NAME")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(12 * mm, box1_y + 19 * mm, name_str)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(12 * mm, box1_y + 11 * mm, "SCHOOL & ACADEMIC CLASS")
    c.setFillColor(TEXT)
    c.setFont("Helvetica", 8.5)
    c.drawString(12 * mm, box1_y + 5 * mm, f"{school_str} | {std_display}")

    # ---- Exam Details Block ----
    box2_y = box1_y - 42 * mm
    box2_h = 38 * mm
    c.setFillColor(WHITE)
    c.roundRect(8 * mm, box2_y, W - 16 * mm, box2_h, 4, stroke=1, fill=1)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(12 * mm, box2_y + 30 * mm, "TARGET EXAM TRACK")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(12 * mm, box2_y + 24 * mm, target_exam_str)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(W/2 + 2 * mm, box2_y + 30 * mm, "DATE & SCHEDULED TIME")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(W/2 + 2 * mm, box2_y + 24 * mm, f"{exam_date_str} • {exam_time_str}")

    c.setStrokeColor(LINE)
    c.line(12 * mm, box2_y + 19 * mm, W - 12 * mm, box2_y + 19 * mm)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(12 * mm, box2_y + 13 * mm, "DESIGNATED EXAM VENUE")
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 10.5)
    c.drawString(12 * mm, box2_y + 7 * mm, f"Unacademy Offline Centre – {valid_venue}")

    # ---- Instructions ----
    y3 = box2_y - 7 * mm
    c.setFillColor(PRIMARY)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(8 * mm, y3, "IMPORTANT CANDIDATE INSTRUCTIONS")
    y3 -= 5 * mm
    
    c.setFont("Helvetica", 7)
    c.setFillColor(TEXT)
    notes = [
        "1. Carry a printed hard copy of this admit card and a valid school photo ID.",
        "2. Arrive at your designated center at least 30 minutes prior to exam time.",
        "3. Mobile phones, smart watches, calculators, and gadgets are prohibited.",
        "4. Results will be declared within 7 days at northendedu.com.",
    ]
    for n in notes:
        c.drawString(8 * mm, y3, n)
        y3 -= 4 * mm

    # ---- Signature ----
    c.setStrokeColor(LINE)
    c.setFillColor(WHITE)
    c.rect(W - 43 * mm, 10 * mm, 35 * mm, 11 * mm, stroke=1, fill=1)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(W - 25.5 * mm, 7 * mm, "CANDIDATE SIGNATURE")

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
    c.drawString(15 * mm, H - 12 * mm, "UNACADEMY OFFLINE CENTRE")
    
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

    qr = _qr_bytes(f"UAC|{application_no}|{name}|{scholarship_percentage}%")
    c.drawImage(qr, W - 38 * mm, box1_y + 8 * mm, 24 * mm, 24 * mm, mask='auto')

    clean_std = str(standard or "").strip()
    std_disp = clean_std if clean_std.lower().startswith("class") else f"Class {clean_std}"

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
    c.drawString(15 * mm, box1_y + 2 * mm, f"{str(school)[:35]} | {std_disp}")

    # ---- Score & Scholarship Block ----
    y2 = box1_y - 5 * mm
    score_h = 42 * mm
    score_y = y2 - score_h
    
    c.setFillColor(WHITE)
    c.roundRect(10 * mm, score_y, W - 20 * mm, score_h, 4, stroke=1, fill=1)
    
    c.setStrokeColor(LINE)
    c.line(W/2, score_y + 5 * mm, W/2, score_y + score_h - 5 * mm)

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawCentredString(W/4 + 5 * mm, score_y + 32 * mm, "MARKS OBTAINED")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(W/4 + 5 * mm, score_y + 18 * mm, f"{marks_obtained:g}")

    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(W/4 + 5 * mm, score_y + 11 * mm, f"out of {total_marks:g}")

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
    c.drawCentredString(W/2, 7 * mm, "Unacademy Offline Centre · Kashmir · northendedu.com")

    c.showPage()
    c.save()
    return buf.getvalue()