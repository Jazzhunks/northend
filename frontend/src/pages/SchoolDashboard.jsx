import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { api, API_BASE, formatError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { Eyebrow, Reveal } from "@/components/Cinematic";
import {
  Upload, Calendar, Clock, School, FileText, CheckCircle2, XCircle, Loader2, ArrowLeft, RefreshCw, Download
} from "lucide-react";

const ALLOWED_CLASSES = ["7th Class", "8th Class", "9th Class", "10th Class", "11th Class", "12th Class"];
const ALLOWED_COURSES = ["Foundation", "NEET", "IIT JEE"];

export default function SchoolDashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const [visitForm, setVisitForm] = useState({ preferred_date: "", preferred_slot_time: "", notes: "" });
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fileInputRef = useRef(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await schoolsAPI.downloadTemplate();
      const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "school_students_template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Template downloaded");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    }
  };

  useEffect(() => {
    api.get("/scholarships", { params: { type: "school" } }).then(r => {
      const active = r.data.filter(c => c.active);
      setCampaigns(active);
      if (active.length) setSelectedCampaign(active[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadVisits();
  }, []);

  useEffect(() => {
    if (!selectedCampaign) {
      setAvailableSlots([]);
      return;
    }
    setLoadingSlots(true);
    api.get(`/scholarships/${selectedCampaign}`)
      .then(r => {
        const slots = (r.data && r.data.school_visit_slots) ? r.data.school_visit_slots.filter(s => s && s.date && s.time) : [];
        setAvailableSlots(slots);
      })
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedCampaign]);

  const loadVisits = async () => {
    setLoadingVisits(true);
    try {
      const { data } = await api.get("/school/my-visits");
      setVisits(data || []);
    } catch (e) {
      // ignore
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".xlsx")) {
        toast.error("Only .xlsx files are allowed");
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setFile(selected);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedCampaign) { toast.error("Please select a scholarship campaign"); return; }
    if (!file) { toast.error("Please upload an Excel file"); return; }
    setUploading(true);
    setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append("scholarship_id", selectedCampaign);
      fd.append("file", file);
      const { data } = await api.post("/school/upload-students", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadResult(data);
      toast.success(`Upload complete: ${data.created} students registered, ${data.skipped} skipped`);
      if (data.errors?.length) {
        toast.error(`${data.errors.length} rows had errors`);
      }
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleVisitSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign) { toast.error("Please select a scholarship campaign"); return; }
    if (!visitForm.preferred_date || !visitForm.preferred_slot_time) {
      toast.error("Please fill in date and time");
      return;
    }
    setSubmittingVisit(true);
    try {
      await api.post("/school/visit-request", {
        scholarship_id: selectedCampaign,
        ...visitForm,
      });
      toast.success("Visit request submitted");
      setVisitForm({ preferred_date: "", preferred_slot_time: "", notes: "" });
      loadVisits();
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally {
      setSubmittingVisit(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="relative min-h-[calc(100vh-64px)]" data-testid="school-dashboard">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Eyebrow>School Portal</Eyebrow>
          <h1 className="font-display text-5xl lg:text-6xl font-light tracking-tight mt-4 leading-[0.95]">
            Welcome, <span className="font-medium italic text-accent">{user?.school_name || user?.name?.split(" ")[0] || "school"}.</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">Register your students for scholarship tests and schedule an exam visit at your school.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {/* Upload Section */}
          <Reveal>
            <GlassPanel elevated className="p-7" data-testid="upload-section">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="text-accent" size={20} />
                <h2 className="font-display text-2xl font-bold">Upload Students</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Upload an Excel file (.xlsx) with columns: Name, Mobile, Current Class, Course.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Select Campaign</label>
                  <select className="w-full border border-border rounded-md px-3 py-2.5 bg-background text-sm" value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
                    <option value="">Select a campaign</option>
                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <button type="button" onClick={handleDownloadTemplate} className="w-full border border-dashed border-border rounded-md px-4 py-3 text-sm text-muted-foreground hover:border-accent/50 transition flex items-center justify-center gap-2">
                  <Download size={16} /> Download Template
                </button>
                <div>
                  <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Excel File</label>
                  <input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border border-dashed border-border rounded-md px-4 py-6 text-sm text-muted-foreground hover:border-accent/50 transition flex items-center justify-center gap-2">
                    <FileText size={16} /> {file ? file.name : "Click to upload .xlsx"}
                  </button>
                </div>
                <button type="button" onClick={handleUpload} disabled={uploading || !file || !selectedCampaign} className="w-full bg-primary text-primary-foreground h-11 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                  {uploading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <><Upload size={16} /> Confirm & Submit</>}
                </button>
                {uploadResult && (
                  <div className="mt-3 p-4 bg-muted/40 border border-border rounded-md text-sm space-y-1">
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Processed: {uploadResult.processed}</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Created: {uploadResult.created}</div>
                    <div className="flex items-center gap-2"><XCircle size={16} className="text-rose-500" /> Skipped (duplicates): {uploadResult.skipped}</div>
                    {uploadResult.errors?.length > 0 && (
                      <div className="mt-2 text-rose-500 text-xs">
                        Errors: {uploadResult.errors.length} rows had issues (see console for details)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassPanel>
          </Reveal>

          {/* Visit Request Section */}
          <Reveal delay={0.1}>
            <GlassPanel elevated className="p-7" data-testid="visit-section">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-accent" size={20} />
                <h2 className="font-display text-2xl font-bold">Request Exam Visit</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Request our team to visit your school for the scholarship exam. Select a preferred date and time.</p>
               <form onSubmit={handleVisitSubmit} className="space-y-3">
                 <div>
                   <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Select Campaign</label>
                   <select className="w-full border border-border rounded-md px-3 py-2.5 bg-background text-sm" value={selectedCampaign} onChange={e => setSelectedCampaign(e.target.value)}>
                     <option value="">Select a campaign</option>
                     {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Available Visit Slots</label>
                   {loadingSlots ? (
                     <div className="text-sm text-muted-foreground">Loading slots...</div>
                   ) : availableSlots.length === 0 ? (
                     <div className="text-sm text-rose-500">No visit slots configured for this campaign yet. Please contact admin.</div>
                   ) : (
                     <div className="space-y-2">
                       {availableSlots.map((slot, idx) => (
                         <label key={idx} className={`flex items-center justify-between border rounded-md px-3 py-2.5 cursor-pointer transition ${visitForm.preferred_date === slot.date && visitForm.preferred_slot_time === slot.time ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                           <div className="flex items-center gap-2">
                             <input type="radio" name="visit-slot" className="accent-primary" checked={visitForm.preferred_date === slot.date && visitForm.preferred_slot_time === slot.time} onChange={() => setVisitForm({ ...visitForm, preferred_date: slot.date, preferred_slot_time: slot.time })} />
                             <span className="text-sm font-medium">{slot.date}</span>
                           </div>
                           <span className="text-xs text-muted-foreground">{slot.time}</span>
                         </label>
                       ))}
                     </div>
                   )}
                 </div>
                 <div>
                   <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Notes (optional)</label>
                   <textarea value={visitForm.notes} onChange={e => setVisitForm({...visitForm, notes: e.target.value})} className="w-full border border-border rounded-md px-3 py-2.5 bg-background text-sm" rows={3} placeholder="Any special requirements..."></textarea>
                 </div>
                 <button type="submit" disabled={submittingVisit || !selectedCampaign || !visitForm.preferred_date || !visitForm.preferred_slot_time} className="w-full bg-primary text-primary-foreground h-11 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                   {submittingVisit ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Calendar size={16} /> Submit Request</>}
                 </button>
               </form>
            </GlassPanel>
          </Reveal>
        </div>

        {/* Visit History */}
        <Reveal delay={0.2}>
          <GlassPanel elevated className="p-7 mt-8" data-testid="visit-history">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="text-accent" size={20} />
                <h2 className="font-display text-2xl font-bold">Visit History</h2>
              </div>
              <button onClick={loadVisits} className="text-muted-foreground hover:text-foreground transition"><RefreshCw size={16} /></button>
            </div>
            {loadingVisits ? (
              <div className="text-center text-muted-foreground py-8">Loading...</div>
            ) : visits.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No visit requests yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground border-b border-border">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Admin Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visits.map(v => (
                      <tr key={v.id}>
                        <td className="py-3 px-4">{v.preferred_date}</td>
                        <td className="py-3 px-4">{v.preferred_slot_time}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            v.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                            v.status === "rejected" ? "bg-rose-500/10 text-rose-500" :
                            "bg-amber-500/10 text-amber-500"
                          }`}>
                            {v.status === "approved" && <CheckCircle2 size={12} />}
                            {v.status === "rejected" && <XCircle size={12} />}
                            {v.status === "pending" && <Clock size={12} />}
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{v.admin_notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </Reveal>
      </div>
    </div>
  );
}
