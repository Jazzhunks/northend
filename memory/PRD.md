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

### ✅ v1.4 (2026-02-10): Seed marker — admin deletes are permanent
- Seed runs ONCE on a fresh database, gated by `system_meta.initial_seed` marker. For existing deployments with data, the marker is auto-recorded without re-inserting (so already-deleted items stay deleted). Removed destructive per-restart `delete_many` for legacy categories. Kept admin upsert, field backfills, and index creation as always-safe operations.

### ✅ v2.0 (2026-02-10): Multi-Branch ERP module (`/erp/*`)
Complete educational ERP grafted onto existing public site without touching the legacy admin/student flows.

**Backend** (`/app/backend/erp_routes.py` + `erp_pdf.py`, ~700 lines):
- Roles: `super_admin` (admin auto-aliased), `center_manager`, `accountant`, `counsellor` — branch-isolated except super.
- Collections: `erp_students`, `erp_payments`, `erp_expenses`, `erp_leads`, `erp_audit`, `erp_counters` (per-branch sequential receipt/student numbers).
- `centers` repurposed as branches (added `gstin`, `signatory_name`, `state_code`, `manager_user_id`).
- Fee receipts: A4 PDF (reportlab) with branch GSTIN, CGST 9% + SGST 9% inclusive math (`amount = base + cgst + sgst`), receipt no like `NES-SRI/YYMM/00001`.
- Expense approval workflow: accountant entries → `pending`, manager/super entries → auto-`approved`. Manager can approve/reject accountant entries.
- Student statement endpoint: total_fee, scholarship_amount, discount, net_fee, total_paid, pending, payments[].
- Dashboards: super (all branches aggregated) + branch-level (revenue / expense / pending / category split / counsellor performance / recent payments).
- Audit log: every create/update/delete recorded with actor, role, entity, payload. Super-admin readable.
- Excel exports: `/erp/exports/payments.xlsx`, `expenses.xlsx`, `students.xlsx` (branch-scoped).
- Cross-branch access denied with 403 at every endpoint.

**Frontend** (`/app/frontend/src/pages/erp/*.jsx`, ~1200 lines, 9 files):
- `ErpLayout` — role-aware sidebar (NAV array hides items per role: counsellor sees only Dashboard/Students/Leads).
- `ErpDashboard` — branches between SuperView (all branches table) and BranchView (single branch stats + counsellor table + recent payments).
- `ErpStudents` (+ create modal), `ErpStudentDetail` (ledger summary + payment history + RecordPaymentModal with GST toggle + PDF receipt download).
- `ErpPayments`, `ErpExpenses` (create + manager approve/reject), `ErpLeads` (inline status change), `ErpStaff` (super/manager can create), `ErpBranches` (super only — GSTIN/signatory), `ErpAudit` (super only).
- Route `/login?next=/erp` now honoured; ERP-role users auto-redirect to `/erp` after login.
- `lib/erpApi.js` — typed wrapper + role helpers (isSuper, isManagerPlus, isFinance, isERPUser, fmtINR, fmtDate).

**Testing**:
- Backend smoke test `/app/backend/tests/test_erp_smoke.py` — 24+ assertions, IDEMPOTENT (passes twice in a row): roles, branch isolation, GST math, scholarship math, receipt PDF, expense approval, cross-branch 403, counsellor visibility, exports, audit log.
- Frontend tested by testing agent — 100% pass after two race-condition fixes (ErpLayout auth-loading guard + useEffect Promise-return wrapping in 4 list pages).

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
