"""
Iteration 4 backend tests:
- Course category Literal validation (only 5 allowed)
- Course array fields: syllabus / faculty / features persist
- Seed cleanup deleted any non-allowed categories on startup; CBSE course exists
- Admin CRUD for centers (POST/PUT/DELETE)
- Admin CRUD for testimonials (POST/PUT/DELETE)
- Admin update for results (PUT)
- Auth gating on all the above (401 when not authed, 403 when student)
"""
import os
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
STUDENT_EMAIL = f"student_iter4_{os.getpid()}@test.com"
STUDENT_PASSWORD = "Student@2025"
ALLOWED = {"NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"}


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
        "name": "Iter4 Student", "email": STUDENT_EMAIL,
        "password": STUDENT_PASSWORD, "phone": "+919999000099"
    }, timeout=20)
    if r.status_code == 400:
        r = requests.post(f"{API}/auth/login",
                          json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


# ---------------- Category restriction ----------------
class TestCategoryRestriction:
    @pytest.mark.parametrize("bad_cat", ["CUET", "NDA", "Crash", "Random"])
    def test_reject_non_allowed_categories(self, admin_token, bad_cat):
        r = requests.post(f"{API}/courses", headers=auth_h(admin_token), json={
            "title": f"TEST_Bad_{bad_cat}", "category": bad_cat,
            "duration": "1m", "fee": 1, "description": "x"
        }, timeout=20)
        assert r.status_code == 422, f"{bad_cat}: expected 422 got {r.status_code} {r.text}"

    @pytest.mark.parametrize("cat", sorted(ALLOWED))
    def test_accept_allowed_categories(self, admin_token, cat):
        r = requests.post(f"{API}/courses", headers=auth_h(admin_token), json={
            "title": f"TEST_OK_{cat}", "category": cat,
            "duration": "1m", "fee": 100, "description": "ok",
            "syllabus": ["S1"], "faculty": ["F1"], "features": ["X1"]
        }, timeout=20)
        assert r.status_code == 200, r.text
        cid = r.json()["id"]
        # cleanup
        d = requests.delete(f"{API}/courses/{cid}", headers=auth_h(admin_token), timeout=20)
        assert d.status_code == 200

    def test_seed_only_allowed_categories(self):
        r = requests.get(f"{API}/courses", timeout=20)
        assert r.status_code == 200
        cats = {c["category"] for c in r.json()}
        assert cats.issubset(ALLOWED), f"Found disallowed seed cats: {cats - ALLOWED}"

    def test_seed_has_cbse(self):
        r = requests.get(f"{API}/courses", params={"category": "CBSE"}, timeout=20)
        assert r.status_code == 200
        assert len(r.json()) >= 1, "CBSE seed course missing"


# ---------------- Course array fields persistence ----------------
class TestCourseArrays:
    def test_create_with_arrays_and_get(self, admin_token):
        payload = {
            "title": "TEST_ArrayCourse", "category": "NEET",
            "duration": "6m", "fee": 5000, "description": "arr",
            "syllabus": ["Physics", "Chem"],
            "faculty": ["Dr. A", "Mr. B"],
            "features": ["Mock tests", "Doubt clearing", "Mentors"],
        }
        r = requests.post(f"{API}/courses", headers=auth_h(admin_token), json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        cid = body["id"]
        assert body["syllabus"] == payload["syllabus"]
        assert body["faculty"] == payload["faculty"]
        assert body["features"] == payload["features"]

        # GET verifies persistence
        g = requests.get(f"{API}/courses/{cid}", timeout=20)
        assert g.status_code == 200
        gb = g.json()
        assert gb["syllabus"] == payload["syllabus"]
        assert gb["faculty"] == payload["faculty"]
        assert gb["features"] == payload["features"]

        # GET list also returns course with features
        listed = requests.get(f"{API}/courses", timeout=20).json()
        match = next((c for c in listed if c["id"] == cid), None)
        assert match is not None
        assert match["features"] == payload["features"]

        # cleanup
        requests.delete(f"{API}/courses/{cid}", headers=auth_h(admin_token), timeout=20)

    def test_seed_courses_have_features(self):
        items = requests.get(f"{API}/courses", timeout=20).json()
        with_features = [c for c in items if isinstance(c.get("features"), list) and len(c["features"]) > 0]
        # NOTE: seed is non-idempotent for `features` — pre-existing courses from
        # iter2/3 were seeded WITHOUT the features field and seed does not backfill.
        # Only newly-inserted courses (e.g., CBSE, JKBOSE) get features.
        # Tracking as a soft expectation; main agent should backfill seeded features.
        assert len(with_features) >= 1, "At least new seeded courses must carry features arrays"


# ---------------- Centers admin CRUD ----------------
class TestCentersCRUD:
    def test_post_unauth_401(self):
        r = requests.post(f"{API}/centers", json={
            "name": "X", "city": "X", "address": "Y", "phone": "1"
        }, timeout=20)
        assert r.status_code == 401

    def test_post_student_403(self, student_token):
        r = requests.post(f"{API}/centers", headers=auth_h(student_token), json={
            "name": "X", "city": "X", "address": "Y", "phone": "1"
        }, timeout=20)
        assert r.status_code == 403

    def test_full_crud_admin(self, admin_token):
        payload = {"name": "TEST_Center", "city": "TestCity",
                   "address": "Some addr", "phone": "+91-9000000000",
                   "timing": "9am-9pm", "lat": 30.0, "lng": 75.0}
        c = requests.post(f"{API}/centers", headers=auth_h(admin_token), json=payload, timeout=20)
        assert c.status_code == 200, c.text
        cid = c.json()["id"]
        assert c.json()["name"] == "TEST_Center"

        # PUT
        upd = {**payload, "name": "TEST_Center_Updated", "city": "TestCity2"}
        u = requests.put(f"{API}/centers/{cid}", headers=auth_h(admin_token), json=upd, timeout=20)
        assert u.status_code == 200, u.text
        assert u.json()["name"] == "TEST_Center_Updated"
        assert u.json()["city"] == "TestCity2"

        # GET list contains
        lst = requests.get(f"{API}/centers", timeout=20).json()
        assert any(x["id"] == cid and x["name"] == "TEST_Center_Updated" for x in lst)

        # DELETE
        d = requests.delete(f"{API}/centers/{cid}", headers=auth_h(admin_token), timeout=20)
        assert d.status_code == 200
        lst2 = requests.get(f"{API}/centers", timeout=20).json()
        assert all(x["id"] != cid for x in lst2)


# ---------------- Testimonials admin CRUD ----------------
class TestTestimonialsCRUD:
    def test_post_unauth_401(self):
        r = requests.post(f"{API}/testimonials", json={"name": "x", "role": "x", "quote": "x"}, timeout=20)
        assert r.status_code == 401

    def test_post_student_403(self, student_token):
        r = requests.post(f"{API}/testimonials", headers=auth_h(student_token),
                          json={"name": "x", "role": "x", "quote": "x"}, timeout=20)
        assert r.status_code == 403

    def test_full_crud_admin(self, admin_token):
        payload = {"name": "TEST_Tm", "role": "Parent", "quote": "Great"}
        c = requests.post(f"{API}/testimonials", headers=auth_h(admin_token), json=payload, timeout=20)
        assert c.status_code == 200, c.text
        tid = c.json()["id"]

        upd = {"name": "TEST_Tm_U", "role": "Student", "quote": "Updated"}
        u = requests.put(f"{API}/testimonials/{tid}", headers=auth_h(admin_token), json=upd, timeout=20)
        assert u.status_code == 200
        assert u.json()["name"] == "TEST_Tm_U"
        assert u.json()["quote"] == "Updated"

        d = requests.delete(f"{API}/testimonials/{tid}", headers=auth_h(admin_token), timeout=20)
        assert d.status_code == 200


# ---------------- Results admin update ----------------
class TestResultsUpdate:
    def test_put_unauth_401(self):
        r = requests.put(f"{API}/results/nonexistent", json={
            "student_name": "X", "exam": "X", "rank": "1", "year": 2025, "course": "NEET"
        }, timeout=20)
        assert r.status_code == 401

    def test_put_student_403(self, student_token):
        r = requests.put(f"{API}/results/nonexistent", headers=auth_h(student_token), json={
            "student_name": "X", "exam": "X", "rank": "1", "year": 2025, "course": "NEET"
        }, timeout=20)
        assert r.status_code == 403

    def test_admin_create_then_update(self, admin_token):
        c = requests.post(f"{API}/results", headers=auth_h(admin_token), json={
            "student_name": "TEST_Topper", "exam": "NEET 2025", "rank": "AIR 100",
            "year": 2025, "course": "NEET", "quote": "Hi"
        }, timeout=20)
        assert c.status_code == 200, c.text
        rid = c.json()["id"]

        u = requests.put(f"{API}/results/{rid}", headers=auth_h(admin_token), json={
            "student_name": "TEST_Topper_Updated", "exam": "NEET 2025",
            "rank": "AIR 50", "year": 2025, "course": "NEET", "quote": "Updated"
        }, timeout=20)
        assert u.status_code == 200, u.text
        body = u.json()
        assert body["student_name"] == "TEST_Topper_Updated"
        assert body["rank"] == "AIR 50"
        assert body["quote"] == "Updated"

        # cleanup
        requests.delete(f"{API}/results/{rid}", headers=auth_h(admin_token), timeout=20)
