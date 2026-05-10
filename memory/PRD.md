# Northend Educational World — PRD

## Original Problem Statement
Modern, premium, mobile-first educational website for Northend Educational World (authorized Unacademy franchise for Kashmir). Tagline: "Empowering Kashmir's Future Through Quality Education." Audience: NEET / IIT-JEE / Foundation / CUET / NDA / JKBOSE aspirants, parents, and job seekers.

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn UI + react-router-dom v7. Bricolage Grotesque (display) + IBM Plex Sans (body). Swiss & High-Contrast aesthetic — International Klein Blue (#002FA7) primary, #FFC107 accent.
- **Backend**: FastAPI + Motor (async MongoDB). JWT auth (httpOnly cookies + Authorization Bearer fallback). Bcrypt hashing. Idempotent admin + catalog seeding on startup.
- **DB**: MongoDB collections — users, courses, scholarships, scholarship_applications, enrollments, jobs, job_applications, notices, results, testimonials, centers, inquiries.
- **Excel export**: openpyxl-driven `/api/admin/export/{kind}` for enrollments, scholarship-applications, job-applications, inquiries, students.

## User Personas
1. **Student aspirant (NEET/JEE/CUET)** — explores courses, applies for scholarship, enrolls, tracks status from dashboard.
2. **Parent** — browses centers, results, notices, contacts counselor.
3. **Job seeker** — applies to teaching / counseling / operations roles.
4. **Admin** — manages courses, notices, jobs, applications; exports Excel.

## Implementation Status (2026-02-10)

### ✅ Implemented (P0)
- 11 public pages: Home, About, Courses, CourseDetail, Scholarship, Enroll, Jobs, Centers, Results, Notices, Contact
- Auth: login, register, logout, /me — admin idempotently seeded
- Student dashboard (enrollments + notices)
- Admin dashboard with 7 tabs: Enrollments, Scholarship Apps, Job Apps, Courses CRUD, Notices CRUD, Jobs CRUD, Inquiries
- Excel export for 5 collections
- Stats counters (intersection-observed with fallback), scholarship calculator, application/receipt number generation
- Floating WhatsApp FAB, sticky glass navbar, dark-mode-ready theme
- 6 Kashmir centers seeded (Srinagar, Anantnag, Sopore, Soura, Zakura, Parraypora)
- 7 course categories seeded; 6 toppers; 3 testimonials; 3 notices; 5 jobs; 1 scholarship campaign
- All interactive elements have `data-testid`
- Backend pytest suite: 38/38 passing

### ⏭ P1 Backlog
- File uploads via Emergent object storage (resumes, ID proof, course PDFs) — currently URL field
- WhatsApp Business API broadcast (currently wa.me link)
- Email / OTP via Resend or Twilio (registration verification, password reset)
- PDF generation: admit cards, fee receipts (reportlab installed but routes not wired)
- QR-code based admit-card verification
- Payment gateway (Stripe/Razorpay) for online fee
- Rich-text editor for notices/courses (currently plain text)
- Brute-force lockout + rate limiting on public POST endpoints
- Gallery, blog/news, sitemap, dynamic SEO metadata
- Multi-image course banners
- Recharts analytics widgets in admin dashboard

### P2 Backlog
- PWA support, service-worker offline shell
- Multi-language (Urdu / Kashmiri)
- Attendance & study-material modules in student dashboard
- Inquiry-management workflow with assigned counselors
- Notification broadcasting (WhatsApp / SMS / email)

## Test Credentials
See `/app/memory/test_credentials.md`.
- Admin: `admin@northend.edu` / `Admin@2025`
- Test student: register fresh

## Next Tasks
1. Wire object-storage uploads for resume + ID proof.
2. Add PDF admit-card generation for scholarship applicants (reportlab + QR).
3. Email transactional notifications (Resend) for enrollment + scholarship + job-app submissions.
4. Add brute-force lockout + per-IP rate limit on public POST endpoints.
5. Build Recharts dashboards (selections trend, students by city) on /admin.
