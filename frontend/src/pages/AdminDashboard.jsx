import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, formatError, API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Trash2, Plus } from "lucide-react";

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

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [enrollments, setEnrollments] = useState([]);
  const [scholarshipApps, setScholarshipApps] = useState([]);
  const [jobApps, setJobApps] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notices, setNotices] = useState([]);
  const [jobs, setJobs] = useState([]);

  // forms
  const [newCourse, setNewCourse] = useState({ title:"", category:"NEET", duration:"", fee:0, description:"", syllabus:[], faculty:[], scholarship_available:true, featured:false, image_url:"" });
  const [newNotice, setNewNotice] = useState({ title:"", content:"", category:"General", pinned:false });
  const [newJob, setNewJob] = useState({ title:"", department:"", location:"", type:"Full-time", description:"", requirements:[], active:true });

  const load = async () => {
    const [s, e, sa, ja, iq, c, n, j] = await Promise.all([
      api.get("/admin/summary"), api.get("/enrollments"), api.get("/scholarship-applications"),
      api.get("/job-applications"), api.get("/inquiries"), api.get("/courses"),
      api.get("/notices"), api.get("/jobs/all"),
    ]);
    setSummary(s.data); setEnrollments(e.data); setScholarshipApps(sa.data);
    setJobApps(ja.data); setInquiries(iq.data); setCourses(c.data); setNotices(n.data); setJobs(j.data);
  };

  useEffect(() => { load().catch(err => toast.error(formatError(err.response?.data?.detail))); }, []);

  const updateStatus = async (kind, id, status) => {
    const map = { enr: "enrollments", sch: "scholarship-applications", job: "job-applications" };
    await api.put(`/${map[kind]}/${id}/status?status=${encodeURIComponent(status)}`);
    toast.success("Updated"); load();
  };

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses", { ...newCourse, fee: Number(newCourse.fee), syllabus: ["Physics","Chemistry","Maths"], faculty: ["Northend Faculty"] });
      toast.success("Course created"); setNewCourse({...newCourse, title:"", description:"", duration:"", fee:0, image_url:""}); load();
    } catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };
  const deleteCourse = async (id) => { await api.delete(`/courses/${id}`); load(); };

  const createNotice = async (e) => {
    e.preventDefault();
    try { await api.post("/notices", newNotice); toast.success("Notice posted"); setNewNotice({title:"",content:"",category:"General",pinned:false}); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };
  const deleteNotice = async (id) => { await api.delete(`/notices/${id}`); load(); };

  const createJob = async (e) => {
    e.preventDefault();
    try { await api.post("/jobs", { ...newJob, requirements: newJob.requirements.length ? newJob.requirements : ["Graduate"] }); toast.success("Job posted"); setNewJob({title:"",department:"",location:"",type:"Full-time",description:"",requirements:[],active:true}); load(); }
    catch (e) { toast.error(formatError(e.response?.data?.detail)); }
  };
  const deleteJob = async (id) => { await api.delete(`/jobs/${id}`); load(); };

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
        <TabsList className="flex flex-wrap h-auto" data-testid="admin-tabs">
          <TabsTrigger value="enrollments" data-testid="tab-enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="scholarships" data-testid="tab-scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="jobapps" data-testid="tab-jobapps">Job Applications</TabsTrigger>
          <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
          <TabsTrigger value="notices" data-testid="tab-notices">Notices</TabsTrigger>
          <TabsTrigger value="jobs" data-testid="tab-jobs">Jobs</TabsTrigger>
          <TabsTrigger value="inquiries" data-testid="tab-inquiries">Inquiries</TabsTrigger>
        </TabsList>

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

        <TabsContent value="jobapps" className="mt-6">
          <div className="flex justify-between mb-3"><div className="font-display font-bold text-lg">Job Applications</div><ExportBtn kind="job-applications"/></div>
          <div className="border border-border rounded-md overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-xs uppercase"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Qual</th><th className="p-3 text-left">Exp</th><th className="p-3 text-left">Status</th></tr></thead>
              <tbody>{jobApps.map(a => (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3 font-bold">{a.name}</td><td className="p-3">{a.email}</td>
                  <td className="p-3">{a.qualification}</td><td className="p-3">{a.experience}</td>
                  <td className="p-3"><select value={a.status} onChange={ev => updateStatus("job", a.id, ev.target.value)} className="text-xs border border-border rounded px-2 py-1 bg-background"><option>received</option><option>shortlisted</option><option>rejected</option><option>hired</option></select></td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Courses</div>
          <form onSubmit={createCourse} className="border border-border p-5 rounded-md grid sm:grid-cols-3 gap-3 mb-6">
            <Input placeholder="Title" value={newCourse.title} onChange={e=>setNewCourse({...newCourse, title:e.target.value})} required data-testid="nc-title"/>
            <select className="border border-border rounded px-3 py-2 bg-background" value={newCourse.category} onChange={e=>setNewCourse({...newCourse, category:e.target.value})}>
              {["NEET","IIT-JEE","Foundation","CUET","NDA","JKBOSE","Crash"].map(x=><option key={x}>{x}</option>)}
            </select>
            <Input placeholder="Duration" value={newCourse.duration} onChange={e=>setNewCourse({...newCourse, duration:e.target.value})} required data-testid="nc-dur"/>
            <Input placeholder="Fee (₹)" type="number" value={newCourse.fee} onChange={e=>setNewCourse({...newCourse, fee:e.target.value})} required data-testid="nc-fee"/>
            <Input placeholder="Image URL" value={newCourse.image_url} onChange={e=>setNewCourse({...newCourse, image_url:e.target.value})} data-testid="nc-img"/>
            <Input placeholder="Description" value={newCourse.description} onChange={e=>setNewCourse({...newCourse, description:e.target.value})} required data-testid="nc-desc"/>
            <Button type="submit" className="bg-primary text-primary-foreground sm:col-span-3" data-testid="nc-submit"><Plus size={14}/>Add Course</Button>
          </form>
          <div className="grid md:grid-cols-3 gap-4">
            {courses.map(c => (
              <div key={c.id} className="border border-border p-4 rounded-md">
                <div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{c.category}</div>
                <div className="font-bold mt-1">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.duration} · ₹{c.fee?.toLocaleString()}</div>
                <Button size="sm" variant="outline" className="mt-3" onClick={()=>deleteCourse(c.id)} data-testid={`del-course-${c.id}`}><Trash2 size={14}/>Delete</Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Notices</div>
          <form onSubmit={createNotice} className="border border-border p-5 rounded-md grid sm:grid-cols-2 gap-3 mb-6">
            <Input placeholder="Title" value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title:e.target.value})} required data-testid="nn-title"/>
            <Input placeholder="Category" value={newNotice.category} onChange={e=>setNewNotice({...newNotice, category:e.target.value})} required data-testid="nn-cat"/>
            <textarea className="sm:col-span-2 border border-border rounded-md px-3 py-2 bg-background min-h-20" placeholder="Content" value={newNotice.content} onChange={e=>setNewNotice({...newNotice, content:e.target.value})} required data-testid="nn-content"/>
            <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={newNotice.pinned} onChange={e=>setNewNotice({...newNotice, pinned:e.target.checked})} data-testid="nn-pin"/>Pin to top</label>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nn-submit"><Plus size={14}/>Post</Button>
          </form>
          <div className="space-y-2">{notices.map(n => (
            <div key={n.id} className="border border-border p-4 rounded-md flex items-start justify-between gap-3">
              <div><div className="text-xs uppercase tracking-[0.18em] font-bold text-primary">{n.category}</div><div className="font-bold">{n.title}</div></div>
              <Button size="sm" variant="outline" onClick={()=>deleteNotice(n.id)} data-testid={`del-notice-${n.id}`}><Trash2 size={14}/></Button>
            </div>
          ))}</div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <div className="font-display font-bold text-lg mb-3">Job Postings</div>
          <form onSubmit={createJob} className="border border-border p-5 rounded-md grid sm:grid-cols-3 gap-3 mb-6">
            <Input placeholder="Title" value={newJob.title} onChange={e=>setNewJob({...newJob, title:e.target.value})} required data-testid="nj-title"/>
            <Input placeholder="Department" value={newJob.department} onChange={e=>setNewJob({...newJob, department:e.target.value})} required data-testid="nj-dept"/>
            <Input placeholder="Location" value={newJob.location} onChange={e=>setNewJob({...newJob, location:e.target.value})} required data-testid="nj-loc"/>
            <Input placeholder="Description" value={newJob.description} onChange={e=>setNewJob({...newJob, description:e.target.value})} required data-testid="nj-desc" className="sm:col-span-2"/>
            <Button type="submit" className="bg-primary text-primary-foreground" data-testid="nj-submit"><Plus size={14}/>Post Job</Button>
          </form>
          <div className="space-y-2">{jobs.map(j => (
            <div key={j.id} className="border border-border p-4 rounded-md flex items-center justify-between">
              <div><div className="font-bold">{j.title}</div><div className="text-xs text-muted-foreground">{j.department} · {j.location}</div></div>
              <Button size="sm" variant="outline" onClick={()=>deleteJob(j.id)} data-testid={`del-job-${j.id}`}><Trash2 size={14}/></Button>
            </div>
          ))}</div>
        </TabsContent>

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
