import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, formatError, adminAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScholarshipNotificationButton from "../components/ScholarshipNotificationButton";
import { 
  Download, Trash2, Plus, Save, Terminal, GraduationCap, 
  ClipboardList, Briefcase, Building2, MessageSquare, 
  HelpCircle, Megaphone, Trophy, Search, Menu, X,
  Loader2, CheckCircle2, AlertCircle, Send, FileSpreadsheet,
  UploadCloud, PlaySquare, Filter, RefreshCw, Eye, ExternalLink,
  User, UserPlus, Printer, Wand2, Image, FileText, Users, Pencil,
  Bell
} from "lucide-react";
import ChipInput from "@/components/ChipInput";
import FileUpload from "@/components/FileUpload";
import { usePaged, Paginator } from "@/components/Paginator";
import WhatsAppInbox from "@/pages/WhatsAppInbox";
import WATHManagement from "@/pages/WATHManagement";
import AdminSchoolVisits from "@/pages/AdminSchoolVisits";
import CourseForm from "./admin/CourseForm";
import NoticeForm from "./admin/NoticeForm";
import JobForm from "./admin/JobForm";
import CenterForm from "./admin/CenterForm";
import TestimonialForm from "./admin/TestimonialForm";
import ResultForm from "./admin/ResultForm";
import GalleryForm from "./admin/GalleryForm";
import BlogPostForm from "./admin/BlogPostForm";
import CampaignFormPage from "@/pages/CampaignFormPage";
import EditApplicantDialog from "./admin/EditApplicantDialog";
import EditResultDialog from "./admin/EditResultDialog";
import BulkProgressModal from "./admin/BulkProgressModal";
import WhatsAppBroadcastModal from "./admin/WhatsAppBroadcastModal";
import AsyncBulkRegModal from "./admin/AsyncBulkRegModal";
import CampaignOperationsModal from "./admin/CampaignOperationsModal";
import NotificationCenter from "@/components/NotificationCenter.jsx";

const CATEGORIES = ["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

// 1. STANDARD CLASSES CONSTANT
const CLASSES = ["Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Dropper (JEE)", "Dropper (NEET)"];

// 2. NORMALIZATION HELPERS
const normalizeClass = (std, targetExam) => {
  if (!std) return "Unknown";
  // Strip whitespace & special characters for robust matching
  const s = String(std).toLowerCase().replace(/[^a-z0-9]/g, '');
  const t = String(targetExam || "").toLowerCase().replace(/[^a-z0-9]/g, '');

  if (s.includes("drop") || s.includes("repeat") || s.includes("13")) {
    if (s.includes("jee") || t.includes("jee")) return "Dropper (JEE)";
    return "Dropper (NEET)"; 
  }
  
  // Catch standard numbers, words, and Roman Numerals
  if (s.includes("12") || s.includes("twel") || s === "xii" || s === "classxii") return "Class 12";
  if (s.includes("11") || s.includes("elev") || s === "xi" || s === "classxi") return "Class 11";
  if (s.includes("10") || s.includes("ten") || s === "x" || s === "classx") return "Class 10";
  if (s.includes("9") || s.includes("nin") || s === "ix" || s === "classix") return "Class 9";
  if (s.includes("8") || s.includes("eigh") || s === "viii" || s === "classviii") return "Class 8";
  if (s.includes("7") || s.includes("seven") || s === "vii" || s === "classvii") return "Class 7";
  
  return std; // return original if no match
};

const normalizeVenue = (rawVenue) => {
  if (!rawVenue) return "Unassigned";
  const vLower = String(rawVenue).trim().toLowerCase();
  let venue = String(rawVenue).trim();
  
  if (vLower === "90 ft" || vLower === "90ft" || vLower === "srinagar") {
    return "90 FT";
  } else if (vLower !== "unassigned") {
    // Force Title Case (e.g. "ANANTNAG" -> "Anantnag")
    return venue.charAt(0).toUpperCase() + venue.slice(1).toLowerCase();
  }
  return "Unassigned";
};

const slugify = (text) => {
  const str = String(text || "").trim().toLowerCase();
  const cleaned = str.replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "post";
};

const SIDE_NAV = [
  { id: "enrollments", label: "Enrollments", icon: ClipboardList },
  { id: "wath", label: "WATH Management", icon: Trophy },
  { id: "scholarships", label: "Scholarships", icon: GraduationCap },
  { id: "chats", label: "WhatsApp Inbox", icon: MessageSquare },
  { id: "jobapps", label: "Job Applications", icon: Briefcase },
  { id: "courses", label: "Course Catalog", icon: Building2 },
  { id: "notices", label: "Bulletin Board", icon: Megaphone },
  { id: "jobs", label: "Careers Portal", icon: Briefcase },
  { id: "centers", label: "Hub Stations", icon: Building2 },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "results", label: "Honors Deck", icon: Trophy },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "inquiries", label: "Inquiries", icon: HelpCircle },
  { id: "push", label: "Push Notifications", icon: Bell },
  { id: "school-visits", label: "School Visits", icon: Building2 },
  { id: "school-students", label: "School Students", icon: Users },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "blog", label: "Blog", icon: FileText },
];

