"""Iteration 12 - WATH Carnival + WATH separation tests.

Covers:
- /api/wath/page (public) mode & hydrated carnival
- /api/scholarships (public) no longer returns WATH-titled campaigns
- /api/admin/wath/page-config (GET/POST) auth + validation
- /api/admin/wath/carnivals CRUD
- /api/scholarship-applications carnival flow (atomic slot reservation, over-book, dup, missing fields)
- /api/admin/wath/carnivals/{id}/registrations
"""
import os
import time
import uuid
import pytest
import requests

def _get_base_url():
    url = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
    if url:
        return url
    # Fallback: read from frontend/.env
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    return line.split("=", 1)[1].strip().rstrip("/")
    except Exception:
        pass
    return ""

BASE_URL = _get_base_url()
assert BASE_URL, "REACT_APP_BACKEND_URL must be set"

ADMIN_EMAIL = "admin@northend.edu"
ADMIN_PWD = "Admin@2025"
STUDENT_EMAIL = "student@test.com"
STUDENT_PWD = "Student@2025"

SEEDED_CARNIVAL_ID = "72107a91-28bc-4b4c-aaa9-7df514b56e6e"
WATH_EXAM_CAMP_ID = "1ed94009-d949-4504-b291-68e3571a5a44"


# ----------------- fixtures -----------------
@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PWD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    tok = r.json().get("access_token") or r.json().get("token")
    assert tok, f"No token in login response: {r.json()}"
    return tok


@pytest.fixture(scope="module")
def admin_client(admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


@pytest.fixture(scope="module")
def student_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": STUDENT_EMAIL, "password": STUDENT_PWD})
    if r.status_code != 200:
        pytest.skip("Student login unavailable")
    return r.json().get("access_token") or r.json().get("token")


# ----------------- public endpoints -----------------
class TestPublicWathPage:
    def test_wath_page_returns_mode(self, api):
        r = api.get(f"{BASE_URL}/api/wath/page")
        assert r.status_code == 200
        data = r.json()
        assert "mode" in data
        assert data["mode"] in ("exam", "carnival", "disabled")

    def test_wath_page_carnival_hydration(self, api):
        r = api.get(f"{BASE_URL}/api/wath/page")
        data = r.json()
        if data["mode"] == "carnival":
            assert "carnival" in data
            car = data["carnival"]
            assert "exam_dates" in car
            for d in car["exam_dates"]:
                for s in d.get("slots", []):
                    assert "booked_count" in s
                    assert "remaining" in s
                    assert "available" in s
                    assert isinstance(s["booked_count"], int)
                    assert isinstance(s["remaining"], int)
                    assert isinstance(s["available"], bool)

    def test_scholarships_excludes_wath(self, api):
        r = api.get(f"{BASE_URL}/api/scholarships")
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        for s in arr:
            assert s.get("kind") != "wath", f"WATH leaked: {s.get('title')}"
            assert not (s.get("title") or "").upper().startswith("WATH"), \
                f"WATH-titled camp returned: {s.get('title')}"


# ----------------- admin page-config -----------------
class TestPageConfig:
    def test_get_config_requires_admin(self, api):
        r = api.get(f"{BASE_URL}/api/admin/wath/page-config")
        assert r.status_code in (401, 403)

    def test_get_config_admin(self, admin_client):
        r = admin_client.get(f"{BASE_URL}/api/admin/wath/page-config")
        assert r.status_code == 200
        data = r.json()
        assert "mode" in data
        assert "active_carnival_id" in data

    def test_switch_exam_disabled_carnival(self, admin_client):
        # Save current state
        cur = admin_client.get(f"{BASE_URL}/api/admin/wath/page-config").json()
        original_mode = cur.get("mode")
        original_id = cur.get("active_carnival_id")

        # -> exam
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/page-config", json={"mode": "exam"})
        assert r.status_code == 200
        assert r.json()["mode"] == "exam"

        # -> disabled
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/page-config",
                              json={"mode": "disabled", "disabled_message": "Down for maintenance"})
        assert r.status_code == 200
        assert r.json()["mode"] == "disabled"

        # public reflects disabled
        pr = requests.get(f"{BASE_URL}/api/wath/page")
        assert pr.status_code == 200
        assert pr.json()["mode"] == "disabled"

        # -> carnival without id -> 400
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/page-config", json={"mode": "carnival"})
        assert r.status_code == 400

        # -> carnival with valid id
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/page-config",
                              json={"mode": "carnival", "active_carnival_id": SEEDED_CARNIVAL_ID})
        assert r.status_code == 200
        assert r.json()["mode"] == "carnival"

        # Restore original state
        admin_client.post(f"{BASE_URL}/api/admin/wath/page-config",
                          json={"mode": original_mode or "carnival",
                                "active_carnival_id": original_id or SEEDED_CARNIVAL_ID})


