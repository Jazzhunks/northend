"""
Iteration 5 backend tests:
- ScholarshipApplicationIn now requires scholarship_id (422 / 404 / 400 / 200 paths)
- Admit card uses campaign venue/exam_time and PDF >9KB
- PUT /scholarship-applications/{aid}/result auth gating + persistence
- POST /scholarship-applications/lookup hides/show result_* fields based on publish
- GET /scholarship-applications/{app_no}/result-card 403/200 paths
- GET /scholarship-applications/mine for logged-in students
- ScholarshipIn now accepts venue/exam_time/total_marks (extra-fields allowed)
"""
import os
import pytest
import requests
import uuid
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
PID = os.getpid()
STUDENT_EMAIL = f"student_iter5_{PID}@test.com"
STUDENT_PHONE = f"+9199990{PID % 100000:05d}"
STUDENT_PASSWORD = "Student@2025"


def auth_h(t):
    return {"Authorization": f"Bearer {t}"}


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def student_token():
    r = requests.post(f"{API}/auth/register", json={
        "name": "Iter5 Student", "email": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD, "phone": STUDENT_PHONE
    }, timeout=20)
    if r.status_code == 400:
        r = requests.post(f"{API}/auth/login",
                          json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def active_campaign(admin_token):
    """Create a fresh campaign with venue/exam_time/total_marks for tests."""
    payload = {
        "title": f"TEST_Campaign_{PID}",
        "description": "iter5 test campaign",
        "exam_date": "2026-03-15",
        "deadline": "2026-03-10",
        "eligibility": "Class 8-12",
        "active": True,
        "venue": "TEST_Venue Hall",
        "exam_time": "11:00 AM",
        "total_marks": 100,
    }
    r = requests.post(f"{API}/scholarships", headers=auth_h(admin_token), json=payload, timeout=20)
    assert r.status_code == 200, r.text
    sch = r.json()
    yield sch
    requests.delete(f"{API}/scholarships/{sch['id']}", headers=auth_h(admin_token), timeout=20)


@pytest.fixture(scope="module")
def inactive_campaign(admin_token):
    payload = {
        "title": f"TEST_Closed_{PID}",
        "description": "closed",
        "exam_date": "2025-01-01",
        "deadline": "2025-01-01",
        "eligibility": "x",
        "active": False,
    }
    r = requests.post(f"{API}/scholarships", headers=auth_h(admin_token), json=payload, timeout=20)
    assert r.status_code == 200, r.text
    sch = r.json()
    yield sch
    requests.delete(f"{API}/scholarships/{sch['id']}", headers=auth_h(admin_token), timeout=20)


# ---------- Apply: validation paths ----------
class TestApplyValidation:
    def test_missing_scholarship_id_422(self):
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_NoSch", "email": "n@t.com", "phone": "9999911100",
            "school": "S", "standard": "12", "target_exam": "NEET", "city": "Srinagar"
        }, timeout=20)
        assert r.status_code == 422, r.text

    def test_unknown_scholarship_id_404(self):
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_Unknown", "email": "u@t.com", "phone": "9999911101",
            "school": "S", "standard": "12", "target_exam": "NEET", "city": "Srinagar",
            "scholarship_id": "00000000-0000-0000-0000-000000000000"
        }, timeout=20)
        assert r.status_code == 404, r.text

    def test_inactive_scholarship_400(self, inactive_campaign):
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_Closed", "email": "c@t.com", "phone": "9999911102",
            "school": "S", "standard": "12", "target_exam": "NEET", "city": "Srinagar",
            "scholarship_id": inactive_campaign["id"]
        }, timeout=20)
        assert r.status_code == 400, r.text
        assert "closed" in r.text.lower()

    def test_active_scholarship_200_with_title(self, active_campaign):
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_AppOK", "email": "ok@t.com", "phone": "9999911103",
            "school": "S", "standard": "12", "target_exam": "NEET", "city": "Srinagar",
            "scholarship_id": active_campaign["id"]
        }, timeout=20)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["application_no"].startswith("NEW-SCH-")
        assert d["scholarship_title"] == active_campaign["title"]
        assert d["scholarship_id"] == active_campaign["id"]


