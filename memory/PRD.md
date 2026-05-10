# Northend Educational World — PRD

## Original Problem Statement
Modern, premium, mobile-first educational website for Northend Educational World (authorized Unacademy franchise for Kashmir).

## Architecture
- React 19 + Tailwind + Shadcn UI · FastAPI + Motor (MongoDB) · JWT auth · Emergent object storage · Gmail SMTP · reportlab+qrcode
- Categories supported: **NEET · IIT-JEE · Foundation · CBSE · JKBOSE**

## Personas
1. Student aspirant — explore courses, scholarship, enroll, dashboard.
2. Parent — centers, results, notices, contact.
3. Job seeker — apply with resume upload.
4. Admin — full CRUD across all content + Excel exports.

## Implementation Status

### ✅ v1 (2026-02-10): MVP
- 11 public pages, JWT auth, admin/student dashboards, Excel export
- 6 Kashmir centers, courses, jobs, scholarship campaign, toppers, testimonials seeded

### ✅ v1.1 (2026-02-10): Integrations
- Emergent object storage (`/api/upload`, `/api/files/{id}`) with `<FileUpload/>` on Jobs + Enroll
- PDF + QR scholarship admit-card (`reportlab` + `qrcode`)
- Gmail SMTP via Workspace (`manager.ops@northendedu.com`) with branded HTML templates
- Async storage client (httpx) — non-blocking uploads

### ✅ v1.2 (2026-02-10): Admin full control + simplified categories
- Categories locked to NEET/IIT-JEE/Foundation/CBSE/JKBOSE (Pydantic Literal); old categories (CUET/NDA/Crash) auto-deleted on startup
- New `<ChipInput/>` for course form: Syllabus highlights, Faculty, Features
- Public CourseDetail shows "What you get" features section
- Admin CRUD added for Centers, Testimonials, Results, Scholarship Campaigns
- AdminDashboard now has **11 tabs**
- Idempotent seed: backfills features/syllabus/faculty on legacy course titles
- pytest **74/74 passing**

### ✅ v1.3 (2026-02-10): Production deployment fixes
- **Backend**: `server.py` MongoDB resolver now prefers `client.get_default_database()` (Atlas URIs embed a default DB), falling back to `DB_NAME` for local dev. Fixes Atlas auth-error on production deploy.
- **Frontend**: removed all hardcoded `process.env.REACT_APP_BACKEND_URL` outside `lib/api.js`. `Scholarship.jsx` and `StudentDashboard.jsx` now use the centralised `API_BASE` from `lib/api.js`.
- Verified: backend boots, `/api/scholarships` returns 200, scholarship page renders cleanly.

### ⏭ P1 Backlog
- Brute-force lockout + per-IP rate limit on public POST endpoints (especially `/api/upload`)
- Refer-a-Friend program (₹1,000 fee discount per converted referral)
- Recharts widgets in admin dashboard (selections trend, students by city)
- Payment gateway (Stripe / Razorpay) for online fee collection
- Move SMTP password + Emergent key to a production secret manager
- Split server.py (~790 lines) and AdminDashboard.jsx (~600 lines) into per-domain modules
- Switch admin Update routes to PATCH with Optional fields for partial saves

### P2 Backlog
- PWA support, sitemap.xml, dynamic SEO metadata, blog/news
- Multi-language (Urdu / Kashmiri)
- Attendance & study-material modules in student dashboard
- WhatsApp Business API broadcast
- Notification broadcasting (SMS / email digest)

## Test Credentials
See `/app/memory/test_credentials.md`. Admin: `admin@northend.edu` / `Admin@2025`.

## Next Tasks
1. Refer-a-Friend referral codes + fee discount on enrollment.
2. Brute-force lockout + rate limiting.
3. Recharts admin analytics widgets.
4. Stripe / Razorpay online fee gateway.
5. Refactor server.py + AdminDashboard.jsx into smaller modules.
