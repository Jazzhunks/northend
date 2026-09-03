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

# ---- Website-matched brand palette (light, print-friendly) ----
BRAND_BLUE = HexColor("#1483D2")   # site --primary
BRAND_GREEN = HexColor("#08BA7F")  # site --accent
BRAND_BLUE_RGB = (20/255, 131/255, 210/255)
BRAND_GREEN_RGB = (8/255, 186/255, 127/255)
INK = HexColor("#334155")
INK_SOFT = HexColor("#7C8CA0")
CARD_BG = HexColor("#F5FAFD")
CARD_LINE = HexColor("#E3EDF5")
GREEN_SOFT = HexColor("#EAFBF4")
BLUE_SOFT = HexColor("#EAF4FC")
HEADER_TINT = HexColor("#CFEDE2")

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

def _h_gradient(c: canvas.Canvas, x, y, w, h, rgb1, rgb2, steps=160):
    """Draw a smooth horizontal gradient rectangle from rgb1 (left) to rgb2 (right)."""
    r1, g1, b1 = rgb1
    r2, g2, b2 = rgb2
    sw = w / steps
    for i in range(steps):
        t = i / (steps - 1)
        c.setFillColorRGB(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t)
        c.rect(x + i * sw, y, sw + 0.6, h, stroke=0, fill=1)

