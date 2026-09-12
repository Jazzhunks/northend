import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

TEXT = HexColor("#0F172A")
MUTED = HexColor("#475569")
LINE = HexColor("#E2E8F0")

def _hr(c: canvas.Canvas, x1: float, x2: float, y: float, color=LINE):
    c.setStrokeColor(color)
    c.setLineWidth(0.6)
    c.line(x1, y, x2, y)

def get_amount_in_words(amount) -> str:
    """Converts a number to Indian Rupee words."""
    try:
        num = int(float(amount))
    except (ValueError, TypeError):
        return "—"
        
    if num == 0:
        return "Indian Rupee Zero Only"
        
    ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", 
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
    
    def process_two_digits(n):
        if n < 20: return ones[n]
        return tens[n // 10] + (" " + ones[n % 10] if n % 10 != 0 else "")
        
    def process_three_digits(n):
        if n < 100: return process_two_digits(n)
        return ones[n // 100] + " Hundred" + (" " + process_two_digits(n % 100) if n % 100 != 0 else "")

    words = ""
    if num >= 10000000:
        words += process_two_digits(num // 10000000) + " Crore "
        num %= 10000000
    if num >= 100000:
        words += process_two_digits(num // 100000) + " Lakh "
        num %= 100000
    if num >= 1000:
        words += process_two_digits(num // 1000) + " Thousand "
        num %= 1000
    if num > 0:
        words += process_three_digits(num)
        
    return f"Indian Rupee {words.strip()} Only"

def fee_receipt_pdf(payment: dict, student: dict, branch: dict, course_title: str, prev_paid: float, total_fee: float) -> bytes:
    # --- DEFENSIVE CHECKS TO PREVENT 500 ERRORS ---
    payment = payment or {}
    student = student or {}
    branch = branch or {}
    course_title = course_title or "—"
    
    # Safely cast financial variables to floats (default to 0.0 if None or empty)
    try:
        prev_paid_val = float(prev_paid) if prev_paid else 0.0
    except (ValueError, TypeError):
        prev_paid_val = 0.0
        
    try:
        total_fee_val = float(total_fee) if total_fee else 0.0
    except (ValueError, TypeError):
        total_fee_val = 0.0
        
    try:
        item_amount = float(payment.get('amount') or 0.0)
    except (ValueError, TypeError):
        item_amount = 0.0
        
    try:
        base_amt = float(payment.get('base_amount') or 0.0)
    except (ValueError, TypeError):
        base_amt = 0.0
        
    try:
        cgst_val = float(payment.get('cgst') or 0.0)
    except (ValueError, TypeError):
        cgst_val = 0.0
        
    try:
        sgst_val = float(payment.get('sgst') or 0.0)
    except (ValueError, TypeError):
        sgst_val = 0.0
    # ----------------------------------------------

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    W, H = A4

    # ---- Header: Company Info ----
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(15 * mm, H - 20 * mm, "NORTHEND EDUCATIONAL WORLD".upper())
    
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, H - 25 * mm, "Head Office: I.G Road Parraypora, Srinagar - 190005")
    c.drawString(15 * mm, H - 30 * mm, "info@northendedu.com | www.northendedu.com")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    c.drawRightString(W - 15 * mm, H - 20 * mm, "Tax Invoice")

    y = H - 35 * mm
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    
   # Splitting address across lines if needed, or printing direct
    raw_addr = branch.get("address", "") or ""
    
    # Skip "Place of Business" if Parraypora is in the address
    if "Parraypora" in raw_addr:
        addr = raw_addr
    else:
        addr = f"Place of Business: {raw_addr}"
    
    c.drawString(15 * mm, y, addr[:80])
    c.drawString(15 * mm, y - 4 * mm, addr[80:160])
    
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(15 * mm, y - 12 * mm, f"GSTIN {branch.get('gstin') or '01AAZFN0892N1ZL'}")

    _hr(c, 15 * mm, W - 15 * mm, y - 18 * mm)

    # ---- Bill To & Invoice Meta ----
    y2 = y - 26 * mm
    
    # Left Side: Bill To
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(15 * mm, y2, "Bill To")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, y2 - 6 * mm, student.get("full_name") or "—")
    c.drawString(15 * mm, y2 - 11 * mm, student.get("contact_phone") or "—")

    # Right Side: Invoice Meta
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawRightString(W - 15 * mm, y2, f"Invoice No.: {payment.get('receipt_no') or '—'}")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawRightString(W - 15 * mm, y2 - 5 * mm, f"Place Of Service: {branch.get('name') or 'Northend Centre'}")
    
    paid_at = str(payment.get("paid_at") or "")[:10]
    c.drawRightString(W - 15 * mm, y2 - 10 * mm, f"Invoice Date: {paid_at}")
    c.drawRightString(W - 15 * mm, y2 - 15 * mm, f"Due Date: {payment.get('next_due_date') or 'NIL'}")

    _hr(c, 15 * mm, W - 15 * mm, y2 - 22 * mm)

    # ---- Items Table ----
    y3 = y2 - 30 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(15 * mm, y3, "Item & Description")
    c.drawString(120 * mm, y3, "HSN/SAC")
    c.drawRightString(W - 15 * mm, y3, "Amount")
    
    _hr(c, 15 * mm, W - 15 * mm, y3 - 3 * mm)

    # Item Row
    y4 = y3 - 10 * mm
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, y4, course_title)
    c.drawString(120 * mm, y4, str(payment.get("hsn_sac") or "999293"))
    
    c.setFillColor(TEXT)
    c.drawRightString(W - 15 * mm, y4, f"{item_amount:,.2f}")

    _hr(c, 15 * mm, W - 15 * mm, y4 - 6 * mm)

    # ---- Totals & Bank Details Block ----
    y5 = y4 - 15 * mm
    
    # Left: Bank Details
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(15 * mm, y5, "Bank Details")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, y5 - 5 * mm, f"Account Name: {payment.get('bank_account_name') or 'Northend Educational World'}")
    c.drawString(15 * mm, y5 - 10 * mm, f"Account Number: {payment.get('bank_account_number') or '0361010100002781'}")
    c.drawString(15 * mm, y5 - 15 * mm, f"IFSC Code: {payment.get('bank_ifsc') or 'JAKA0RAWWAL'}")
    
    # Left: Payment Meta & Words
    y_words = y5 - 30 * mm
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(15 * mm, y_words, "Mode of Payment:")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(45 * mm, y_words, str(payment.get("mode") or "—"))
    
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(15 * mm, y_words - 6 * mm, "Total In Words:")
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    
    # Use the helper function to generate the words from the amount
    auto_words = get_amount_in_words(item_amount)
    c.drawString(42 * mm, y_words - 6 * mm, auto_words)

    # Right: Totals
    totals_x = W - 85 * mm
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    
    c.drawString(totals_x, y5, "Sub Total (Tax Inclusive)")
    c.drawRightString(W - 15 * mm, y5, f"INR {item_amount:,.2f}")
    
    c.drawString(totals_x, y5 - 6 * mm, "Total Taxable Amount")
    c.drawRightString(W - 15 * mm, y5 - 6 * mm, f"INR {base_amt:,.2f}")
    
    cgst_rate = payment.get('cgst_rate') or 9.0
    c.drawString(totals_x, y5 - 12 * mm, f"CGST ({cgst_rate}%)")
    c.drawRightString(W - 15 * mm, y5 - 12 * mm, f"INR {cgst_val:,.2f}")
    
    sgst_rate = payment.get('sgst_rate') or 9.0
    c.drawString(totals_x, y5 - 18 * mm, f"SGST ({sgst_rate}%)")
    c.drawRightString(W - 15 * mm, y5 - 18 * mm, f"INR {sgst_val:,.2f}")
    
    _hr(c, totals_x, W - 15 * mm, y5 - 22 * mm)
    
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(totals_x, y5 - 28 * mm, "Total")
    c.drawRightString(W - 15 * mm, y5 - 28 * mm, f"INR {item_amount:,.2f}")

    # Previously Paid
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(totals_x, y5 - 34 * mm, "Previously Paid")
    c.drawRightString(W - 15 * mm, y5 - 34 * mm, f"INR {prev_paid_val:,.2f}")

    # Balance Due Logic
    pending = max(total_fee_val - prev_paid_val - item_amount, 0)
    
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(totals_x, y5 - 40 * mm, "Balance Due")
    c.drawRightString(W - 15 * mm, y5 - 40 * mm, f"INR {pending:,.2f}" if pending > 0 else "NIL")

    # Next Due Date
    c.setFont("Helvetica", 9)
    c.setFillColor(MUTED)
    c.drawString(totals_x, y5 - 46 * mm, "Next Due Date")
    c.drawRightString(W - 15 * mm, y5 - 46 * mm, str(payment.get("next_due_date") or "NIL"))

    # ---- Terms and Conditions & Disclaimer ----
    y6 = 45 * mm
    _hr(c, 15 * mm, W - 15 * mm, y6 + 5 * mm)
    
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(15 * mm, y6, "Terms & Conditions")
    
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawString(15 * mm, y6 - 5 * mm, "1. Refund, if any, shall be governed by the refund policy of NORTHEND EDUCATIONAL WORLD")
    c.drawString(15 * mm, y6 - 9 * mm, "2. GST under reverse charge is not payable on this invoice.")
    c.drawString(15 * mm, y6 - 13 * mm, "3. This is a computer-generated invoice and does not require a physical signature.")
    
    c.setFont("Helvetica-Oblique", 7.5)
    c.drawString(15 * mm, y6 - 22 * mm, "Disclaimer: This centre is independently owned and operated by NORTHEND EDUCATIONAL WORLD, an Authorised")
    c.drawString(15 * mm, y6 - 26 * mm, "Franchisee of Sorting Hat Solutions Pvt. Ltd. (Unacademy).")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf.getvalue()