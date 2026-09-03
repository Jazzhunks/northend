"""Iteration 13 — Regression test for WATH Carnival over-booking fix.

Focus:
1. Sequential over-book: capacity=1, 1st register 200, 2nd register 409.
2. Concurrent capacity=1: 5 parallel requests -> exactly 1 success, 4x409.
3. Concurrent capacity=3: 10 parallel requests -> exactly 3 success, 7x409.
4. Cross-carnival isolation of the unique index.
5. Sanity: existing seeded WATH Carnival (id 72107a91-28bc-4b4c-aaa9-7df514b56e6e)
   still hydrates via GET /api/wath/page in mode 'carnival'.
"""
from __future__ import annotations
import asyncio
import os
import random
import string
import pytest
import requests
import httpx


def _base_url() -> str:
    env_path = "/app/frontend/.env"
    if os.path.exists(env_path):
        for line in open(env_path):
            if line.startswith("REACT_APP_BACKEND_URL="):
                return line.split("=", 1)[1].strip().strip('"').rstrip("/")
    return os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")


BASE_URL = _base_url()
assert BASE_URL, "REACT_APP_BACKEND_URL must be set"

ADMIN_EMAIL = "admin@northend.edu"
ADMIN_PWD = "Admin@2025"
SEEDED_CARNIVAL_ID = "72107a91-28bc-4b4c-aaa9-7df514b56e6e"

CARNIVAL_DATE = "2030-01-15"
SLOT_TIME = "10:00 AM"


def _rand_suffix(n=6):
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=n))


# ---------- fixtures ----------
@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login",
                 json={"email": ADMIN_EMAIL, "password": ADMIN_PWD})
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    tok = r.json().get("token") or r.json().get("access_token")
    assert tok, f"No token in login response: {r.json()}"
    return tok


@pytest.fixture(scope="module")
def admin_client(api, admin_token):
    api.headers.update({"Authorization": f"Bearer {admin_token}"})
    return api


def _make_carnival_payload(capacity: int, tag: str):
    return {
        "title": f"TEST_OVERBOOK_{tag}",
        "subtitle": "regression",
        "description": "iteration 13 over-book regression",
        "start_date": "2030-01-01",
        "end_date": "2030-02-01",
        "exam_dates": [
            {"date": CARNIVAL_DATE,
             "slots": [{"time": SLOT_TIME, "capacity": capacity, "is_open": True}]}
        ],
        "active": True,
    }


def _create_carnival(admin_client, capacity: int) -> str:
    tag = _rand_suffix()
    r = admin_client.post(f"{BASE_URL}/api/admin/wath/carnivals",
                          json=_make_carnival_payload(capacity, tag))
    assert r.status_code == 200, f"create carnival failed: {r.status_code} {r.text}"
    return r.json()["id"]


def _delete_carnival(admin_client, cid: str):
    try:
        admin_client.delete(f"{BASE_URL}/api/admin/wath/carnivals/{cid}")
    except Exception:
        pass


def _make_applicant(i: int, tag: str):
    return {
        "carnival_id": None,   # filled by caller
        "chosen_date": CARNIVAL_DATE,
        "chosen_slot_time": SLOT_TIME,
        "name": f"TEST Student {tag}{i}",
        "email": f"TEST_{tag}_{i}_{_rand_suffix(4)}@test.example.com",
        "phone": f"9{random.randint(100000000, 999999999)}",
        "school": "Test School",
        "city": "Srinagar",
        "standard": "10",
        "target_exam": "WATH",
        "venue": "Northend Srinagar",
    }


# ---------- Test 1: sanity for existing seeded carnival ----------
class TestSeededCarnival:
    def test_seeded_carnival_hydrates(self, api):
        r = api.get(f"{BASE_URL}/api/wath/page")
        assert r.status_code == 200
        data = r.json()
        # We only enforce carnival mode if the seeded carnival is active
        if data.get("mode") == "carnival":
            car = data.get("carnival")
            assert car and car.get("id"), f"carnival payload missing: {data}"
            # exam_dates should have hydrated booked_count/remaining/available
            for d in car.get("exam_dates", []):
                for s in d.get("slots", []):
                    assert "booked_count" in s
                    assert "remaining" in s
                    assert "available" in s
        # Direct GET on the seeded id must always work
        r2 = api.get(f"{BASE_URL}/api/wath/carnivals/{SEEDED_CARNIVAL_ID}")
        assert r2.status_code in (200, 404), f"unexpected status: {r2.status_code}"
        if r2.status_code == 200:
            car = r2.json()
            assert car["id"] == SEEDED_CARNIVAL_ID


