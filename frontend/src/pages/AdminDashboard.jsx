import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatError, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Trash2, Plus, Save, X } from "lucide-react";
import ChipInput from "@/components/ChipInput";

const CATEGORIES = ["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"];

function StatCard({ label, value, testId }) {
  return (
    <div className="border border-border p-5 rounded-md" data-testid={testId}>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="font-display text-3xl font-black mt-1">{value}</div>
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
  return <Button size="sm" variant="outline" onClick={dl} data-testid={`export-${kind}`}><Download size={14}/>Excel</Button>;
}

const emptyCourse = { title:"", category:"NEET", duration:"", fee:0, description:"", syllabus:[], faculty:[], features:[], scholarship_available:true, featured:false, image_url:"" };

function CourseForm({ initial, onCancel, onSave, busy }) {
  const [c, setC] = useState(initial || emptyCourse);
  const submit = (e) => { e.preventDefault(); onSave({ ...c, fee: Number(c.fee) }); };
  return (
    <form onSubmit={submit} className="border border-border p-5 rounded-md bg-background grid sm:grid-cols-2 gap-3" data-testid="course-form">
      <Input placeholder="Title" value={c.title} onChange={e=>setC({...c, title:e.target.value})} required data-testid="cf-title"/>
      <select className="border border-border rounded-md px-3 py-2 bg-background" value={c.category} onChange={e=>setC({...c, category:e.target.value})} data-testid="cf-cat">
        {CATEGORIES.map(x=><option key={x}>{x}</option>)}
      </select>
      <Input placeholder="Duration (e.g. 12 months)" value={c.duration} onChange={e=>setC({...c, duration:e.target.value})} required data-testid="cf-dur"/>
      <Input placeholder="Fee in ₹" type="number" value={c.fee} onChange={e=>setC({...c, fee:e.target.value})} required data-testid="cf-fee"/>
      <Input placeholder="Banner image URL" value={c.image_url || ""} onChange={e=>setC({...c, image_url:e.target.value})} className="sm:col-span-2" data-testid="cf-img"/>
      <textarea className="sm:col-span-2 border border-border rounded-md px-3 py-2 bg-background min-h-20" placeholder="Description" value={c.description} onChange={e=>setC({...c, description:e.target.value})} required data-testid="cf-desc"/>
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
      <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={c.scholarship_available} onChange={e=>setC({...c, scholarship_available: e.target.checked})} data-testid="cf-sch"/>Scholarship available</label>
      <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={c.featured} onChange={e=>setC({...c, featured: e.target.checked})} data-testid="cf-feat"/>Featured on home</label>
      <div className="sm:col-span-2 flex gap-2">
        <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground" data-testid="cf-save"><Save size={14}/>{initial?.id ? "Save changes" : "Create course"}</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} data-testid="cf-cancel">Cancel</Button>}
      </div>
    </form>
  );
}

export default function AdminDashboard() {
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
  const [campaigns, setCampaigns] = useState([]);

  const [editingCourse, setEditingCourse] = useState(null); // course object or "new"
  const [busy, setBusy] = useState(false);

  // Forms for simple add (notices, jobs, centers, testimonials, results, campaigns)
  const [newNotice, setNewNotice] = useState({ title:"", content:"", category:"General", pinned:false });
  const [newJob, setNewJob] = useState({ title:"", department:"", location:"", type:"Full-time", description:"", requirements:[], active:true });
  const [newCenter, setNewCenter] = useState({ name:"", city:"", address:"", phone:"", timing:"8:00 AM – 8:00 PM", lat:34.0837, lng:74.7973 });
  const [newTestimonial, setNewTestimonial] = useState({ name:"", role:"", quote:"" });
  const [newResult, setNewResult] = useState({ student_name:"", exam:"", rank:"", year:new Date().getFullYear(), course:"NEET", photo_url:"", quote:"" });
  const [newCampaign, setNewCampaign] = useState({ title:"", description:"", exam_date:"", deadline:"", eligibility:"", active:true });

  const load = async () => {
    try {
      const [s, e, sa, ja, iq, c, n, j, ce, ts, rs, cm] = await Promise.all([
        api.get("/admin/summary"), api.get("/enrollments"), api.get("/scholarship-applications"),
        api.get("/job-applications"), api.get("/inquiries"), api.get("/courses"),
        api.get("/notices"), api.get("/jobs/all"),
        api.get("/centers"), api.get("/testimonials"), api.get("/results"), api.get("/scholarships"),
      ]);
      setSummary(s.data); setEnrollments(e.data); setScholarshipApps(sa.data);
      setJobApps(ja.data); setInquiries(iq.data); setCourses(c.data); setNotices(n.data); setJobs(j.data);
      setCenters(ce.data); setTestimonials(ts.data); setResults(rs.data); setCampaigns(cm.data);
    } catch (err) { toast.error(formatError(err.response?.data?.detail) || err.message); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (kind, id, status) => {
    const map = { enr: "enrollments", sch: "scholarship-applications", job: "job-applications" };
    try { await api.put(`/${map[kind]}/${id}/status?status=${encodeURIComponent(status)}`); toast.success("Updated"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };

  // ----- Course CRUD
  const saveCourse = async (data) => {
    setBusy(true);
    try {
      if (editingCourse?.id) {
        await api.put(`/courses/${editingCourse.id}`, data);
        toast.success("Course updated");
      } else {
        await api.post("/courses", data);
        toast.success("Course created");
      }
      setEditingCourse(null); load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
    finally { setBusy(false); }
  };
  const deleteCourse = async (id) => { if (!confirm("Delete this course?")) return; await api.delete(`/courses/${id}`); load(); };

  // ----- generic creators
  const post = async (path, body, reset, label) => {
    try { await api.post(path, body); toast.success(`${label} created`); reset && reset(); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };
  const del = async (path, label) => { if (!confirm(`Delete this ${label}?`)) return; await api.delete(path); load(); };

  // ----- feature toggle (single across notices/jobs/scholarships)
  const setFeatured = async (kind, id) => {
    try { await api.post(`/admin/feature?kind=${kind}&id=${id}`); toast.success("Featured on home"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };
  const clearFeatured = async () => {
    try { await api.post("/admin/feature?kind=clear&id=none"); toast.success("Cleared featured"); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail) || e.message); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12" data-testid="admin-dashboard">
      <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-2">Admin Console</div>
      <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter">Northend Operations.</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 mb-10">
        <StatCard label="Students" value={summary.total_students || 0} testId="stat-students"/>
        <StatCard label="Enrollments" value={summary.total_enrollments || 0} testId="stat-enrollments"/>
        <StatCard label="Scholarship Apps" value={summary.total_scholarship_apps || 0} testId="stat-sch"/>
        <StatCard label="Job Apps" value={summary.total_job_apps || 0} testId="stat-jobs"/>
      </div>

      <Tabs defaultValue="enrollments" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1" data-testid="admin-tabs">
          <TabsTrigger value="enrollments" data-testid="tab-enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="scholarships" data-testid="tab-scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="jobapps" data-testid="tab-jobapps">Job Apps</TabsTrigger>
          <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
          <TabsTrigger value="notices" data-testid="tab-notices">Notices</TabsTrigger>
          <TabsTrigger value="jobs" data-testid="tab-jobs">Jobs</TabsTrigger>
          <TabsTrigger value="centers" data-testid="tab-centers">Centers</TabsTrigger>
          <TabsTrigger value="testimonials" data-testid="tab-testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="results" data-testid="tab-results">Results</TabsTrigger>
          <TabsTrigger value="campaigns" data-testid="tab-campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries</TabsTrigger>
        </TabsList>

        {/* Enrollments */}
        <TabsContent value="enrollments" className="mt-6">
          <div className="flex justify-between mb-3"><div className="font-display font-bold text-lg">All Enrollments</div><ExportBtn kind="enrollments"/></div>
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase"><tr><th className="p-3 text-left">Receipt</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Phone</th><th className="p-3 text-left">Center</th><th className="p-3 text-left">Status</th></tr></thead>
              <tbody>{enrollments.map(e => (
                <tr key={e.id} className="border-t border-border" data-testid={`adm-enr-${e.id}`}>
                  <td className="p-3 font-mono text-xs">{e.receipt_no}</td>
                  <td className="p-3 font-bold">{e.name}</td>
                  <td className="p-3">{e.phone}</td>
                  <td className="p-3">{e.center}</td>
                  <td className="p-3">
                    <select value={e.status} onChange={ev => updateStatus("enr", e.id, ev.target.value)} className="text-xs border border-border rounded px-2 py-1 bg-background">
                      <option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option>
                    </select>
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Scholarships */}
        <TabsContent value="scholarships" className="mt-6">
          <div className="flex justify-between mb-3"><div className="font-display font-bold text-lg">Scholarship Applications</div><ExportBtn kind="scholarship-applications"/></div>
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase"><tr><th className="p-3 text-left">App No</th><th className="p-3 text-left">Name</th><th className="p-3 text-left">Class</th><th className="p-3 text-left">Target</th><th className="p-3 text-left">Status</th></tr></thead>
              <tbody>{scholarshipApps.map(a => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{a.application_no}</td>
                  <td className="p-3 font-bold">{a.name}</td>
                  <td className="p-3">{a.standard}</td>
                  <td className="p-3">{a.target_exam}</td>
                  <td className="p-3"><select value={a.status} onChange={ev => updateStatus("sch", a.id, ev.target.value)} className="text-xs border border-border rounded px-2 py-1 bg-background"><option>pending</option><option>approved</option><option>rejected</option></select></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Job Apps */}
        <TabsContent value="jobapps" className="mt-6">
          <div className="flex justify-between mb-3"><div className="font-display font-bold text-lg">Job Applications</div><ExportBtn kind="job-applications"/></div>
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Qual</th><th className="p-3 text-left">Resume</th><th className="p-3 text-left">Status</th></tr></thead>
              <tbody>{jobApps.map(a => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3 font-bold">{a.name}</td><td className="p-3">{a.email}</td>
                  <td className="p-3">{a.qualification}</td>
                  <td className="p-3">{a.resume_url ? <a href={a.resume_url} target="_blank" rel="noreferrer" className="text-primary underline">View</a> : "—"}</td>
                  <td className="p-3"><select value={a.status} onChange={ev => updateStatus("job", a.id, ev.target.value)} className="text-xs border border-border rounded px-2 py-1 bg-background"><option>received</option><option>shortlisted</option><option>rejected</option><option>hired</option></select></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Courses */}
        <TabsContent value="courses" className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display font-bold text-lg">Courses</div>
            {!editingCourse && <Button onClick={() => setEditingCourse({})} className="bg-primary text-primary-foreground" data-testid="new-course-btn"><Plus size={14}/>New course</Button>}
          </div>
          {editingCourse && (
            <div className="mb-6">
              <CourseForm initial={editingCourse} onCancel={() => setEditingCourse(null)} onSave={saveCourse} busy={busy}/>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {courses.map(c => (
              <div key={c.id} className="border border-border p-4 rounded-md" data-testid={`course-row-${c.id}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{c.category}</div>
                    <div className="font-bold mt-1">{c.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.duration} · ₹{c.fee?.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => setEditingCourse(c)} data-testid={`edit-course-${c.id}`}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => deleteCourse(c.id)} data-testid={`del-course-${c.id}`}><Trash2 size={14}/></Button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(c.features || []).slice(0, 3).map((f, i) => <span key={i} className="text-[10px] uppercase tracking-wider bg-accent/20 px-2 py-0.5 rounded">{f}</span>)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Notices */}
        <TabsContent value="notices" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Notices</div>
          <form onSubmit={(e)=>{e.preventDefault(); post("/notices", newNotice, ()=>setNewNotice({title:"",content:"",category:"General",pinned:false}), "Notice");}} className="border border-border p-5 rounded-md grid sm:grid-cols-2 gap-3 mb-6">
            <Input placeholder="Title" value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title:e.target.value})} required data-testid="nn-title"/>
            <Input placeholder="Category" value={newNotice.category} onChange={e=>setNewNotice({...newNotice, category:e.target.value})} required data-testid="nn-cat"/>
            <textarea className="sm:col-span-2 border border-border rounded-md px-3 py-2 bg-background min-h-20" placeholder="Content" value={newNotice.content} onChange={e=>setNewNotice({...newNotice, content:e.target.value})} required data-testid="nn-content"/>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={newNotice.pinned} onChange={e=>setNewNotice({...newNotice, pinned:e.target.checked})} data-testid="nn-pin"/>Pin to top</label>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nn-submit"><Plus size={14}/>Post</Button>
          </form>
          <div className="space-y-2">{notices.map(n => (
            <div key={n.id} className={`border ${n.is_featured ? "border-accent ring-1 ring-accent/30" : "border-border"} p-4 rounded-md flex items-start justify-between gap-3`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{n.category}</div>
                  {n.is_featured && <span className="text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded font-bold">★ Featured</span>}
                </div>
                <div className="font-bold mt-1">{n.title}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant={n.is_featured ? "default" : "outline"} onClick={() => n.is_featured ? clearFeatured() : setFeatured("notice", n.id)} data-testid={`feat-notice-${n.id}`}>{n.is_featured ? "Unfeature" : "Feature"}</Button>
                <Button size="sm" variant="outline" onClick={() => del(`/notices/${n.id}`, "notice")} data-testid={`del-notice-${n.id}`}><Trash2 size={14}/></Button>
              </div>
            </div>
          ))}</div>
        </TabsContent>

        {/* Jobs */}
        <TabsContent value="jobs" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Job Postings</div>
          <form onSubmit={(e)=>{e.preventDefault(); post("/jobs", { ...newJob, requirements: newJob.requirements.length ? newJob.requirements : ["Graduate"] }, ()=>setNewJob({title:"",department:"",location:"",type:"Full-time",description:"",requirements:[],active:true}), "Job");}} className="border border-border p-5 rounded-md grid sm:grid-cols-3 gap-3 mb-6">
            <Input placeholder="Title" value={newJob.title} onChange={e=>setNewJob({...newJob, title:e.target.value})} required data-testid="nj-title"/>
            <Input placeholder="Department" value={newJob.department} onChange={e=>setNewJob({...newJob, department:e.target.value})} required data-testid="nj-dept"/>
            <Input placeholder="Location" value={newJob.location} onChange={e=>setNewJob({...newJob, location:e.target.value})} required data-testid="nj-loc"/>
            <Input placeholder="Description" value={newJob.description} onChange={e=>setNewJob({...newJob, description:e.target.value})} required data-testid="nj-desc" className="sm:col-span-3"/>
            <div className="sm:col-span-3"><label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Requirements</label>
              <ChipInput testId="nj-req" value={newJob.requirements} onChange={v=>setNewJob({...newJob, requirements:v})}/>
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nj-submit"><Plus size={14}/>Post Job</Button>
          </form>
          <div className="space-y-2">{jobs.map(j => (
            <div key={j.id} className={`border ${j.is_featured ? "border-accent ring-1 ring-accent/30" : "border-border"} p-4 rounded-md flex items-center justify-between`}>
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-bold">{j.title}</div>
                  {j.is_featured && <span className="text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded font-bold">★ Featured</span>}
                </div>
                <div className="text-xs text-muted-foreground">{j.department} · {j.location}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={j.is_featured ? "default" : "outline"} onClick={() => j.is_featured ? clearFeatured() : setFeatured("job", j.id)} data-testid={`feat-job-${j.id}`}>{j.is_featured ? "Unfeature" : "Feature"}</Button>
                <Button size="sm" variant="outline" onClick={() => del(`/jobs/${j.id}`, "job")} data-testid={`del-job-${j.id}`}><Trash2 size={14}/></Button>
              </div>
            </div>
          ))}</div>
        </TabsContent>

        {/* Centers */}
        <TabsContent value="centers" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Centers</div>
          <form onSubmit={(e)=>{e.preventDefault(); post("/centers", newCenter, ()=>setNewCenter({name:"",city:"",address:"",phone:"",timing:"8:00 AM – 8:00 PM",lat:34.0837,lng:74.7973}), "Center");}} className="border border-border p-5 rounded-md grid sm:grid-cols-3 gap-3 mb-6">
            <Input placeholder="Name (e.g. Northend Srinagar)" value={newCenter.name} onChange={e=>setNewCenter({...newCenter, name:e.target.value})} required data-testid="nc2-name"/>
            <Input placeholder="City" value={newCenter.city} onChange={e=>setNewCenter({...newCenter, city:e.target.value})} required data-testid="nc2-city"/>
            <Input placeholder="Phone" value={newCenter.phone} onChange={e=>setNewCenter({...newCenter, phone:e.target.value})} required data-testid="nc2-phone"/>
            <Input placeholder="Address" value={newCenter.address} onChange={e=>setNewCenter({...newCenter, address:e.target.value})} required data-testid="nc2-addr" className="sm:col-span-2"/>
            <Input placeholder="Timing" value={newCenter.timing} onChange={e=>setNewCenter({...newCenter, timing:e.target.value})} data-testid="nc2-timing"/>
            <Input placeholder="Latitude" type="number" step="any" value={newCenter.lat} onChange={e=>setNewCenter({...newCenter, lat: Number(e.target.value)})} data-testid="nc2-lat"/>
            <Input placeholder="Longitude" type="number" step="any" value={newCenter.lng} onChange={e=>setNewCenter({...newCenter, lng: Number(e.target.value)})} data-testid="nc2-lng"/>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nc2-submit"><Plus size={14}/>Add Center</Button>
          </form>
          <div className="grid md:grid-cols-2 gap-3">{centers.map(c => (
            <div key={c.id} className="border border-border p-4 rounded-md flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{c.city}</div>
                <div className="font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.address} · {c.phone}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => del(`/centers/${c.id}`, "center")} data-testid={`del-center-${c.id}`}><Trash2 size={14}/></Button>
            </div>
          ))}</div>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Testimonials</div>
          <form onSubmit={(e)=>{e.preventDefault(); post("/testimonials", newTestimonial, ()=>setNewTestimonial({name:"",role:"",quote:""}), "Testimonial");}} className="border border-border p-5 rounded-md grid sm:grid-cols-2 gap-3 mb-6">
            <Input placeholder="Name" value={newTestimonial.name} onChange={e=>setNewTestimonial({...newTestimonial, name:e.target.value})} required data-testid="nt-name"/>
            <Input placeholder="Role (Parent / NEET Aspirant…)" value={newTestimonial.role} onChange={e=>setNewTestimonial({...newTestimonial, role:e.target.value})} required data-testid="nt-role"/>
            <textarea className="sm:col-span-2 border border-border rounded-md px-3 py-2 bg-background min-h-20" placeholder="Quote" value={newTestimonial.quote} onChange={e=>setNewTestimonial({...newTestimonial, quote:e.target.value})} required data-testid="nt-quote"/>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nt-submit"><Plus size={14}/>Add Testimonial</Button>
          </form>
          <div className="grid md:grid-cols-2 gap-3">{testimonials.map(t => (
            <div key={t.id} className="border border-border p-4 rounded-md flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{t.role}</div>
                <div className="font-bold mt-1">{t.name}</div>
                <div className="text-sm text-muted-foreground mt-1 italic">"{t.quote}"</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => del(`/testimonials/${t.id}`, "testimonial")} data-testid={`del-test-${t.id}`}><Trash2 size={14}/></Button>
            </div>
          ))}</div>
        </TabsContent>

        {/* Results */}
        <TabsContent value="results" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Results / Toppers</div>
          <form onSubmit={(e)=>{e.preventDefault(); post("/results", { ...newResult, year: Number(newResult.year) }, ()=>setNewResult({student_name:"",exam:"",rank:"",year:new Date().getFullYear(),course:"NEET",photo_url:"",quote:""}), "Result");}} className="border border-border p-5 rounded-md grid sm:grid-cols-3 gap-3 mb-6">
            <Input placeholder="Student name" value={newResult.student_name} onChange={e=>setNewResult({...newResult, student_name:e.target.value})} required data-testid="nr-name"/>
            <Input placeholder="Exam (e.g. NEET 2025)" value={newResult.exam} onChange={e=>setNewResult({...newResult, exam:e.target.value})} required data-testid="nr-exam"/>
            <Input placeholder="Rank (e.g. AIR 412)" value={newResult.rank} onChange={e=>setNewResult({...newResult, rank:e.target.value})} required data-testid="nr-rank"/>
            <Input placeholder="Year" type="number" value={newResult.year} onChange={e=>setNewResult({...newResult, year:e.target.value})} required data-testid="nr-year"/>
            <select className="border border-border rounded-md px-3 py-2 bg-background" value={newResult.course} onChange={e=>setNewResult({...newResult, course:e.target.value})} data-testid="nr-course">
              {CATEGORIES.map(x=><option key={x}>{x}</option>)}
            </select>
            <Input placeholder="Photo URL (optional)" value={newResult.photo_url} onChange={e=>setNewResult({...newResult, photo_url:e.target.value})} data-testid="nr-photo"/>
            <textarea className="sm:col-span-3 border border-border rounded-md px-3 py-2 bg-background min-h-20" placeholder="Quote (optional)" value={newResult.quote} onChange={e=>setNewResult({...newResult, quote:e.target.value})} data-testid="nr-quote"/>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nr-submit"><Plus size={14}/>Add Result</Button>
          </form>
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Exam</th><th className="p-3 text-left">Rank</th><th className="p-3 text-left">Year</th><th className="p-3 text-left">Course</th><th className="p-3 text-right">Action</th></tr></thead>
              <tbody>{results.map(r => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 font-bold">{r.student_name}</td>
                  <td className="p-3">{r.exam}</td>
                  <td className="p-3 text-primary font-bold">{r.rank}</td>
                  <td className="p-3 font-mono">{r.year}</td>
                  <td className="p-3">{r.course}</td>
                  <td className="p-3 text-right"><Button size="sm" variant="outline" onClick={() => del(`/results/${r.id}`, "result")} data-testid={`del-result-${r.id}`}><Trash2 size={14}/></Button></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Campaigns */}
        <TabsContent value="campaigns" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Scholarship Campaigns</div>
          <form onSubmit={(e)=>{e.preventDefault(); post("/scholarships", newCampaign, ()=>setNewCampaign({title:"",description:"",exam_date:"",deadline:"",eligibility:"",active:true}), "Campaign");}} className="border border-border p-5 rounded-md grid sm:grid-cols-2 gap-3 mb-6">
            <Input placeholder="Title (e.g. NST 2026)" value={newCampaign.title} onChange={e=>setNewCampaign({...newCampaign, title:e.target.value})} required data-testid="ncm-title"/>
            <Input placeholder="Eligibility" value={newCampaign.eligibility} onChange={e=>setNewCampaign({...newCampaign, eligibility:e.target.value})} required data-testid="ncm-elig"/>
            <Input placeholder="Exam date (YYYY-MM-DD)" value={newCampaign.exam_date} onChange={e=>setNewCampaign({...newCampaign, exam_date:e.target.value})} required data-testid="ncm-exam"/>
            <Input placeholder="Deadline (YYYY-MM-DD)" value={newCampaign.deadline} onChange={e=>setNewCampaign({...newCampaign, deadline:e.target.value})} required data-testid="ncm-dead"/>
            <textarea className="sm:col-span-2 border border-border rounded-md px-3 py-2 bg-background min-h-20" placeholder="Description" value={newCampaign.description} onChange={e=>setNewCampaign({...newCampaign, description:e.target.value})} required data-testid="ncm-desc"/>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={newCampaign.active} onChange={e=>setNewCampaign({...newCampaign, active:e.target.checked})}/>Active</label>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="ncm-submit"><Plus size={14}/>Launch Campaign</Button>
          </form>
          <div className="space-y-2">{campaigns.map(c => (
            <div key={c.id} className={`border ${c.is_featured ? "border-accent ring-1 ring-accent/30" : "border-border"} p-4 rounded-md flex items-start justify-between gap-3`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{c.active ? "Live" : "Closed"}</div>
                  {c.is_featured && <span className="text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded font-bold">★ Featured</span>}
                </div>
                <div className="font-bold">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">Exam {c.exam_date} · Deadline {c.deadline}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant={c.is_featured ? "default" : "outline"} onClick={() => c.is_featured ? clearFeatured() : setFeatured("scholarship", c.id)} data-testid={`feat-camp-${c.id}`}>{c.is_featured ? "Unfeature" : "Feature"}</Button>
                <Button size="sm" variant="outline" onClick={() => del(`/scholarships/${c.id}`, "campaign")} data-testid={`del-camp-${c.id}`}><Trash2 size={14}/></Button>
              </div>
            </div>
          ))}</div>
        </TabsContent>

        {/* Inquiries */}
        <TabsContent value="inquiries" className="mt-6">
          <div className="flex justify-between mb-3"><div className="font-display font-bold text-lg">Inquiries</div><ExportBtn kind="inquiries"/></div>
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Subject</th><th className="p-3 text-left">Message</th></tr></thead>
              <tbody>{inquiries.map(i => (
                <tr key={i.id} className="border-t border-border">
                  <td className="p-3 font-bold">{i.name}</td><td className="p-3">{i.email}</td>
                  <td className="p-3">{i.subject}</td><td className="p-3 text-muted-foreground">{i.message}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
