"""
Backend API tests for Northend Educational World (Unacademy Kashmir franchise)
Covers: auth, public catalog, public submissions, admin gating, excel export, student-only.
"""
import os
import io
import pytest
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # fallback to frontend .env
    fe_env = Path(__file__).resolve().parents[2] / "frontend" / ".env"
    for line in fe_env.read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@northend.edu"
ADMIN_PASSWORD = "Admin@2025"
STUDENT_EMAIL = f"student_test_{os.getpid()}@test.com"
STUDENT_PASSWORD = "Student@2025"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    j = r.json()
    assert j["user"]["role"] == "admin"
    return j["access_token"]


@pytest.fixture(scope="session")
def student_token():
    r = requests.post(f"{API}/auth/register", json={
        "name": "Test Student", "email": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD, "phone": "+919999000000"
    }, timeout=20)
    if r.status_code == 400:
        r = requests.post(f"{API}/auth/login", json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"student auth failed: {r.status_code} {r.text}"
    j = r.json()
    assert j["user"]["role"] == "student"
    return j["access_token"]


def auth_h(tok):
    return {"Authorization": f"Bearer {tok}"}


# ---- Public catalog ----
class TestPublicCatalog:
    def test_courses(self):
        r = requests.get(f"{API}/courses", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list) and len(data) >= 7
        cats = {c["category"] for c in data}
        assert {"NEET", "IIT-JEE", "Foundation", "CUET", "NDA", "JKBOSE", "Crash"}.issubset(cats)

    def test_courses_filter_category(self):
        r = requests.get(f"{API}/courses", params={"category": "NEET"}, timeout=20)
        assert r.status_code == 200
        for c in r.json():
            assert c["category"] == "NEET"

    def test_centers(self):
        r = requests.get(f"{API}/centers", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 6
        assert all("city" in c and "lat" in c for c in data)

    def test_stats(self):
        r = requests.get(f"{API}/stats", timeout=20)
        assert r.status_code == 200
        d = r.json()
        for k in ["students_trained", "selections", "educators", "centers", "courses"]:
            assert k in d and isinstance(d[k], int)

    def test_scholarships(self):
        r = requests.get(f"{API}/scholarships", timeout=20)
        assert r.status_code == 200 and isinstance(r.json(), list) and len(r.json()) >= 1

    def test_notices(self):
        r = requests.get(f"{API}/notices", timeout=20)
        assert r.status_code == 200 and len(r.json()) >= 1

    def test_jobs(self):
        r = requests.get(f"{API}/jobs", timeout=20)
        assert r.status_code == 200 and len(r.json()) >= 1

    def test_results(self):
        r = requests.get(f"{API}/results", timeout=20)
        assert r.status_code == 200 and len(r.json()) >= 1

    def test_testimonials(self):
        r = requests.get(f"{API}/testimonials", timeout=20)
        assert r.status_code == 200 and len(r.json()) >= 1


# ---- Auth ----
class TestAuth:
    def test_login_admin(self, admin_token):
        assert isinstance(admin_token, str) and len(admin_token) > 20

    def test_me_with_bearer(self, admin_token):
        r = requests.get(f"{API}/auth/me", headers=auth_h(admin_token), timeout=20)
        assert r.status_code == 200
        assert r.json()["role"] == "admin"

    def test_me_unauth(self):
        r = requests.get(f"{API}/auth/me", timeout=20)
        assert r.status_code == 401

    def test_register_student(self, student_token):
        assert isinstance(student_token, str) and len(student_token) > 20

    def test_login_invalid(self):
        r = requests.post(f"{API}/auth/login", json={"email": "nope@x.com", "password": "bad"}, timeout=20)
        assert r.status_code == 401


# ---- Public submissions ----
class TestPublicSubmissions:
    def test_scholarship_application(self):
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_App", "email": "t1@test.com", "phone": "9999900001",
            "school": "TEST School", "standard": "12", "target_exam": "NEET", "city": "Srinagar"
        }, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d.get("application_no", "").startswith("NEW-SCH-")
        assert d["status"] == "pending"

    def test_enrollment(self):
        courses = requests.get(f"{API}/courses", timeout=20).json()
        cid = courses[0]["id"]
        r = requests.post(f"{API}/enrollments", json={
            "course_id": cid, "name": "TEST_Enroll", "email": "te@test.com",
            "phone": "9999900002", "address": "Lal Chowk", "center": "Srinagar"
        }, timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d.get("receipt_no", "").startswith("NEW-ENR-")

    def test_job_application(self):
        jobs = requests.get(f"{API}/jobs", timeout=20).json()
        jid = jobs[0]["id"]
        r = requests.post(f"{API}/job-applications", json={
            "name": "TEST_Job", "email": "tj@test.com", "phone": "9999900003",
            "job_id": jid, "qualification": "M.Sc Physics", "experience": "4 years",
            "subject_expertise": "Physics", "preferred_location": "Srinagar",
            "cover_letter": "Excited to apply.", "resume_url": "https://example.com/r.pdf"
        }, timeout=20)
        assert r.status_code == 200
        assert r.json()["status"] == "received"

    def test_contact(self):
        r = requests.post(f"{API}/contact", json={
            "name": "TEST_Contact", "email": "tc@test.com", "phone": "9999900004",
            "subject": "Demo", "message": "Hi"
        }, timeout=20)
        assert r.status_code == 200
        assert r.json()["status"] == "new"


# ---- Admin gating + Excel ----
class TestAdminGating:
    def test_summary_unauth(self):
        r = requests.get(f"{API}/admin/summary", timeout=20)
        assert r.status_code == 401

    def test_summary_as_student_403(self, student_token):
        r = requests.get(f"{API}/admin/summary", headers=auth_h(student_token), timeout=20)
        assert r.status_code == 403

    def test_summary_admin(self, admin_token):
        r = requests.get(f"{API}/admin/summary", headers=auth_h(admin_token), timeout=20)
        assert r.status_code == 200
        d = r.json()
        for k in ["total_students", "total_courses", "total_enrollments",
                  "total_scholarship_apps", "total_job_apps", "total_inquiries", "total_jobs"]:
            assert k in d

    def test_create_course_requires_admin(self, student_token):
        r = requests.post(f"{API}/courses", headers=auth_h(student_token), json={
            "title": "Bad", "category": "NEET", "duration": "1m", "fee": 1, "description": "x"
        }, timeout=20)
        assert r.status_code == 403

    def test_create_course_admin(self, admin_token):
        r = requests.post(f"{API}/courses", headers=auth_h(admin_token), json={
            "title": "TEST_AdminCourse", "category": "Crash", "duration": "1 month",
            "fee": 999, "description": "test", "syllabus": ["A"], "faculty": ["X"], "featured": False
        }, timeout=20)
        assert r.status_code == 200
        cid = r.json()["id"]
        # cleanup
        d = requests.delete(f"{API}/courses/{cid}", headers=auth_h(admin_token), timeout=20)
        assert d.status_code == 200

    def test_create_notice_admin(self, admin_token):
        r = requests.post(f"{API}/notices", headers=auth_h(admin_token), json={
            "title": "TEST_N", "content": "tc", "category": "General", "pinned": False
        }, timeout=20)
        assert r.status_code == 200
        nid = r.json()["id"]
        requests.delete(f"{API}/notices/{nid}", headers=auth_h(admin_token), timeout=20)

    def test_create_job_admin(self, admin_token):
        r = requests.post(f"{API}/jobs", headers=auth_h(admin_token), json={
            "title": "TEST_J", "department": "X", "location": "Srinagar",
            "type": "Full-time", "description": "d", "requirements": ["a"], "active": True
        }, timeout=20)
        assert r.status_code == 200
        jid = r.json()["id"]
        requests.delete(f"{API}/jobs/{jid}", headers=auth_h(admin_token), timeout=20)

    def test_export_enrollments_xlsx(self, admin_token):
        r = requests.get(f"{API}/admin/export/enrollments", headers=auth_h(admin_token), timeout=30)
        assert r.status_code == 200
        ct = r.headers.get("content-type", "")
        assert "spreadsheetml" in ct or "officedocument" in ct
        # Validate xlsx magic bytes (ZIP)
        assert r.content[:2] == b"PK"

    def test_export_unknown_kind(self, admin_token):
        r = requests.get(f"{API}/admin/export/unknown", headers=auth_h(admin_token), timeout=20)
        assert r.status_code == 404


# ---- Validation: invalid IDs and enum status updates ----
class TestValidation:
    def test_enrollment_invalid_course_id(self):
        r = requests.post(f"{API}/enrollments", json={
            "course_id": "00000000-0000-0000-0000-000000000000",
            "name": "TEST_BadCourse", "email": "bad@test.com",
            "phone": "9999900050", "address": "X", "center": "Srinagar"
        }, timeout=20)
        assert r.status_code == 404, f"expected 404 got {r.status_code}: {r.text}"

    def test_jobapp_invalid_job_id(self):
        r = requests.post(f"{API}/job-applications", json={
            "name": "TEST_BadJob", "email": "bj@test.com", "phone": "9999900051",
            "job_id": "00000000-0000-0000-0000-000000000000",
            "qualification": "B.Sc", "experience": "1y", "subject_expertise": "Math",
            "preferred_location": "Srinagar", "cover_letter": "x", "resume_url": "https://x.com/r.pdf"
        }, timeout=20)
        assert r.status_code == 404, f"expected 404 got {r.status_code}: {r.text}"

    def test_status_update_invalid_enum_enrollment(self, admin_token):
        # need an existing enrollment id
        courses = requests.get(f"{API}/courses", timeout=20).json()
        cid = courses[0]["id"]
        en = requests.post(f"{API}/enrollments", json={
            "course_id": cid, "name": "TEST_StatusEnroll", "email": "se@test.com",
            "phone": "9999900060", "address": "X", "center": "Srinagar"
        }, timeout=20).json()
        eid = en["id"]
        r = requests.put(f"{API}/enrollments/{eid}/status",
                         headers=auth_h(admin_token),
                         params={"status": "BOGUS_STATUS"}, timeout=20)
        assert r.status_code == 400, f"expected 400 got {r.status_code}: {r.text}"

    def test_status_update_invalid_enum_scholarship(self, admin_token):
        sa = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_AppS", "email": "ts@test.com", "phone": "9999900061",
            "school": "S", "standard": "12", "target_exam": "NEET", "city": "Srinagar"
        }, timeout=20).json()
        sid = sa["id"]
        r = requests.put(f"{API}/scholarship-applications/{sid}/status",
                         headers=auth_h(admin_token),
                         params={"status": "BOGUS"}, timeout=20)
        assert r.status_code == 400, f"expected 400 got {r.status_code}: {r.text}"

    def test_status_update_invalid_enum_jobapp(self, admin_token):
        jobs = requests.get(f"{API}/jobs", timeout=20).json()
        jid = jobs[0]["id"]
        ja = requests.post(f"{API}/job-applications", json={
            "name": "TEST_StatusJob", "email": "tsj@test.com", "phone": "9999900062",
            "job_id": jid, "qualification": "M.Sc", "experience": "2y",
            "subject_expertise": "Phy", "preferred_location": "Srinagar",
            "cover_letter": "x", "resume_url": "https://x.com/r.pdf"
        }, timeout=20).json()
        jaid = ja["id"]
        r = requests.put(f"{API}/job-applications/{jaid}/status",
                         headers=auth_h(admin_token),
                         params={"status": "BOGUS"}, timeout=20)
        assert r.status_code == 400, f"expected 400 got {r.status_code}: {r.text}"