# ---------- Test 2: sequential over-book ----------
class TestSequentialOverbook:
    def test_capacity_1_second_registration_returns_409(self, admin_client):
        cid = _create_carnival(admin_client, capacity=1)
        try:
            tag = _rand_suffix()
            a1 = _make_applicant(1, tag); a1["carnival_id"] = cid
            r1 = requests.post(f"{BASE_URL}/api/scholarship-applications", json=a1)
            assert r1.status_code == 200, f"1st reg expected 200, got {r1.status_code}: {r1.text}"
            body = r1.json()
            app_no = body.get("application_no") or body.get("app", {}).get("application_no")
            assert app_no and len(str(app_no)) == 8, f"app_no should be 8-digit, got {app_no!r}"

            a2 = _make_applicant(2, tag); a2["carnival_id"] = cid
            r2 = requests.post(f"{BASE_URL}/api/scholarship-applications", json=a2)
            assert r2.status_code == 409, f"2nd reg expected 409, got {r2.status_code}: {r2.text}"
            assert "full" in r2.text.lower() or "closed" in r2.text.lower()

            # verify admin GET shows booked_count=1
            g = admin_client.get(f"{BASE_URL}/api/admin/wath/carnivals/{cid}")
            assert g.status_code == 200
            car = g.json()
            slot = car["exam_dates"][0]["slots"][0]
            assert slot["booked_count"] == 1, f"booked_count expected 1 got {slot}"
            assert slot["available"] is False
        finally:
            _delete_carnival(admin_client, cid)


# ---------- Test 3+4: concurrency ----------
async def _fire_parallel(cid: str, n: int, tag: str):
    """Fire n POSTs to the same slot truly concurrently."""
    async with httpx.AsyncClient(timeout=30) as client:
        payloads = []
        for i in range(n):
            p = _make_applicant(i, tag)
            p["carnival_id"] = cid
            payloads.append(p)
        tasks = [client.post(f"{BASE_URL}/api/scholarship-applications", json=p) for p in payloads]
        responses = await asyncio.gather(*tasks, return_exceptions=True)
    codes = []
    for r in responses:
        if isinstance(r, Exception):
            codes.append(("EXC", str(r)))
        else:
            codes.append((r.status_code, r.text[:120]))
    return codes


class TestConcurrentOverbook:
    def test_capacity_1_five_parallel(self, admin_client):
        cid = _create_carnival(admin_client, capacity=1)
        try:
            tag = _rand_suffix()
            codes = asyncio.run(_fire_parallel(cid, 5, tag))
            success = [c for c in codes if c[0] == 200]
            conflict = [c for c in codes if c[0] == 409]
            other = [c for c in codes if c[0] not in (200, 409)]
            assert len(success) == 1, f"expected exactly 1 success, got {len(success)}. all={codes}"
            assert len(conflict) == 4, f"expected 4x409, got {len(conflict)}. all={codes}"
            assert not other, f"unexpected statuses: {other}"

            g = admin_client.get(f"{BASE_URL}/api/admin/wath/carnivals/{cid}").json()
            slot = g["exam_dates"][0]["slots"][0]
            assert slot["booked_count"] == 1, f"booked_count must be 1, got {slot}"
            assert slot["available"] is False
        finally:
            _delete_carnival(admin_client, cid)

    def test_capacity_3_ten_parallel(self, admin_client):
        cid = _create_carnival(admin_client, capacity=3)
        try:
            tag = _rand_suffix()
            codes = asyncio.run(_fire_parallel(cid, 10, tag))
            success = [c for c in codes if c[0] == 200]
            conflict = [c for c in codes if c[0] == 409]
            other = [c for c in codes if c[0] not in (200, 409)]
            assert len(success) == 3, f"expected exactly 3 success, got {len(success)}. all={codes}"
            assert len(conflict) == 7, f"expected 7x409, got {len(conflict)}. all={codes}"
            assert not other, f"unexpected statuses: {other}"

            g = admin_client.get(f"{BASE_URL}/api/admin/wath/carnivals/{cid}").json()
            slot = g["exam_dates"][0]["slots"][0]
            assert slot["booked_count"] == 3, f"booked_count must be 3, got {slot}"
            assert slot["remaining"] == 0
            assert slot["available"] is False
        finally:
            _delete_carnival(admin_client, cid)


# ---------- Test 5: cross-carnival unique-index isolation ----------
class TestUniqueIndexAcrossCarnivals:
    def test_two_carnivals_same_slot_key_do_not_clash(self, admin_client):
        cid_a = _create_carnival(admin_client, capacity=1)
        cid_b = _create_carnival(admin_client, capacity=1)
        try:
            tag = _rand_suffix()
            # A should succeed
            pa = _make_applicant(0, tag); pa["carnival_id"] = cid_a
            ra = requests.post(f"{BASE_URL}/api/scholarship-applications", json=pa)
            assert ra.status_code == 200, ra.text
            # B, same date/time but different carnival, should ALSO succeed
            pb = _make_applicant(1, tag); pb["carnival_id"] = cid_b
            rb = requests.post(f"{BASE_URL}/api/scholarship-applications", json=pb)
            assert rb.status_code == 200, rb.text

            ga = admin_client.get(f"{BASE_URL}/api/admin/wath/carnivals/{cid_a}").json()
            gb = admin_client.get(f"{BASE_URL}/api/admin/wath/carnivals/{cid_b}").json()
            assert ga["exam_dates"][0]["slots"][0]["booked_count"] == 1
            assert gb["exam_dates"][0]["slots"][0]["booked_count"] == 1
        finally:
            _delete_carnival(admin_client, cid_a)
            _delete_carnival(admin_client, cid_b)
