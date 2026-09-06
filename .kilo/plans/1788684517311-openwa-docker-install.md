# OpenWA Docker Installation - Complete

## Installation Summary
- **Location**: `~/OpenWA`
- **Branch**: main
- **Container**: `openwa-api` (healthy)
- **Ports**: `127.0.0.1:2785` → `2785`
- **API Health**: `http://localhost:2785/api/health` → `{"status":"ok","version":"0.18.0"}`
- **Dashboard**: `http://localhost:2785` → `200 OK`

## Credentials
- **API Key**: `owa_k1_e90d235a2d7423fad11e5b49a130abf360873afacc819935f7b03198880fe477`
- Also stored at: `~/OpenWA/data/.api-key`

## Access URLs
- Dashboard: http://localhost:2785
- API: http://localhost:2785/api
- Swagger: http://localhost:2785/api/docs (if ENABLE_SWAGGER=true)
- Health: http://localhost:2785/api/health
- Ready: http://localhost:2785/api/health/ready

## Management
```bash
# View logs
docker logs -f openwa-api

# Stop
docker compose -f ~/OpenWA/docker-compose.dev.yml down

# Restart
docker compose -f ~/OpenWA/docker-compose.dev.yml up -d

# Rebuild after code changes
docker compose -f ~/OpenWA/docker-compose.dev.yml up -d --build
```

## Notes
- Redis is not enabled (warnings in logs are expected for single-node dev)
- Data persists in `~/OpenWA/data/`
- To enable Swagger in production, add `ENABLE_SWAGGER=true` to `~/OpenWA/.env`
- To use a different engine, set `ENGINE_TYPE=baileys` in `~/OpenWA/.env`
