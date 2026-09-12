"""Iteration 11 — WhatsApp Inbox end-to-end backend tests.

Covers:
  * GET /api/webhooks/whatsapp verify handshake (200 + challenge, 403 wrong token)
  * POST /api/webhooks/whatsapp signature validation (401 without/bad sig, 200 with valid HMAC)
  * Auto-link to WATH applicant with matching phone (9999900000 -> application_no 12477667)
  * Admin GET /threads, GET /threads/{id}/messages, PATCH /threads/{id}/read
  * POST /threads/{id}/messages -> real Meta Graph API (4xx expected, must not crash)
  * RBAC: unauth -> 401/403, student -> 403
"""
import os
import time
import json
import hmac
import hashlib
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://nexed-neet.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

VERIFY_TOKEN = "Z1w53bdGJc0cIlAz0eGN6F_Wwgp9nyS-jCxC5o8cavI"
APP_SECRET = b"86e03ae15a47eea31ad53486f6cb108d"
WATH_PHONE = "9999900000"
WATH_APPLICATION_NO_HINT = "12477667"  # from the review request (may vary)

ADMIN_EMAIL = "admin@northend.edu"
ADMIN_PASSWORD = "Admin@2025"
STUDENT_EMAIL = "student@test.com"
STUDENT_PASSWORD = "Student@2025"


# ---------- helpers ----------
def _login(email, password):
    r = requests.post(f"{API}/auth/login", json={"email": email, "password": password}, timeout=15)
    assert r.status_code == 200, f"login {email} failed: {r.status_code} {r.text}"
    return r.json().get("token") or r.json().get("access_token")


@pytest.fixture(scope="session")
def admin_token():
    return _login(ADMIN_EMAIL, ADMIN_PASSWORD)


@pytest.fixture(scope="session")
def student_token():
    try:
        return _login(STUDENT_EMAIL, STUDENT_PASSWORD)
    except AssertionError:
        # Try to register student if not exists
        requests.post(
            f"{API}/auth/register",
            json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD, "name": "Test Student"},
            timeout=15,
        )
        return _login(STUDENT_EMAIL, STUDENT_PASSWORD)


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="session")
def student_headers(student_token):
    return {"Authorization": f"Bearer {student_token}"}


def _make_inbound_payload(wa_id: str, profile_name: str, text: str, msg_id: str | None = None):
    return {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "897105382814076",
                "changes": [
                    {
                        "field": "messages",
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {"display_phone_number": "15551234567", "phone_number_id": "1169594382913429"},
                            "contacts": [{"profile": {"name": profile_name}, "wa_id": wa_id}],
                            "messages": [
                                {
                                    "from": wa_id,
                                    "id": msg_id or f"wamid.TEST_{uuid.uuid4().hex}",
                                    "timestamp": str(int(time.time())),
                                    "type": "text",
                                    "text": {"body": text},
                                }
                            ],
                        },
                    }
                ],
            }
        ],
    }


def _sign(raw: bytes) -> str:
    return "sha256=" + hmac.new(APP_SECRET, raw, hashlib.sha256).hexdigest()


# ---------- Webhook verify ----------
class TestWebhookVerify:
    def test_verify_success(self):
        r = requests.get(
            f"{API}/webhooks/whatsapp",
            params={"hub.mode": "subscribe", "hub.verify_token": VERIFY_TOKEN, "hub.challenge": "CHAL_1234"},
            timeout=10,
        )
        assert r.status_code == 200, r.text
        assert r.text == "CHAL_1234"

    def test_verify_wrong_token(self):
        r = requests.get(
            f"{API}/webhooks/whatsapp",
            params={"hub.mode": "subscribe", "hub.verify_token": "WRONG", "hub.challenge": "x"},
            timeout=10,
        )
        assert r.status_code == 403

    def test_verify_missing_mode(self):
        r = requests.get(
            f"{API}/webhooks/whatsapp",
            params={"hub.verify_token": VERIFY_TOKEN, "hub.challenge": "x"},
            timeout=10,
        )
        assert r.status_code == 403


