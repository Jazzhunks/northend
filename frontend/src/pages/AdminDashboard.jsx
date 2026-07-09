import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, formatError, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Download, Trash2, Plus, Save, Terminal, GraduationCap, 
  ClipboardList, Briefcase, Building2, MessageSquare, 
  HelpCircle, Megaphone, Trophy, Search 
} from "lucide-react";
import ChipInput from "@/components/ChipInput";

const CATEGORIES = ["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

const SIDE_NAV = [
  { id: "enrollments", label: "Enrollments", icon: ClipboardList },
  { id: "scholarships", label: "Scholarships", icon: GraduationCap },
  { id: "jobapps", label: "Job Applications", icon: Briefcase },
  { id: "courses", label: "Course Catalog", icon: Building2 },
  { id: "notices", label: "Bulletin Board", icon: Megaphone },
  { id: "jobs", label: "Careers Portal", icon: Briefcase },
  { id: "centers", label: "Hub Stations", icon: Building2 },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "results", label: "Honors Deck", icon: Trophy },
  { id: "campaigns", label: "Campaigns", icon: Megaphone },
  { id: "inquiries", label: "Inquiries", icon: HelpCircle },
];

// --- ADDED STATIC CARD HELPER SEGMENT MATRIX ---
function StatCard({ label, value, testId }) {
  return (
    <div className="glass-elevated p-5 rounded-2xl border border-white/5 bg-background/20" data-testid={testId}>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">{label}</div>
      <div className="font-display text-3xl font-medium mt-1.5 text-foreground">{value}</div>
    </div>
  );
}

