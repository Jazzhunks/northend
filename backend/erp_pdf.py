"""ERP receipt PDF generator (GST-compliant)."""
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

PRIMARY = HexColor("#002FA7")
ACCENT = HexColor("#FFC107")
TEXT = HexColor("#0F172A")
MUTED = HexColor("#475569")
LINE = HexColor("#E2E8F0")


def _hr(c: canvas.Canvas, x1: float, x2: float, y: float, color=LINE):
    c.setStrokeColor(color)
    c.setLineWidth(0.6)
    c.line(x1, y, x2, y)


def fee_receipt_pdf(payment: dict, student: dict, branch: dict, course_title: str, prev_paid: float, total_fee: float) -> bytes:
    """Generate a professional GST fee receipt as A4 PDF bytes."""
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    W, H = A4

    # ---- Header band ----
    c.setFillColor(PRIMARY)
    c.rect(0, H - 28 * mm, W, 28 * mm, fill=1, stroke=0)
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica-Bold", 18)
    c.drawString(15 * mm, H - 15 * mm, "NORTHEND EDUCATIONAL WORLD")
    c.setFont("Helvetica", 9)
    c.drawString(15 * mm, H - 21 * mm, "Authorized Unacademy Partner — Kashmir Region")
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 11)
    c.drawRightString(W - 15 * mm, H - 15 * mm, "FEE RECEIPT")
    c.setFillColor(HexColor("#FFFFFF"))
    c.setFont("Helvetica", 8)
    c.drawRightString(W - 15 * mm, H - 21 * mm, f"GSTIN: {branch.get('gstin', 'N/A')}")

    # ---- Branch + receipt meta ----
    y = H - 38 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(15 * mm, y, branch.get("name", "Northend Centre"))
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED)
    addr = branch.get("address", "") or ""
    c.drawString(15 * mm, y - 4.5 * mm, addr[:90])
    c.drawString(15 * mm, y - 9 * mm, f"Phone: {branch.get('phone', '—')}")

    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawRightString(W - 15 * mm, y, f"Receipt No: {payment['receipt_no']}")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MUTED)
    paid_at = payment["paid_at"][:10] if isinstance(payment.get("paid_at"), str) else str(payment.get("paid_at"))[:10]
    c.drawRightString(W - 15 * mm, y - 4.5 * mm, f"Date: {paid_at}")
    c.drawRightString(W - 15 * mm, y - 9 * mm, f"Mode: {payment.get('mode', '—').upper()}")

    _hr(c, 15 * mm, W - 15 * mm, y - 13 * mm)

    # ---- Student block ----
    y2 = y - 22 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(15 * mm, y2, "Student Details")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, y2 - 5 * mm, f"Name:   {student.get('full_name', '—')}")
    c.drawString(15 * mm, y2 - 10 * mm, f"ID:     {student.get('student_no', '—')}")
    c.drawString(15 * mm, y2 - 15 * mm, f"Course: {course_title}")
    c.drawString(15 * mm, y2 - 20 * mm, f"Batch:  {student.get('batch', '—')}")
    c.drawString(15 * mm, y2 - 25 * mm, f"Phone:  {student.get('contact_phone', '—')}")

    _hr(c, 15 * mm, W - 15 * mm, y2 - 32 * mm)

    # ---- Amount table ----
    y3 = y2 - 42 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(15 * mm, y3, "Particulars")
    c.drawRightString(W - 15 * mm, y3, "Amount (INR)")
    _hr(c, 15 * mm, W - 15 * mm, y3 - 2 * mm)

    rows = [
        (f"Course fee — {course_title}", float(payment.get("base_amount", 0))),
        (f"CGST ({payment.get('cgst_rate', 9)}%)", float(payment.get("cgst", 0))),
        (f"SGST ({payment.get('sgst_rate', 9)}%)", float(payment.get("sgst", 0))),
    ]
    yi = y3 - 7 * mm
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    for label, amt in rows:
        c.drawString(15 * mm, yi, label)
        c.drawRightString(W - 15 * mm, yi, f"{amt:,.2f}")
        yi -= 5.5 * mm

    _hr(c, 15 * mm, W - 15 * mm, yi)
    yi -= 6 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(15 * mm, yi, "Total Paid")
    c.drawRightString(W - 15 * mm, yi, f"INR {float(payment.get('amount', 0)):,.2f}")

    # ---- Balance summary ----
    yi -= 14 * mm
    c.setFillColor(HexColor("#F1F5F9"))
    c.rect(15 * mm, yi - 16 * mm, W - 30 * mm, 18 * mm, fill=1, stroke=0)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(20 * mm, yi - 3 * mm, "Account Summary")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    pending = max(total_fee - prev_paid - float(payment.get("amount", 0)), 0)
    c.drawString(20 * mm, yi - 8 * mm, f"Total course fee:        INR {total_fee:,.2f}")
    c.drawString(20 * mm, yi - 12 * mm, f"Previously paid:         INR {prev_paid:,.2f}")
    c.drawString(95 * mm, yi - 8 * mm, f"This payment:            INR {float(payment.get('amount', 0)):,.2f}")
    c.setFillColor(HexColor("#B91C1C") if pending > 0 else HexColor("#047857"))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(95 * mm, yi - 12 * mm, f"Pending balance:         INR {pending:,.2f}")

    if payment.get("next_due_date"):
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 8.5)
        c.drawString(20 * mm, yi - 18 * mm, f"Next installment due: {payment['next_due_date']}")

    # ---- Footer signature ----
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(15 * mm, 22 * mm, payment.get("notes", "") or "")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawRightString(W - 15 * mm, 28 * mm, "Authorized Signatory")
    _hr(c, W - 60 * mm, W - 15 * mm, 26 * mm, color=TEXT)
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawRightString(W - 15 * mm, 22 * mm, branch.get("signatory_name", "Centre Manager"))
    c.drawString(15 * mm, 12 * mm, "This is a computer-generated receipt. For queries, contact your branch.")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf.getvalue()