# ---------- Admit card uses campaign data ----------
class TestAdmitCard:
    def test_admit_card_pdf(self, active_campaign):
        ap = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_Admit", "email": "ad@t.com", "phone": "9999911110",
            "school": "S", "standard": "11", "target_exam": "JEE-Main",
            "city": "Anantnag", "scholarship_id": active_campaign["id"]
        }, timeout=20).json()
        app_no = ap["application_no"]
        r = requests.get(f"{API}/scholarship-applications/{app_no}/admit-card", timeout=30)
        assert r.status_code == 200, r.text
        assert r.headers.get("content-type", "").startswith("application/pdf")
        assert r.content[:5] == b"%PDF-"
        assert len(r.content) > 9000, f"PDF too small: {len(r.content)}"


# ---------- Result PUT auth + persistence ----------
class TestResultManagement:
    def _create_app(self, active_campaign, phone="9999911120"):
        r = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_Res", "email": "r@t.com", "phone": phone,
            "school": "S", "standard": "12", "target_exam": "NEET",
            "city": "Srinagar", "scholarship_id": active_campaign["id"]
        }, timeout=20)
        assert r.status_code == 200
        return r.json()

    def test_put_result_unauth_401(self, active_campaign):
        ap = self._create_app(active_campaign, "9999911121")
        r = requests.put(f"{API}/scholarship-applications/{ap['id']}/result", json={
            "marks_obtained": 80, "total_marks": 100, "scholarship_percentage": 50
        }, timeout=20)
        assert r.status_code == 401

    def test_put_result_student_403(self, active_campaign, student_token):
        ap = self._create_app(active_campaign, "9999911122")
        r = requests.put(f"{API}/scholarship-applications/{ap['id']}/result",
                         headers=auth_h(student_token), json={
            "marks_obtained": 80, "total_marks": 100, "scholarship_percentage": 50
        }, timeout=20)
        assert r.status_code == 403

    def test_put_result_admin_no_publish_then_publish(self, active_campaign, admin_token):
        ap = self._create_app(active_campaign, "9999911123")
        # save without publishing
        r = requests.put(f"{API}/scholarship-applications/{ap['id']}/result",
                         headers=auth_h(admin_token), json={
            "marks_obtained": 75, "total_marks": 100, "rank": 12,
            "percentile": 92.5, "scholarship_percentage": 60,
            "remarks": "Good", "publish": False
        }, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["result_marks_obtained"] == 75
        assert body["result_scholarship_percentage"] == 60
        assert body["result_published"] is False

        # lookup hides result_*
        lk = requests.post(f"{API}/scholarship-applications/lookup", json={
            "phone": "9999911123", "application_no": ap["application_no"]
        }, timeout=20)
        assert lk.status_code == 200
        lkd = lk.json()
        for k in ("result_marks_obtained", "result_total_marks", "result_rank",
                  "result_percentile", "result_scholarship_percentage", "result_remarks"):
            assert k not in lkd, f"{k} should be hidden when not published"

        # result-card 403
        rc = requests.get(f"{API}/scholarship-applications/{ap['application_no']}/result-card",
                          params={"phone": "9999911123"}, timeout=20)
        assert rc.status_code == 403

        # now publish
        p = requests.put(f"{API}/scholarship-applications/{ap['id']}/result",
                         headers=auth_h(admin_token), json={
            "marks_obtained": 75, "total_marks": 100, "rank": 12,
            "percentile": 92.5, "scholarship_percentage": 60,
            "remarks": "Good", "publish": True
        }, timeout=20)
        assert p.status_code == 200
        assert p.json()["result_published"] is True

        # lookup now shows results
        lk2 = requests.post(f"{API}/scholarship-applications/lookup", json={
            "phone": "9999911123", "application_no": ap["application_no"]
        }, timeout=20).json()
        assert lk2.get("result_marks_obtained") == 75
        assert lk2.get("result_scholarship_percentage") == 60
        assert lk2.get("result_rank") == 12

        # result-card now 200 PDF when phone matches
        rc2 = requests.get(f"{API}/scholarship-applications/{ap['application_no']}/result-card",
                           params={"phone": "9999911123"}, timeout=30)
        assert rc2.status_code == 200, rc2.text
        assert rc2.content[:5] == b"%PDF-"
        assert len(rc2.content) > 1000

        # phone mismatch -> 403
        rc3 = requests.get(f"{API}/scholarship-applications/{ap['application_no']}/result-card",
                           params={"phone": "0000000000"}, timeout=20)
        assert rc3.status_code == 403

    def test_put_result_app_not_found(self, admin_token):
        r = requests.put(f"{API}/scholarship-applications/nonexistent-id/result",
                         headers=auth_h(admin_token), json={
            "marks_obtained": 1, "total_marks": 100, "scholarship_percentage": 1
        }, timeout=20)
        assert r.status_code == 404


# ---------- Lookup edge cases ----------
class TestLookup:
    def test_wrong_phone_404(self, active_campaign):
        ap = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_Lk", "email": "l@t.com", "phone": "9999911140",
            "school": "S", "standard": "10", "target_exam": "Foundation",
            "city": "Sopore", "scholarship_id": active_campaign["id"]
        }, timeout=20).json()
        r = requests.post(f"{API}/scholarship-applications/lookup", json={
            "phone": "0000000000", "application_no": ap["application_no"]
        }, timeout=20)
        assert r.status_code == 404

    def test_unknown_app_no_404(self):
        r = requests.post(f"{API}/scholarship-applications/lookup", json={
            "phone": "9999911140", "application_no": "NEW-SCH-99999999"
        }, timeout=20)
        assert r.status_code == 404