function ExportBtn({ kind }) {
  const dl = async () => {
    try {
      const tok = localStorage.getItem("nw_token");
      const res = await fetch(`${API_BASE}/admin/export/${kind}`, {
        credentials: "include",
        headers: tok ? { Authorization: `Bearer ${tok}` } : {},
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${kind}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error(e.message); }
  };
  return <Button size="sm" variant="outline" onClick={dl} data-testid={`export-${kind}`} className="border-white/10 rounded-xl"><Download size={14} className="mr-1.5"/>Excel</Button>;
}

const emptyCourse = { title:"", category:"NEET", duration:"", fee:0, description:"", syllabus:[], faculty:[], features:[], scholarship_available:true, featured:false, image_url:"" };

function CourseForm({ initial, onCancel, onSave, busy }) {
  const [c, setC] = useState(initial || emptyCourse);
  const submit = (e) => { e.preventDefault(); onSave({ ...c, fee: Number(c.fee) }); };
  return (
    <form onSubmit={submit} className="glass-elevated p-6 rounded-2xl bg-background border border-white/10 grid sm:grid-cols-2 gap-4 animate-fadeIn" data-testid="course-form">
      <Input placeholder="Title" value={c.title} onChange={e=>setC({...c, title:e.target.value})} required data-testid="cf-title" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
      <select className="border border-white/10 rounded-xl px-3 py-2 bg-background text-sm focus:outline-none focus:border-accent text-foreground font-medium" value={c.category} onChange={e=>setC({...c, category:e.target.value})} data-testid="cf-cat">
        {CATEGORIES.map(x=><option key={x} className="bg-background text-foreground">{x}</option>)}
      </select>
      <Input placeholder="Duration (e.g. 12 months)" value={c.duration} onChange={e=>setC({...c, duration:e.target.value})} required data-testid="cf-dur" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
      <Input placeholder="Fee in ₹" type="number" value={c.fee} onChange={e=>setC({...c, fee:e.target.value})} required data-testid="cf-fee" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
      <Input placeholder="Banner image URL" value={c.image_url || ""} onChange={e=>setC({...c, image_url:e.target.value})} className="sm:col-span-2 rounded-xl border-white/10 bg-background/50 text-foreground" data-testid="cf-img"/>
      <textarea className="sm:col-span-2 glass border border-white/10 rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Description details..." value={c.description} onChange={e=>setC({...c, description:e.target.value})} required data-testid="cf-desc"/>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Syllabus highlights</label>
        <ChipInput testId="cf-syllabus" value={c.syllabus} onChange={v => setC({...c, syllabus: v})} placeholder="e.g. Physics, Chemistry, NCERT Mastery"/>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Faculty</label>
        <ChipInput testId="cf-faculty" value={c.faculty} onChange={v => setC({...c, faculty: v})} placeholder="e.g. Dr. A. Wani (Physics)"/>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Features</label>
        <ChipInput testId="cf-features" value={c.features} onChange={v => setC({...c, features: v})} placeholder="e.g. Daily doubt sessions, Weekly mock tests"/>
      </div>
      <label className="text-sm flex items-center gap-2 text-muted-foreground select-none cursor-pointer"><input type="checkbox" checked={c.scholarship_available} onChange={e=>setC({...c, scholarship_available: e.target.checked})} className="accent-primary" data-testid="cf-sch"/>Scholarship available</label>
      <label className="text-sm flex items-center gap-2 text-muted-foreground select-none cursor-pointer"><input type="checkbox" checked={c.featured} onChange={e=>setC({...c, featured: e.target.checked})} className="accent-primary" data-testid="cf-feat"/>Featured on home</label>
      <div className="sm:col-span-2 flex gap-2 pt-2">
        <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2" data-testid="cf-save"><Save size={14} className="mr-1.5"/>{initial?.id ? "Save changes" : "Create course"}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} data-testid="cf-cancel" className="rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</Button>}
      </div>
    </form>
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
  const [adminCampaigns, setAdminCampaigns] = useState([]);

  const [editingCourse, setEditingCourse] = useState(null);
  const [busy, setBusy] = useState(false);
  const [innerSearch, setInnerSearch] = useState("");

  // Forms states
  const [newNotice, setNewNotice] = useState({ title:"", content:"", category:"General", pinned:false });
  const [newJob, setNewJob] = useState({ title:"", department:"", location:"", type:"Full-time", description:"", requirements:[], active:true });
  const [newCenter, setNewCenter] = useState({ name:"", city:"", address:"", phone:"", timing:"8:00 AM – 8:00 PM", lat:34.0837, lng:74.7973 });
  const [newTestimonial, setNewTestimonial] = useState({ name:"", role:"", quote:"" });
  const [newResult, setNewResult] = useState({ student_name:"", exam:"", rank:"", year:new Date().getFullYear(), course:"NEET", photo_url:"", quote:"" });
  const [newCampaign, setNewCampaign] = useState({ title:"", description:"", exam_date:"", deadline:"", eligibility:"", venue:"", available_venues:[], whatsapp_community_url:"", exam_time:"10:00 AM", total_marks:100, active:true, is_featured:false });
  const [resultEditor, setResultEditor] = useState({});

  const load = async () => {
    try {
      const [s, e, sa, ja, iq, c, n, j, ce, ts, rs, acm] = await Promise.all([
        api.get("/admin/summary"), api.get("/enrollments"), api.get("/scholarship-applications"),
        api.get("/job-applications"), api.get("/inquiries"), api.get("/courses"),
        api.get("/notices"), api.get("/jobs/all"),
        api.get("/centers"), api.get("/testimonials"), api.get("/results"),
        api.get("/admin/scholarships"),
      ]);
      setSummary(s.data || {}); setEnrollments(e.data || []); setScholarshipApps(sa.data || []);
      setJobApps(ja.data || []); setInquiries(iq.data || []); setCourses(c.data || []); setNotices(n.data || []); setJobs(j.data || []);
      setCenters(ce.data || []); setTestimonials(ts.data || []); setResults(rs.data || []); setAdminCampaigns(acm.data || []);
    } catch (err) { toast.error(formatError(err.response?.data?.detail) || err.message); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (kind, id, status) => {
    const map = { enr: "enrollments", sch: "scholarship-applications", job: "job-applications" };
    try { await api.put(`/${map[kind]}/${id}/status?status=${encodeURIComponent(status)}`); toast.success("Status matrix updated"); load(); }
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
        toast.success("New course framework deployed safely");
      }
      setEditingCourse(null); load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
    finally { setBusy(false); }
  };

  const deleteCourse = async (id) => { if (!confirm("Delete this course parameters?")) return; await api.delete(`/courses/${id}`); load(); };

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
      toast.success(payload.publish ? "Result published into student metrics loop" : "Draft state saved safely");
      setResultEditor(prev => ({ ...prev, [aid]: undefined }));
      load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const post = async (path, body, reset, label) => {
    try { await api.post(path, body); toast.success(`${label} record created`); reset && reset(); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };
  const del = async (path, label) => { if (!confirm(`Delete this ${label}?`)) return; await api.delete(path); load(); };

  const setFeatured = async (kind, id) => {
    try { await api.post(`/admin/feature?kind=${kind}&id=${id}`); toast.success("Asset promoted to home page dashboard track"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };
  const clearFeatured = async () => {
    try { await api.post("/admin/feature?kind=clear&id=none"); toast.success("Cleared promotional flags"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  const downloadAttendance = async (sid) => {
    try {
      const tok = localStorage.getItem("nw_token");
      const res = await fetch(`${API_BASE}/admin/attendance/${sid}/export`, {
        credentials: "include", headers: tok ? { Authorization: `Bearer ${tok}` } : {},
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `attendance-${sid}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error(e.message); }
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
      const tok = localStorage.getItem("nw_token");
      const res = await fetch(`${API_BASE}/admin/scholarships/${sid}/results-template`, {
        credentials: "include", headers: tok ? { Authorization: `Bearer ${tok}` } : {},
      });
      if (!res.ok) throw new Error("Template download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `results-template-${sid}.xlsx`; a.click(); URL.revokeObjectURL(url);
    } catch (e) { toast.error(e.message); }
  };

  const bulkUploadResults = async (sid, file) => {
    try {
      const fd = new FormData(); fd.append("file", file);
      const { data } = await api.post(`/admin/scholarships/${sid}/bulk-results`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Processed ${data.processed} · Published ${data.published}`);
      load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  return (
    <div className="h-screen w-screen flex bg-background relative overflow-hidden select-none">
      <div className="ambient-orb ambient-orb--primary drift pointer-events-none" style={{ width: 500, height: 500, top: "-150px", left: "10%" }} />
      <div className="ambient-orb ambient-orb--accent pointer-events-none" style={{ width: 380, height: 380, bottom: "10%", right: "5%", opacity: 0.25 }} />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Sidebar Section Layout */}
      <aside className="w-64 h-full glass-elevated border-r border-white/10 flex flex-col justify-between shrink-0 overflow-hidden z-30">
        <div className="w-full shrink-0 flex flex-col">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Northend Group</div>
            <div className="font-display text-xl font-medium tracking-tight mt-1 text-foreground">Operations Engine</div>
          </div>
          <div className="p-4 border-b border-white/[0.06] bg-white/[0.01]">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">System Identity</div>
            <div className="font-medium mt-1 text-sm text-foreground">Operations Admin Desk</div>
            <div className="text-[10px] text-accent font-mono mt-0.5 uppercase tracking-wider">LEVEL 0 ROOT ACCESS</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto custom-scrollbar min-h-0">
          {SIDE_NAV.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setInnerSearch(""); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--accent-rgb),0.12)] font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/[0.04]"
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/[0.06] shrink-0 bg-background/40">
          <button 
            onClick={() => navigate("/erp")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider text-accent border border-accent/20 bg-accent/5 hover:bg-accent/15 transition duration-200"
          >
            <Terminal size={14} className="shrink-0"/> <span>Launch ERP Hub</span>
          </button>
        </div>
      </aside>

      {/* Content workspace wrapper view */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden z-20">
        
        <header className="px-8 py-6 border-b border-white/[0.06] bg-background/30 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground flex items-center gap-1.5">
              <span className="w-4 h-px bg-muted-foreground/50"/> Analytics Console Matrix
            </div>
            <h2 className="font-display text-3xl font-light tracking-tight mt-1 text-foreground">
              Operations Overview <span className="text-accent font-medium italic">Deck.</span>
            </h2>
          </div>
          
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input 
              type="text"
              value={innerSearch}
              onChange={e => setInnerSearch(e.target.value)}
              placeholder="Search running page vectors..."
              className="w-full pl-9 pr-4 py-2 border border-white/10 bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
            <StatCard label="Pipeline Students" value={summary.total_students || 0} testId="stat-students"/>
            <StatCard label="Inbound Admissions" value={summary.total_enrollments || 0} testId="stat-enrollments"/>
            <StatCard label="Scholarship Drives" value={summary.total_scholarship_apps || 0} testId="stat-sch"/>
            <StatCard label="Talent Profiles" value={summary.total_job_apps || 0} testId="stat-jobs"/>
          </div>

          <div className="w-full min-h-0">
            {activeTab === "enrollments" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center"><h3 className="font-display font-medium text-xl text-foreground">Inbound Admissions Registry</h3><ExportBtn kind="enrollments"/></div>
                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm table-fixed min-w-[700px]">
                      <thead className="bg-[#141417] text-muted-foreground text-xs uppercase tracking-wider">
                        <tr><th className="w-[15%] p-4 text-left bg-[#101012]">Receipt</th><th className="w-[25%] p-4 text-left bg-[#101012]">Name</th><th className="w-[20%] p-4 text-left bg-[#101012]">Phone Line</th><th className="w-[22%] p-4 text-left bg-[#101012]">Station Center</th><th className="w-[18%] p-4 text-left bg-[#101012]">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-foreground bg-background/20">
                        {enrollments.filter(x => x.name?.toLowerCase().includes(innerSearch.toLowerCase())).map(e => (
                          <tr key={e.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 font-mono text-xs text-foreground font-semibold">{e.receipt_no}</td>
                            <td className="p-4 font-bold text-foreground">{e.name}</td>
                            <td className="p-4 font-mono text-xs text-muted-foreground">{e.phone}</td>
                            <td className="p-4 text-muted-foreground truncate">{e.center}</td>
                            <td className="p-4">
                              <select value={e.status} onChange={ev => updateStatus("enr", e.id, ev.target.value)} className="text-xs font-bold uppercase border border-white/10 rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none">
                                <option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "scholarships" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center"><h3 className="font-display font-medium text-xl text-foreground">Scholarship Drives Processing Queue</h3><ExportBtn kind="scholarship-applications"/></div>
                <div className="space-y-3">
                  {scholarshipApps.filter(x => x.name?.toLowerCase().includes(innerSearch.toLowerCase())).map(a => {
                    const editing = resultEditor[a.id];
                    const r = editing || { marks_obtained: a.result_marks_obtained ?? "", total_marks: a.result_total_marks ?? 100, rank: a.result_rank ?? "", percentile: a.result_percentile ?? "", scholarship_percentage: a.result_scholarship_percentage ?? 0, remarks: a.result_remarks ?? "", publish: a.result_published ?? false };
                    return (
                      <div key={a.id} className="glass border border-white/5 rounded-2xl bg-background/40 p-4 transition hover:border-white/10" data-testid={`adm-sch-${a.id}`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-mono text-xs text-muted-foreground/60">{a.application_no}</div>
                            <div className="font-bold text-foreground text-base">{a.name} <span className="text-xs font-normal text-muted-foreground">· Class {a.standard} · Target: {a.target_exam}</span></div>
                            <div className="text-xs text-muted-foreground mt-0.5">{a.email} · <span className="font-mono">{a.phone}</span></div>
                          </div>
                          <div className="flex items-center gap-3">
                            {a.result_published && <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-md font-bold">Published</span>}
                            <select value={a.status} onChange={ev => updateStatus("sch", a.id, ev.target.value)} className="text-xs font-bold uppercase border border-white/10 rounded-lg px-2.5 py-1 bg-background text-foreground"><option>pending</option><option>approved</option><option>rejected</option></select>
                            <Button size="sm" variant={editing ? "outline" : "default"} onClick={() => setResultEditor(prev => ({ ...prev, [a.id]: editing ? undefined : r }))} data-testid={`toggle-result-${a.id}`} className="rounded-xl text-xs uppercase tracking-wider font-bold">
                              {editing ? "Close" : (a.result_published ? "Edit Score" : "Log Result")}
                            </Button>
                          </div>
                        </div>
                        {editing && (
                          <div className="mt-4 pt-4 border-t border-white/[0.06] grid sm:grid-cols-3 gap-3 animate-fadeIn" data-testid={`result-form-${a.id}`}>
                            <Input placeholder="Marks obtained" type="number" value={r.marks_obtained} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, marks_obtained: e.target.value}}))} data-testid={`r-marks-${a.id}`} className="rounded-xl border-white/10 bg-background text-foreground font-mono"/>
                            <Input placeholder="Total marks" type="number" value={r.total_marks} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, total_marks: e.target.value}}))} data-testid={`r-total-${a.id}`} className="rounded-xl border-white/10 bg-background text-foreground font-mono"/>
                            <Input placeholder="Scholarship %" type="number" min={0} max={100} value={r.scholarship_percentage} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, scholarship_percentage: e.target.value}}))} data-testid={`r-pct-${a.id}`} className="rounded-xl border-white/10 bg-background text-foreground font-mono"/>
                            <Input placeholder="Rank (optional)" type="number" value={r.rank} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, rank: e.target.value}}))} data-testid={`r-rank-${a.id}`} className="rounded-xl border-white/10 bg-background text-foreground font-mono"/>
                            <Input placeholder="Percentile (optional)" type="number" step="0.01" value={r.percentile} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, percentile: e.target.value}}))} data-testid={`r-perc-${a.id}`} className="rounded-xl border-white/10 bg-background text-foreground font-mono"/>
                            <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2 select-none cursor-pointer"><input type="checkbox" checked={!!r.publish} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, publish: e.target.checked}}))} className="accent-primary"/>Publish output to student dashboard</label>
                            <textarea className="sm:col-span-3 border border-white/10 rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent min-h-16 resize-none" placeholder="Remarks / Guidance (optional)" value={r.remarks} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, remarks: e.target.value}}))} />
                            <div className="sm:col-span-3 flex gap-2 pt-1">
                              <Button onClick={() => saveResult(a.id, r)} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2" data-testid={`r-save-${a.id}`}><Save size={14} className="mr-1.5"/>{r.publish ? "Commit & Publish" : "Save Draft Blueprint"}</Button>
                              <Button variant="outline" onClick={() => setResultEditor(prev => ({ ...prev, [a.id]: undefined }))} className="rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "jobapps" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center"><h3 className="font-display font-medium text-xl text-foreground">Talent Recruitment Applications</h3><ExportBtn kind="job-applications"/></div>
                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm table-fixed min-w-[700px]">
                    <thead className="bg-[#141417] text-muted-foreground text-xs uppercase tracking-wider">
                      <tr><th className="p-4 text-left bg-[#101012]">Applicant Name</th><th className="p-4 text-left bg-[#101012]">Email Endpoint</th><th className="p-4 text-left bg-[#101012]">Qualification</th><th className="p-4 text-left bg-[#101012]">Dossier Sheet</th><th className="p-4 text-left bg-[#101012]">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-foreground bg-background/20">
                      {jobApps.filter(x => x.name?.toLowerCase().includes(innerSearch.toLowerCase())).map(a => (
                        <tr key={a.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 font-bold text-foreground">{a.name}</td>
                          <td className="p-4 text-muted-foreground font-mono text-xs">{a.email}</td>
                          <td className="p-4 text-muted-foreground truncate">{a.qualification}</td>
                          <td className="p-4">{a.resume_url ? <a href={a.resume_url} target="_blank" rel="noreferrer" className="text-accent underline font-semibold text-xs uppercase tracking-wider">View Resume</a> : "—"}</td>
                          <td className="p-4">
                            <select value={a.status} onChange={ev => updateStatus("job", a.id, ev.target.value)} className="text-xs font-bold uppercase border border-white/10 rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none">
                              <option>received</option><option>shortlisted</option><option>rejected</option><option>hired</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-medium text-xl text-foreground">Course Catalog Matrix</h3>
                  {!editingCourse && <Button onClick={() => setEditingCourse({})} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider"><Plus size={14} className="mr-1.5"/>Add Custom Course</Button>}
                </div>
                {editingCourse && <div className="mb-6"><CourseForm initial={editingCourse} onCancel={() => setEditingCourse(null)} onSave={saveCourse} busy={busy}/></div>}
                <div className="grid md:grid-cols-2 gap-4">
                  {courses.filter(x => x.title?.toLowerCase().includes(innerSearch.toLowerCase())).map(c => (
                    <div key={c.id} className="border border-white/10 bg-background/30 p-5 rounded-2xl flex flex-col justify-between group hover:border-accent/30 transition duration-300" data-testid={`course-row-${c.id}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{c.category}</div>
                          <div className="font-bold text-lg text-foreground mt-1">{c.title}</div>
                          <div className="text-xs text-muted-foreground font-mono mt-1">{c.duration} · ₹{c.fee?.toLocaleString()}</div>
                        </div>
                        <div className="flex gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" onClick={() => setEditingCourse(c)} className="rounded-lg text-xs font-bold">Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => deleteCourse(c.id)} className="rounded-lg text-xs text-rose-400 border-transparent hover:border-rose-500/20 hover:bg-rose-500/5"><Trash2 size={14}/></Button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1 border-t border-white/[0.04] pt-3">
                        {(c.features || []).slice(0, 3).map((f) => <span key={f} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-md text-muted-foreground">{f}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notices" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Board Notices</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/notices", newNotice, ()=>setNewNotice({title:"",content:"",category:"General",pinned:false}), "Notice");}} className="glass border border-white/5 p-5 rounded-2xl grid sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Notice Title" value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title:e.target.value})} required data-testid="nn-title" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Category Tag" value={newNotice.category} onChange={e=>setNewNotice({...newNotice, category:e.target.value})} required data-testid="nn-cat" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <textarea className="sm:col-span-2 border border-white/10 rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Notice body content parameter text string..." value={newNotice.content} onChange={e=>setNewNotice({...newNotice, content:e.target.value})} required />
                  <label className="text-sm flex items-center gap-2 text-muted-foreground cursor-pointer select-none"><input type="checkbox" checked={newNotice.pinned} onChange={e=>newNotice.pinned} className="accent-primary" />Pin dispatch to priority index window</label>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"><Plus size={14} className="mr-1.5"/>Post Notice</Button>
                </form>
                <div className="space-y-2">
                  {notices.map(n => (
                    <div key={n.id} className={`border ${n.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-white/5 bg-background/30"} p-4 rounded-2xl flex items-center justify-between gap-4`}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{n.category}</div>
                          {n.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Featured</span>}
                        </div>
                        <div className="font-bold text-foreground text-base mt-1 truncate">{n.title}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant={n.is_featured ? "default" : "outline"} onClick={() => n.is_featured ? clearFeatured() : setFeatured("notice", n.id)} className="rounded-xl text-xs font-bold">{n.is_featured ? "Demote" : "Feature"}</Button>
                        <Button size="sm" variant="outline" onClick={() => del(`/notices/${n.id}`, "notice")} className="rounded-xl border-transparent text-rose-400 hover:bg-rose-500/5"><Trash2 size={14}/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Job Openings Matrix</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/jobs", { ...newJob, requirements: newJob.requirements.length ? newJob.requirements : ["Graduate"] }, ()=>setNewJob({title:"",department:"",location:"",type:"Full-time",description:"",requirements:[],active:true}), "Job");}} className="glass border border-white/5 p-5 rounded-2xl grid sm:grid-cols-3 gap-4 bg-background/20">
                  <Input placeholder="Job Title" value={newJob.title} onChange={e=>setNewJob({...newJob, title:e.target.value})} required data-testid="nj-title" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Department" value={newJob.department} onChange={e=>setNewJob({...newJob, department:e.target.value})} required data-testid="nj-dept" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Location" value={newJob.location} onChange={e=>setNewJob({...newJob, location:e.target.value})} required data-testid="nj-loc" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Short Description Summary" value={newJob.description} onChange={e=>setNewJob({...newJob, description:e.target.value})} required data-testid="nj-desc" className="sm:col-span-3 rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <div className="sm:col-span-3"><label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Prerequisite Qualifications Requirements</label><ChipInput testId="nj-req" value={newJob.requirements} onChange={v=>setNewJob({...newJob, requirements:v})}/></div>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"><Plus size={14} className="mr-1.5"/>Deploy Career Index</Button>
                </form>
                <div className="space-y-2">
                  {jobs.map(j => (
                    <div key={j.id} className={`border ${j.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-white/5 bg-background/30"} p-4 rounded-2xl flex items-center justify-between gap-4`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-foreground text-base">{j.title}</div>
                          {j.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Active</span>}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{j.department} · {j.location}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" variant={j.is_featured ? "default" : "outline"} onClick={() => j.is_featured ? clearFeatured() : setFeatured("job", j.id)} className="rounded-xl text-xs font-bold">{j.is_featured ? "Demote" : "Feature"}</Button>
                        <Button size="sm" variant="outline" onClick={() => del(`/jobs/${j.id}`, "job")} className="rounded-xl border-transparent text-rose-400 hover:bg-rose-500/5"><Trash2 size={14}/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "centers" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Regional Center Desks</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/centers", newCenter, ()=>setNewCenter({name:"",city:"",address:"",phone:"",timing:"8:00 AM – 8:00 PM",lat:34.0837,lng:74.7973}), "Center");}} className="glass border border-white/5 p-5 rounded-2xl grid sm:grid-cols-3 gap-4 bg-background/20">
                  <Input placeholder="Center Hub Name" value={newCenter.name} onChange={e=>setNewCenter({...newCenter, name:e.target.value})} required data-testid="nc2-name" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="City Scope" value={newCenter.city} onChange={e=>setNewCenter({...newCenter, city:e.target.value})} required data-testid="nc2-city" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Contact Support Line" value={newCenter.phone} onChange={e=>setNewCenter({...newCenter, phone:e.target.value})} required data-testid="nc2-phone" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono text-xs"/>
                  <Input placeholder="Complete Physical Address" value={newCenter.address} onChange={e=>setNewCenter({...newCenter, address:e.target.value})} required data-testid="nc2-addr" className="sm:col-span-2 rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Timing Boundaries" value={newCenter.timing} onChange={e=>setNewCenter({...newCenter, timing:e.target.value})} data-testid="nc2-timing" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Latitude" type="number" step="any" value={newCenter.lat} onChange={e=>setNewCenter({...newCenter, lat: Number(e.target.value)})} data-testid="nc2-lat" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Longitude" type="number" step="any" value={newCenter.lng} onChange={e=>setNewCenter({...newCenter, lng: Number(e.target.value)})} data-testid="nc2-lng" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"><Plus size={14} className="mr-1.5"/>Add Station Hub</Button>
                </form>
                <div className="grid md:grid-cols-2 gap-4">
                  {centers.map(c => (
                    <div key={c.id} className="border border-white/10 bg-background/30 p-4 rounded-2xl flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] font-bold text-accent font-mono">{c.city}</div>
                        <div className="font-bold text-foreground text-base mt-0.5">{c.name}</div>
                        <div className="text-xs text-muted-foreground mt-1.5">{c.address} · <span className="font-mono">{c.phone}</span></div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => del(`/centers/${c.id}`, "center")} className="rounded-xl border-transparent text-rose-400 hover:bg-rose-500/5"><Trash2 size={14}/></Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Feedback Reviews Board</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/testimonials", newTestimonial, ()=>setNewTestimonial({name:"",role:"",quote:""}), "Testimonial");}} className="glass border border-white/5 p-5 rounded-2xl grid sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Endorsee Full Name" value={newTestimonial.name} onChange={e=>setNewTestimonial({...newTestimonial, name:e.target.value})} required data-testid="nt-name" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Role / Standing Identity" value={newTestimonial.role} onChange={e=>setNewTestimonial({...newTestimonial, role:e.target.value})} required data-testid="nt-role" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <textarea className="sm:col-span-2 border border-white/10 rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Verbatim review narration quotation body strings..." value={newTestimonial.quote} onChange={e=>setNewTestimonial({...newTestimonial, quote:e.target.value})} required />
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"><Plus size={14} className="mr-1.5"/>Commit Review</Button>
                </form>
                <div className="grid md:grid-cols-2 gap-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="border border-white/10 bg-background/30 p-5 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-white/5 border border-white/5 rounded text-accent inline-block">{t.role}</div>
                        <div className="font-bold text-foreground text-base mt-2">{t.name}</div>
                        <div className="text-sm text-muted-foreground/80 mt-2 italic">"{t.quote}"</div>
                      </div>
                      <div className="flex justify-end pt-3 border-t border-white/[0.04] mt-3">
                        <Button size="sm" variant="outline" onClick={() => del(`/testimonials/${t.id}`, "testimonial")} className="rounded-xl border-transparent text-rose-400 hover:bg-rose-500/5"><Trash2 size={14}/></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "results" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Honors Board Toppers Matrix</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/results", { ...newResult, year: Number(newResult.year) }, ()=>setNewResult({student_name:"",exam:"",rank:"",year:new Date().getFullYear(),course:"NEET",photo_url:"",quote:""}), "Result");}} className="glass border border-white/5 p-5 rounded-2xl grid sm:grid-cols-3 gap-4 bg-background/20">
                  <Input placeholder="Student Name" value={newResult.student_name} onChange={e=>setNewResult({...newResult, student_name:e.target.value})} required data-testid="nr-name" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Examination Scale" value={newResult.exam} onChange={e=>setNewResult({...newResult, exam:e.target.value})} required data-testid="nr-exam" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Score Rank Metric (AIR/State)" value={newResult.rank} onChange={e=>setNewResult({...newResult, rank:e.target.value})} required data-testid="nr-rank" className="rounded-xl border-white/10 bg-background/50 text-foreground text-accent font-bold"/>
                  <Input placeholder="Year" type="number" value={newResult.year} onChange={e=>setNewResult({...newResult, year:e.target.value})} required data-testid="nr-year" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <select className="border border-white/10 rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent" value={newResult.course} onChange={e=>setNewResult({...newResult, course:e.target.value})} data-testid="nr-course">
                    {CATEGORIES.map(x=><option key={x} className="bg-background text-foreground">{x}</option>)}
                  </select>
                  <Input placeholder="Portrait asset direct url endpoint" value={newResult.photo_url} onChange={e=>setNewResult({...newResult, photo_url:e.target.value})} data-testid="nr-photo" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <textarea className="sm:col-span-3 border border-white/10 rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Learner reflection quote validation text string..." value={newResult.quote} onChange={e=>setNewResult({...newResult, quote:e.target.value})} />
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"><Plus size={14} className="mr-1.5"/>Publish Honors Record</Button>
                </form>
                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm table-fixed min-w-[700px]">
                      <thead className="bg-[#141417] text-muted-foreground text-xs uppercase tracking-wider">
                        <tr><th className="p-4 text-left bg-[#101012]">Topper Identity</th><th className="p-4 text-left bg-[#101012]">Examination Scale</th><th className="p-4 text-left bg-[#101012]">Rank Secured</th><th className="p-4 text-left bg-[#101012]">Year</th><th className="p-4 text-left bg-[#101012]">Syllabus Track</th><th className="p-4 text-right bg-[#101012]"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04] text-foreground bg-background/20">
                        {results.map(r => (
                          <tr key={r.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-4 font-bold text-foreground">{r.student_name}</td>
                            <td className="p-4 text-muted-foreground">{r.exam}</td>
                            <td className="p-4 text-accent font-bold tracking-wide font-mono">{r.rank}</td>
                            <td className="p-4 font-mono text-xs text-muted-foreground">{r.year}</td>
                            <td className="p-4 text-muted-foreground">{r.course}</td>
                            <td className="p-4 text-right">
                              <Button size="sm" variant="outline" onClick={() => del(`/results/${r.id}`, "result")} className="rounded-xl border-transparent text-rose-400 hover:bg-rose-500/5"><Trash2 size={14}/></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "campaigns" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="font-display font-bold text-xl text-foreground">Scholarship Campaigns Drivers</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/scholarships", newCampaign, ()=>setNewCampaign({title:"",description:"",exam_date:"",deadline:"",eligibility:"",venue:"",available_venues:[],whatsapp_community_url:"",exam_time:"10:00 AM",total_marks:100,active:true,is_featured:false}), "Campaign");}} className="glass border border-white/5 p-5 rounded-2xl grid sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Driver Name (e.g. NST 2026)" value={newCampaign.title} onChange={e=>setNewCampaign({...newCampaign, title:e.target.value})} required data-testid="ncm-title" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Eligibility Criteria Parameters" value={newCampaign.eligibility} onChange={e=>setNewCampaign({...newCampaign, eligibility:e.target.value})} required data-testid="ncm-elig" className="rounded-xl border-white/10 bg-background/50 text-foreground"/>
                  <Input placeholder="Examination Date" value={newCampaign.exam_date} onChange={e=>setNewCampaign({...newCampaign, exam_date:e.target.value})} required data-testid="ncm-exam" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Lock Expiration Deadline" value={newCampaign.deadline} onChange={e=>setNewCampaign({...newCampaign, deadline:e.target.value})} required data-testid="ncm-dead" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Execution Time Grid" value={newCampaign.exam_time} onChange={e=>setNewCampaign({...newCampaign, exam_time:e.target.value})} data-testid="ncm-time" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Total marks value" type="number" value={newCampaign.total_marks} onChange={e=>setNewCampaign({...newCampaign, total_marks:Number(e.target.value)})} data-testid="ncm-marks" className="rounded-xl border-white/10 bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="WhatsApp Community Endpoint URL" value={newCampaign.whatsapp_community_url} onChange={e=>setNewCampaign({...newCampaign, whatsapp_community_url:e.target.value})} className="sm:col-span-2 rounded-xl border-white/10 bg-background/50 text-foreground" data-testid="ncm-wa"/>
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Authorized Running Venues</label>
                    <div className="flex flex-wrap gap-2 glass rounded-xl p-2.5 bg-background/50 border border-white/10">
                      {centers.map(c => {
                        const checked = newCampaign.available_venues.includes(c.name);
                        return (
                          <label key={c.id} className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${checked ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-white/10 text-muted-foreground hover:bg-white/5"}`} data-testid={`ncm-venue-${c.id}`}>
                            <input type="checkbox" className="hidden" checked={checked} onChange={() => {
                              setNewCampaign(prev => ({...prev, available_venues: checked ? prev.available_venues.filter(v=>v!==c.name) : [...prev.available_venues, c.name]}));
                            }}/>
                            {c.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <textarea className="sm:col-span-2 border border-white/10 rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Description data parameters string layout..." value={newCampaign.description} onChange={e=>setNewCampaign({...newCampaign, description:e.target.value})} required data-testid="ncm-desc"/>
                  <label className="text-sm flex items-center gap-2 text-muted-foreground select-none cursor-pointer font-medium"><input type="checkbox" checked={newCampaign.active} onChange={e=>setNewCampaign({...newCampaign, active:e.target.checked})} className="accent-primary"/>Flag project as active status</label>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2"><Plus size={14} className="mr-1.5"/>Launch Test Campaign</Button>
                </form>
                
                <div className="space-y-4">
                  {adminCampaigns.map(c => (
                    <div key={c.id} className={`border ${c.is_featured ? "border-accent ring-1 ring-accent/20 bg-accent/[0.01]" : "border-white/5 bg-background/30"} p-5 rounded-2xl transition duration-200`}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-xs uppercase font-bold tracking-widest text-accent font-mono">{c.active ? "LIVE PROFILE" : "ARCHIVED RECORD"}</div>
                            {c.is_featured && <span className="text-[9px] uppercase font-bold tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">★ Top Showcase</span>}
                          </div>
                          <div className="font-bold text-foreground text-lg mt-1">{c.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">Slot: <span className="font-semibold text-foreground">{c.exam_date}</span> {c.exam_time ? `at ${c.exam_time}` : ""} · Expiration Lock: <span className="font-semibold text-foreground font-mono">{c.deadline}</span></div>
                          {(c.available_venues || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {c.available_venues.map(v => <span key={v} className="text-[10px] uppercase font-bold font-mono tracking-wider bg-white/5 px-2.5 py-0.5 border border-white/5 rounded text-muted-foreground">{v}</span>)}
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-1.5 shrink-0 w-full sm:w-auto">
                          <Button size="sm" variant={c.is_featured ? "default" : "outline"} onClick={() => c.is_featured ? clearFeatured() : setFeatured("scholarship", c.id)} className="rounded-lg text-xs font-bold">Promote</Button>
                          <Button size="sm" variant="outline" onClick={() => downloadAttendance(c.id)} className="rounded-lg text-xs font-bold text-muted-foreground"><Download size={13} className="mr-1"/>Attendance</Button>
                          <Button size="sm" variant="outline" onClick={() => downloadResultsTemplate(c.id)} className="rounded-lg text-xs font-bold text-muted-foreground"><Download size={13} className="mr-1"/>Template</Button>
                          <Button size="sm" variant="outline" type="button" onClick={() => document.getElementById(`bulk-input-${c.id}`)?.click()} className="rounded-lg text-xs font-bold text-accent border-accent/20 hover:bg-accent/5"><Plus size={13} className="mr-1"/>Bulk Input</Button>
                          <input id={`bulk-input-${c.id}`} type="file" accept=".xlsx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { bulkUploadResults(c.id, f); e.target.value = ""; } }}/>
                          <Button size="sm" variant="outline" onClick={() => del(`/scholarships/${c.id}`, "campaign")} className="rounded-lg text-xs border-transparent text-rose-400 hover:bg-rose-500/5 col-span-2 sm:col-span-1"><Trash2 size={13}/></Button>
                        </div>
                      </div>
                      
                      {c.examiner_token && (
                        <div className="mt-4 pt-4 border-t border-white/[0.04] bg-white/[0.01] -mx-5 -mb-5 px-5 py-4 rounded-b-2xl">
                          <div className="text-[10px] uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5">Independent Evaluation Gateway Link</div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <code className="glass-elevated px-3 py-1.5 rounded-lg border border-white/5 break-all flex-1 font-mono text-emerald-400 font-medium">{examinerLink(c.examiner_token)}</code>
                            <Button size="sm" variant="outline" onClick={() => copy(examinerLink(c.examiner_token))} className="rounded-lg text-xs font-bold">Copy Link</Button>
                            <Button size="sm" variant="outline" onClick={() => regenerateToken(c.id)} className="rounded-lg text-xs font-bold text-muted-foreground">Rotate Token</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "inquiries" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center"><h3 className="font-display font-medium text-xl text-foreground">Marketing &amp; Support Inquiries</h3><ExportBtn kind="inquiries"/></div>
                <div className="glass border border-white/5 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm table-fixed min-w-[700px]">
                    <thead className="bg-[#141417] text-muted-foreground text-xs uppercase tracking-wider">
                      <tr><th className="p-4 text-left bg-[#101012]">Identity contact</th><th className="p-4 text-left bg-[#101012]">Email Address</th><th className="p-4 text-left bg-[#101012]">Subject Parameter</th><th className="p-4 text-left bg-[#101012]">Message Context Body</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-foreground bg-background/20">
                      {inquiries.filter(x => x.name?.toLowerCase().includes(innerSearch.toLowerCase())).map(i => (
                        <tr key={i.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 font-bold text-foreground whitespace-nowrap">{i.name}</td>
                          <td className="p-4 text-muted-foreground font-mono text-xs whitespace-nowrap">{i.email}</td>
                          <td className="p-4 text-foreground font-medium truncate" title={i.subject}>{i.subject}</td>
                          <td className="p-4 text-muted-foreground/80 leading-relaxed max-w-sm truncate" title={i.message}>{i.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}