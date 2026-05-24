"""End-to-end ERP smoke test (idempotent — safe to re-run)."""
import os
import requests

API = "http://localhost:8001/api"

def login(email, password):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password})
    r.raise_for_status()
    return r.json()["access_token"]

def H(t):
    return {"Authorization": f"Bearer {t}"}

def ensure_staff(token, name, email, password, role, branch_id, phone=None):
    """Create staff if not exists; return staff id."""
    existing = requests.get(f"{API}/erp/staff", headers=H(token)).json()
    found = next((s for s in existing if s["email"] == email.lower()), None)
    if found:
        return found["id"]
    body = {"name": name, "email": email, "password": password, "role": role, "branch_id": branch_id}
    if phone:
        body["phone"] = phone
    r = requests.post(f"{API}/erp/staff", headers=H(token), json=body)
    assert r.status_code == 200, f"create {role}: {r.text}"
    return r.json()["id"]

# 1. Login as super admin
admin_t = login("admin@northend.edu", "Admin@2025")
print("✓ Admin login OK")

me = requests.get(f"{API}/erp/me", headers=H(admin_t)).json()
print(f"✓ /erp/me role={me['role']}")
assert me["role"] == "super_admin"

# 2. List branches
branches = requests.get(f"{API}/erp/branches", headers=H(admin_t)).json()
print(f"✓ {len(branches)} branches found")
srinagar = next(b for b in branches if b["city"] == "Srinagar")
anantnag = next(b for b in branches if b["city"] == "Anantnag")

# 3. Update branch with GST info (idempotent)
r = requests.patch(f"{API}/erp/branches/{srinagar['id']}", headers=H(admin_t),
    json={"gstin": "01ABCDE1234F1Z5", "signatory_name": "Centre Manager — Srinagar", "state_code": "01"})
assert r.status_code == 200
print("✓ Branch GST info updated")

# 4-6. Idempotent staff creation
mgr_id = ensure_staff(admin_t, "Tariq Manager", "tariq.mgr@northend.edu", "Mgr@2025", "center_manager", srinagar["id"], phone="+91-9999111111")
print(f"✓ Center manager ensured: {mgr_id}")

mgr_t = login("tariq.mgr@northend.edu", "Mgr@2025")
print("✓ Manager login OK")

acct_id = ensure_staff(mgr_t, "Aamir Accountant", "acct.sgr@northend.edu", "Pwd@2025", "accountant", srinagar["id"])
cnsl_id = ensure_staff(mgr_t, "Sara Counsellor", "cnsl.sgr@northend.edu", "Pwd@2025", "counsellor", srinagar["id"])
acct_t = login("acct.sgr@northend.edu", "Pwd@2025")
cnsl_t = login("cnsl.sgr@northend.edu", "Pwd@2025")
print("✓ Accountant + counsellor ensured and logged in")

# 7. Cross-branch denial: manager tries to create staff in Anantnag → 403
existing = requests.get(f"{API}/erp/staff", headers=H(mgr_t)).json()
# Manager can only see srinagar staff
assert all(s["branch_id"] == srinagar["id"] for s in existing), "manager should only see own branch staff"
r = requests.post(f"{API}/erp/staff", headers=H(mgr_t), json={
    "name": "X-deny", "email": "xdeny@x.com", "password": "Pwd@2025",
    "role": "accountant", "branch_id": anantnag["id"]
})
assert r.status_code == 403, f"expected 403, got {r.status_code}: {r.text}"
print("✓ Cross-branch staff create blocked (403)")

# 8. Get a course to enroll into
courses = requests.get(f"{API}/courses").json()
neet = next(c for c in courses if c["category"] == "NEET")

# 9. Manager creates a student in Srinagar (idempotent — reuse existing test student if present)
existing_students = requests.get(f"{API}/erp/students", headers=H(mgr_t), params={"q": "9876500099"}).json()
if existing_students:
    student = existing_students[0]
    print(f"✓ Reusing existing student: {student['student_no']}")
