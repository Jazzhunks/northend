# OpenWA Production Subpath Deployment Plan

## Goal
Expose OpenWA dashboard + API at `https://<production-domain>/openwa` instead of `localhost:2785`, while the root domain continues serving the existing website.

## Domain Selection
Use `https://northendedu.com` as primary (matches existing website + CORS). Preview domain `https://nexed-neet.preview.emergentagent.com` can mirror the same `/openwa` subpath.

## Changes Required

### 1. OpenWA `.env` (`OpenWA/.env`)
```env
DOMAIN=northendedu.com
BASE_URL=https://northendedu.com/openwa
DASHBOARD_URL=https://northendedu.com/openwa
CORS_ORIGINS=https://northendedu.com,https://www.northendedu.com,https://nexed-neet.preview.emergentagent.com
```

### 2. Reverse Proxy (nginx/Caddy/cloud LB)
Add a route that:
- Matches `/openwa/*`
- Strips the `/openwa` prefix
- Proxies to `localhost:2785/*`
- Serves the existing website at `/` and all other paths

Example nginx snippet:
```nginx
location /openwa/ {
    proxy_pass http://127.0.0.1:2785/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 3. Frontend Admin Dashboard Link (`frontend/src/pages/AdminDashboard.jsx`)
Update the OpenWA dashboard href from `https://nexed-neet.preview.emergentagent.com` to `https://northendedu.com/openwa`.

### 4. CORS Validation
Confirm backend Python FastAPI CORS regex in `backend/server.py:3198-3205` already allows `northendedu.com` origins. No change needed there.

## Verification
1. `https://northendedu.com/openwa` loads the OpenWA dashboard
2. API calls from dashboard succeed (CORS headers present)
3. Root `https://northendedu.com` still serves the existing website
4. OpenWA ingress URLs (webhooks) use `https://northendedu.com/openwa/api/ingress/...`

## Out of Scope
- Reverse proxy TLS certificate provisioning
- Backend Python API changes (no path prefix needed there)