# ---- More export kinds ----
class TestExports:
    @pytest.mark.parametrize("kind", ["scholarship-applications", "job-applications", "inquiries", "students"])
    def test_export_other_kinds(self, admin_token, kind):
        r = requests.get(f"{API}/admin/export/{kind}", headers=auth_h(admin_token), timeout=30)
        assert r.status_code == 200, f"{kind}: {r.status_code} {r.text[:200]}"
        ct = r.headers.get("content-type", "")
        assert "spreadsheetml" in ct or "officedocument" in ct, f"{kind}: ct={ct}"
        assert r.content[:2] == b"PK", f"{kind}: missing PK magic"


# ---- Student-only ----
class TestStudent:
    def test_enrollments_mine(self, student_token):
        # create one with auth so user_id is linked
        courses = requests.get(f"{API}/courses", timeout=20).json()
        cid = courses[0]["id"]
        c = requests.post(f"{API}/enrollments", headers=auth_h(student_token), json={
            "course_id": cid, "name": "TEST_StuEnroll", "email": STUDENT_EMAIL,
            "phone": "9999900099", "address": "X", "center": "Srinagar"
        }, timeout=20)
        assert c.status_code == 200
        r = requests.get(f"{API}/enrollments/mine", headers=auth_h(student_token), timeout=20)
        assert r.status_code == 200
        rows = r.json()
        assert any(e.get("receipt_no") == c.json()["receipt_no"] for e in rows)

    def test_enrollments_mine_unauth(self):
        r = requests.get(f"{API}/enrollments/mine", timeout=20)
        assert r.status_code == 401
