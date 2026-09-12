<<<<<<< HEAD
# Here are your Instructions
=======
# Northend Educational World

**Live:** https://northendedu.com · **Preview:** https://nexed-neet.preview.emergentagent.com

Official authorized franchise owner of [Unacademy](https://unacademy.com) for the **Kashmir region**, India. Full-stack EdTech + Institute Management Platform for competitive exam preparation (NEET, IIT-JEE, Foundation, CBSE, JKBOSE).

---

## Architecture

```
northend/
├── frontend/     React 19, CRA + craco, Tailwind CSS, Radix UI, Framer Motion, Three.js
├── backend/      Python 3.11, FastAPI, Motor (async MongoDB), Pydantic v2
├── test_reports/ Iteration test reports (JSON + JUnit XML)
├── memory/PRD.md Internal product requirements document
└── design_guidelines.json  Design system specification
```

**Deployment:** Emergent platform (containerized, see `.emergent/`)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + React Router v7 |
| Build | Create React App + craco |
| Styling | Tailwind CSS + Radix UI (shadcn/ui) |
| Animation | Framer Motion, GSAP, React Three Fiber |
| Backend Framework | FastAPI + Uvicorn |
| Database | MongoDB (async Motor driver) |
| Auth | JWT (HttpOnly cookies) + bcrypt |
| PDF | ReportLab + qrcode |
| File Storage | Emergent Object Storage |
| Email | Emergent SMTP |
| WhatsApp | Meta Cloud API v20 |
| Push Notifications | OneSignal + VAPID |

---

## Project Modules

| Module | Description |
|--------|-------------|
| Public Portal | 11 marketing pages (Home, Courses, WATH, About, etc.) |
| WATH Exam Engine | Scholarship exam (3 modes: exam / carnival / disabled) |
| WATH Carnival | Date+slot booking with atomic seat reservation |
| Admit Card Engine | A4 PDF admit cards with QR codes |
| Multi-Branch ERP | Role-based staff console (Super Admin / Centre Manager / Accountant / Counsellor) |
| WhatsApp Inbox | Meta Cloud API v20 — inbound, templates, media, broadcasts |
| Admin Dashboard | Full content management + analytics |

---

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB (local or Atlas URI)

### 1. Clone
```bash
git clone https://github.com/Jazzhunks/northend
cd northend
```

### 2. Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in your values
uvicorn server:app --reload --port 8001
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Fill in your values
npm start             # Starts on port 3000
```

### 4. Run Both Together (from root)
```bash
npm install
npm start
```

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URL=mongodb://localhost:27017/northend_db
JWT_SECRET=<strong-random-secret>
ADMIN_PASSWORD=<strong-random-password>
STORAGE_URL=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_ID=
WHATSAPP_VERIFY_TOKEN=
NVIDIA_API_KEY=
```

### Frontend (`frontend/.env`)
```
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_ONESIGNAL_APP_ID=
REACT_APP_VAPID_PUBLIC_KEY=
```

---

## User Roles

| Role | Access |
|------|--------|
| `student` | Public portal, student dashboard, admit card downloads |
| `school` | School dashboard, visit requests |
| `admin` | Full admin dashboard, WATH management, WhatsApp inbox |
| `super_admin` | Admin + ERP full access |
| `center_manager` | ERP (branch-scoped) |
| `accountant` | ERP payments + expenses |
| `counsellor` | ERP students + leads |
>>>>>>> f5d60c2be (chore: clean branch push)