# ---------- Webhook POST signature ----------
class TestWebhookPost:
    def test_post_without_signature(self):
        payload = _make_inbound_payload("15551110001", "NoSig Tester", "hello no sig")
        raw = json.dumps(payload).encode()
        r = requests.post(
            f"{API}/webhooks/whatsapp",
            data=raw,
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        assert r.status_code == 401, f"expected 401 got {r.status_code}: {r.text}"

    def test_post_bad_signature(self):
        payload = _make_inbound_payload("15551110002", "BadSig", "hello bad sig")
        raw = json.dumps(payload).encode()
        r = requests.post(
            f"{API}/webhooks/whatsapp",
            data=raw,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": "sha256=deadbeef"},
            timeout=10,
        )
        assert r.status_code == 401

    def test_post_valid_signature_persists_and_links(self, admin_headers):
        unique_text = f"WATH-LINK-TEST {uuid.uuid4().hex[:6]}"
        payload = _make_inbound_payload(WATH_PHONE, "WATH Applicant", unique_text)
        raw = json.dumps(payload).encode()
        sig = _sign(raw)
        r = requests.post(
            f"{API}/webhooks/whatsapp",
            data=raw,
            headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
            timeout=10,
        )
        assert r.status_code == 200, r.text
        assert r.json() == {"ok": True}

        # Now verify via admin API that thread exists with correct data + linked to WATH applicant
        r2 = requests.get(f"{API}/whatsapp/threads?limit=100", headers=admin_headers, timeout=10)
        assert r2.status_code == 200, r2.text
        threads = r2.json()
        assert isinstance(threads, list) and len(threads) > 0

        wath = [t for t in threads if t.get("wa_id") == WATH_PHONE]
        assert wath, f"No thread found for wa_id={WATH_PHONE}. Threads: {[t.get('wa_id') for t in threads]}"
        t = wath[0]
        assert t.get("last_message_preview") == unique_text
        assert int(t.get("unread_count", 0)) >= 1
        assert t.get("profile_name") == "WATH Applicant"
        # Auto-link should have populated application_no if a WATH applicant exists with phone=9999900000
        assert t.get("linked_application_no"), (
            f"Expected auto-link to WATH applicant with phone {WATH_PHONE}, got linked_application_no={t.get('linked_application_no')}"
        )

        # Save thread id for downstream tests
        pytest.wath_thread_id = t["id"]

    def test_idempotent_duplicate_msg(self, admin_headers):
        """Sending the same wa message id twice should not create duplicate messages."""
        msg_id = f"wamid.TEST_IDEMP_{uuid.uuid4().hex}"
        payload = _make_inbound_payload(WATH_PHONE, "WATH Applicant", "idempotent-1", msg_id=msg_id)
        raw = json.dumps(payload).encode()
        sig = _sign(raw)
        for _ in range(2):
            r = requests.post(
                f"{API}/webhooks/whatsapp",
                data=raw,
                headers={"Content-Type": "application/json", "X-Hub-Signature-256": sig},
                timeout=10,
            )
            assert r.status_code == 200

        # verify only one message with that wa_message_id in the thread
        tid = getattr(pytest, "wath_thread_id", None)
        assert tid
        r = requests.get(f"{API}/whatsapp/threads/{tid}/messages", headers=admin_headers, timeout=10)
        assert r.status_code == 200
        items = r.json().get("items", [])
        matches = [m for m in items if m.get("wa_message_id") == msg_id]
        assert len(matches) == 1, f"Expected exactly 1 message with id={msg_id}, got {len(matches)}"


# ---------- Admin API ----------
class TestAdminThreadsAPI:
    def test_get_messages(self, admin_headers):
        tid = getattr(pytest, "wath_thread_id", None)
        assert tid, "Prior test must have populated pytest.wath_thread_id"
        r = requests.get(f"{API}/whatsapp/threads/{tid}/messages", headers=admin_headers, timeout=10)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "thread" in data and "contact" in data and "items" in data
        assert isinstance(data["items"], list) and len(data["items"]) >= 1
        # ensure no mongo _id leaked
        for m in data["items"]:
            assert "_id" not in m

    def test_get_messages_thread_not_found(self, admin_headers):
        r = requests.get(f"{API}/whatsapp/threads/does-not-exist/messages", headers=admin_headers, timeout=10)
        assert r.status_code == 404

    def test_mark_read(self, admin_headers):
        tid = getattr(pytest, "wath_thread_id", None)
        assert tid
        r = requests.patch(f"{API}/whatsapp/threads/{tid}/read", headers=admin_headers, timeout=10)
        assert r.status_code == 200
        # verify unread_count reset to 0
        r2 = requests.get(f"{API}/whatsapp/threads?limit=100", headers=admin_headers, timeout=10)
        t = next((x for x in r2.json() if x["id"] == tid), None)
        assert t and t.get("unread_count", -1) == 0

    def test_send_message_hits_meta_gracefully(self, admin_headers):
        tid = getattr(pytest, "wath_thread_id", None)
        assert tid
        r = requests.post(
            f"{API}/whatsapp/threads/{tid}/messages",
            headers={**admin_headers, "Content-Type": "application/json"},
            json={"kind": "text", "text": "hi"},
            timeout=30,
        )
        # Real Meta API — likely 4xx because recipient is fake test number.
        # Accept: 200 (unlikely) OR a Meta-forwarded 4xx. Must NOT be 500 (crash)
        # or 422 (means our own request-body validation is broken — reject that too).
        assert r.status_code != 422, f"Endpoint returned 422 — body-parsing bug: {r.text}"
        assert r.status_code < 500, f"Send endpoint crashed with 5xx: {r.status_code} {r.text}"
        # Response must be JSON with 'detail' (FastAPI HTTPException) or the created message doc
        try:
            body = r.json()
        except Exception:
            pytest.fail(f"Non-JSON response: {r.text}")
        if r.status_code == 200:
            assert body.get("direction") == "outbound"
        else:
            assert "detail" in body

    def test_send_invalid_kind_400(self, admin_headers):
        tid = getattr(pytest, "wath_thread_id", None)
        assert tid
        r = requests.post(
            f"{API}/whatsapp/threads/{tid}/messages",
            headers={**admin_headers, "Content-Type": "application/json"},
            json={"kind": "invalid_kind"},
            timeout=10,
        )
        assert r.status_code in (400, 422)


# ---------- RBAC ----------
class TestRBAC:
    def test_threads_no_auth(self):
        r = requests.get(f"{API}/whatsapp/threads", timeout=10)
        assert r.status_code in (401, 403)

    def test_threads_student_token(self, student_headers):
        r = requests.get(f"{API}/whatsapp/threads", headers=student_headers, timeout=10)
        assert r.status_code == 403

    def test_send_no_auth(self):
        r = requests.post(f"{API}/whatsapp/threads/any/messages", json={"kind": "text", "text": "x"}, timeout=10)
        assert r.status_code in (401, 403)

    def test_send_student_token(self, student_headers):
        r = requests.post(
            f"{API}/whatsapp/threads/any/messages",
            headers={**student_headers, "Content-Type": "application/json"},
            json={"kind": "text", "text": "x"},
            timeout=10,
        )
        assert r.status_code == 403

    def test_mark_read_no_auth(self):
        r = requests.patch(f"{API}/whatsapp/threads/any/read", timeout=10)
        assert r.status_code in (401, 403)
