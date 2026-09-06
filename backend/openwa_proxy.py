import os
import re
import json
import httpx
import logging
from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import Response, HTMLResponse, FileResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("openwa_proxy")

OPENWA_BASE = os.getenv("OPENWA_URL", "http://127.0.0.1:2785")
OPENWA_MASTER_KEY = os.getenv("OPENWA_API_MASTER_KEY")
DASHBOARD_DIST = Path(__file__).parent.parent / "waha" / "dashboard" / "dist"

router = APIRouter()


def _proxy_path(path: str) -> str:
    stripped = path[len("/admin/openwa"):]
    return stripped or "/"


def _rewrite_html(body: str) -> str:
    if not isinstance(body, str):
        return body
    body = re.sub(r'(href|src|action|formaction)=(")/(?!admin/openwa)([^"#?]*)(")', r'\1=\2/admin/openwa\3\4', body)
    body = re.sub(r'(["\'])/api', r'\1/admin/openwa/api', body)
    body = re.sub(r'(["\'])/socket.io', r'\1/admin/openwa/socket.io', body)
    return body


async def _proxy_request(request: Request, target_url: str):
    headers = {}
    if OPENWA_MASTER_KEY:
        headers["X-API-Key"] = OPENWA_MASTER_KEY

    body = await request.body()
    excluded_host_headers = {"host", "content-length"}
    for k, v in request.headers.items():
        if k.lower() not in excluded_host_headers:
            headers[k] = v

    async with httpx.AsyncClient(follow_redirects=False, timeout=httpx.Timeout(30.0)) as client:
        req = client.build_request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body if body else None,
        )
        resp = await client.send(req)

    content = await resp.aread()
    media_type = resp.headers.get("content-type", "")

    if "text/html" in media_type and resp.status_code < 400:
        try:
            content = _rewrite_html(content.decode("utf-8")).encode("utf-8")
        except Exception:
            pass

    excluded_resp_headers = {"content-encoding", "content-length", "transfer-encoding", "connection"}
    response_headers = {
        k: v for k, v in resp.headers.items()
        if k.lower() not in excluded_resp_headers
    }

    return Response(
        content=content,
        status_code=resp.status_code,
        headers=response_headers,
    )


@router.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def proxy_openwa_api(request: Request, path: str):
    target_path = f"/api/{path}"
    url = f"{OPENWA_BASE}{target_path}"
    if request.query_params:
        url = f"{url}?{request.query_params}"
    return await _proxy_request(request, url)


@router.api_route("/socket.io/{path:path}", methods=["GET", "POST", "OPTIONS"])
async def proxy_openwa_socketio(request: Request, path: str):
    target_path = f"/socket.io/{path}"
    url = f"{OPENWA_BASE}{target_path}"
    if request.query_params:
        url = f"{url}?{request.query_params}"
    return await _proxy_request(request, url)


@router.get("/{path:path}")
async def serve_dashboard_or_proxy(request: Request, path: str):
    if not path or path == "/":
        path = "index.html"

    safe_path = re.sub(r"\.\.+", "", path)
    file_path = DASHBOARD_DIST / safe_path

    if file_path.is_file():
        return FileResponse(file_path)

    index = DASHBOARD_DIST / "index.html"
    if index.is_file():
        return FileResponse(index)

    raise HTTPException(status_code=502, detail="OpenWA dashboard unavailable")