else:
    r = requests.post(f"{API}/erp/students", headers=H(mgr_t), json={
        "full_name": "Hamid Wani Test", "contact_phone": "9876500099", "contact_email": "hamid@test.com",
        "parent_name": "Aslam Wani", "parent_phone": "9876500098",
        "course_id": neet["id"], "batch": "NEET-26-A", "branch_id": srinagar["id"],
        "counsellor_id": cnsl_id, "total_fee": 95000.0, "scholarship_percent": 25.0
    })
    assert r.status_code == 200, r.text
    student = r.json()
    print(f"✓ Student created: {student['student_no']}")
sid = student["id"]

# Ensure counsellor is assigned (if reused student without counsellor)
if not student.get("counsellor_id"):
    requests.patch(f"{API}/erp/students/{sid}", headers=H(mgr_t), json={"counsellor_id": cnsl_id})

# 10. Counsellor sees only own student
r = requests.get(f"{API}/erp/students", headers=H(cnsl_t)).json()
assert len(r) == 1 and r[0]["id"] == sid
print(f"✓ Counsellor visibility: {len(r)} student (own only)")

# 11. Counsellor cannot create student
r = requests.post(f"{API}/erp/students", headers=H(cnsl_t), json={
    "full_name": "X", "contact_phone": "9", "course_id": neet["id"],
    "branch_id": srinagar["id"], "total_fee": 1000.0
})
assert r.status_code == 403
print("✓ Counsellor create-student blocked (403)")

# 12. Accountant records two payments (idempotent: only add if test student has no prior payments)
existing_payments = requests.get(f"{API}/erp/payments", headers=H(mgr_t), params={"student_id": sid}).json()
if existing_payments:
    print(f"✓ Reusing {len(existing_payments)} existing payment(s) for test student")
    pay1 = existing_payments[0]
else:
    r = requests.post(f"{API}/erp/payments", headers=H(acct_t), json={
        "student_id": sid, "amount": 30000.0, "mode": "upi", "next_due_date": "2026-04-15"
    })
    assert r.status_code == 200, r.text
    pay1 = r.json()
    print(f"✓ Payment 1: {pay1['receipt_no']} amt={pay1['amount']} cgst={pay1['cgst']} sgst={pay1['sgst']}")
    requests.post(f"{API}/erp/payments", headers=H(acct_t), json={"student_id": sid, "amount": 25000.0, "mode": "cash"})

# Verify GST math on whichever pay1 we have
assert abs(pay1["amount"] - pay1["base_amount"] - pay1["cgst"] - pay1["sgst"]) < 0.05
print(f"  GST math OK: base+cgst+sgst≈amount ({pay1['base_amount']}+{pay1['cgst']}+{pay1['sgst']})")

# 13. Statement — verify relationships, not exact amounts (test may run repeatedly)
stmt = requests.get(f"{API}/erp/students/{sid}/statement", headers=H(mgr_t)).json()
print(f"✓ Statement: total_fee={stmt['total_fee']} scholarship={stmt['scholarship_percent']}% net={stmt['net_fee']} paid={stmt['total_paid']} pending={stmt['pending']}")
# net = total_fee - scholarship - discount; pending = max(net - paid, 0)
expected_net = stmt["total_fee"] - stmt["scholarship_amount"] - stmt["discount"]
assert abs(stmt["net_fee"] - max(expected_net, 0)) < 0.5
assert abs(stmt["pending"] - max(stmt["net_fee"] - stmt["total_paid"], 0)) < 0.5
print(f"  Math correct: net = {stmt['net_fee']:.2f}; pending = {stmt['pending']:.2f}")

# 14. Receipt PDF download
r = requests.get(f"{API}/erp/payments/{pay1['id']}/receipt", headers=H(mgr_t))
assert r.status_code == 200 and r.headers["content-type"] == "application/pdf"
print(f"✓ Receipt PDF: {len(r.content)} bytes")

