from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import io
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query, UploadFile, File, BackgroundTasks
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
import openpyxl

from storage_client import init_storage, put_object, get_object, aclose as storage_aclose, APP_NAME
from email_client import (
    email_enrollment_received, email_scholarship_received,
    email_job_app_received, email_admin_notification,
)
from pdf_client import admit_card_pdf

ALLOWED_UPLOAD_TYPES = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg", "image/jpg": "jpg",
    "image/png": "png", "image/webp": "webp",
}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB

# ---------- Setup ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Northend Educational World API")
api = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

def jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()

def verify_password(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), h.encode())
    except Exception:
        return False

def create_access_token(uid: str, email: str, role: str) -> str:
    return jwt.encode(
        {"sub": uid, "email": email, "role": role,
         "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
         "type": "access"},
        jwt_secret(), algorithm=JWT_ALGORITHM
    )

def create_refresh_token(uid: str) -> str:
    return jwt.encode(
        {"sub": uid, "exp": datetime.now(timezone.utc) + timedelta(days=7),
         "type": "refresh"},
        jwt_secret(), algorithm=JWT_ALGORITHM
    )

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        ah = request.headers.get("Authorization", "")
        if ah.startswith("Bearer "):
            token = ah[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(401, "Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(401, "User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin access required")
    return user

# ---------- Models ----------
class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class LoginIn(BaseModel):
    email: EmailStr
    password: str

ALLOWED_CATEGORIES = ["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"]

class CourseIn(BaseModel):
    title: str
    category: Literal["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"]
    duration: str
    fee: int
    description: str
    syllabus: List[str] = []
    faculty: List[str] = []
    features: List[str] = []
    scholarship_available: bool = True
    featured: bool = False
    image_url: Optional[str] = None

class ScholarshipIn(BaseModel):
    title: str
    description: str
    exam_date: str
    deadline: str
    eligibility: str
    active: bool = True

class ScholarshipApplicationIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    school: str
    standard: str
    target_exam: str
    city: str
    scholarship_id: Optional[str] = None

class EnrollmentIn(BaseModel):
    course_id: str
    name: str
    email: EmailStr
    phone: str
    address: str
    center: str
    id_proof_url: Optional[str] = None

class JobIn(BaseModel):
    title: str
    department: str
    location: str
    type: str  # Full-time, Part-time
    description: str
    requirements: List[str] = []
    active: bool = True

class JobApplicationIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    job_id: str
    qualification: str
    experience: str
    subject_expertise: Optional[str] = None
    preferred_location: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None  # link or note

class NoticeIn(BaseModel):
    title: str
    content: str
    category: str = "General"
    pinned: bool = False

class ResultIn(BaseModel):
    student_name: str
    exam: str
    rank: str
    year: int
    course: str
    photo_url: Optional[str] = None
    quote: Optional[str] = None

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class CenterIn(BaseModel):
    name: str
    city: str
    address: str
    phone: str
    timing: str = "8:00 AM – 8:00 PM"
    lat: float = 34.0837
    lng: float = 74.7973

class TestimonialIn(BaseModel):
    name: str
    role: str
    quote: str

# ---------- Helpers ----------
def now_iso():
    return datetime.now(timezone.utc).isoformat()

def new_id():
    return str(uuid.uuid4())

# ---------- Auth Routes ----------
@api.post("/auth/register")
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "Email already registered")
    user_id = new_id()
    doc = {
        "id": user_id, "name": payload.name, "email": email,
        "phone": payload.phone, "role": "student",
        "password_hash": hash_password(payload.password),
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    access = create_access_token(user_id, email, "student")
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    doc.pop("password_hash"); doc.pop("_id", None)
    return {"user": doc, "access_token": access}

@api.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    access = create_access_token(user["id"], email, user["role"])
    refresh = create_refresh_token(user["id"])
    set_auth_cookies(response, access, refresh)
    user.pop("password_hash"); user.pop("_id", None)
    return {"user": user, "access_token": access}

@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"ok": True}

@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user

# ---------- Public stats ----------
@api.get("/stats")
async def stats():
    courses = await db.courses.count_documents({})
    students = await db.users.count_documents({"role": "student"})
    enrollments = await db.enrollments.count_documents({})
    centers = await db.centers.count_documents({})
    selections = await db.results.count_documents({})
    return {
        "students_trained": max(students * 50 + 12000, 12000),
        "selections": max(selections * 8 + 850, 850),
        "educators": 65,
        "centers": max(centers, 6),
        "courses": courses,
        "enrollments": enrollments,
    }

# ---------- Courses ----------
@api.get("/courses")
async def list_courses(category: Optional[str] = None, featured: Optional[bool] = None):
    q = {}
    if category: q["category"] = category
    if featured is not None: q["featured"] = featured
    items = await db.courses.find(q, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

@api.get("/courses/{cid}")
async def get_course(cid: str):
    c = await db.courses.find_one({"id": cid}, {"_id": 0})
    if not c: raise HTTPException(404, "Course not found")
    return c

@api.post("/courses")
async def create_course(payload: CourseIn, _admin = Depends(require_admin)):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.courses.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api.put("/courses/{cid}")
async def update_course(cid: str, payload: CourseIn, _admin = Depends(require_admin)):
    res = await db.courses.update_one({"id": cid}, {"$set": payload.model_dump()})
    if not res.matched_count: raise HTTPException(404, "Course not found")
    return await db.courses.find_one({"id": cid}, {"_id": 0})

@api.delete("/courses/{cid}")
async def delete_course(cid: str, _admin = Depends(require_admin)):
    await db.courses.delete_one({"id": cid})
    return {"ok": True}

# ---------- Scholarships ----------
@api.get("/scholarships")
async def list_scholarships():
    return await db.scholarships.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api.post("/scholarships")
async def create_scholarship(payload: ScholarshipIn, _admin = Depends(require_admin)):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso()
    await db.scholarships.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/scholarships/{sid}")
async def update_scholarship(sid: str, payload: ScholarshipIn, _admin = Depends(require_admin)):
    await db.scholarships.update_one({"id": sid}, {"$set": payload.model_dump()})
    return await db.scholarships.find_one({"id": sid}, {"_id": 0})

@api.delete("/scholarships/{sid}")
async def delete_scholarship(sid: str, _admin = Depends(require_admin)):
    await db.scholarships.delete_one({"id": sid}); return {"ok": True}

@api.post("/scholarship-applications")
async def apply_scholarship(payload: ScholarshipApplicationIn, background: BackgroundTasks):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["application_no"] = "NEW-SCH-" + str(uuid.uuid4().int)[:8]
    doc["status"] = "pending"
    doc["created_at"] = now_iso()
    await db.scholarship_applications.insert_one(doc)
    doc.pop("_id", None)
    background.add_task(email_scholarship_received, payload.email, payload.name, doc["application_no"], payload.target_exam)
    background.add_task(email_admin_notification, f"New scholarship application: {payload.name}",
                       f"<p><b>{payload.name}</b> from {payload.school} ({payload.standard}) applied for <b>{payload.target_exam}</b> scholarship.<br/>App No: {doc['application_no']}</p>")
    return doc

@api.get("/scholarship-applications")
async def list_scholarship_apps(_admin = Depends(require_admin)):
    return await db.scholarship_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api.put("/scholarship-applications/{aid}/status")
async def update_scholarship_status(aid: str, status: str = Query(...), _admin = Depends(require_admin)):
    if status not in ("pending", "approved", "rejected"):
        raise HTTPException(400, "Invalid status")
    await db.scholarship_applications.update_one({"id": aid}, {"$set": {"status": status}})
    return {"ok": True}

# ---------- Enrollments ----------
@api.post("/enrollments")
async def create_enrollment(payload: EnrollmentIn, request: Request, background: BackgroundTasks):
    course = await db.courses.find_one({"id": payload.course_id}, {"_id": 0})
    if not course:
        raise HTTPException(404, "Course not found")
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["status"] = "pending"
    doc["receipt_no"] = "NEW-ENR-" + str(uuid.uuid4().int)[:8]
    doc["created_at"] = now_iso()
    try:
        user = await get_current_user(request)
        doc["user_id"] = user["id"]
    except Exception:
        doc["user_id"] = None
    await db.enrollments.insert_one(doc)
    doc.pop("_id", None)
    background.add_task(email_enrollment_received, payload.email, payload.name, doc["receipt_no"], course["title"], payload.center)
    background.add_task(email_admin_notification, f"New enrollment: {payload.name}",
                       f"<p><b>{payload.name}</b> ({payload.email}, {payload.phone}) enrolled for <b>{course['title']}</b> at <b>{payload.center}</b>.<br/>Receipt: {doc['receipt_no']}</p>")
    return doc

@api.get("/enrollments")
async def list_enrollments(_admin = Depends(require_admin)):
    return await db.enrollments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api.get("/enrollments/mine")
async def my_enrollments(user: dict = Depends(get_current_user)):
    return await db.enrollments.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api.put("/enrollments/{eid}/status")
async def update_enrollment_status(eid: str, status: str = Query(...), _admin = Depends(require_admin)):
    if status not in ("pending", "approved", "rejected"):
        raise HTTPException(400, "Invalid status")
    await db.enrollments.update_one({"id": eid}, {"$set": {"status": status}})
    return {"ok": True}

# ---------- Jobs ----------
@api.get("/jobs")
async def list_jobs():
    return await db.jobs.find({"active": True}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api.get("/jobs/all")
async def list_all_jobs(_admin = Depends(require_admin)):
    return await db.jobs.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/jobs")
async def create_job(payload: JobIn, _admin = Depends(require_admin)):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso()
    await db.jobs.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/jobs/{jid}")
async def update_job(jid: str, payload: JobIn, _admin = Depends(require_admin)):
    await db.jobs.update_one({"id": jid}, {"$set": payload.model_dump()})
    return await db.jobs.find_one({"id": jid}, {"_id": 0})

@api.delete("/jobs/{jid}")
async def delete_job(jid: str, _admin = Depends(require_admin)):
    await db.jobs.delete_one({"id": jid}); return {"ok": True}

@api.post("/job-applications")
async def apply_job(payload: JobApplicationIn, background: BackgroundTasks):
    job = await db.jobs.find_one({"id": payload.job_id}, {"_id": 0})
    if not job:
        raise HTTPException(404, "Job not found")
    doc = payload.model_dump()
    doc["id"] = new_id(); doc["status"] = "received"; doc["created_at"] = now_iso()
    await db.job_applications.insert_one(doc); doc.pop("_id", None)
    background.add_task(email_job_app_received, payload.email, payload.name, job["title"])
    background.add_task(email_admin_notification, f"New job application: {payload.name}",
                       f"<p><b>{payload.name}</b> ({payload.email}, {payload.phone}) applied for <b>{job['title']}</b>.<br/>Qualification: {payload.qualification}<br/>Experience: {payload.experience}<br/>Resume: {payload.resume_url or '—'}</p>")
    return doc

@api.get("/job-applications")
async def list_job_apps(_admin = Depends(require_admin)):
    return await db.job_applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api.put("/job-applications/{aid}/status")
async def update_job_app_status(aid: str, status: str = Query(...), _admin = Depends(require_admin)):
    if status not in ("received", "shortlisted", "rejected", "hired"):
        raise HTTPException(400, "Invalid status")
    await db.job_applications.update_one({"id": aid}, {"$set": {"status": status}})
    return {"ok": True}

# ---------- Notices ----------
@api.get("/notices")
async def list_notices():
    return await db.notices.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api.post("/notices")
async def create_notice(payload: NoticeIn, _admin = Depends(require_admin)):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso()
    await db.notices.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/notices/{nid}")
async def update_notice(nid: str, payload: NoticeIn, _admin = Depends(require_admin)):
    await db.notices.update_one({"id": nid}, {"$set": payload.model_dump()})
    return await db.notices.find_one({"id": nid}, {"_id": 0})

@api.delete("/notices/{nid}")
async def delete_notice(nid: str, _admin = Depends(require_admin)):
    await db.notices.delete_one({"id": nid}); return {"ok": True}

# ---------- Centers ----------
@api.get("/centers")
async def list_centers():
    return await db.centers.find({}, {"_id": 0}).to_list(100)

@api.post("/centers")
async def create_center(payload: CenterIn, _admin = Depends(require_admin)):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso()
    await db.centers.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/centers/{cid}")
async def update_center(cid: str, payload: CenterIn, _admin = Depends(require_admin)):
    await db.centers.update_one({"id": cid}, {"$set": payload.model_dump()})
    return await db.centers.find_one({"id": cid}, {"_id": 0})

@api.delete("/centers/{cid}")
async def delete_center(cid: str, _admin = Depends(require_admin)):
    await db.centers.delete_one({"id": cid}); return {"ok": True}

# ---------- Results ----------
@api.get("/results")
async def list_results():
    return await db.results.find({}, {"_id": 0}).sort("year", -1).to_list(200)

@api.post("/results")
async def create_result(payload: ResultIn, _admin = Depends(require_admin)):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso()
    await db.results.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/results/{rid}")
async def update_result(rid: str, payload: ResultIn, _admin = Depends(require_admin)):
    await db.results.update_one({"id": rid}, {"$set": payload.model_dump()})
    return await db.results.find_one({"id": rid}, {"_id": 0})

@api.delete("/results/{rid}")
async def delete_result(rid: str, _admin = Depends(require_admin)):
    await db.results.delete_one({"id": rid}); return {"ok": True}

# ---------- Testimonials ----------
@api.get("/testimonials")
async def list_testimonials():
    return await db.testimonials.find({}, {"_id": 0}).to_list(50)

@api.post("/testimonials")
async def create_testimonial(payload: TestimonialIn, _admin = Depends(require_admin)):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso()
    await db.testimonials.insert_one(doc); doc.pop("_id", None); return doc

@api.put("/testimonials/{tid}")
async def update_testimonial(tid: str, payload: TestimonialIn, _admin = Depends(require_admin)):
    await db.testimonials.update_one({"id": tid}, {"$set": payload.model_dump()})
    return await db.testimonials.find_one({"id": tid}, {"_id": 0})

@api.delete("/testimonials/{tid}")
async def delete_testimonial(tid: str, _admin = Depends(require_admin)):
    await db.testimonials.delete_one({"id": tid}); return {"ok": True}

# ---------- Contact ----------
@api.post("/contact")
async def contact(payload: ContactIn):
    doc = payload.model_dump(); doc["id"] = new_id(); doc["created_at"] = now_iso(); doc["status"] = "new"
    await db.inquiries.insert_one(doc); doc.pop("_id", None); return doc

@api.get("/inquiries")
async def list_inquiries(_admin = Depends(require_admin)):
    return await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

# ---------- Admin Dashboard summary ----------
@api.get("/admin/summary")
async def admin_summary(_admin = Depends(require_admin)):
    return {
        "total_students": await db.users.count_documents({"role": "student"}),
        "total_courses": await db.courses.count_documents({}),
        "total_enrollments": await db.enrollments.count_documents({}),
        "pending_enrollments": await db.enrollments.count_documents({"status": "pending"}),
        "total_scholarship_apps": await db.scholarship_applications.count_documents({}),
        "total_job_apps": await db.job_applications.count_documents({}),
        "total_inquiries": await db.inquiries.count_documents({}),
        "total_jobs": await db.jobs.count_documents({}),
    }

# ---------- File Upload (Emergent Object Storage) ----------
@api.post("/upload")
async def upload(file: UploadFile = File(...)):
    ctype = file.content_type or "application/octet-stream"
    if ctype not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(415, f"Unsupported type {ctype}. Allowed: pdf, jpg, png, webp.")
    ext = ALLOWED_UPLOAD_TYPES[ctype]
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "File too large (max 10 MB)")
    if len(data) == 0:
        raise HTTPException(400, "Empty file")
    file_id = new_id()
    path = f"{APP_NAME}/uploads/{file_id}.{ext}"
    try:
        result = await put_object(path, data, ctype)
    except Exception as e:
        raise HTTPException(500, f"Upload failed: {e}")
    record = {
        "id": file_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": ctype,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": now_iso(),
    }
    await db.files.insert_one(record); record.pop("_id", None)
    record["url"] = f"/api/files/{file_id}"
    return record

@api.get("/files/{file_id}")
async def download_file(file_id: str):
    rec = await db.files.find_one({"id": file_id, "is_deleted": False}, {"_id": 0})
    if not rec:
        raise HTTPException(404, "File not found")
    try:
        data, ctype = await get_object(rec["storage_path"])
    except Exception as e:
        raise HTTPException(500, f"Storage error: {e}")
    return Response(content=data, media_type=rec.get("content_type") or ctype,
                    headers={"Content-Disposition": f'inline; filename="{rec["original_filename"]}"'})

# ---------- Scholarship admit card PDF ----------
@api.get("/scholarship-applications/{application_no}/admit-card")
async def admit_card(application_no: str):
    app_doc = await db.scholarship_applications.find_one({"application_no": application_no}, {"_id": 0})
    if not app_doc:
        raise HTTPException(404, "Application not found")
    # exam_date best effort from latest active scholarship campaign
    camp = await db.scholarships.find_one({"active": True}, {"_id": 0}, sort=[("created_at", -1)])
    exam_date = (camp or {}).get("exam_date", "TBA")
    pdf_bytes = admit_card_pdf(
        application_no=application_no,
        name=app_doc.get("name", ""),
        school=app_doc.get("school", ""),
        standard=app_doc.get("standard", ""),
        target_exam=app_doc.get("target_exam", ""),
        exam_date=exam_date,
        center=f"Northend {app_doc.get('city', 'Srinagar')}",
    )
    return Response(content=pdf_bytes, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="admit-card-{application_no}.pdf"'})


def export_excel(rows: list, sheet_name: str, filename: str):
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = sheet_name
    if rows:
        headers = list(rows[0].keys())
        ws.append(headers)
        for r in rows:
            ws.append([str(r.get(h, "")) for h in headers])
    else:
        ws.append(["No data"])
    buf = io.BytesIO(); wb.save(buf); buf.seek(0)
    return StreamingResponse(buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'})

@api.get("/admin/export/{kind}")
async def export(kind: str, _admin = Depends(require_admin)):
    mapping = {
        "enrollments": ("enrollments", "Enrollments"),
        "scholarship-applications": ("scholarship_applications", "Scholarships"),
        "job-applications": ("job_applications", "Jobs"),
        "inquiries": ("inquiries", "Inquiries"),
        "students": ("users", "Students"),
    }
    if kind not in mapping:
        raise HTTPException(404, "Unknown export kind")
    coll, name = mapping[kind]
    q = {"role": "student"} if kind == "students" else {}
    rows = await db[coll].find(q, {"_id": 0, "password_hash": 0}).to_list(5000)
    return export_excel(rows, name, f"{kind}.xlsx")

# ---------- Seed ----------
async def seed():
    # admin
    admin_email = os.environ.get("ADMIN_EMAIL").lower()
    admin_pwd = os.environ.get("ADMIN_PASSWORD")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": new_id(), "name": "Northend Admin", "email": admin_email,
            "phone": "+91-9999999999", "role": "admin",
            "password_hash": hash_password(admin_pwd),
            "created_at": now_iso(),
        })
    elif not verify_password(admin_pwd, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_pwd), "role": "admin"}})

    # centers
    if await db.centers.count_documents({}) == 0:
        kashmir_centers = [
            {"id": new_id(), "name": "Northend Srinagar", "city": "Srinagar", "address": "Lal Chowk, Srinagar, J&K 190001", "phone": "+91-9876500001", "timing": "8:00 AM – 8:00 PM", "lat": 34.0837, "lng": 74.7973},
            {"id": new_id(), "name": "Northend Anantnag", "city": "Anantnag", "address": "KP Road, Anantnag, J&K 192101", "phone": "+91-9876500002", "timing": "8:00 AM – 8:00 PM", "lat": 33.7311, "lng": 75.1487},
            {"id": new_id(), "name": "Northend Sopore", "city": "Sopore", "address": "Main Chowk, Sopore, J&K 193201", "phone": "+91-9876500003", "timing": "8:00 AM – 8:00 PM", "lat": 34.2871, "lng": 74.4663},
            {"id": new_id(), "name": "Northend Soura", "city": "Soura", "address": "Soura, Srinagar, J&K 190011", "phone": "+91-9876500004", "timing": "8:00 AM – 8:00 PM", "lat": 34.1396, "lng": 74.8005},
            {"id": new_id(), "name": "Northend Zakura", "city": "Zakura", "address": "Zakura, Srinagar, J&K 190006", "phone": "+91-9876500005", "timing": "8:00 AM – 8:00 PM", "lat": 34.1373, "lng": 74.8584},
            {"id": new_id(), "name": "Northend Parraypora", "city": "Parraypora", "address": "Parraypora, Srinagar, J&K 190015", "phone": "+91-9876500006", "timing": "8:00 AM – 8:00 PM", "lat": 34.0500, "lng": 74.7833},
        ]
        await db.centers.insert_many(kashmir_centers)

    # Drop courses that are not in the allowed category set (admin requested simplification)
    await db.courses.delete_many({"category": {"$nin": ALLOWED_CATEGORIES}})

    # courses (idempotent: insert any missing course titles)
    courses_data = [
        ("Class 11–12 NEET", "NEET", "24 months", 95000, "Comprehensive 2-year NEET preparation with Unacademy curriculum.", True, "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
         ["Physics", "Chemistry", "Botany", "Zoology", "NCERT Mastery", "Weekly Mock Tests"],
         ["Dr. A. Wani (Physics)", "Mr. R. Bhat (Chemistry)", "Ms. S. Kaur (Biology)"],
         ["1:30 mentor ratio", "Doubt clearing daily", "AIIMS-style test series", "Personal performance dashboard"]),
        ("IIT-JEE Main + Advanced", "IIT-JEE", "24 months", 105000, "Two-year integrated JEE Main + Advanced programme.", True, "https://images.pexels.com/photos/29534728/pexels-photo-29534728.jpeg?w=800",
         ["Mathematics", "Physics", "Chemistry", "Numerical Practice", "Past JEE Papers"],
         ["Mr. F. Lone (Maths)", "Dr. A. Wani (Physics)", "Mr. R. Bhat (Chemistry)"],
         ["Small batches of 30", "Olympiad-grade problem sets", "All-India test ranking", "Doubt sessions 6 days a week"]),
        ("Foundation 8th–10th", "Foundation", "12 months", 35000, "Strong academic foundation with Olympiad training.", False, "https://images.pexels.com/photos/6147219/pexels-photo-6147219.jpeg?w=800",
         ["Maths Foundation", "Science Foundation", "English", "Mental Ability", "Olympiad Prep"],
         ["Ms. M. Khan", "Mr. T. Rather"],
         ["NTSE & NSO support", "Concept-first teaching", "Weekly parent reports"]),
        ("CBSE Class 11–12 Sciences", "CBSE", "24 months", 40000, "CBSE-aligned programme for PCM / PCB streams with Boards-grade rigor.", True, "https://images.unsplash.com/photo-1555967522-37949fc21dcb?w=800",
         ["NCERT Mastery", "Sample Paper Drills", "Practical Lab Notes", "Pre-Board Tests"],
         ["Mr. F. Lone", "Dr. A. Wani", "Ms. S. Kaur"],
         ["100% NCERT coverage", "Boards + competitive integration", "Pre-board mock series"]),
        ("JKBOSE 12th Boards", "JKBOSE", "10 months", 22000, "Targeted JKBOSE board syllabus mastery for Kashmir students.", False, "https://images.pexels.com/photos/29534728/pexels-photo-29534728.jpeg?w=800",
         ["JKBOSE Textbooks", "Weekly Topic Tests", "Previous Year Papers", "Viva Practice"],
         ["Local Faculty Panel"],
         ["JKBOSE-pattern test series", "One-on-one revision plans", "Affordable monthly fee plans"]),
    ]
    for t, cat, dur, fee, desc, feat, img, syl, fac, feats in courses_data:
        existing = await db.courses.find_one({"title": t})
        if not existing:
            await db.courses.insert_one({
                "id": new_id(), "title": t, "category": cat, "duration": dur, "fee": fee,
                "description": desc, "syllabus": syl, "faculty": fac, "features": feats,
                "scholarship_available": True, "featured": feat, "image_url": img, "created_at": now_iso(),
            })
        else:
            # Backfill arrays for legacy seed rows that pre-date these fields
            patch = {}
            if not existing.get("features"): patch["features"] = feats
            if not existing.get("syllabus"): patch["syllabus"] = syl
            if not existing.get("faculty"): patch["faculty"] = fac
            if patch:
                await db.courses.update_one({"id": existing["id"]}, {"$set": patch})

    # notices
    if await db.notices.count_documents({}) == 0:
        notices = [
            ("New 2026 NEET Batch Launch", "Admissions open for the new NEET 2026 batch starting March 1.", "Admissions", True),
            ("Scholarship Test 2026", "Northend Scholarship Test on Feb 28 — up to 100% fee waiver.", "Scholarship", True),
            ("Foundation Olympiad Workshop", "Free 3-day Olympiad workshop for Class 8–10 students.", "Workshop", False),
        ]
        for t, c, cat, p in notices:
            await db.notices.insert_one({"id": new_id(), "title": t, "content": c, "category": cat, "pinned": p, "created_at": now_iso()})

    # results
    if await db.results.count_documents({}) == 0:
        results_data = [
            ("Aamir Hussain", "NEET 2025", "AIR 412", 2025, "NEET", "Cracked NEET in first attempt with Northend's guidance."),
            ("Zoya Bhat", "JEE Advanced 2025", "AIR 1108", 2025, "IIT-JEE", "From Anantnag to IIT Delhi — mentors made the difference."),
            ("Hamid Wani", "NEET 2024", "AIR 587", 2024, "NEET", "Dedicated faculty + structured tests = AIIMS dream realised."),
            ("Sahla Mir", "CUET 2024", "99.4 percentile", 2024, "CUET", "Got admission into Delhi University Hindu College."),
            ("Bilal Ahmad", "JEE Main 2025", "99.1 percentile", 2025, "IIT-JEE", "Best teaching ecosystem in Kashmir, hands down."),
            ("Iqra Jan", "NEET 2025", "AIR 1903", 2025, "NEET", "Northend made the impossible feel routine."),
        ]
        for n, e, r, y, c, q in results_data:
            await db.results.insert_one({
                "id": new_id(), "student_name": n, "exam": e, "rank": r, "year": y, "course": c,
                "photo_url": None, "quote": q, "created_at": now_iso()
            })

    # testimonials
    if await db.testimonials.count_documents({}) == 0:
        ts = [
            ("Insha Rather", "Parent", "Northend transformed my daughter's preparation. The faculty truly cares."),
            ("Rayaan Khan", "NEET Aspirant", "Best decision was joining Northend in Srinagar. Mock tests were spot on."),
            ("Mehak Lone", "JEE Aspirant", "Doubt clearing happens in real time — feels like a national coaching."),
        ]
        for n, role, q in ts:
            await db.testimonials.insert_one({"id": new_id(), "name": n, "role": role, "quote": q, "created_at": now_iso()})

    # jobs
    if await db.jobs.count_documents({}) == 0:
        jobs = [
            ("Physics Faculty (NEET/JEE)", "Academics", "Srinagar", "Full-time", "Senior physics educator for NEET/JEE batches.", ["M.Sc/Ph.D Physics", "3+ years coaching experience"], True),
            ("Counselor", "Admissions", "Anantnag", "Full-time", "Student counseling and parent interactions.", ["Graduate", "Excellent communication"], True),
            ("Floor Manager", "Operations", "Sopore", "Full-time", "Manage center operations and student discipline.", ["Graduate", "Leadership skills"], True),
            ("BDM (Business Dev. Manager)", "Business", "Srinagar", "Full-time", "Drive admissions and outreach across Kashmir.", ["MBA preferred", "5+ years in EdTech"], True),
            ("DTP Operator", "Production", "Srinagar", "Full-time", "Design study material and notices.", ["CorelDraw / InDesign expertise"], True),
        ]
        for t, d, l, ty, desc, req, a in jobs:
            await db.jobs.insert_one({"id": new_id(), "title": t, "department": d, "location": l, "type": ty, "description": desc, "requirements": req, "active": a, "created_at": now_iso()})

    # scholarship campaign
    if await db.scholarships.count_documents({}) == 0:
        await db.scholarships.insert_one({
            "id": new_id(), "title": "Northend Scholarship Test 2026 (NST)",
            "description": "Win up to 100% scholarship on tuition fees. Open for Class 8–12 students across Kashmir.",
            "exam_date": "2026-02-28", "deadline": "2026-02-25",
            "eligibility": "Students of Class 8 to 12 from any school in J&K.",
            "active": True, "created_at": now_iso(),
        })

    # indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)

# ---------- App wiring ----------
app.include_router(api)

frontend_url = os.environ.get("FRONTEND_URL", "")
allowed = ["http://localhost:3000"]
if frontend_url: allowed.append(frontend_url)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

@app.on_event("startup")
async def on_start():
    await seed()
    await init_storage()
    logging.info("Northend backend ready.")

@app.on_event("shutdown")
async def on_stop():
    await storage_aclose()
    client.close()
