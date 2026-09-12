# Northend Educational World — Product Requirements Document (PRD)

**Status**: Live at https://northendedu.com · Preview: https://nexed-neet.preview.emergentagent.com

## Original Problem Statement
Create a modern, premium, mobile-first educational website for Northend Educational World (authorized franchise owner of Unacademy for the Kashmir region). Full React + FastAPI + MongoDB stack with:
- 11 public pages + Student/Admin/Examiner dashboards
- Multi-Branch ERP for staff (Super Admin, Centre Manager, Accountant, Counsellor)
- Cinematic dark-luxury redesign
- Dedicated WATH (Wisdom Aptitude Talent Hunt) scholarship exam page
- **WATH Carnival** — a temporary campaign mode with per-date/per-slot booking

## User Personas
- **Student / applicant** — browses courses, registers for WATH, downloads admit card, checks results
- **Super Admin** — full control incl. WhatsApp Inbox, WATH Management, scholarships/courses CRUD
- **Centre Manager / Accountant / Counsellor** — branch-scoped ERP access
- **Examiner** — evaluates scholarship results

## Core Requirements — Implemented
### ✅ Public
- Home / Courses / Scholarships / Centres / Results / Careers / Notices / About / Contact / Login / Register / WATH
- WATH page with 3 modes (`exam` · `carnival` · `disabled`) toggled by admin
- WATH Carnival: student picks a date + time slot, capacity is atomically reserved, full slots become unclickable
- Slug-friendly WATH URL (`/wath` remains stable regardless of mode)

### ✅ Student Dashboard
- Enrollments, scholarships, admit-card downloads

### ✅ Admin Dashboard
- Enrollments, WATH Management (mode toggle + carnival CRUD + slot booking view), Scholarships (with per-campaign registration dashboard), WhatsApp Inbox (Meta Cloud API v20, inbound + template send + media send), Job Applications, Course Catalog, Bulletin, Careers Portal, Hub Stations, Testimonials, Honors, Campaigns, Inquiries.
- Bulk-register scholarship applicants via XLSX; auto-generates admit cards (PDF), sends via email + WhatsApp template.

### ✅ ERP Console
- Super Admin / Centre Manager / Accountant / Counsellor
- Branch isolation, fee tracking, GST receipts, expense tracking, audit log
- Real-time attendance streaming (SSE)

### ✅ Data Isolation
- WATH campaigns (`kind: "wath"`) never appear in generic `/scholarships` listings.
- WATH Carnival lives in a separate `wath_carnivals` collection; slot counters in `wath_slot_counts` with a unique index for over-book safety.
- Application records carry `campaign_kind` for downstream reporting.

### ✅ 3rd Party
- Meta WhatsApp Cloud API (v20, System User token, HMAC-verified webhook, template + media send)
- Emergent SMTP for email
- Emergent Object Storage
- Emergent LLM key (for occasional AI features)

## Backlog / Not Yet Done
### P1
- **WhatsApp Inbox polish** — auto-refresh polling every 5s (currently 60s) + log every outbound WhatsApp we send (admit-card, exam-details notifications, receipts) into `wa_messages` so they appear in the applicant's thread.

### P2 — refactor
- Break `AdminDashboard.jsx` (~1000 lines) into feature-slice components.
- Split `server.py` (~2100 lines) into FastAPI routers.
- Re-enable R3F 3D Hero scene (currently CSS fallback).

## Key File Map
```
/app/backend/
├── server.py                # Main app + auth + scholarships + admin
├── erp_routes.py            # Multi-branch ERP
├── whatsapp_inbox.py        # Meta Cloud API inbox module
├── wath_carnival.py         # WATH page config + carnival CRUD + atomic slot booking
├── whatsapp_client.py       # Outbound WhatsApp templates (admit-card, exam details)
├── storage_client.py        # Emergent Object Storage
├── email_client.py          # SMTP
├── pdf_client.py / erp_pdf.py
/app/frontend/src/pages/
├── WATH.jsx                 # Public /wath — 3 modes (exam · carnival · disabled)
├── WATHManagement.jsx       # Admin WATH mode toggle + carnival CRUD
├── ScholarshipDashboard.jsx # Per-campaign registration stats
├── WhatsAppInbox.jsx        # Admin WhatsApp inbox
├── AdminDashboard.jsx       # Monolithic admin console (refactor pending)
├── erp/*                    # ERP console
├── Home, Courses, Scholarship, Centers, Results, Careers, Notices, About, Contact, Login, Register, StudentDashboard, ExaminerConsole
```

