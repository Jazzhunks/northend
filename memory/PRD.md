# Northend Educational World — PRD

## Original Problem Statement
Modern, premium, mobile-first educational website for Northend Educational World (authorized Unacademy franchise for Kashmir). Tagline: "Empowering Kashmir's Future Through Quality Education." Audience: NEET / IIT-JEE / Foundation / CUET / NDA / JKBOSE aspirants, parents, and job seekers.

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn UI + react-router-dom v7. Bricolage Grotesque (display) + IBM Plex Sans (body). Swiss & High-Contrast aesthetic — International Klein Blue (#002FA7) primary, #FFC107 accent.
- **Backend**: FastAPI + Motor (async MongoDB). JWT auth (httpOnly cookies + Authorization Bearer fallback). Bcrypt hashing. Idempotent admin + catalog seeding on startup.
- **Storage**: Emergent built-in object storage (10 MB limit, PDF/JPG/PNG/WebP).
- **Email**: Gmail SMTP via Workspace account `manager.ops@northendedu.com`, fired via FastAPI BackgroundTasks.
- **PDF**: reportlab + qrcode for scholarship admit cards.
- **DB**: collections — users, courses, scholarships, scholarship_applications, enrollments, jobs, job_applications, notices, results, testimonials, centers, inquiries, files.

## User Personas
1. **Student aspirant (NEET/JEE/CUET)** — explores courses, applies for scholarship, downloads admit card, enrolls, tracks status.
2. **Parent** — browses centers, results, notices, contacts counselor.
3. **Job seeker** — applies to teaching / counseling / operations roles with resume upload.
4. **Admin** — manages courses, notices, jobs, applications; exports Excel.

## Implementation Status

### ✅ v1 (2026-02-10)
- 11 public pages + admin and student dashboards
- JWT auth, bcrypt, idempotent admin seed
- 6 Kashmir centers, 8 courses, 5 jobs, scholarship campaign, toppers, testimonials
- Excel export (5 collections), stats counters, scholarship calculator
- Floating WhatsApp FAB, sticky glass navbar, all interactive elements have data-testid
- Backend pytest: 38/38 passing

### ✅ v1.1 (2026-02-10)
- Emergent object storage uploads (`/api/upload`, `/api/files/{id}`)
- Reusable `<FileUpload/>` component on Jobs (resume) + Enroll (ID proof)
- PDF + QR admit-card generation (`/api/scholarship-applications/{no}/admit-card`)
- Gmail SMTP transactional emails: enrollment / scholarship / job-app receipts + admin notifications
- BackgroundTasks for non-blocking email sends
- Backend pytest: **52/52 passing**

### ⏭ P1 Backlog
- Brute-force lockout + per-IP rate limit on public POST endpoints (especially /api/upload)
- Refer-a-friend program (referral codes → fee discount on enrollment)
- Recharts analytics in admin dashboard (selections trend, students by city)
- Rich-text editor for notices/courses (currently plain text)
- Payment gateway (Stripe / Razorpay) for online fee collection
- Multi-image course banners + gallery page
- Async storage client (httpx.AsyncClient) — current sync requests block event loop on large files
- Move SMTP password and EMERGENT_LLM_KEY to a production secret manager

### P2 Backlog
- PWA support, service-worker offline shell
- Multi-language (Urdu / Kashmiri)
- Attendance & study-material modules in student dashboard
- Inquiry-management workflow with assigned counselors
- Notification broadcasting (WhatsApp Business API / SMS)
- Sitemap.xml, dynamic SEO metadata, blog/news system
- Split server.py into per-domain routers (~725 lines now)

## Test Credentials
See `/app/memory/test_credentials.md`.
- Admin: `admin@northend.edu` / `Admin@2025`
- Test student: register fresh via `/register`

## Next Tasks
1. Brute-force lockout + rate limiting on public POST endpoints (security hardening).
2. Refer-a-friend program for ₹1,000 enrollment discounts.
3. Recharts dashboard widgets in /admin (selections by year, students by city).
4. Stripe / Razorpay integration for online fee collection.
5. Refactor server.py into routers/ subdirectory.
