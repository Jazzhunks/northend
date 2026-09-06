# Plan: Integrate OpenWA as Admin-Only Tool

## Objective
Integrate OpenWA (https://github.com/rmyndharis/OpenWA) into the existing codebase as a separate admin-only tool, alongside the existing Meta WhatsApp Cloud API integration. OpenWA functionality will be accessed through the FastAPI backend via proxy routes, with the dashboard UI restricted to admin users only.

## Context
- **Existing**: Meta WhatsApp Cloud API integration (`whatsapp_inbox.py`, `whatsapp_broadcast.py`, `whatsapp_client.py`, frontend inbox, campaigns, templates, webhooks)
- **New**: OpenWA (whatsapp-web.js based) running as a separate service, proxied through FastAPI
- **Root package.json** already references a missing `waha` service: `"start:waha": "cd waha && yarn start"`

## Key Decisions

### 1. Service Architecture
- OpenWA runs as a **separate Node.js service** in `waha/` directory
- FastAPI backend adds **proxy routes** that forward requests to OpenWA
- Existing Meta WhatsApp integration remains **untouched**
- Root `package.json` updated to start OpenWA service alongside backend and frontend

### 2. Ports & URLs
- OpenWA internal port: **2785** (default)
- Host binding: **127.0.0.1:2785** (localhost only, not publicly exposed)
- FastAPI proxy prefix: **`/api/openwa/*`**
- Frontend admin route: **`/admin/openwa`**

### 3. Authentication & Access Control
- All OpenWA API proxy routes require **`require_admin`** dependency
- Frontend `/admin/openwa` route wrapped in `<Protected allowedRoles={["admin"]}>`
- OpenWA dashboard embedded via **iframe** or **server-side proxy** through FastAPI
- OpenWA's internal API key auth remains active for its own security

### 4. OpenWA Configuration
- `SERVE_DASHBOARD=true`
- `BASE_URL=https://northendedu.com/openwa` (for display in banners)
- `DASHBOARD_URL=https://northendedu.com/openwa`
- `TRUSTED_PROXIES=127.0.0.1` (since behind FastAPI proxy)
- `API_MASTER_KEY`: generated and stored in `backend/.env`
- `CORS_ORIGINS`: restrict to production domains only
- `ENGINE_TYPE=whatsapp-web.js` (default)

## Implementation Tasks

### Task 1: Clone OpenWA into `waha/` directory
```bash
git clone https://github.com/rmyndharis/OpenWA.git waha
cd waha && git checkout main
```

### Task 2: Configure OpenWA environment
- Create `waha/.env` with production settings
- Set `API_MASTER_KEY` from `backend/.env` `OPENWA_API_MASTER_KEY`
- Configure `BASE_URL` and `DASHBOARD_URL` for production domain
- Set `CORS_ORIGINS` to allowed domains

### Task 3: Add FastAPI proxy router
Create `backend/openwa_proxy.py`:
```python
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import Response
import httpx
import os

router = APIRouter(prefix="/api/openwa", tags=["openwa"])

OPENWA_BASE = os.getenv("OPENWA_URL", "http://127.0.0.1:2785")
OPENWA_MASTER_KEY = os.getenv("OPENWA_API_MASTER_KEY")

async def _proxy(request: Request, path: str):
    url = f"{OPENWA_BASE}/{path}"
    headers = {}
    if OPENWA_MASTER_KEY:
        headers["X-API-Key"] = OPENWA_MASTER_KEY
    
    async with httpx.AsyncClient() as client:
        req = client.build_request(
            method=request.method,
            url=url,
            headers=headers,
            content=await request.body(),
            params=request.query_params,
        )
        resp = await client.send(req, stream=True)
        return Response(
            content=await resp.aread(),
            status_code=resp.status_code,
            headers=dict(resp.headers),
        )

# Proxy all /api/openwa/* to OpenWA
@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def proxy_openwa(request: Request, path: str):
    return await _proxy(request, path)
```

### Task 4: Mount proxy router in `backend/server.py`
- Import `openwa_proxy` router
- Mount with `require_admin` dependency: `api.include_router(openwa_proxy.router, dependencies=[Depends(require_admin)])`

### Task 5: Add frontend admin route
In `frontend/src/App.js`:
- Import `OpenWA` page component
- Add route: `<Route path="/admin/openwa" element={<Protected allowedRoles={["admin"]}><OpenWA /></Protected>} />`

Create `frontend/src/pages/OpenWA.jsx`:
```jsx
import { useEffect, useState } from "react";

const OPENWA_URL = "/api/openwa";

export default function OpenWA() {
  const [src, setSrc] = useState("");

  useEffect(() => {
    fetch(OPENWA_URL, { credentials: "include" })
      .then(() => setSrc(OPENWA_URL))
      .catch(() => setSrc(""));
  }, []);

  if (!src) return <div className="p-12 text-center">OpenWA Dashboard unavailable.</div>;

  return (
    <iframe
      src={src}
      title="OpenWA Dashboard"
      className="w-full h-[calc(100vh-4rem)] border-0"
      allow="clipboard-write"
    />
  );
};
```

### Task 6: Update root `package.json`
Add OpenWA service scripts:
```json
"start:openwa": "cd waha && npm run start:prod",
"dev:openwa": "cd waha && npm run dev"
```

Update main start script:
```json
"start": "concurrently -k -n \"BACKEND,FRONTEND,OPENWA\" -c \"blue,green,magenta\" \"npm run start:backend\" \"npm run start:frontend\" \"npm run start:openwa\""
```

### Task 7: Update backend `.env`
Add new variables:
```
OPENWA_URL=http://127.0.0.1:2785
OPENWA_API_MASTER_KEY=<generate-secure-key>
```

### Task 8: Update CORS if needed
Ensure `FRONTEND_URL` includes the production domain. OpenWA dashboard will be served through FastAPI proxy, so CORS is handled by FastAPI.

### Task 9: Add admin navigation link
Update `frontend/src/components/Layout.jsx` or admin dashboard to include link to `/admin/openwa` for admin users.

## Open Questions / Assumptions

1. **Iframe vs. Proxy**: The plan uses an iframe for the dashboard. If OpenWA's dashboard has X-Frame-Options restrictions, we may need to use a server-side HTML proxy instead.

2. **OpenWA Data Persistence**: OpenWA uses SQLite by default. For production, consider PostgreSQL profile. The `waha/` directory should be added to `.gitignore`.

3. **WhatsApp Web Risk**: OpenWA uses `whatsapp-web.js` (reverse-engineered). There is a risk of WhatsApp account restriction. Admin should be aware.

4. **Service Discovery**: If deploying with Docker or a process manager, ensure OpenWA starts before FastAPI (or add retry logic).

## Validation Steps

1. Start OpenWA: `cd waha && npm run start:prod`
2. Verify OpenWA accessible at `http://127.0.0.1:2785`
3. Start backend and frontend
4. Login as admin, navigate to `/admin/openwa`
5. Verify OpenWA dashboard loads through iframe
6. Verify non-admin users are redirected from `/admin/openwa`
7. Test proxy routes: `curl -H "Authorization: Bearer <admin_token>" https://northendedu.com/api/openwa/api/keys`
8. Verify existing Meta WhatsApp integration still works

## Risks

- OpenWA dashboard may block iframe embedding (X-Frame-Options)
- OpenWA service must be running for admin dashboard to work
- WhatsApp account ban risk with whatsapp-web.js
- Two parallel WhatsApp systems may confuse operators