# ----------------- carnival CRUD -----------------
class TestCarnivalCRUD:
    def _make_carnival(self, capacity=5, slot_time="09:00 AM"):
        uniq = uuid.uuid4().hex[:6]
        return {
            "title": f"TEST_Carnival_{uniq}",
            "subtitle": "test",
            "description": "auto-test",
            "start_date": "2026-10-01",
            "end_date": "2026-10-31",
            "exam_dates": [
                {"date": "2026-10-15", "slots": [
                    {"time": slot_time, "capacity": capacity, "is_open": True}
                ]}
            ],
            "active": True,
        }

    @pytest.fixture(scope="class")
    def created_carnival(self, admin_client):
        payload = self._make_carnival(capacity=5)
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/carnivals", json=payload)
        assert r.status_code == 200, r.text
        car = r.json()
        assert "id" in car
        # Check hydrated slot counters
        slot = car["exam_dates"][0]["slots"][0]
        assert slot["booked_count"] == 0
        assert slot["remaining"] == 5
        assert slot["available"] is True
        yield car
        # cleanup
        admin_client.delete(f"{BASE_URL}/api/admin/wath/carnivals/{car['id']}")

    def test_create_returns_hydrated(self, created_carnival):
        assert created_carnival["title"].startswith("TEST_Carnival_")

    def test_update_carnival(self, admin_client, created_carnival):
        cid = created_carnival["id"]
        upd = self._make_carnival(capacity=5)
        upd["title"] = created_carnival["title"] + "_updated"
        r = admin_client.put(f"{BASE_URL}/api/admin/wath/carnivals/{cid}", json=upd)
        assert r.status_code == 200
        assert r.json()["title"].endswith("_updated")

    def test_delete_resets_config_when_active(self, admin_client):
        # Create a new carnival, set active, delete, verify mode reset
        payload = self._make_carnival(capacity=3)
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/carnivals", json=payload)
        cid = r.json()["id"]

        r = admin_client.post(f"{BASE_URL}/api/admin/wath/page-config",
                              json={"mode": "carnival", "active_carnival_id": cid})
        assert r.status_code == 200

        # Delete
        r = admin_client.delete(f"{BASE_URL}/api/admin/wath/carnivals/{cid}")
        assert r.status_code == 200

        cfg = admin_client.get(f"{BASE_URL}/api/admin/wath/page-config").json()
        assert cfg["mode"] == "exam"
        assert cfg.get("active_carnival_id") in (None, "")

        # Restore to seeded carnival
        admin_client.post(f"{BASE_URL}/api/admin/wath/page-config",
                          json={"mode": "carnival", "active_carnival_id": SEEDED_CARNIVAL_ID})


