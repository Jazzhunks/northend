"""Iteration 9 tests:
- index.html no stray 'pnpm run build' text
- 8-digit numeric application_no
- GET /api/scholarships/{sid}/stats admin-only
"""
import os
import re
import uuid
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://nexed-neet.preview.emergentagent.com").rstrip("/")
WATH_ID = "1ed94009-d949-4504-b291-68e3571a5a44"
APP_NO_RE = re.compile(r"^[0-9]{8}$")


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": "admin@northend.edu", "password": "Admin@2025"},
                      timeout=30)
    assert r.status_code == 200, f"login failed {r.status_code} {r.text}"
    data = r.json()
    tok = data.get("access_token") or data.get("token") or data.get("nw_token")
    assert tok, f"no token in {data}"
    return tok


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ----- 1. index.html clean -----
def test_index_html_no_pnpm_text():
    r = requests.get(f"{BASE_URL}/", timeout=30)
    assert r.status_code == 200
    body = r.text.lstrip()
    assert not body.lower().startswith("pnpm run build"), "index.html starts with stray text"
    # Also check first ~200 chars don't contain the phrase (outside of any script content it shouldn't appear)
    assert "pnpm run build" not in r.text[:500], "stray pnpm run build text present near top"


# ----- 2. numeric application_no on create -----
def test_scholarship_application_creates_8digit_app_no():
    uniq = uuid.uuid4().hex[:8]
    payload = {
        "scholarship_id": WATH_ID,
        "name": f"TEST Numeric {uniq}",
        "full_name": f"TEST Numeric {uniq}",
        "email": f"test_numeric_{uniq}@test.com",
        "phone": f"9{uniq[:9].ljust(9,'0')}",
        "venue": "Northend 90 FT",
        "school": "Test School",
        "school_name": "Test School",
        "standard": "10",
        "class_grade": "10",
        "target_exam": "NEET",
        "city": "Srinagar",
        "date_of_birth": "2005-01-01",
        "gender": "male",
        "father_name": "Father",
        "mother_name": "Mother",
        "address": "Test Address",
    }
    r = requests.post(f"{BASE_URL}/api/scholarship-applications", json=payload, timeout=30)
    assert r.status_code in (200, 201), f"{r.status_code} {r.text}"
    data = r.json()
    app_no = data.get("application_no") or data.get("app_no")
    assert app_no, f"no application_no in {data}"
    assert APP_NO_RE.match(str(app_no)), f"app_no '{app_no}' not 8-digit numeric"


# ----- 3. admin list: every record's app_no is 8-digit numeric -----
def test_all_applications_have_8digit_numeric_app_no(admin_headers):
    r = requests.get(f"{BASE_URL}/api/scholarship-applications", headers=admin_headers, timeout=30)
    assert r.status_code == 200, f"{r.status_code} {r.text}"
    data = r.json()
    items = data if isinstance(data, list) else data.get("items", [])
    assert len(items) > 0, "no applications returned"
    bad = [it.get("application_no") for it in items if not APP_NO_RE.match(str(it.get("application_no") or ""))]
    assert not bad, f"non-numeric app_no records: {bad[:10]}"


# ----- 4. stats endpoint auth -----
def test_stats_endpoint_requires_auth():
    r = requests.get(f"{BASE_URL}/api/scholarships/{WATH_ID}/stats", timeout=30)
    assert r.status_code in (401, 403), f"expected 401/403, got {r.status_code}"


def test_stats_endpoint_admin_ok(admin_headers):
    r = requests.get(f"{BASE_URL}/api/scholarships/{WATH_ID}/stats", headers=admin_headers, timeout=30)
    assert r.status_code == 200, f"{r.status_code} {r.text}"
    data = r.json()
    for key in ["campaign", "total_registrations", "wow_growth_pct", "this_week",
                "prev_week", "by_venue", "top_venue", "as_of"]:
        assert key in data, f"missing key {key} in stats response: {list(data.keys())}"
    assert isinstance(data["total_registrations"], int)
    assert isinstance(data["by_venue"], list)
    for v in data["by_venue"]:
        for k in ["venue", "total", "today", "last_7_days"]:
            assert k in v, f"missing venue key {k}"