## Recent History
- **Jun 2026** — **Admit card rebuilt as an official hall-ticket (A4)** modelled on a University-of-Kashmir style form: Unacademy logo + Application/Form No header, gradient title strip, bordered **Candidate/Personal Details** grid (Name, Father's/Guardian's Name, Gender, DOB, Mobile, Email, School, Class) with a **photo box** and a **mandatory QR**, bordered **Examination Details** (programme, roll no, date, reporting time, venue), instructions, declaration, dual signature lines (Candidate / Controller of Examinations) and branded footer. Fixed an exam-box overlap. Verified via rendered PDF + live download.
- **Jun 2026** — **WATH form now collects the new admit-card fields** so form & card don't mismatch: added Father's/Guardian's Name, Gender (select), Date of Birth (date). Wired through `ScholarshipApplicationIn` → stored on the application → passed to `admit_card_pdf` from both the apply endpoint and the admit-card download endpoint. Verified end-to-end (form submit → download shows all fields).
- **Jun 2026** — **Slot layout centered**: date tabs and time-slot pills now center their content (time + "X/30 left").
- **Jun 2026** — **Carnival count fix**: closed/full slots forced to `remaining=0` in the public padded view so date totals equal the sum of available slots (33 not 47); admin keeps real numbers.
- **Jun 2026** — **Carnival dashboard layout polish**: wider modal (max-w-5xl), sticky header, evenly-spaced stat cards, gradient fill-by-date bars, tidier venue/class chips.
- **Jun 2026** — **Carnival slot urgency (display-only gimmick)**: public `/wath/page` & `/wath/carnivals/{id}` show slots ~50-70% full (deterministic per-slot padding in `_hydrate_carnival(pad=True)`) while `available`/real capacity stay truthful so genuine registrations are never blocked. Admin views use `pad=False` (real numbers).
- **Jun 2026** — **Home banner rebranded** to "WATH Carnival" (badge, headline, CTA "Explore WATH Carnival").
- **Jun 2026** — **WATH Carnival admin dashboard**: the carnival "Dashboard" drawer (WATHManagement) now shows summary stats (registrations, total capacity, overall fill %, exam dates), fill-by-exam-date bars, by-venue & by-class breakdowns, and registrant tables with App No / Name / Phone / Class / Venue / Registered-on. Uses REAL counts. Verified via screenshot.
- **Jun 2026** — **Admin pagination (25/page, client-side)** via reusable `components/Paginator.jsx` (`usePaged` hook + `Paginator`): AdminDashboard Enrollments, Scholarship/WATH Applications, Job Applications; ERP Students & Leads. Plus a **programme/kind filter** on Scholarship Applications (All / WATH / WATH Carnival / Scholarship via `campaign_kind`). Verified filter + paginator present in admin UI.
- **Jun 2026** — **Slug URLs**: courses & scholarships now carry a title-based `slug` (auto-generated on create/update with collision suffixes + startup backfill for existing docs). Public routes `GET /courses/{cid}` and `GET /scholarships/{sid}/stats` resolve by slug OR id (backwards compatible). Frontend links now use `/courses/:slug` and `/admin/scholarships/:slug/dashboard`.
- **Jun 2026** — **Slot Countdown Nudge** (WATH Carnival): per-slot amber "Only X left!" cue with pulsing dot when a time slot has ≤5 seats; date tabs show amber "filling fast" indicator when a date has ≤10 seats left. Verified visually.
- **Jun 2026** — Fixed WATH Carnival post-registration UX bug: `onRegistered` was calling full `load()` which flipped parent into loading state, unmounted the form and wiped the `submitted` success card (looked like a reload + only toast shown). Made refresh silent (`load(true)`) so inline success card (App No, Venue, Exam Date, Slot, Download Admit Card, Join WhatsApp) persists. Verified via live registration screenshot.
- **Feb 2026** — WATH Carnival: kind separation, page-config toggle, atomic slot booking (with over-book race fix via unique index).
- **Feb 2026** — WhatsApp Inbox: Meta Cloud API v20 webhook + admin inbox + template send. Full 17/17 pytest coverage.
- **Feb 2026** — Numeric app_no (8-digit) migration; PII protection on admit-card endpoint (requires phone or admin token).
- **Feb 2026** — Bulk scholarship registration with empty-row skip + accurate per-row error reporting.
- **Feb 2026** — Multi-Branch ERP, cinematic dark-luxury redesign, deployment fixes.

## Test Report Trail
- iteration_9.json — pnpm-in-DOM fix + numeric app_no + Scholarship stats dashboard (100%)
- iteration_10.json — Bulk-register empty rows (100%)
- iteration_11.json — WhatsApp Inbox full E2E (17/17)
- iteration_12.json — WATH Carnival flow (93%, over-book bug found)
- iteration_13.json — Over-book fix regression (100%)