# ----------------- Application flow -----------------
class TestApplicationFlow:
    def _app_payload(self, **over):
        uniq = uuid.uuid4().hex[:8]
        base = {
            "name": f"TEST_{uniq}",
            "email": f"TEST_{uniq}@example.com",
            "phone": f"9{uniq[:9].rjust(9,'0')}",
            "school": "TEST School",
            "standard": "10",
            "target_exam": "JEE",
            "city": "Srinagar",
        }
        base.update(over)
        return base

    def test_missing_both_ids_400(self, api):
        r = api.post(f"{BASE_URL}/api/scholarship-applications", json=self._app_payload())
        assert r.status_code == 400

    def test_carnival_without_slot_400(self, api):
        p = self._app_payload(carnival_id=SEEDED_CARNIVAL_ID)
        r = api.post(f"{BASE_URL}/api/scholarship-applications", json=p)
        assert r.status_code == 400

    def test_carnival_over_book_returns_409(self, admin_client, api):
        # Create carnival with capacity=1
        uniq = uuid.uuid4().hex[:6]
        cpayload = {
            "title": f"TEST_Overbook_{uniq}",
            "start_date": "2026-11-01", "end_date": "2026-11-30",
            "exam_dates": [{"date": "2026-11-05",
                            "slots": [{"time": "11:00 AM", "capacity": 1, "is_open": True}]}],
            "active": True,
        }
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/carnivals", json=cpayload)
        assert r.status_code == 200
        cid = r.json()["id"]
        try:
            # First registration
            p1 = self._app_payload(carnival_id=cid,
                                   chosen_date="2026-11-05", chosen_slot_time="11:00 AM")
            r1 = api.post(f"{BASE_URL}/api/scholarship-applications", json=p1)
            assert r1.status_code == 200, r1.text
            body = r1.json()
            app_no = body.get("application_no")
            assert app_no and app_no.isdigit() and len(app_no) == 8
            assert body.get("campaign_kind") == "carnival"

            # Confirm slot remaining decreased via public page/carnival endpoint
            r_car = api.get(f"{BASE_URL}/api/wath/carnivals/{cid}")
            slot = r_car.json()["exam_dates"][0]["slots"][0]
            assert slot["booked_count"] == 1
            assert slot["remaining"] == 0
            assert slot["available"] is False

            # Second registration should over-book -> 409
            p2 = self._app_payload(carnival_id=cid,
                                   chosen_date="2026-11-05", chosen_slot_time="11:00 AM")
            r2 = api.post(f"{BASE_URL}/api/scholarship-applications", json=p2)
            assert r2.status_code == 409, f"Expected 409, got {r2.status_code}: {r2.text}"
            assert "full" in r2.text.lower() or "closed" in r2.text.lower()
        finally:
            admin_client.delete(f"{BASE_URL}/api/admin/wath/carnivals/{cid}")

    def test_duplicate_email_returns_400(self, admin_client, api):
        uniq = uuid.uuid4().hex[:6]
        cpayload = {
            "title": f"TEST_Dup_{uniq}",
            "start_date": "2026-12-01", "end_date": "2026-12-31",
            "exam_dates": [{"date": "2026-12-05",
                            "slots": [{"time": "10:00 AM", "capacity": 5, "is_open": True}]}],
            "active": True,
        }
        r = admin_client.post(f"{BASE_URL}/api/admin/wath/carnivals", json=cpayload)
        cid = r.json()["id"]
        try:
            p = self._app_payload(carnival_id=cid,
                                  chosen_date="2026-12-05", chosen_slot_time="10:00 AM")
            r1 = api.post(f"{BASE_URL}/api/scholarship-applications", json=p)
            assert r1.status_code == 200
            existing_no = r1.json()["application_no"]

            # Duplicate with same email
            r2 = api.post(f"{BASE_URL}/api/scholarship-applications", json=p)
            assert r2.status_code == 400
            assert existing_no in r2.text
        finally:
            admin_client.delete(f"{BASE_URL}/api/admin/wath/carnivals/{cid}")

    def test_registrations_endpoint(self, admin_client, api):
        uniq = uuid.uuid4().hex[:6]
        cpayload = {
            "title": f"TEST_Regs_{uniq}",
            "start_date": "2027-01-01", "end_date": "2027-01-31",
            "exam_dates": [{"date": "2027-01-10",
                            "slots": [{"time": "09:00 AM", "capacity": 3, "is_open": True}]}],
            "active": True,
        }
        cid = admin_client.post(f"{BASE_URL}/api/admin/wath/carnivals", json=cpayload).json()["id"]
        try:
            p = self._app_payload(carnival_id=cid,
                                  chosen_date="2027-01-10", chosen_slot_time="09:00 AM")
            api.post(f"{BASE_URL}/api/scholarship-applications", json=p)
            r = admin_client.get(f"{BASE_URL}/api/admin/wath/carnivals/{cid}/registrations")
            assert r.status_code == 200
            regs = r.json()
            assert isinstance(regs, list)
            assert len(regs) >= 1
            assert regs[0]["carnival_id"] == cid
        finally:
            admin_client.delete(f"{BASE_URL}/api/admin/wath/carnivals/{cid}")