# ---------- /mine endpoint ----------
class TestMyScholarshipApps:
    def test_unauth_401(self):
        r = requests.get(f"{API}/scholarship-applications/mine", timeout=20)
        assert r.status_code == 401

    def test_returns_apps_by_email(self, student_token, active_campaign):
        # create scholarship app with student email
        ap = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_Mine", "email": STUDENT_EMAIL, "phone": "9999911150",
            "school": "S", "standard": "12", "target_exam": "NEET",
            "city": "Srinagar", "scholarship_id": active_campaign["id"]
        }, timeout=20)
        assert ap.status_code == 200
        ap_no = ap.json()["application_no"]
        r = requests.get(f"{API}/scholarship-applications/mine",
                         headers=auth_h(student_token), timeout=20)
        assert r.status_code == 200
        rows = r.json()
        assert any(x["application_no"] == ap_no for x in rows)

    def test_result_hidden_when_not_published_in_mine(self, student_token, active_campaign, admin_token):
        ap = requests.post(f"{API}/scholarship-applications", json={
            "name": "TEST_MineHide", "email": STUDENT_EMAIL, "phone": "9999911151",
            "school": "S", "standard": "12", "target_exam": "NEET",
            "city": "Srinagar", "scholarship_id": active_campaign["id"]
        }, timeout=20).json()
        # save unpublished result
        requests.put(f"{API}/scholarship-applications/{ap['id']}/result",
                     headers=auth_h(admin_token), json={
            "marks_obtained": 50, "total_marks": 100, "scholarship_percentage": 25,
            "publish": False
        }, timeout=20)
        rows = requests.get(f"{API}/scholarship-applications/mine",
                            headers=auth_h(student_token), timeout=20).json()
        target = next(x for x in rows if x["id"] == ap["id"])
        for k in ("result_marks_obtained", "result_scholarship_percentage"):
            assert k not in target