function StatCard({ label, value, icon: Icon, testId }) {
  return (
    <div className="glass-elevated p-4 sm:p-5 rounded-2xl border border-border bg-background/30 hover:bg-background/40 transition-all min-w-0 flex items-center justify-between" data-testid={testId}>
      <div className="min-w-0">
        <div className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold truncate">{label}</div>
        <div className="font-display text-2xl sm:text-3xl font-medium mt-1 text-foreground truncate">{value ?? 0}</div>
      </div>
      {Icon && (
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-accent shrink-0">
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}

function EmptyState({ title = "No records found", description = "Try refining your search query or clear filters." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass border border-border rounded-2xl bg-background/20 space-y-2">
      <AlertCircle className="text-muted-foreground/40" size={36} />
      <div className="font-medium text-foreground text-sm">{title}</div>
      <div className="text-xs text-muted-foreground max-w-xs">{description}</div>
    </div>
  );
}

function ExportBtn({ kind }) {
  const [loading, setLoading] = useState(false);
  const dl = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/export/${kind}`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; 
      a.download = `${kind}.xlsx`; 
      a.click(); 
      URL.revokeObjectURL(url);
    } catch (e) { 
      toast.error(formatError(e.response?.data?.detail) || e.message); 
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button size="sm" variant="outline" onClick={dl} disabled={loading} data-testid={`export-${kind}`} className="border-border rounded-xl text-xs px-2.5 sm:px-3 shrink-0 hover:bg-muted/50">
      {loading ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Download size={14} className="mr-1 sm:mr-1.5"/>} Excel
    </Button>
  );
}

const emptyCourse = { title:"", category:"NEET", duration:"", fee:0, description:"", syllabus:[], faculty:[], features:[], scholarship_available:true, featured:false, image_url:"" };

function SchoolStudentsTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scholarshipFilter, setScholarshipFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (scholarshipFilter) params.scholarship_id = scholarshipFilter;
      if (schoolFilter) params.school_id = schoolFilter;
      const { data } = await api.get("/admin/school-applications", { params });
      setRows(data || []);
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to load school applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [scholarshipFilter, schoolFilter]);

  const exportCsv = () => {
    if (!rows.length) return;
    const headers = ["Application No", "Name", "Phone", "Email", "School", "Class", "Course", "Campaign", "Status", "Date"];
    const csv = [
      headers.join(","),
      ...rows.map(r => [
        r.application_no, r.name, r.phone, r.email, r.school_name || r.school, r.standard, r.target_exam, r.scholarship_title || r.scholarship_id, r.status, r.created_at
      ].map(v => `"${String(v || "").replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "school_applications.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">School-Registered Students</h3>
        <div className="flex items-center gap-2">
          <input placeholder="Filter by school ID" value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)} className="border border-border rounded-lg px-3 py-2 bg-background text-xs" />
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={!rows.length} className="rounded-lg text-xs font-bold cursor-pointer">Export CSV</Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : rows.length === 0 ? (
        <EmptyState title="No school applications" description="Students uploaded via school portal will appear here." />
      ) : (
        <div className="glass border border-border rounded-2xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm min-w-[900px] table-auto">
              <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4 text-left bg-muted">App No</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Name</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Phone</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">School</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Class</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Course</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Campaign</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                  <th className="p-3 sm:p-4 text-left bg-muted">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground bg-background/20">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-3 sm:p-4 font-mono text-xs">{r.application_no}</td>
                    <td className="p-3 sm:p-4 font-medium">{r.name}</td>
                    <td className="p-3 sm:p-4 text-muted-foreground font-mono text-xs">{r.phone}</td>
                    <td className="p-3 sm:p-4 text-xs">{r.school_name || r.school || "-"}</td>
                    <td className="p-3 sm:p-4 text-xs">{r.standard}</td>
                    <td className="p-3 sm:p-4 text-xs">{r.target_exam}</td>
                    <td className="p-3 sm:p-4 text-xs truncate max-w-[200px]" title={r.scholarship_title || r.scholarship_id}>{r.scholarship_title || r.scholarship_id}</td>
                    <td className="p-3 sm:p-4 text-xs capitalize">{r.status}</td>
                    <td className="p-3 sm:p-4 text-xs text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("enrollments");
  const [summary, setSummary] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [scholarshipApps, setScholarshipApps] = useState([]);
  const [jobApps, setJobApps] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [centers, setCenters] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [results, setResults] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);
  const [busy, setBusy] = useState(false);
  const [innerSearch, setInnerSearch] = useState("");
  const [schKind, setSchKind] = useState("all");

  const [newNotice, setNewNotice] = useState({ title:"", content:"", category:"General", pinned:false });
  const [newJob, setNewJob] = useState({ title:"", department:"", location:"", type:"Full-time", description:"", requirements: [], active:true });
  const [newCenter, setNewCenter] = useState({ name:"", city:"", address:"", phone:"", timing:"8:00 AM – 8:00 PM", lat:34.0837, lng:74.7973 });
  const [newTestimonial, setNewTestimonial] = useState({ name:"", role:"", quote:"" });
  const [newResult, setNewResult] = useState({ student_name:"", exam:"", rank:"", year:new Date().getFullYear(), course:"NEET", photo_url:"", quote:"" });
  const handleCampaignTypeChange = (value) => {
    setNewCampaign(prev => ({
      ...prev,
      type: value,
      ...(value === "school"
        ? { description: "", exam_date: "", deadline: "", eligibility: "", available_venues: [], whatsapp_community_url: "", exam_time: "10:00 AM", total_marks: 100 }
        : { start_date: "", end_date: "", eligible_classes: [], time_slots: [] }),
    }));
  };

  const [newCampaign, setNewCampaign] = useState({ title:"", description:"", exam_date:"", deadline:"", eligibility:"", venue:"", available_venues: [], whatsapp_community_url:"", exam_time:"10:00 AM", total_marks:100, active:true, is_featured:false, type:"general", start_date:"", end_date:"", eligible_classes:[], time_slots:[] });
  const [newGallery, setNewGallery] = useState({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 });
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState("");
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ 
    title:"", slug:"", excerpt:"", content:"", category:"", tags:[], 
    author:"Admin", featured_image_url:"", image_alt:"", og_image_url:"", 
    meta_title:"", meta_description:"", status:"draft", visibility:"public", published_at:"" 
  });
  const [editingPostId, setEditingPostId] = useState(null);
  
  const [resultEditor, setResultEditor] = useState({});
  const [appEditor, setAppEditor] = useState({});
  
  const [operationsModalId, setOperationsModalId] = useState(null);
  const [broadcastModalId, setBroadcastModalId] = useState(null);
  
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkState, setBulkState] = useState({
    title: "",
    status: "idle",
    progress: 0,
    currentStep: "",
    details: [],
    error: null
  });

  const [asyncBulkRegId, setAsyncBulkRegId] = useState(null);

  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);
  const [applicantDialogAppNo, setApplicantDialogAppNo] = useState(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogId, setResultDialogId] = useState(null);

  const load = async () => {
    setLoadingData(true);
    try {
      const [s, e, sa, ja, iq, c, n, j, ce, ts, rs, g, p, acm] = await Promise.all([
        api.get("/admin/summary"), api.get("/enrollments"), api.get("/scholarship-applications"),
        api.get("/job-applications"), api.get("/inquiries"), api.get("/courses"),
        api.get("/notices"), api.get("/jobs/all"),
        api.get("/centers"), api.get("/testimonials"), api.get("/results"), api.get("/admin/gallery"), api.get("/admin/posts"),
        api.get("/admin/scholarships"),
      ]);
      setSummary(s.data || {}); setEnrollments(e.data || []); setScholarshipApps(sa.data || []);
      setJobApps(ja.data || []); setInquiries(iq.data || []); setCourses(c.data || []); setNotices(n.data || []); setJobs(j.data || []);
      setCenters(ce.data || []); setTestimonials(ts.data || []); setResults(rs.data || []); setGallery(g.data || []); setPosts(p.data || []); setAdminCampaigns(acm.data || []);
    } catch (err) { toast.error(formatError(err.response?.data?.detail) || err.message); }
    finally { setLoadingData(false); }
  };

  useEffect(() => { load(); }, []);

  const searchMatch = (obj, fields) => {
    if (!innerSearch.trim()) return true;
    const term = innerSearch.toLowerCase();
    return fields.some(f => String(obj[f] || "").toLowerCase().includes(term));
  };

  const filteredEnrollments = useMemo(() => enrollments.filter(x => searchMatch(x, ["name", "receipt_no", "phone", "center"])), [enrollments, innerSearch]);
  const filteredScholarships = useMemo(() => scholarshipApps.filter(x => searchMatch(x, ["name", "application_no", "email", "phone", "target_exam"]) && (schKind === "all" || (x.campaign_kind || "scholarship") === schKind)), [scholarshipApps, innerSearch, schKind]);
  const filteredJobApps = useMemo(() => jobApps.filter(x => searchMatch(x, ["name", "email", "qualification"])), [jobApps, innerSearch]);
  const filteredCourses = useMemo(() => courses.filter(x => searchMatch(x, ["title", "category", "description"])), [courses, innerSearch]);
  const filteredNotices = useMemo(() => notices.filter(x => searchMatch(x, ["title", "category", "content"])), [notices, innerSearch]);
  const filteredJobs = useMemo(() => jobs.filter(x => searchMatch(x, ["title", "department", "location"])), [jobs, innerSearch]);
  const filteredCenters = useMemo(() => centers.filter(x => searchMatch(x, ["name", "city", "address", "phone"])), [centers, innerSearch]);
  const filteredTestimonials = useMemo(() => testimonials.filter(x => searchMatch(x, ["name", "role", "quote"])), [testimonials, innerSearch]);
  const filteredResults = useMemo(() => results.filter(x => searchMatch(x, ["student_name", "exam", "rank", "course"])), [results, innerSearch]);
  const filteredCampaigns = useMemo(() => adminCampaigns.filter(x => searchMatch(x, ["title", "eligibility", "exam_date"])), [adminCampaigns, innerSearch]);
  const filteredInquiries = useMemo(() => inquiries.filter(x => searchMatch(x, ["name", "email", "subject", "message"])), [inquiries, innerSearch]);
  const filteredGallery = useMemo(() => gallery.filter(x => searchMatch(x, ["title", "description", "category"])), [gallery, innerSearch]);
  const galleryCategories = useMemo(() => Array.from(new Set(gallery.map(x => x.category).filter(Boolean))).sort(), [gallery]);
  const filteredPosts = useMemo(() => posts.filter(x => searchMatch(x, ["title", "excerpt", "category", "author", "status"])), [posts, innerSearch]);

  const enrPage = usePaged(filteredEnrollments, 25);
  const schPage = usePaged(filteredScholarships, 25);
  const jobPage = usePaged(filteredJobApps, 25);

  const updateStatus = async (kind, id, status) => {
    const map = { enr: "enrollments", sch: "scholarship-applications", job: "job-applications" };
    try { await api.put(`/${map[kind]}/${id}/status?status=${encodeURIComponent(status)}`); toast.success("Status updated"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };

  const saveCourse = async (data) => {
    setBusy(true);
    try {
      if (editingCourse?.id) {
        await api.put(`/courses/${editingCourse.id}`, data);
        toast.success("Course configuration synchronized");
      } else {
        await api.post("/courses", data);
        toast.success("New course framework deployed");
      }
      setEditingCourse(null); load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
    finally { setBusy(false); }
  };

  const deleteCourse = async (id) => { if (!confirm("Delete this course parameter?")) return; await api.delete(`/courses/${id}`); load(); };

  const saveResult = async (aid, payload) => {
    try {
      await api.put(`/scholarship-applications/${aid}/result`, {
        ...payload,
        marks_obtained: Number(payload.marks_obtained || 0),
        total_marks: Number(payload.total_marks || 100),
        rank: payload.rank ? Number(payload.rank) : null,
        percentile: payload.percentile ? Number(payload.percentile) : null,
        scholarship_percentage: Number(payload.scholarship_percentage || 0),
      });
      toast.success(payload.publish ? "Result published into student metrics loop" : "Draft saved");
      setResultEditor(prev => ({ ...prev, [aid]: undefined }));
      load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const saveAppDetails = async (appNo, payload) => {
    try {
      await api.put(`/scholarship-applications/${appNo}`, payload);
      toast.success("Applicant details & venue updated successfully");
      setAppEditor(prev => ({ ...prev, [appNo]: undefined }));
      load();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || e.message);
    }
  };

  const post = async (path, body, reset, label) => {
    try { await api.post(path, body); toast.success(`${label} record created`); reset && reset(); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const del = async (path, label) => { if (!confirm(`Delete this ${label}?`)) return; await api.delete(path); load(); };

  const setFeatured = async (kind, id) => {
    try { await api.post(`/admin/feature?kind=${kind}&id=${id}`); toast.success("Asset promoted to home layout"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };
  const clearFeatured = async () => {
    try { await api.post("/admin/feature?kind=clear&id=none"); toast.success("Cleared promotional flags"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const downloadAttendance = async (sid) => {
    try {
      const res = await api.get(`/admin/attendance/${sid}/export`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = `attendance-${sid}.xlsx`; 
      a.click(); 
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const regenerateToken = async (sid) => {
    if (!confirm("Rotate security authorization key hashes? Old examiner configurations will fail.")) return;
    try { await api.post(`/admin/scholarships/${sid}/regenerate-token`); toast.success("Tokens rotated cleanly"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const examinerLink = (token) => `${window.location.origin}/examiner?token=${token}`;
  const copy = (txt) => { navigator.clipboard?.writeText(txt); toast.success("Link copied safely"); };

  const downloadResultsTemplate = async (sid) => {
    try {
      const res = await api.get(`/admin/scholarships/${sid}/results-template`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = `results-template-${sid}.xlsx`; 
      a.click(); 
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const downloadBulkRegisterTemplate = async (sid) => {
    try {
      const res = await api.get(`/admin/scholarships/${sid}/bulk-register-template`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); 
      a.href = url; 
      a.download = `bulk-register-template-${sid}.xlsx`; 
      a.click(); 
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const bulkUploadResults = async (sid, file) => {
    setBulkState({
      title: "Bulk Results Upload",
      status: "uploading",
      progress: 25,
      currentStep: "Uploading spreadsheet file...",
      details: [{ label: "File Name", value: file.name }],
      error: null
    });
    setBulkModalOpen(true);

    try {
      const fd = new FormData(); fd.append("file", file);
      
      setBulkState((prev) => ({ 
        ...prev, 
        progress: 60, 
        status: "processing", 
        currentStep: "Parsing scores & compiling ranks..." 
      }));

      const { data } = await api.post(`/admin/scholarships/${sid}/bulk-results`, fd, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setBulkState((prev) => ({ ...prev, progress: Math.min(percentCompleted, 50) }));
        }
      });

      setBulkState({
        title: "Bulk Results Upload",
        status: "completed",
        progress: 100,
        currentStep: "Results Successfully Published",
        details: [
          { label: "File Name", value: file.name },
          { label: "Processed Rows", value: data.processed || 0 },
          { label: "Published Scores", value: data.published || 0 }
        ],
        error: null
      });

      toast.success(`Processed ${data.processed} · Published ${data.published}`);
      load();
    } catch (e) {
      const err = formatError(e.response?.data?.detail) || e.message;
      setBulkState((prev) => ({
        ...prev,
        status: "error",
        error: err
      }));
      toast.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 isolate w-screen h-[100dvh] min-h-0 flex flex-col lg:flex-row overflow-hidden select-none"
      role="region"
      aria-label="Admin Dashboard"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        minHeight: 0,
        margin: 0,
        padding: 0,
        zIndex: 40,
        background: "#ffffff",
        color: "#3C4952",
        visibility: "visible",
        opacity: 1,
        display: "flex",
      }}
    >
      <BulkProgressModal 
        isOpen={bulkModalOpen} 
        onClose={() => setBulkModalOpen(false)} 
        state={bulkState} 
      />

      <AsyncBulkRegModal 
        scholarshipId={asyncBulkRegId} 
        onClose={() => { setAsyncBulkRegId(null); load(); }} 
      />

      <WhatsAppBroadcastModal 
        scholarshipId={broadcastModalId}
        onClose={() => setBroadcastModalId(null)}
        allApps={scholarshipApps}
      />

      <CampaignOperationsModal 
        scholarshipId={operationsModalId}
        onClose={() => setOperationsModalId(null)}
        onDownloadResultsTemplate={downloadResultsTemplate}
        onUploadResults={bulkUploadResults}
        onDownloadRegTemplate={downloadBulkRegisterTemplate}
        onOpenBulkReg={setAsyncBulkRegId}
        onDownloadAttendance={downloadAttendance}
        allApps={scholarshipApps}
        onRefresh={load} 
      />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-muted/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" 
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 w-64 h-[100dvh] lg:h-full glass-elevated z-50 border-r border-border flex flex-col justify-between shrink-0 overflow-hidden transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="w-full shrink-0 flex flex-col">
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Northend Group</div>
              <div className="font-display text-lg sm:text-xl font-medium tracking-tight mt-0.5 text-foreground">Operations Engine</div>
            </div>
             <button type="button" onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground p-1 hover:text-foreground cursor-pointer" aria-label="Close navigation menu">
               <X size={20} />
             </button>
          </div>
          <div className="p-3 sm:p-4 border-b border-border bg-background/40">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">System Identity</div>
            <div className="font-medium mt-0.5 text-xs sm:text-sm text-foreground">Operations Admin Desk</div>
            <div className="text-[10px] text-accent font-mono mt-0.5 uppercase tracking-wider">LEVEL 0 ROOT ACCESS</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar min-h-0">
          {SIDE_NAV.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setInnerSearch(""); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--accent-rgb),0.12)] font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border shrink-0 bg-background/40">
          <button 
            onClick={() => navigate("/erp")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider text-accent border border-accent/20 bg-accent/5 hover:bg-accent/15 transition duration-200 cursor-pointer"
          >
            <Terminal size={14} className="shrink-0"/> <span>Launch ERP Hub</span>
          </button>
        </div>
      </aside>

      <div
        className="relative z-10 flex-1 min-w-0 w-full min-h-0 flex flex-col overflow-hidden"
        style={{ minWidth: 0, minHeight: 0, height: "100%", position: "relative" }}
      >
        <header
          className="relative z-30 shrink-0 px-4 sm:px-8 py-4 sm:py-6 border-b border-border backdrop-blur-md flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3"
          style={{ background: "rgba(255, 255, 255, 0.92)" }}
        >
          <div className="flex items-center gap-3 min-w-0">
             <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 border border-border rounded-xl lg:hidden text-foreground hover:bg-muted/50 shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-1.5 truncate">
                <span className="w-4 h-px bg-muted-foreground/50 hidden sm:inline-block shrink-0"/> Analytics Console Matrix
              </div>
              <h2 className="font-display text-xl sm:text-3xl font-light tracking-tight text-foreground truncate">
                Operations <span className="text-accent font-medium italic">Deck.</span>
              </h2>
            </div>
          </div>
          
           <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80 sm:shrink-0 min-w-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input 
                  type="text"
                  value={innerSearch}
                  onChange={e => setInnerSearch(e.target.value)}
                  placeholder="Search active tab records..."
                  className="w-full pl-9 pr-8 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground placeholder:text-muted-foreground/60"
                />
                {innerSearch && (
                  <button type="button" onClick={() => setInnerSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </div>
              <NotificationCenter />
              <Button size="icon" variant="outline" onClick={load} disabled={loadingData} className="rounded-xl border-border shrink-0 hover:bg-muted/50 cursor-pointer" aria-label="Refresh data">
               <RefreshCw size={14} className={loadingData ? "animate-spin" : ""} />
            </Button>
          </div>
        </header>

        <main className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6 min-w-0 custom-scrollbar overscroll-contain">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fadeIn">
            <StatCard label="Pipeline Students" value={summary.total_students} icon={GraduationCap} testId="stat-students"/>
            <StatCard label="Inbound Admissions" value={summary.total_enrollments} icon={ClipboardList} testId="stat-enrollments"/>
            <StatCard label="Scholarship Drives" value={summary.total_scholarship_apps} icon={Trophy} testId="stat-sch"/>
            <StatCard label="Talent Profiles" value={summary.total_job_apps} icon={Briefcase} testId="stat-jobs"/>
          </div>

          <div className="w-full min-w-0">
            {activeTab === "enrollments" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Inbound Admissions Registry</h3>
                  <ExportBtn kind="enrollments"/>
                </div>
                {filteredEnrollments.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="glass border border-border rounded-2xl overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm min-w-[650px] table-auto">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3 sm:p-4 text-left bg-muted">Receipt</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Name</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Phone Line</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Station Center</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground bg-background/20">
                          {enrPage.pageItems.map((e) => (
                            <tr key={e.id} className="hover:bg-muted/50 transition-colors">
                              <td className="p-3 sm:p-4 font-mono text-xs font-semibold">{e.receipt_no}</td>
                              <td className="p-3 sm:p-4 font-bold">{e.name}</td>
                              <td className="p-3 sm:p-4 font-mono text-xs text-muted-foreground">{e.phone}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground truncate">{e.center}</td>
                              <td className="p-3 sm:p-4">
                                <select value={e.status} onChange={ev => updateStatus("enr", e.id, ev.target.value)} className="text-xs font-bold uppercase border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none cursor-pointer" aria-label="Update enrollment status">
                                  <option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 pb-4"><Paginator {...enrPage} testid="enrollments-paginator"/></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "chats" && (
              <div className="space-y-4 animate-fadeIn" data-testid="admin-chats-tab">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display font-medium text-lg sm:text-xl text-foreground">WhatsApp Inbox</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Reply to incoming messages · linked to WATH applicants automatically</p>
                  </div>
                </div>
                <WhatsAppInbox />
              </div>
            )}

            {activeTab === "wath" && (
              <div className="animate-fadeIn" data-testid="admin-wath-tab">
                <WATHManagement />
              </div>
            )}

            {activeTab === "scholarships" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Scholarship Processing Queue</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={schKind}
                      onChange={e => setSchKind(e.target.value)}
                      className="text-xs font-bold uppercase tracking-wider border border-border rounded-xl px-3 py-2 bg-background text-foreground cursor-pointer focus:outline-none focus:border-accent"
                      data-testid="scholarship-kind-filter"
                      aria-label="Filter scholarship programmes"
                    >
                      <option value="all">All programmes</option>
                      <option value="wath">WATH</option>
                      <option value="carnival">WATH Carnival</option>
                      <option value="scholarship">Scholarship</option>
                    </select>
                    <ExportBtn kind="scholarship-applications"/>
                  </div>
                </div>
                {filteredScholarships.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-3">
                    {schPage.pageItems.map((a) => {
                      const editing = resultEditor[a.id];
                      const r = editing || { marks_obtained: a.result_marks_obtained ?? "", total_marks: a.result_total_marks ?? 100, rank: a.result_rank ?? "", percentile: a.result_percentile ?? "", scholarship_percentage: a.result_scholarship_percentage ?? 0, remarks: a.result_remarks ?? "", publish: a.result_published ?? false };
                      
                      const editingApp = appEditor[a.application_no];
                      const appData = editingApp || { name: a.name || "", email: a.email || "", phone: a.phone || "", school: a.school || "", standard: a.standard || "", target_exam: a.target_exam || "", city: a.city || "", venue: a.venue || "" };

                      return (
                        <div key={a.id} className="glass border border-border rounded-2xl bg-background/40 p-4 transition hover:border-border" data-testid={`adm-sch-${a.id}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-mono text-xs text-muted-foreground/60 truncate">App No: {a.application_no}</div>
                              <div className="font-bold text-foreground text-sm sm:text-base break-words">
                                {a.name} <span className="text-xs font-normal text-muted-foreground">· {a.standard} · Target: {a.target_exam}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                {a.email} · <span className="font-mono">{a.phone}</span>
                              </div>
                              <div className="text-xs font-medium text-muted-foreground mt-0.5 flex gap-1">
                                Venue/School: <span className="text-emerald-600 font-bold">{a.venue || a.city}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                              {a.result_published && <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-0.5 rounded-md font-bold">Published</span>}
                              <select value={a.status} onChange={ev => updateStatus("sch", a.id, ev.target.value)} className="text-xs font-bold uppercase border border-border rounded-lg px-2.5 py-1 bg-background text-foreground cursor-pointer" aria-label="Update scholarship status"><option>pending</option><option>approved</option><option>rejected</option></select>
                              
                              <Button size="sm" variant="outline" onClick={() => { setApplicantDialogAppNo(a.application_no); setApplicantDialogOpen(true); }} className="rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer">
                                Edit Info
                              </Button>

                              <Button size="sm" variant="outline" onClick={() => { setResultDialogId(a.id); setResultDialogOpen(true); }} data-testid={`toggle-result-${a.id}`} className="rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer">
                                {editing ? "Close Score" : (a.result_published ? "Edit Score" : "Log Result")}
                              </Button>
                            </div>
                          </div>
                        </div>
                       );
                      })}
                      <EditApplicantDialog
                       open={applicantDialogOpen}
                       appNo={applicantDialogAppNo}
                       appData={(() => {
                         if (!applicantDialogAppNo) return null;
                         const app = filteredScholarships.find(s => s.application_no === applicantDialogAppNo);
                         if (!app) return null;
                         const editingApp2 = appEditor[app.application_no];
                         return editingApp2 || { name: app.name || "", email: app.email || "", phone: app.phone || "", school: app.school || "", standard: app.standard || "", target_exam: app.target_exam || "", city: app.city || "", venue: app.venue || "" };
                       })()}
                       onClose={() => { setApplicantDialogOpen(false); setApplicantDialogAppNo(null); }}
                       onSave={saveAppDetails}
                     />
                     <EditResultDialog
                       open={resultDialogOpen}
                       resultId={resultDialogId}
                       resultData={(() => {
                         if (!resultDialogId) return null;
                         const res = filteredScholarships.find(s => s.id === resultDialogId);
                         if (!res) return null;
                         const editing2 = resultEditor[res.id];
                         return editing2 || { marks_obtained: res.result_marks_obtained ?? "", total_marks: res.result_total_marks ?? 100, rank: res.result_rank ?? "", percentile: res.result_percentile ?? "", scholarship_percentage: res.result_scholarship_percentage ?? 0, remarks: res.result_remarks ?? "", publish: res.result_published ?? false };
                       })()}
                       onClose={() => { setResultDialogOpen(false); setResultDialogId(null); setResultEditor(prev => ({ ...prev, [resultDialogId]: undefined })); }}
                       onSave={saveResult}
                     />
                    <Paginator {...schPage} testid="scholarships-paginator"/>
                  </div>
                )}
              </div>
            )}

            {activeTab === "jobapps" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Talent Recruitment Applications</h3>
                  <ExportBtn kind="job-applications"/>
                </div>
                {filteredJobApps.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="glass border border-border rounded-2xl overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm min-w-[650px] table-auto">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3 sm:p-4 text-left bg-muted">Applicant Name</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Email Endpoint</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Qualification</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Dossier Sheet</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground bg-background/20">
                          {jobPage.pageItems.map((a) => (
                            <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                              <td className="p-3 sm:p-4 font-bold text-foreground">{a.name}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground font-mono text-xs">{a.email}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground truncate">{a.qualification}</td>
                              <td className="p-3 sm:p-4">{a.resume_url ? <a href={a.resume_url} target="_blank" rel="noreferrer" className="text-accent underline font-semibold text-xs uppercase tracking-wider">View Resume</a> : "—"}</td>
                              <td className="p-3 sm:p-4">
                                <select value={a.status} onChange={ev => updateStatus("job", a.id, ev.target.value)} className="text-xs font-bold uppercase border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none cursor-pointer" aria-label="Update job application status">
                                  <option>received</option><option>shortlisted</option><option>rejected</option><option>hired</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 pb-4"><Paginator {...jobPage} testid="jobapps-paginator"/></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Course Catalog Matrix</h3>
                  {!editingCourse && <Button onClick={() => setEditingCourse({})} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 cursor-pointer"><Plus size={14} className="mr-1.5"/>Add Custom Course</Button>}
                </div>
                {editingCourse && <div className="mb-6"><CourseForm initial={editingCourse} onCancel={() => setEditingCourse(null)} onSave={saveCourse} busy={busy}/></div>}
                {filteredCourses.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.map((c) => (
                      <div key={c.id} className="border border-border bg-background/30 p-4 sm:p-5 rounded-2xl flex flex-col justify-between group hover:border-accent/30 transition duration-300 min-w-0" data-testid={`course-row-${c.id}`}>
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{c.category}</div>
                              <h4 className="font-bold text-foreground text-base sm:text-lg break-words mt-1">{c.title}</h4>
                              <div className="text-xs text-muted-foreground font-mono mt-1">{c.duration} · ₹{c.fee?.toLocaleString()}</div>
                            </div>
                            <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="outline" onClick={() => setEditingCourse(c)} className="rounded-lg text-xs font-bold cursor-pointer">Edit</Button>
                              <Button size="sm" variant="outline" onClick={() => deleteCourse(c.id)} className="rounded-lg text-xs text-rose-600 border-transparent hover:border-rose-500/20 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1 border-t border-border pt-3">
                          {(c.features || []).slice(0, 3).map((f) => <span key={f} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-muted/50 border border-border px-2.5 py-0.5 rounded-md text-muted-foreground">{f}</span>)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "notices" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Board Notices</div>
                <NoticeForm onSubmit={(data) => post("/notices", data, () => setNewNotice({title:"",content:"",category:"General",pinned:false}), "Notice")} />
                {filteredNotices.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-2">
                    {filteredNotices.map((n) => (
                      <div key={n.id} className={`border ${n.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-border bg-background/30"} p-4 rounded-2xl flex items-center justify-between gap-4`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{n.category}</div>
                            {n.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Featured</span>}
                          </div>
                          <div className="font-bold text-foreground text-base mt-1 truncate">{n.title}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button size="sm" variant={n.is_featured ? "default" : "outline"} onClick={() => n.is_featured ? clearFeatured() : setFeatured("notice", n.id)} className="rounded-xl text-xs font-bold cursor-pointer">{n.is_featured ? "Demote" : "Feature"}</Button>
                          <Button size="sm" variant="outline" onClick={() => del(`/notices/${n.id}`, "notice")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Job Openings Matrix</div>
                <JobForm onSubmit={(data) => post("/jobs", { ...data, requirements: data.requirements.length ? data.requirements : ["Graduate"] }, () => setNewJob({title:"",department:"",location:"",type:"Full-time",description:"",requirements:[],active:true}), "Job")} />
                {filteredJobs.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-2">
                    {filteredJobs.map((j) => (
                      <div key={j.id} className={`border ${j.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-border bg-background/30"} p-4 rounded-2xl flex items-center justify-between gap-4`}>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-foreground text-base">{j.title}</div>
                            {j.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Active</span>}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{j.department} · {j.location}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button size="sm" variant={j.is_featured ? "default" : "outline"} onClick={() => j.is_featured ? clearFeatured() : setFeatured("job", j.id)} className="rounded-xl text-xs font-bold cursor-pointer">{j.is_featured ? "Demote" : "Feature"}</Button>
                          <Button size="sm" variant="outline" onClick={() => del(`/jobs/${j.id}`, "job")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "centers" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Regional Center Desks</div>
                <CenterForm onSubmit={(data) => post("/centers", data, () => setNewCenter({name:"",city:"",address:"",phone:"",timing:"8:00 AM – 8:00 PM",lat:34.0837,lng:74.7973}), "Center")} />
                {filteredCenters.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCenters.map((c) => (
                      <div key={c.id} className="border border-border bg-background/30 p-4 rounded-2xl flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{c.city}</div>
                          <div className="font-bold text-foreground text-base mt-0.5">{c.name}</div>
                          <div className="text-xs text-muted-foreground mt-1.5">{c.address} · <span className="font-mono">{c.phone}</span></div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => del(`/centers/${c.id}`, "center")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Feedback Reviews Board</div>
                <TestimonialForm onSubmit={(data) => post("/testimonials", data, () => setNewTestimonial({name:"",role:"",quote:""}), "Testimonial")} />
                {filteredTestimonials.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTestimonials.map((t) => (
                      <div key={t.id} className="border border-border bg-background/30 p-5 rounded-2xl flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-muted/50 border border-border rounded text-accent inline-block">{t.role}</div>
                          <div className="font-bold text-foreground text-base mt-2">{t.name}</div>
                          <div className="text-sm text-muted-foreground/80 mt-2 italic">"{t.quote}"</div>
                        </div>
                        <div className="flex justify-end pt-3 border-t border-border mt-3">
                          <Button size="sm" variant="outline" onClick={() => del(`/testimonials/${t.id}`, "testimonial")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "results" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Honors Board Toppers Matrix</div>
                <ResultForm onSubmit={(data) => post("/results", { ...data, year: Number(data.year) }, () => setNewResult({student_name:"",exam:"",rank:"",year:new Date().getFullYear(),course:"NEET",photo_url:"",quote:""}), "Result")} />
                {filteredResults.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="glass border border-border rounded-2xl overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm min-w-[650px] table-auto">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                          <tr><th className="p-3 sm:p-4 text-left bg-muted">Topper Identity</th><th className="p-3 sm:p-4 text-left bg-muted">Examination Scale</th><th className="p-3 sm:p-4 text-left bg-muted">Rank Secured</th><th className="p-3 sm:p-4 text-left bg-muted">Year</th><th className="p-3 sm:p-4 text-left bg-muted">Syllabus Track</th><th className="p-3 sm:p-4 text-right bg-muted"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground bg-background/20">
                          {filteredResults.map((r) => (
                            <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                              <td className="p-3 sm:p-4 font-bold text-foreground">{r.student_name}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground">{r.exam}</td>
                              <td className="p-3 sm:p-4 text-accent font-bold tracking-wide font-mono">{r.rank}</td>
                              <td className="p-3 sm:p-4 font-mono text-xs text-muted-foreground">{r.year}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground">{r.course}</td>
                              <td className="p-3 sm:p-4 text-right">
                                <Button size="sm" variant="outline" onClick={() => del(`/results/${r.id}`, "result")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Gallery Studio</div>
                <GalleryForm
                  onSubmit={(payload) => post("/admin/gallery", payload, () => setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 }), "Gallery item")}
                  onUpdate={(id, payload) => api.put(`/admin/gallery/${id}`, payload).then(() => { toast.success("Gallery item updated"); setEditingGalleryId(null); setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 }); load(); }).catch(err => toast.error(formatError(err.response?.data?.detail)))}
                  editingId={editingGalleryId}
                  galleryCategories={galleryCategories}
                  previewMediaUrl={newGallery.media_url}
                  mediaType={newGallery.media_type}
                  onMediaTypeChange={(val) => setNewGallery({...newGallery, media_type: val})}
                  onMediaUrlClear={() => setNewGallery({...newGallery, media_url: ""})}
                />
                {filteredGallery.length === 0 ? (
                  <EmptyState title="No gallery items" description="Add your first image, video, or paragraph to get started." />
                ) : (
                  <div className="space-y-6">
                    {galleryCategories.map((cat) => {
                      const items = filteredGallery.filter(x => x.category === cat || (!x.category && cat === "Uncategorised"));
                      if (items.length === 0) return null;
                      return (
                        <div key={cat} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg font-medium">{cat}</h3>
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{items.length} items</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                              <div key={item.id} className="border border-border bg-background/30 rounded-2xl p-4 flex flex-col gap-3">
                                <div className="aspect-video rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center">
                                  {item.media_type === "video" && item.media_url ? (
                                    <video src={item.media_url} controls className="w-full h-full object-cover" />
                                  ) : item.media_type === "text" ? (
                                    <p className="text-xs text-muted-foreground p-3 line-clamp-4 whitespace-pre-wrap">{item.description || item.title}</p>
                                  ) : item.media_url ? (
                                    <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <Image size={32} className="text-muted-foreground/40" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-foreground text-sm">{item.title}</div>
                                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">{item.media_type} {item.category ? `· ${item.category}` : ""}</div>
                                </div>
                                <div className="flex justify-end pt-2 border-t border-border">
                                  <div className="inline-flex gap-1.5">
                                    <Button size="sm" variant="outline" onClick={() => { setEditingGalleryId(item.id); setNewGallery(item); }} className="rounded-xl border-transparent text-primary hover:bg-primary/5 cursor-pointer"><Eye size={14}/></Button>
                                    <Button size="sm" variant="outline" onClick={() => del(`/admin/gallery/${item.id}`, "gallery item")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === "blog" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Blog Studio</div>
                <BlogPostForm onSubmit={(payload) => post("/admin/posts", payload, () => setNewPost({ title:"", slug:"", excerpt:"", content:"", category:"", tags:[], author:"Admin", featured_image_url:"", image_alt:"", og_image_url:"", meta_title:"", meta_description:"", status:"draft", visibility:"public", published_at:"" }), "Post")} />
                {filteredPosts.length === 0 ? (
                  <EmptyState title="No posts" description="Create your first blog post to get started." />
                ) : (
                  <div className="glass border border-border rounded-2xl overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm min-w-[900px] table-auto">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                          <tr><th className="p-3 sm:p-4 text-left bg-muted">Title</th><th className="p-3 sm:p-4 text-left bg-muted">Category</th><th className="p-3 sm:p-4 text-left bg-muted">Author</th><th className="p-3 sm:p-4 text-left bg-muted">Status</th><th className="p-3 sm:p-4 text-left bg-muted">Visibility</th><th className="p-3 sm:p-4 text-left bg-muted">Published</th><th className="p-3 sm:p-4 text-right bg-muted"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground bg-background/20">
                          {filteredPosts.map((p) => (
                            <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                              <td className="p-3 sm:p-4 font-bold text-foreground">{p.title}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground">{p.category || "—"}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground">{p.author}</td>
                              <td className="p-3 sm:p-4"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === "published" ? "bg-accent/10 text-accent border border-accent/20" : "bg-muted/50 text-muted-foreground border border-border"}`}>{p.status}</span></td>
                              <td className="p-3 sm:p-4 text-muted-foreground capitalize">{p.visibility}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground">{p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}</td>
                              <td className="p-3 sm:p-4 text-right">
                                <div className="inline-flex gap-1.5">
                                  <Button size="sm" variant="outline" onClick={() => { setEditingPostId(p.id); setNewPost(p); }} className="rounded-xl border-transparent text-primary hover:bg-primary/5 cursor-pointer"><Eye size={14}/></Button>
                                  <Button size="sm" variant="outline" onClick={() => del(`/admin/posts/${p.id}`, "post")} className="rounded-xl border-transparent text-rose-600 hover:bg-rose-500/5 cursor-pointer"><Trash2 size={14}/></Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "campaigns" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-display font-bold text-xl text-foreground">Scholarship Campaigns Drivers</div>
                  <Button size="sm" onClick={() => navigate("/admin/campaigns/new")} className="rounded-lg text-xs font-bold bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">New Campaign</Button>
                </div>
                
                {filteredCampaigns.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-4">
                    {filteredCampaigns.map((c) => (
                      <div key={c.id} className={`border ${c.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-border bg-background/30"} p-5 rounded-2xl transition duration-200`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="text-xs uppercase font-bold tracking-widest text-accent font-mono">{c.active ? "LIVE PROFILE" : "ARCHIVED RECORD"}</div>
                              {c.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Top Showcase</span>}
                            </div>
                            <div className="font-bold text-foreground text-lg mt-1">{c.title}</div>
                             <div className="text-xs text-muted-foreground mt-1">Slot: <span className="font-semibold text-foreground">{c.exam_date}</span> {c.exam_time ? `at ${c.exam_time}` : ""} · Expiration Lock: <span className="font-semibold text-foreground font-mono">{c.deadline}</span></div>
                             {(c.start_date || c.end_date) && (
                               <div className="text-xs text-muted-foreground mt-1">Campaign Duration: <span className="font-semibold text-foreground">{c.start_date || "..."}</span> → <span className="font-semibold text-foreground">{c.end_date || "..."}</span></div>
                             )}
                             {c.eligible_classes && c.eligible_classes.length > 0 && (
                               <div className="flex flex-wrap gap-1 mt-1.5">
                                 {c.eligible_classes.map(cls => <span key={cls} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">{cls}</span>)}
                               </div>
                             )}
                             {(c.available_venues || []).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2.5">
                                {c.available_venues.map((v) => <span key={v} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-muted/50 px-2.5 py-0.5 border border-border rounded text-muted-foreground">{v}</span>)}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1.5 shrink-0 w-full sm:w-auto">
                            <Button size="sm" variant="default" onClick={() => navigate(`/admin/scholarships/${c.slug || c.id}/dashboard`)} className="rounded-lg text-xs font-bold bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer" data-testid={`campaign-dashboard-${c.id}`}>Dashboard</Button>
                            
                            <Button size="sm" variant="outline" onClick={() => navigate(`/admin/campaigns/${c.id}/edit`)} className="rounded-lg text-xs font-bold cursor-pointer">
                              <Pencil size={13} className="mr-1.5"/> Edit
                            </Button>

                            <Button size="sm" onClick={() => setBroadcastModalId(c.id)} className="rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20b858] text-black cursor-pointer shadow-md">
                              <MessageSquare size={13} className="mr-1.5"/> Broadcast
                            </Button>

                            <Button size="sm" variant="outline" onClick={() => setOperationsModalId(c.id)} className="rounded-lg text-xs font-bold text-accent border-accent/20 hover:bg-accent/5 cursor-pointer">
                              <Terminal size={13} className="mr-1.5"/> Operations
                            </Button>

                            <Button size="sm" variant={c.is_featured ? "default" : "outline"} onClick={() => c.is_featured ? clearFeatured() : setFeatured("scholarship", c.id)} className="rounded-lg text-xs font-bold cursor-pointer">Promote</Button>
                            <Button size="sm" variant="outline" onClick={() => del(`/scholarships/${c.id}`, "campaign")} className="rounded-lg text-xs border-transparent text-rose-600 hover:bg-rose-500/5 col-span-2 sm:col-span-1 cursor-pointer"><Trash2 size={13}/></Button>
                          </div>
                        </div>

                        {c.examiner_token && (
                          <div className="mt-4 pt-4 border-t border-border bg-background/40 -mx-5 -mb-5 px-5 py-4 rounded-b-2xl">
                            <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5">Independent Evaluation Gateway Link</div>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <code className="glass-elevated px-3 py-1.5 rounded-lg border border-border break-all flex-1 font-mono text-emerald-600 font-medium">{examinerLink(c.examiner_token)}</code>
                              <Button size="sm" variant="outline" onClick={() => copy(examinerLink(c.examiner_token))} className="rounded-lg text-xs font-bold cursor-pointer">Copy Link</Button>
                              <Button size="sm" variant="outline" onClick={() => regenerateToken(c.id)} className="rounded-lg text-xs font-bold text-muted-foreground cursor-pointer">Rotate Token</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "inquiries" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center gap-2">
                  <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Marketing &amp; Support Inquiries</h3>
                  <ExportBtn kind="inquiries"/>
                </div>
                {filteredInquiries.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="glass border border-border rounded-2xl overflow-hidden w-full">
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-sm min-w-[650px] table-auto">
                        <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider">
                          <tr>
                            <th className="p-3 sm:p-4 text-left bg-muted">Identity contact</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Email Address</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Subject Parameter</th>
                            <th className="p-3 sm:p-4 text-left bg-muted">Message Context Body</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-foreground bg-background/20">
                          {filteredInquiries.map((i) => (
                            <tr key={i.id} className="hover:bg-muted/50 transition-colors">
                              <td className="p-3 sm:p-4 font-bold text-foreground whitespace-nowrap">{i.name}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground font-mono text-xs whitespace-nowrap">{i.email}</td>
                              <td className="p-3 sm:p-4 text-foreground font-medium truncate" title={i.subject}>{i.subject}</td>
                              <td className="p-3 sm:p-4 text-muted-foreground/80 leading-relaxed max-w-sm truncate" title={i.message}>{i.message}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

             {activeTab === "push" && (
               <div className="space-y-4 animate-fadeIn">
                 <div className="flex justify-between items-center gap-2">
                   <h3 className="font-display font-medium text-lg sm:text-xl text-foreground truncate">Push Notifications</h3>
                 </div>
                 <div className="glass border border-border rounded-2xl p-4 sm:p-6 space-y-4">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
                       <input
                         id="push-title"
                         className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
                         placeholder="Notification title"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target</label>
                       <select
                         id="push-target"
                         className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
                       >
                         <option value="all">All Users</option>
                         <option value="admin">Admins</option>
                         <option value="student">Students</option>
                       </select>
                     </div>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
                     <textarea
                       id="push-message"
                       rows={4}
                       className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40 resize-y"
                       placeholder="Notification message"
                     />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Redirect URL (optional)</label>
                       <input
                         id="push-url"
                         className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
                         placeholder="/admin or /notices"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Image URL (optional)</label>
                       <input
                         id="push-image"
                         className="w-full border border-border rounded-xl bg-background/50 px-3 py-2 text-sm focus:outline-none focus:border-accent/40"
                         placeholder="https://example.com/image.png"
                       />
                     </div>
                   </div>
                   <div className="flex justify-end">
                     <Button
                       id="push-send-btn"
                       onClick={async () => {
                         const title = document.getElementById("push-title").value.trim();
                         const message = document.getElementById("push-message").value.trim();
                         const target = document.getElementById("push-target").value;
                         const url = document.getElementById("push-url").value.trim() || undefined;
                         const image = document.getElementById("push-image").value.trim() || undefined;
                         if (!title || !message) {
                           toast.error("Title and message are required");
                           return;
                         }
                         try {
                           await adminAPI.sendPushNotification({ title, message, target, url, image });
                           toast.success("Push notification sent");
                           document.getElementById("push-title").value = "";
                           document.getElementById("push-message").value = "";
                           document.getElementById("push-url").value = "";
                           document.getElementById("push-image").value = "";
                         } catch (e) {
                           toast.error(formatError(e));
                         }
                       }}
                       className="rounded-xl cursor-pointer"
                     >
                       <Send size={16} className="mr-2" /> Send Push
                     </Button>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === "school-visits" && (
               <AdminSchoolVisits />
             )}

            {activeTab === "school-students" && (
              <SchoolStudentsTab />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}