def admit_card_pdf(application_no, name, phone, school, standard, target_exam,
                   exam_date, venue=None, exam_time=None, scholarship_title=None) -> bytes:
    """Generate a modern Admit Card A5 PDF matched to the northendedu.com brand
    (blue → green gradient, glass-card layout, QR)."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A5)
    W, H = A5

    # Safe fallback string handling
    app_no_str = str(application_no or "")
    name_str = str(name or "")[:32]
    phone_str = str(phone or "N/A")
    school_str = str(school or "")[:34]

    clean_std = str(standard or "").strip()
    std_display = clean_std if clean_std.lower().startswith("class") else (f"Class {clean_std}" if clean_std else "—")

    target_exam_str = str(target_exam or "N/A")
    exam_date_str = str(exam_date or "TBA")
    exam_time_str = str(exam_time or "10:00 AM")
    title_str = str(scholarship_title or "Scholarship Aptitude Test")[:40]
    valid_venue = _sanitize_venue(venue)

    # ---- Page background + subtle frame ----
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # ---- Gradient Header (full-bleed top) ----
    hdr_h = 42 * mm
    _h_gradient(c, 0, H - hdr_h, W, hdr_h, BRAND_BLUE_RGB, BRAND_GREEN_RGB)

    # Overline
    c.setFillColor(HEADER_TINT)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(11 * mm, H - 12 * mm, "U N A C A D E M Y   K A S H M I R")

    # Big title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 21)
    c.drawString(11 * mm, H - 22 * mm, "ADMIT CARD")

    # Programme subtitle
    c.setFont("Helvetica", 8.5)
    c.setFillColor(WHITE)
    c.drawString(11 * mm, H - 29 * mm, title_str)

    # Tagline chip
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Oblique", 7)
    c.setFillColor(HEADER_TINT)
    c.drawString(11 * mm, H - 36 * mm, "Wisdom  ·  Aptitude  ·  Talent  ·  Hunt")

    # Unacademy logo in a white rounded pill (top-right)
    c.setFillColor(WHITE)
    c.roundRect(W - 46 * mm, H - 26 * mm, 39 * mm, 14.5 * mm, 3.2, stroke=0, fill=1)
    _draw_unacademy_logo(c, X0=W - 43 * mm, Ytop=H - 15.5 * mm, target_width=33 * mm)

    # ---- Candidate Profile Card ----
    card_h = 48 * mm
    card_y = H - hdr_h - 6 * mm - card_h
    c.setFillColor(CARD_BG)
    c.setStrokeColor(CARD_LINE)
    c.setLineWidth(1)
    c.roundRect(8 * mm, card_y, W - 16 * mm, card_h, 5, stroke=1, fill=1)

    # accent tab
    c.setFillColor(BRAND_GREEN)
    c.roundRect(8 * mm, card_y + card_h - 1.2 * mm, 26 * mm, 1.2 * mm, 0.6, stroke=0, fill=1)

    # QR (encodes result lookup)
    qr_url = f"https://northendedu.com/wath?app_no={app_no_str}&phone={phone_str}#result"
    c.setFillColor(WHITE)
    c.setStrokeColor(CARD_LINE)
    c.roundRect(W - 36 * mm, card_y + 9 * mm, 24 * mm, 24 * mm, 3, stroke=1, fill=1)
    c.drawImage(_qr_bytes(qr_url), W - 35 * mm, card_y + 10 * mm, 22 * mm, 22 * mm, mask='auto')
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica-Bold", 5)
    c.drawCentredString(W - 24 * mm, card_y + 6 * mm, "SCAN FOR RESULT")

    def field(x, y, label, value, value_color=INK, value_font=("Helvetica-Bold", 10)):
        c.setFillColor(INK_SOFT)
        c.setFont("Helvetica-Bold", 6.3)
        c.drawString(x, y, label)
        c.setFillColor(value_color)
        c.setFont(value_font[0], value_font[1])
        c.drawString(x, y - 6 * mm, str(value))

    field(13 * mm, card_y + 39 * mm, "APPLICATION NO.", app_no_str, BRAND_BLUE, ("Helvetica-Bold", 12))
    field(13 * mm, card_y + 25 * mm, "CANDIDATE NAME", name_str, INK, ("Helvetica-Bold", 11))
    field(13 * mm, card_y + 11 * mm, "SCHOOL & CLASS", f"{school_str} · {std_display}", INK, ("Helvetica", 8.5))
    field(66 * mm, card_y + 39 * mm, "MOBILE / PHONE", phone_str, INK, ("Helvetica-Bold", 10))

    # ---- Exam Details Card ----
    ex_h = 39 * mm
    ex_y = card_y - 6 * mm - ex_h
    c.setFillColor(WHITE)
    c.setStrokeColor(CARD_LINE)
    c.roundRect(8 * mm, ex_y, W - 16 * mm, ex_h, 5, stroke=1, fill=1)

    # Target track (blue soft pill)
    c.setFillColor(BLUE_SOFT)
    c.roundRect(12 * mm, ex_y + 25 * mm, 58 * mm, 9 * mm, 2.5, stroke=0, fill=1)
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica-Bold", 6.3)
    c.drawString(15 * mm, ex_y + 30.5 * mm, "TARGET EXAM TRACK")
    c.setFillColor(BRAND_BLUE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(15 * mm, ex_y + 26.5 * mm, target_exam_str)

    # Date & time (green soft pill)
    c.setFillColor(GREEN_SOFT)
    c.roundRect(W / 2 + 2 * mm, ex_y + 25 * mm, W / 2 - 14 * mm, 9 * mm, 2.5, stroke=0, fill=1)
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica-Bold", 6.3)
    c.drawString(W / 2 + 5 * mm, ex_y + 30.5 * mm, "DATE & TIME")
    c.setFillColor(BRAND_GREEN)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(W / 2 + 5 * mm, ex_y + 26.5 * mm, f"{exam_date_str} · {exam_time_str}")

    c.setStrokeColor(CARD_LINE)
    c.line(12 * mm, ex_y + 19 * mm, W - 12 * mm, ex_y + 19 * mm)

    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica-Bold", 6.3)
    c.drawString(13 * mm, ex_y + 12.5 * mm, "DESIGNATED EXAM VENUE")
    c.setFillColor(BRAND_BLUE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(13 * mm, ex_y + 6 * mm, f"Unacademy Kashmir – {valid_venue}")

    # ---- Instructions ----
    y3 = ex_y - 8 * mm
    c.setFillColor(BRAND_BLUE)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(9 * mm, y3, "IMPORTANT CANDIDATE INSTRUCTIONS")
    y3 -= 5.5 * mm
    c.setFont("Helvetica", 7)
    notes = [
        "Carry a printed hard copy of this admit card and a valid school photo ID.",
        "Arrive at your designated centre at least 30 minutes prior to exam time.",
        "Mobile phones, smart watches, calculators and gadgets are prohibited.",
        "Results will be declared within 7 days at northendedu.com.",
    ]
    for n in notes:
        c.setFillColor(BRAND_GREEN)
        c.setFont("Helvetica-Bold", 7)
        c.drawString(9 * mm, y3, "•")
        c.setFillColor(INK)
        c.setFont("Helvetica", 7)
        c.drawString(12 * mm, y3, n)
        y3 -= 4.4 * mm

    # ---- Signature + footer ----
    c.setStrokeColor(CARD_LINE)
    c.setFillColor(WHITE)
    c.roundRect(W - 44 * mm, 12 * mm, 36 * mm, 12 * mm, 2, stroke=1, fill=1)
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica-Bold", 5.5)
    c.drawCentredString(W - 26 * mm, 9 * mm, "CANDIDATE SIGNATURE")

    c.setFillColor(BRAND_GREEN)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(9 * mm, 16 * mm, "northendedu.com")
    c.setFillColor(INK_SOFT)
    c.setFont("Helvetica", 6)
    c.drawString(9 * mm, 12 * mm, "System-generated · Verify via QR")

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