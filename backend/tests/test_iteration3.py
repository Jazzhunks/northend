"""
Iteration 3 backend tests:
- /api/upload (Emergent object storage) + content-type/size validation
- /api/files/{id} download
- /api/scholarship-applications/{application_no}/admit-card (PDF)
- Email side-effects (BackgroundTasks) — only verify HTTP 200 and no error
"""
import os
import io
import time
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    fe_env = Path(__file__).resolve().parents[2] / "frontend" / ".env"
    for line in fe_env.read_text().splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip()
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@northend.edu"
ADMIN_PASSWORD = "Admin@2025"

PDF_BYTES = b"%PDF-1.4\n% Test PDF\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"admin login failed: {r.text}"
    return r.json()["access_token"]


# ---------------- /api/upload ----------------
class TestUpload:
    def test_upload_pdf_success(self):
        files = {"file": ("test.pdf", io.BytesIO(PDF_BYTES), "application/pdf")}
        r = requests.post(f"{API}/upload", files=files, timeout=60)
        assert r.status_code == 200, f"{r.status_code} {r.text}"
        j = r.json()
        assert "id" in j and "url" in j and "storage_path" in j
        assert j["url"].startswith("/api/files/")
        assert j["content_type"] == "application/pdf"
        # store for cross-test
        TestUpload.uploaded_id = j["id"]
        TestUpload.uploaded_url = j["url"]

    def test_reject_unsupported_type(self):
        files = {"file": ("evil.exe", io.BytesIO(b"MZ\x90"), "application/x-msdownload")}
        r = requests.post(f"{API}/upload", files=files, timeout=30)
        assert r.status_code == 415, f"expected 415 got {r.status_code}: {r.text}"

    def test_reject_empty(self):
        files = {"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")}
        r = requests.post(f"{API}/upload", files=files, timeout=30)
        assert r.status_code == 400, f"expected 400 got {r.status_code}: {r.text}"

    def test_size_marker_smaller_than_limit(self):
        # Marker test: upload ~100KB pdf to ensure non-trivial sizes pass; do NOT send 10MB
        big = b"%PDF-1.4\n" + (b"A" * 100_000)
        files = {"file": ("big.pdf", io.BytesIO(big), "application/pdf")}
        r = requests.post(f"{API}/upload", files=files, timeout=60)
        assert r.status_code == 200, f"{r.status_code} {r.text}"

    def test_image_upload(self):
        png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 50
        files = {"file": ("a.png", io.BytesIO(png), "image/png")}
        r = requests.post(f"{API}/upload", files=files, timeout=60)
        assert r.status_code == 200, f"{r.status_code} {r.text}"


# ---------------- /api/files/{id} ----------------
class TestFiles:
    def test_download_uploaded(self):
        files = {"file": ("d.pdf", io.BytesIO(PDF_BYTES), "application/pdf")}
        u = requests.post(f"{API}/upload", files=files, timeout=60)
        assert u.status_code == 200
        fid = u.json()["id"]

        r = requests.get(f"{API}/files/{fid}", timeout=30)
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("application/pdf")
        cd = r.headers.get("content-disposition", "")
        assert "inline" in cd.lower()
        assert r.content.startswith(b"%PDF-")

    def test_404_for_missing(self):
        r = requests.get(f"{API}/files/00000000-0000-0000-0000-000000000000", timeout=20)
        assert r.status_code == 404


# ---------------- Admit card PDF ----------------
class TestAdmitCard:
    def test_admit_card_pdf(self):
        # create a scholarship application
        payload = {
            "name": "TEST_AdmitCardUser",
            "email": "test_admit@example.com",
            "phone": "9999999999",
            "school": "Test School",
            "standard": "11",
            "target_exam": "NEET",
            "city": "Srinagar",
        }
        r = requests.post(f"{API}/scholarship-applications", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        app_no = r.json()["application_no"]

        r = requests.get(f"{API}/scholarship-applications/{app_no}/admit-card", timeout=30)
        assert r.status_code == 200, f"{r.status_code} {r.text[:200]}"
        assert r.headers.get("content-type", "").startswith("application/pdf"), r.headers
        assert r.content.startswith(b"%PDF-"), "PDF magic missing"
        assert len(r.content) > 1000, f"PDF too small: {len(r.content)}"

    def test_admit_card_404(self):
        r = requests.get(f"{API}/scholarship-applications/NEW-SCH-99999999/admit-card", timeout=20)
        assert r.status_code == 404


# ---------------- Email side effects (background tasks) ----------------
class TestEmailSideEffects:
    """Verify endpoints return 200 quickly (background tasks don't block response)."""

    def test_scholarship_app_no_block(self):
        start = time.time()
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_EmailScholar", "email": "test@example.com",
            "phone": "9000000000", "school": "X", "standard": "10",
            "target_exam": "NEET", "city": "Srinagar",
        }, timeout=20)
        elapsed = time.time() - start
        assert r.status_code == 200
        # background task: response should be fast (<5s typically)
        assert elapsed < 15, f"endpoint blocked for {elapsed:.1f}s"

    def test_enrollment_with_valid_course(self):
        courses = requests.get(f"{API}/courses", timeout=20).json()
        assert courses
        cid = courses[0]["id"]
        start = time.time()
        r = requests.post(f"{API}/enrollments", json={
            "course_id": cid, "name": "TEST_EmailEnroll",
            "email": "test_enr@example.com", "phone": "9000000001",
            "address": "Addr", "center": "Srinagar",
        }, timeout=20)
        elapsed = time.time() - start
        assert r.status_code == 200, r.text
        assert "receipt_no" in r.json()
        assert elapsed < 15, f"endpoint blocked for {elapsed:.1f}s"

    def test_enrollment_invalid_course_id(self):
        r = requests.post(f"{API}/enrollments", json={
            "course_id": "non-existent-id", "name": "X",
            "email": "x@example.com", "phone": "9", "address": "A", "center": "S",
        }, timeout=20)
        assert r.status_code == 404

    def test_job_application_with_valid_job(self):
        jobs = requests.get(f"{API}/jobs", timeout=20).json()
        assert jobs
        jid = jobs[0]["id"]
        start = time.time()
        r = requests.post(f"{API}/job-applications", json={
            "name": "TEST_EmailJob", "email": "test_job@example.com",
            "phone": "9000000002", "job_id": jid,
            "qualification": "MSc", "experience": "2yr",
            "preferred_location": "Srinagar", "resume_url": "/api/files/abc",
        }, timeout=20)
        elapsed = time.time() - start
        assert r.status_code == 200, r.text
        assert elapsed < 15

    def test_job_application_invalid_job_id(self):
        r = requests.post(f"{API}/job-applications", json={
            "name": "X", "email": "x@example.com",
            "phone": "9", "job_id": "non-existent",
            "qualification": "Q", "experience": "E",
            "preferred_location": "S",
        }, timeout=20)
        assert r.status_code == 404