# 15. Expense — accountant creates (pending), manager approves
r = requests.post(f"{API}/erp/expenses", headers=H(acct_t), json={
    "branch_id": srinagar["id"], "category": "Electricity",
    "amount": 4500.0, "description": "Smoke test electricity bill", "vendor": "JKPDD"
})
exp = r.json()
print(f"✓ Expense by accountant: status={exp['status']}")
assert exp["status"] == "pending"

r = requests.post(f"{API}/erp/expenses/{exp['id']}/decision", headers=H(mgr_t), json={"decision": "approve"})
assert r.json()["status"] == "approved"
print("✓ Manager approved expense")

# 16. Manager-created expense auto-approved
r = requests.post(f"{API}/erp/expenses", headers=H(mgr_t), json={
    "branch_id": srinagar["id"], "category": "Rent", "amount": 35000.0, "description": "Smoke test office rent"
})
assert r.json()["status"] == "approved"
print("✓ Manager direct expense auto-approved")

# 17. Cross-branch expense denial
r = requests.post(f"{API}/erp/expenses", headers=H(mgr_t), json={
    "branch_id": anantnag["id"], "category": "Rent", "amount": 1.0, "description": "x"
})
assert r.status_code == 403
print("✓ Cross-branch expense blocked (403)")

# 18. Lead by counsellor (idempotent — reuse if exists)
existing_leads = requests.get(f"{API}/erp/leads", headers=H(cnsl_t)).json()
mine = [l for l in existing_leads if l.get("phone") == "9876500200"]
if mine:
    lead = mine[0]
    print(f"✓ Reusing existing lead: {lead['id']}")
else:
    r = requests.post(f"{API}/erp/leads", headers=H(cnsl_t), json={
        "name": "Iqra Jan", "phone": "9876500200", "email": "iqra@x.com",
        "branch_id": srinagar["id"], "target_exam": "NEET"
    })
    lead = r.json()
    print(f"✓ Lead created: {lead['id']}")

r = requests.patch(f"{API}/erp/leads/{lead['id']}", headers=H(cnsl_t), json={"status": "follow_up", "notes": "Demo class scheduled"})
assert r.json()["status"] == "follow_up"
print("✓ Lead updated to follow_up")

# 19. Branch dashboard
r = requests.get(f"{API}/erp/dashboard/branch/{srinagar['id']}", headers=H(mgr_t)).json()
print(f"✓ Branch dashboard: revenue={r['revenue']} expense={r['expense']} students={r['student_count']} pending={r['pending_fees']}")
assert r["revenue"] > 0
assert r["expense"] > 0
assert r["student_count"] >= 1

# 20. Super dashboard
r = requests.get(f"{API}/erp/dashboard/super", headers=H(admin_t)).json()
print(f"✓ Super dashboard: total_rev={r['total_revenue']} total_exp={r['total_expense']} branches={r['total_branches']}")
assert r["total_revenue"] > 0
assert r["total_branches"] == 6

# 21. Branch dashboard cross-branch denial
r = requests.get(f"{API}/erp/dashboard/branch/{anantnag['id']}", headers=H(mgr_t))
assert r.status_code == 403
print("✓ Cross-branch dashboard blocked (403)")

# 22. Counsellor cannot access super dashboard
r = requests.get(f"{API}/erp/dashboard/super", headers=H(cnsl_t))
assert r.status_code == 403
print("✓ Counsellor super-dashboard blocked (403)")

# 23. Excel export
r = requests.get(f"{API}/erp/exports/payments.xlsx", headers=H(mgr_t))
assert r.status_code == 200 and "spreadsheet" in r.headers["content-type"]
print(f"✓ Payments XLSX export: {len(r.content)} bytes")

# 24. Audit log (super only)
r = requests.get(f"{API}/erp/audit", headers=H(admin_t)).json()
print(f"✓ Audit log: {len(r)} entries")
assert len(r) > 10

print()
print("=" * 50)
print("ALL ERP SMOKE TESTS PASSED ✅")
print("=" * 50)
