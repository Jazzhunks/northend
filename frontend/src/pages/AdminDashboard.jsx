import { useEffect, useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, formatError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScholarshipNotificationButton from "../components/ScholarshipNotificationButton";
import { 
  Download, Trash2, Plus, Save, Terminal, GraduationCap, 
  ClipboardList, Briefcase, Building2, MessageSquare, 
  HelpCircle, Megaphone, Trophy, Search, Menu, X,
  Loader2, CheckCircle2, AlertCircle, Send, FileSpreadsheet,
  UploadCloud, PlaySquare, Filter, RefreshCw, Eye, ExternalLink,
  User, UserPlus, Printer, Wand2, Image, FileText, Users
} from "lucide-react";
import ChipInput from "@/components/ChipInput";
import FileUpload from "@/components/FileUpload";
import { usePaged, Paginator } from "@/components/Paginator";
import WhatsAppInbox from "@/pages/WhatsAppInbox";
import WATHManagement from "@/pages/WATHManagement";
import AdminSchoolVisits from "@/pages/AdminSchoolVisits";

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

function BulkProgressModal({ isOpen, onClose, state }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-elevated border border-border bg-background p-6 rounded-3xl shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            {state.status === "uploading" || state.status === "processing" ? (
              <Loader2 className="animate-spin text-accent" size={20} />
            ) : state.status === "completed" ? (
              <CheckCircle2 className="text-emerald-600" size={20} />
            ) : (
              <AlertCircle className="text-rose-600" size={20} />
            )}
            <h3 className="font-display font-medium text-lg text-foreground">
              {state.title || "Bulk Batch Processing"}
            </h3>
          </div>
          {state.status !== "uploading" && state.status !== "processing" && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">{state.currentStep}</span>
              <span className="text-accent font-bold">{state.progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden border border-border">
              <div 
                className="h-full bg-accent transition-all duration-300 ease-out" 
                style={{ width: `${state.progress}%` }} 
              />
            </div>
          </div>

          <div className="glass p-4 rounded-xl border border-border bg-background/30 text-xs font-mono space-y-2 text-muted-foreground">
            {state.details?.map((line, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span>{line.label}</span>
                <span className="font-bold text-foreground">{line.value}</span>
              </div>
            ))}
          </div>

          {state.status === "completed" && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 text-xs text-center font-medium animate-fadeIn">
              ✓ Process completed successfully!
            </div>
          )}

          {state.error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 text-xs text-center font-medium animate-fadeIn">
              {state.error}
            </div>
          )}
        </div>

        {(state.status === "completed" || state.status === "error") && (
          <Button 
            onClick={onClose} 
            className="w-full bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider py-2.5"
          >
            Acknowledge &amp; Close
          </Button>
        )}
      </div>
    </div>
  );
}

function WhatsAppBroadcastModal({ scholarshipId, onClose, allApps }) {
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [starting, setStarting] = useState(false);
  const logContainerRef = useRef(null);

  const campaignApps = useMemo(() => allApps.filter(a => a.scholarship_id === scholarshipId), [allApps, scholarshipId]);

  useEffect(() => {
    let interval;
    if (jobId && jobStatus?.status !== "completed" && jobStatus?.status !== "failed") {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/admin/bulk-jobs/${jobId}`);
          setJobStatus(res.data);
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
          }
        } catch (err) {
          console.error("Failed to fetch job status", err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jobId, jobStatus?.status]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const { data } = await api.post(`/admin/scholarships/${scholarshipId}/notify-applicants`);
      setJobId(data.job_id);
      toast.success("Broadcast engine started");
    } catch (error) {
      toast.error(formatError(error.response?.data?.detail) || "Failed to start broadcast");
    } finally {
      setStarting(false);
    }
  };

  const getPercentage = () => {
    if (!jobStatus || jobStatus.total_rows === 0) return 0;
    return Math.round((jobStatus.processed / jobStatus.total_rows) * 100);
  };

  if (!scholarshipId) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl glass-elevated border border-border bg-background p-6 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4 shrink-0">
          <h3 className="font-display font-medium text-xl text-foreground flex items-center gap-2">
            <MessageSquare className="text-[#25D366]" size={20} />
            WhatsApp Broadcast Engine
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
          {!jobId ? (
            <>
              <div className="bg-muted/50 border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div>
                  <div className="font-bold text-foreground">Ready to Broadcast</div>
                  <div className="text-sm text-muted-foreground mt-1 max-w-md">
                    This will generate personalized PDF Admit Cards and send WhatsApp notifications to all <strong>{campaignApps.length}</strong> applicants.
                  </div>
                </div>
                <Button 
                  onClick={handleStart} 
                  disabled={starting || campaignApps.length === 0}
                  className="bg-[#25D366] text-black hover:brightness-110 font-bold rounded-xl px-6 py-3 cursor-pointer shrink-0"
                >
                  {starting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send size={18} className="mr-2"/>} 
                  Start Broadcast
                </Button>
              </div>

              <div className="border border-border rounded-2xl bg-background/20 overflow-hidden flex-1 flex flex-col min-h-[300px]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="p-3 sm:p-4">App No</th>
                      <th className="p-3 sm:p-4">Applicant Name</th>
                      <th className="p-3 sm:p-4">Phone Number</th>
                      <th className="p-3 sm:p-4">Venue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {campaignApps.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-muted-foreground italic">No applicants found.</td></tr>
                    ) : (
                      campaignApps.map(a => (
                        <tr key={a.id} className="hover:bg-muted/50">
                          <td className="p-3 sm:p-4 font-mono text-xs text-muted-foreground">{a.application_no}</td>
                          <td className="p-3 sm:p-4 font-bold">{a.name}</td>
                          <td className="p-3 sm:p-4 font-mono text-xs text-muted-foreground">{a.phone}</td>
                          <td className="p-3 sm:p-4 text-emerald-600 font-medium">{a.venue || a.city}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl border border-border">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {jobStatus?.status === "completed" ? <CheckCircle2 className="text-emerald-600" /> : jobStatus?.status === "failed" ? <AlertCircle className="text-rose-600" /> : <Loader2 className="animate-spin text-accent" />}
                  Live Broadcast Dashboard
                </h3>
                <span className="text-xs font-mono bg-muted/50 px-2 py-1 rounded border border-border">Job ID: {jobId.slice(0,8)}</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total</div>
                  <div className="text-2xl font-bold">{jobStatus?.total_rows || 0}</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Processed</div>
                  <div className="text-2xl font-bold">{jobStatus?.processed || 0}</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Success</div>
                  <div className="text-2xl font-bold text-emerald-600">{jobStatus?.success || 0}</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-4 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Errors</div>
                  <div className="text-2xl font-bold text-rose-600">{jobStatus?.errors || 0}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Overall Progress</span>
                  <span>{getPercentage()}%</span>
                </div>
                <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#25D366] transition-all duration-500 ease-out" 
                    style={{ width: `${getPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="bg-muted/60 border border-border rounded-xl overflow-hidden shadow-inner">
                <div className="px-4 py-2 border-b border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex justify-between bg-black/30">
                  <span>System Activity Log</span>
                  <span>Real-time Stream</span>
                </div>
                <div 
                  ref={logContainerRef}
                  className="p-4 h-64 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 text-foreground/80 custom-scrollbar"
                >
                  {!jobStatus?.recent_logs?.length && <div className="text-muted-foreground italic">Waiting for logs...</div>}
                  {jobStatus?.recent_logs?.map((log, idx) => (
                    <div key={idx} className={`${log.includes("❌") || log.includes("⚠️") ? "text-rose-600" : log.includes("✅") ? "text-emerald-600" : ""}`}>
                      <span className="text-foreground/30 mr-2 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className="break-words">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-5 pt-4 border-t border-border flex justify-end gap-3 shrink-0">
           {(jobStatus?.status === "completed" || jobStatus?.status === "failed") && (
            <Button 
              variant="outline"
              onClick={() => { setJobId(null); setJobStatus(null); }}
              className="rounded-xl text-xs font-bold cursor-pointer"
            >
              Start New Broadcast
            </Button>
          )}
          <Button 
            onClick={onClose} 
            className="bg-muted/50 hover:bg-muted/50 text-foreground rounded-xl text-xs font-bold px-6 cursor-pointer"
          >
            {jobStatus && jobStatus.status !== "completed" && jobStatus.status !== "failed" ? "Close (Runs in Background)" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AsyncBulkRegModal({ scholarshipId, onClose }) {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (jobId && jobStatus?.status !== "completed" && jobStatus?.status !== "failed") {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/admin/bulk-jobs/${jobId}`);
          setJobStatus(res.data);
          
          if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
          }
        } catch (err) {
          console.error("Failed to fetch job status", err);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [jobId, jobStatus?.status]);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post(`/admin/scholarships/${scholarshipId}/bulk-register`, formData, {
        headers: {},
      });
      setJobId(data.job_id);
      toast.success("Bulk job started successfully");
    } catch (error) {
      toast.error(formatError(error.response?.data?.detail) || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getPercentage = () => {
    if (!jobStatus || jobStatus.total_rows === 0) return 0;
    return Math.round((jobStatus.processed / jobStatus.total_rows) * 100);
  };

  if (!scholarshipId) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl glass-elevated border border-border bg-background p-6 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6 shrink-0">
          <h3 className="font-display font-medium text-xl text-foreground flex items-center gap-2">
            <UserPlus className="text-emerald-600" size={20} /> Bulk Registration Engine
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {!jobId ? (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border rounded-xl bg-muted/50 p-6">
              <UploadCloud size={48} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">Upload Bulk Applicant List</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center">Handles 10,000+ rows asynchronously with real-time feedback</p>
              
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-6 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90 cursor-pointer"
              />
              
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex items-center gap-2 px-8 py-3 bg-[#25D366] text-black font-semibold rounded-xl hover:brightness-110 disabled:opacity-50 transition cursor-pointer"
              >
                {uploading ? <Loader2 className="animate-spin" size={18} /> : <PlaySquare size={18} />}
                Start Processing Engine
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {jobStatus?.status === "completed" ? <CheckCircle2 className="text-emerald-600" /> : jobStatus?.status === "failed" ? <AlertCircle className="text-rose-600" /> : <Loader2 className="animate-spin text-accent" />}
                  Live Processing Dashboard
                </h3>
                <span className="text-xs font-mono bg-muted/50 px-2 py-1 rounded border border-border">Job ID: {jobId.slice(0,8)}</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total</div>
                  <div className="text-xl font-bold">{jobStatus?.total_rows || 0}</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Processed</div>
                  <div className="text-xl font-bold">{jobStatus?.processed || 0}</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Success</div>
                  <div className="text-xl font-bold text-emerald-600">{jobStatus?.success || 0}</div>
                </div>
                <div className="bg-muted/50 border border-border rounded-xl p-3 flex flex-col items-center">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Errors</div>
                  <div className="text-xl font-bold text-rose-600">{jobStatus?.errors || 0}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Overall Progress</span>
                  <span>{getPercentage()}%</span>
                </div>
                <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-500 ease-out" 
                    style={{ width: `${getPercentage()}%` }}
                  />
                </div>
              </div>

              <div className="bg-muted/60 border border-border rounded-xl overflow-hidden shadow-inner">
                <div className="px-4 py-2 border-b border-border text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex justify-between bg-black/30">
                  <span>System Activity Log</span>
                  <span>Real-time Stream</span>
                </div>
                <div 
                  ref={logContainerRef}
                  className="p-4 h-56 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 text-foreground/80 custom-scrollbar"
                >
                  {!jobStatus?.recent_logs?.length && <div className="text-muted-foreground italic">Waiting for logs...</div>}
                  {jobStatus?.recent_logs?.map((log, idx) => (
                    <div key={idx} className={`${log.includes("❌") || log.includes("⚠️") ? "text-rose-600" : log.includes("✅") ? "text-emerald-600" : ""}`}>
                      <span className="text-foreground/30 mr-2 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span className="break-words">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-end gap-3 shrink-0">
          {(jobStatus?.status === "completed" || jobStatus?.status === "failed") && (
            <Button 
              variant="outline"
              onClick={() => { setJobId(null); setFile(null); setJobStatus(null); }}
              className="rounded-xl text-xs font-bold"
            >
              Start Another Upload
            </Button>
          )}
          <Button 
            onClick={onClose} 
            className="bg-muted/50 hover:bg-muted/50 text-foreground rounded-xl text-xs font-bold px-6"
          >
            {jobStatus && jobStatus.status !== "completed" && jobStatus.status !== "failed" ? "Background Execution" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CampaignOperationsModal({ 
  scholarshipId, 
  onClose, 
  onDownloadResultsTemplate, 
  onUploadResults, 
  onDownloadRegTemplate,
  onOpenBulkReg,
  onDownloadAttendance,
  allApps,
  onRefresh
}) {
  const [downloading, setDownloading] = useState(null); 
  const [viewTab, setViewTab] = useState("applicants"); 
  const [isCleaning, setIsCleaning] = useState(false);

  const campaignApps = useMemo(() => allApps.filter(a => a.scholarship_id === scholarshipId), [allApps, scholarshipId]);

  // Generate logistics matrix based on current applications and force all CLASSES to exist
  const logisticsData = useMemo(() => {
    const matrix = {};
    const classesSet = new Set(CLASSES);

    campaignApps.forEach(a => {
      // Use the visual normalizer here so the Matrix is always perfectly formatted!
      const venue = normalizeVenue(a.venue || a.city || "Unassigned");
      const std = normalizeClass(a.standard || "Unknown", a.target_exam);
      
      classesSet.add(std);
      
      if (!matrix[venue]) matrix[venue] = {};
      if (!matrix[venue][std]) matrix[venue][std] = 0;
      matrix[venue][std]++;
    });

    return {
      matrix,
      classes: Array.from(classesSet).sort((a, b) => {
        const idxA = CLASSES.indexOf(a);
        const idxB = CLASSES.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.localeCompare(b);
      }),
      venues: Object.keys(matrix).sort()
    };
  }, [campaignApps]);

  const handleDownload = async (actionName, actionFn, ...args) => {
    setDownloading(actionName);
    try {
      await actionFn(...args);
    } finally {
      setDownloading(null);
    }
  };

  // AUTO-CLEAN CLASS & VENUE DATA
  const handleCleanData = async () => {
    setIsCleaning(true);
    let updatedCount = 0;
    try {
      for (const app of campaignApps) {
        const currentStd = app.standard || "";
        const normalizedStd = normalizeClass(currentStd, app.target_exam);
        
        const currentVenue = app.venue || app.city || "Unassigned";
        const normalizedVenue = normalizeVenue(currentVenue);

        const updates = {};
        
        // If class needs updating
        if (normalizedStd !== currentStd && CLASSES.includes(normalizedStd)) {
          updates.standard = normalizedStd;
        }
        
        // If venue needs updating
        if (normalizedVenue !== currentVenue && normalizedVenue !== "Unassigned") {
          updates.venue = normalizedVenue;
          updates.city = normalizedVenue; // Keep city in sync with venue to keep DB clean
        }

        if (Object.keys(updates).length > 0) {
          await api.put(`/scholarship-applications/${app.application_no}`, updates);
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        toast.success(`Successfully auto-formatted ${updatedCount} applicant records.`);
        if (onRefresh) onRefresh();
      } else {
        toast.info("All classes and venues are already uniformly formatted.");
      }
    } catch (error) {
      toast.error(formatError(error.response?.data?.detail) || "Error formatting data");
    } finally {
      setIsCleaning(false);
    }
  };

  // Safe early return placed AFTER all hooks
  if (!scholarshipId) return null;

  return (
    <div className="fixed inset-0 z-[2147483648] flex items-center justify-center p-4 bg-black/30 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-5xl glass-elevated border border-border bg-background p-6 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5 shrink-0">
          <h3 className="font-display font-medium text-xl text-foreground flex items-center gap-2">
            <Terminal className="text-accent" size={20} />
            Manage Campaign Operations
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1">
            <X size={20} />
          </button>
        </div>

        {/* Top Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
          {/* Pre-Exam Panel */}
          <div className="glass p-5 rounded-2xl border border-border bg-background/30 flex flex-col items-center text-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500/50"></div>
            <UserPlus size={26} className="text-emerald-600 mb-1" />
            <div className="font-bold text-foreground text-sm">1. Bulk Registration</div>
            <div className="text-xs text-muted-foreground flex-1 mb-2">Register students and dispatch WhatsApp admit cards.</div>
            
            <Button 
              variant="outline" size="sm" 
              onClick={() => handleDownload("reg-temp", onDownloadRegTemplate, scholarshipId)} 
              disabled={downloading === "reg-temp"} 
              className="w-full text-xs rounded-xl border-border hover:bg-muted/50 cursor-pointer"
            >
              {downloading === "reg-temp" ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Download size={13} className="mr-1.5"/>} 
              Registration Template
            </Button>
            <Button 
              size="sm" 
              onClick={() => { onOpenBulkReg(scholarshipId); onClose(); }} 
              className="w-full text-xs font-bold rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 cursor-pointer"
            >
              <Send size={13} className="mr-1.5"/> Upload & Dispatch
            </Button>
          </div>

          {/* Post-Exam Panel */}
          <div className="glass p-5 rounded-2xl border border-border bg-background/30 flex flex-col items-center text-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-accent/50"></div>
            <FileSpreadsheet size={26} className="text-accent mb-1" />
            <div className="font-bold text-foreground text-sm">2. Grade & Publish</div>
            <div className="text-xs text-muted-foreground flex-1 mb-2">Input offline exam scores to update student results.</div>
            
            <Button 
              variant="outline" size="sm" 
              onClick={() => handleDownload("res-temp", onDownloadResultsTemplate, scholarshipId)} 
              disabled={downloading === "res-temp"} 
              className="w-full text-xs rounded-xl border-border hover:bg-muted/50 cursor-pointer"
            >
              {downloading === "res-temp" ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Download size={13} className="mr-1.5"/>} 
              Scores Template
            </Button>
            
            <input
              type="file"
              accept=".xlsx"
              id="bulk-result-upload"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  onUploadResults(scholarshipId, f);
                  e.target.value = ""; 
                  onClose(); 
                }
              }}
            />
            <Button 
              size="sm" 
              onClick={() => document.getElementById("bulk-result-upload")?.click()} 
              className="w-full text-xs font-bold rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
            >
              <UploadCloud size={13} className="mr-1.5" /> Upload Scores
            </Button>
          </div>

          {/* Reports Panel */}
          <div className="glass p-5 rounded-2xl border border-border bg-background/30 flex flex-col items-center text-center gap-2 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-blue-400/50"></div>
            <Printer size={26} className="text-blue-400 mb-1" />
            <div className="font-bold text-foreground text-sm">3. Logistics & Reports</div>
            <div className="text-xs text-muted-foreground flex-1 mb-2">Export attendance logs and check print requirements.</div>
            
            <Button 
              variant="outline" size="sm" 
              onClick={() => handleDownload("att-rep", onDownloadAttendance, scholarshipId)} 
              disabled={downloading === "att-rep"} 
              className="w-full text-xs font-bold rounded-xl border-border hover:bg-muted/50 cursor-pointer"
            >
              {downloading === "att-rep" ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Download size={13} className="mr-1.5"/>} 
              Attendance Log
            </Button>
            <Button 
              size="sm" 
              onClick={() => setViewTab("logistics")} 
              className="w-full text-xs font-bold rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
            >
              <ClipboardList size={13} className="mr-1.5"/> Print Requirements
            </Button>
          </div>
        </div>

        {/* Data / Matrix Viewer */}
        <div className="flex-1 min-h-[250px] flex flex-col border border-border rounded-2xl bg-background/20 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-muted border-b border-border shrink-0 z-20">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewTab("applicants")} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${viewTab === "applicants" ? "bg-accent text-accent-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
              >
                Applicants ({campaignApps.length})
              </button>
              <button 
                onClick={() => setViewTab("logistics")} 
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${viewTab === "logistics" ? "bg-accent text-accent-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
              >
                Print & Logistics Matrix
              </button>
            </div>
            
            {/* CLEAN DATA BUTTON (Now handles venues AND classes) */}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCleanData}
              disabled={isCleaning || campaignApps.length === 0}
              className="h-8 text-xs font-bold bg-muted/50 hover:bg-muted/50 border-border cursor-pointer text-muted-foreground hover:text-foreground"
            >
              {isCleaning ? <Loader2 size={13} className="animate-spin mr-1.5"/> : <Wand2 size={13} className="mr-1.5"/>}
              Auto-Format Data
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {viewTab === "applicants" && (
              <table className="w-full text-sm text-left relative">
                <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider sticky top-0 z-10 shadow-[0_4px_20px_rgba(60,73,82,0.08)] border-b border-border">
                  <tr>
                    <th className="p-3 sm:p-4 whitespace-nowrap">App No</th>
                    <th className="p-3 sm:p-4 whitespace-nowrap">Applicant Name</th>
                    <th className="p-3 sm:p-4 whitespace-nowrap">School / Institute</th>
                    <th className="p-3 sm:p-4 whitespace-nowrap">Standard</th>
                    <th className="p-3 sm:p-4 text-center whitespace-nowrap">Score Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {campaignApps.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-muted-foreground italic bg-background/10">
                        No approved applicants found for this campaign yet.
                      </td>
                    </tr>
                  ) : (
                    campaignApps.map(a => (
                      <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                        <td className="p-3 sm:p-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{a.application_no}</td>
                        <td className="p-3 sm:p-4 font-bold whitespace-nowrap">{a.name}</td>
                        <td className="p-3 sm:p-4 text-muted-foreground truncate max-w-[200px]" title={a.school || ""}>{a.school || "—"}</td>
                        <td className="p-3 sm:p-4 text-muted-foreground whitespace-nowrap">{a.standard || "—"}</td>
                        <td className="p-3 sm:p-4 text-center">
                          {a.result_published ? (
                            <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                              Published ({a.result_marks_obtained || 0})
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider bg-muted/50 border border-border text-muted-foreground px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {viewTab === "logistics" && (
              <div className="p-4 sm:p-6 animate-fadeIn">
                <div className="mb-4">
                  <h4 className="font-display font-medium text-lg text-foreground">Printing Requirements Matrix</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Use this breakdown to determine exact exam paper counts needed per class, per center.</p>
                </div>
                
                {campaignApps.length === 0 ? (
                  <EmptyState title="No Data Available" description="Register applicants to generate the logistics matrix." />
                ) : (
                  <div className="overflow-x-auto glass border border-border rounded-2xl">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wider border-b border-border">
                        <tr>
                          <th className="p-3 sm:p-4 whitespace-nowrap">Standard / Class</th>
                          {logisticsData.venues.map(v => (
                            <th key={v} className="p-3 sm:p-4 text-center whitespace-nowrap">{v}</th>
                          ))}
                          <th className="p-3 sm:p-4 text-center text-accent whitespace-nowrap">Total Print</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {logisticsData.classes.map(c => {
                          let rowTotal = 0;
                          return (
                            <tr key={c} className="hover:bg-muted/50">
                              <td className="p-3 sm:p-4 font-bold text-foreground whitespace-nowrap">{c}</td>
                              {logisticsData.venues.map(v => {
                                const count = logisticsData.matrix[v]?.[c] || 0;
                                rowTotal += count;
                                return (
                                  <td key={v} className="p-3 sm:p-4 text-center font-mono text-muted-foreground">
                                    {count > 0 ? count : "-"}
                                  </td>
                                );
                              })}
                              <td className="p-3 sm:p-4 text-center font-bold text-accent font-mono">{rowTotal}</td>
                            </tr>
                          );
                        })}
                        {/* Grand Totals Row */}
                        <tr className="bg-muted border-t border-border">
                          <td className="p-3 sm:p-4 font-bold text-foreground whitespace-nowrap">VENUE TOTAL</td>
                          {logisticsData.venues.map(v => {
                            const vTotal = logisticsData.classes.reduce((sum, c) => sum + (logisticsData.matrix[v]?.[c] || 0), 0);
                            return <td key={v} className="p-3 sm:p-4 text-center font-bold text-emerald-600 font-mono">{vTotal}</td>;
                          })}
                          <td className="p-3 sm:p-4 text-center font-bold text-accent font-mono">{campaignApps.length}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const emptyCourse = { title:"", category:"NEET", duration:"", fee:0, description:"", syllabus:[], faculty:[], features:[], scholarship_available:true, featured:false, image_url:"" };

function CourseForm({ initial, onCancel, onSave, busy }) {
  const [c, setC] = useState(initial || emptyCourse);
  const submit = (e) => { e.preventDefault(); onSave({ ...c, fee: Number(c.fee) }); };
  return (
    <form onSubmit={submit} className="glass-elevated p-4 sm:p-6 rounded-2xl bg-background border border-border grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn" data-testid="course-form">
      <Input placeholder="Course Title" value={c.title} onChange={e=>setC({...c, title:e.target.value})} required data-testid="cf-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
      <select className="border border-border rounded-xl px-3 py-2 bg-background text-sm focus:outline-none focus:border-accent text-foreground font-medium" value={c.category} onChange={e=>setC({...c, category:e.target.value})} data-testid="cf-cat">
        {CATEGORIES.map(x=><option key={x} className="bg-background text-foreground">{x}</option>)}
      </select>
      <Input placeholder="Duration (e.g. 12 months)" value={c.duration} onChange={e=>setC({...c, duration:e.target.value})} required data-testid="cf-dur" className="rounded-xl border-border bg-background/50 text-foreground"/>
      <Input placeholder="Fee in ₹" type="number" value={c.fee} onChange={e=>setC({...c, fee:e.target.value})} required data-testid="cf-fee" className="rounded-xl border-border bg-background/50 text-foreground"/>
      <Input placeholder="Banner Image URL" value={c.image_url || ""} onChange={e=>setC({...c, image_url:e.target.value})} className="sm:col-span-2 rounded-xl border-border bg-background/50 text-foreground" data-testid="cf-img"/>
      <textarea className="sm:col-span-2 glass border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Description details..." value={c.description} onChange={e=>setC({...c, description:e.target.value})} required data-testid="cf-desc"/>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Syllabus Highlights</label>
        <ChipInput testId="cf-syllabus" value={c.syllabus || []} onChange={(v) => setC({...c, syllabus: v})} placeholder="e.g. Physics, Chemistry, NCERT Mastery"/>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Faculty Members</label>
        <ChipInput testId="cf-faculty" value={c.faculty || []} onChange={(v) => setC({...c, faculty: v})} placeholder="e.g. Dr. A. Wani (Physics)"/>
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Key Features</label>
        <ChipInput testId="cf-features" value={c.features || []} onChange={(v) => setC({...c, features: v})} placeholder="e.g. Daily doubt sessions, Weekly mock tests"/>
      </div>
      <label className="text-sm flex items-center gap-2 text-muted-foreground select-none cursor-pointer"><input type="checkbox" checked={c.scholarship_available} onChange={e=>setC({...c, scholarship_available: e.target.checked})} className="accent-primary" data-testid="cf-sch"/>Scholarship Available</label>
      <label className="text-sm flex items-center gap-2 text-muted-foreground select-none cursor-pointer"><input type="checkbox" checked={c.featured} onChange={e=>setC({...c, featured: e.target.checked})} className="accent-primary" data-testid="cf-feat"/>Featured on Home</label>
      <div className="sm:col-span-2 flex flex-wrap gap-2 pt-2">
        <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2" data-testid="cf-save">
          {busy ? <Loader2 className="animate-spin mr-1.5" size={14} /> : <Save size={14} className="mr-1.5"/>}
          {initial?.id ? "Save Changes" : "Create Course"}
        </Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} data-testid="cf-cancel" className="rounded-xl text-xs font-bold uppercase tracking-wider">Cancel</Button>}
      </div>
    </form>
  );
}

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
  
  const [portalHost, setPortalHost] = useState(null);

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

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const host = document.createElement("div");
    host.setAttribute("data-admin-dashboard-host", "true");
    host.style.position = "fixed";
    host.style.inset = "0";
    host.style.width = "100vw";
    host.style.height = "100dvh";
    host.style.margin = "0";
    host.style.padding = "0";
    host.style.zIndex = "2147483647";
    host.style.display = "block";
    host.style.visibility = "visible";
    host.style.opacity = "1";
    host.style.pointerEvents = "auto";
    host.style.overflow = "hidden";
    host.style.isolation = "isolate";

    document.body.appendChild(host);
    setPortalHost(host);

    return () => {
      host.remove();
    };
  }, []);

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

  if (!portalHost) return null;

  return createPortal(
    <div
      className="fixed inset-0 isolate w-screen h-[100dvh] min-h-0 flex flex-col lg:flex-row overflow-hidden select-none"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        minHeight: 0,
        margin: 0,
        padding: 0,
        zIndex: 2147483647,
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
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground p-1 hover:text-foreground">
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
            <div className="relative w-full sm:w-80 shrink-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
              <input 
                type="text"
                value={innerSearch}
                onChange={e => setInnerSearch(e.target.value)}
                placeholder="Search active tab records..."
                className="w-full pl-9 pr-8 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground placeholder:text-muted-foreground/60"
              />
              {innerSearch && (
                <button onClick={() => setInnerSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>
            <Button size="icon" variant="outline" onClick={load} disabled={loadingData} className="rounded-xl border-border shrink-0 hover:bg-muted/50 cursor-pointer">
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
                                <select value={e.status} onChange={ev => updateStatus("enr", e.id, ev.target.value)} className="text-xs font-bold uppercase border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none cursor-pointer">
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
                              <select value={a.status} onChange={ev => updateStatus("sch", a.id, ev.target.value)} className="text-xs font-bold uppercase border border-border rounded-lg px-2.5 py-1 bg-background text-foreground cursor-pointer"><option>pending</option><option>approved</option><option>rejected</option></select>
                              
                              <Button size="sm" variant={editingApp ? "default" : "outline"} onClick={() => setAppEditor(prev => ({ ...prev, [a.application_no]: editingApp ? undefined : appData }))} className="rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer">
                                {editingApp ? "Close Info" : "Edit Info"}
                              </Button>

                              <Button size="sm" variant={editing ? "default" : "outline"} onClick={() => setResultEditor(prev => ({ ...prev, [a.id]: editing ? undefined : r }))} data-testid={`toggle-result-${a.id}`} className="rounded-xl text-xs uppercase tracking-wider font-bold cursor-pointer">
                                {editing ? "Close Score" : (a.result_published ? "Edit Score" : "Log Result")}
                              </Button>
                            </div>
                          </div>

                          {editingApp && (
                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-fadeIn">
                              <div className="col-span-full text-[11px] uppercase tracking-wider font-bold text-accent mb-1 flex items-center">
                                <User size={14} className="mr-1.5"/> Edit Applicant Identity & Venue
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                                <Input value={appData.name} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, name: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                                <Input value={appData.email} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, email: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
                                <Input value={appData.phone} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, phone: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">School / Institute</label>
                                <Input value={appData.school} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, school: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Standard / Class</label>
                                <Input value={appData.standard} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, standard: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Target Exam</label>
                                <Input value={appData.target_exam} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, target_exam: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">City / Region</label>
                                <Input value={appData.city} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, city: e.target.value}}))} className="rounded-xl border-border bg-background text-foreground"/>
                              </div>
                              
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1 flex items-center justify-between">Venue <span className="text-emerald-600 font-bold ml-1">(Can be custom)</span></label>
                                <Input value={appData.venue} onChange={e=>setAppEditor(prev=>({...prev, [a.application_no]: {...appData, venue: e.target.value}}))} className="rounded-xl border-emerald-500/30 bg-emerald-500/5 text-foreground"/>
                              </div>
                              
                              <div className="col-span-full flex flex-wrap gap-2 pt-2">
                                <Button onClick={() => saveAppDetails(a.application_no, appData)} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer">
                                  <Save size={14} className="mr-1.5"/> Save Applicant Details
                                </Button>
                                <Button variant="outline" onClick={() => setAppEditor(prev => ({ ...prev, [a.application_no]: undefined }))} className="rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {editing && (
                            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn" data-testid={`result-form-${a.id}`}>
                              <div className="col-span-full text-[11px] uppercase tracking-wider font-bold text-accent mb-1 flex items-center">
                                <Trophy size={14} className="mr-1.5"/> Edit Examination Scores
                              </div>
                              <Input placeholder="Marks obtained" type="number" value={r.marks_obtained} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, marks_obtained: e.target.value}}))} data-testid={`r-marks-${a.id}`} className="rounded-xl border-border bg-background text-foreground font-mono"/>
                              <Input placeholder="Total marks" type="number" value={r.total_marks} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, total_marks: e.target.value}}))} data-testid={`r-total-${a.id}`} className="rounded-xl border-border bg-background text-foreground font-mono"/>
                              <Input placeholder="Scholarship %" type="number" min={0} max={100} value={r.scholarship_percentage} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, scholarship_percentage: e.target.value}}))} data-testid={`r-pct-${a.id}`} className="rounded-xl border-border bg-background text-foreground font-mono"/>
                              <Input placeholder="Rank (optional)" type="number" value={r.rank} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, rank: e.target.value}}))} data-testid={`r-rank-${a.id}`} className="rounded-xl border-border bg-background text-foreground font-mono"/>
                              <Input placeholder="Percentile (optional)" type="number" step="0.01" value={r.percentile} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, percentile: e.target.value}}))} data-testid={`r-perc-${a.id}`} className="rounded-xl border-border bg-background text-foreground font-mono"/>
                              <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2 select-none cursor-pointer"><input type="checkbox" checked={!!r.publish} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, publish: e.target.checked}}))} className="accent-primary"/>Publish output</label>
                              <textarea className="sm:col-span-3 border border-border rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent min-h-16 resize-none" placeholder="Remarks / Guidance (optional)" value={r.remarks} onChange={e=>setResultEditor(prev=>({...prev, [a.id]: {...r, remarks: e.target.value}}))} />
                              <div className="sm:col-span-3 flex flex-wrap gap-2 pt-1">
                                <Button onClick={() => saveResult(a.id, r)} className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer" data-testid={`r-save-${a.id}`}><Save size={14} className="mr-1.5"/>{r.publish ? "Commit & Publish" : "Save Draft"}</Button>
                                <Button variant="outline" onClick={() => setResultEditor(prev => ({ ...prev, [a.id]: undefined }))} className="rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">Cancel</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                                <select value={a.status} onChange={ev => updateStatus("job", a.id, ev.target.value)} className="text-xs font-bold uppercase border border-border rounded-lg px-2 py-1 bg-background text-foreground focus:outline-none cursor-pointer">
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
                <form onSubmit={(e)=>{e.preventDefault(); post("/notices", newNotice, ()=>setNewNotice({title:"",content:"",category:"General",pinned:false}), "Notice");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Notice Title" value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title:e.target.value})} required data-testid="nn-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Category Tag" value={newNotice.category} onChange={e=>setNewNotice({...newNotice, category:e.target.value})} required data-testid="nn-cat" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <textarea className="sm:col-span-2 border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Notice body content..." value={newNotice.content} onChange={e=>setNewNotice({...newNotice, content:e.target.value})} required />
                  <label className="text-sm flex items-center gap-2 text-muted-foreground cursor-pointer select-none"><input type="checkbox" checked={newNotice.pinned} onChange={e=>setNewNotice({...newNotice, pinned: e.target.checked})} className="accent-primary" />Pin dispatch to priority index window</label>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Post Notice</Button>
                </form>
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
                <form onSubmit={(e)=>{e.preventDefault(); post("/jobs", { ...newJob, requirements: newJob.requirements.length ? newJob.requirements : ["Graduate"] }, ()=>setNewJob({title:"",department:"",location:"",type:"Full-time",description:"",requirements:[],active:true}), "Job");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/20">
                  <Input placeholder="Job Title" value={newJob.title} onChange={e=>setNewJob({...newJob, title:e.target.value})} required data-testid="nj-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Department" value={newJob.department} onChange={e=>setNewJob({...newJob, department:e.target.value})} required data-testid="nj-dept" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Location" value={newJob.location} onChange={e=>setNewJob({...newJob, location:e.target.value})} required data-testid="nj-loc" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Short Description Summary" value={newJob.description} onChange={e=>setNewJob({...newJob, description:e.target.value})} required data-testid="nj-desc" className="sm:col-span-3 rounded-xl border-border bg-background/50 text-foreground"/>
                  <div className="sm:col-span-3"><label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Prerequisite Qualifications Requirements</label><ChipInput testId="nj-req" value={newJob.requirements} onChange={(v)=>setNewJob({...newJob, requirements:v})}/></div>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Deploy Career Index</Button>
                </form>
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
                <form onSubmit={(e)=>{e.preventDefault(); post("/centers", newCenter, ()=>setNewCenter({name:"",city:"",address:"",phone:"",timing:"8:00 AM – 8:00 PM",lat:34.0837,lng:74.7973}), "Center");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/20">
                  <Input placeholder="Center Hub Name" value={newCenter.name} onChange={e=>setNewCenter({...newCenter, name:e.target.value})} required data-testid="nc2-name" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="City Scope" value={newCenter.city} onChange={e=>setNewCenter({...newCenter, city:e.target.value})} required data-testid="nc2-city" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Contact Support Line" value={newCenter.phone} onChange={e=>setNewCenter({...newCenter, phone:e.target.value})} required data-testid="nc2-phone" className="rounded-xl border-border bg-background/50 text-foreground font-mono text-xs"/>
                  <Input placeholder="Complete Physical Address" value={newCenter.address} onChange={e=>setNewCenter({...newCenter, address:e.target.value})} required data-testid="nc2-addr" className="sm:col-span-2 rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Timing Boundaries" value={newCenter.timing} onChange={e=>setNewCenter({...newCenter, timing:e.target.value})} data-testid="nc2-timing" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Latitude" type="number" step="any" value={newCenter.lat} onChange={e=>setNewCenter({...newCenter, lat: Number(e.target.value)})} data-testid="nc2-lat" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Longitude" type="number" step="any" value={newCenter.lng} onChange={e=>setNewCenter({...newCenter, lng: Number(e.target.value)})} data-testid="nc2-lng" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Add Station Hub</Button>
                </form>
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
                <form onSubmit={(e)=>{e.preventDefault(); post("/testimonials", newTestimonial, ()=>setNewTestimonial({name:"",role:"",quote:""}), "Testimonial");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Endorsee Full Name" value={newTestimonial.name} onChange={e=>setNewTestimonial({...newTestimonial, name:e.target.value})} required data-testid="nt-name" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Role / Standing Identity" value={newTestimonial.role} onChange={e=>setNewTestimonial({...newTestimonial, role:e.target.value})} required data-testid="nt-role" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <textarea className="sm:col-span-2 border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Verbatim review quotation string..." value={newTestimonial.quote} onChange={e=>setNewTestimonial({...newTestimonial, quote:e.target.value})} required />
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Commit Review</Button>
                </form>
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
                <form onSubmit={(e)=>{e.preventDefault(); post("/results", { ...newResult, year: Number(newResult.year) }, ()=>setNewResult({student_name:"",exam:"",rank:"",year:new Date().getFullYear(),course:"NEET",photo_url:"",quote:""}), "Result");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 bg-background/20">
                  <Input placeholder="Student Name" value={newResult.student_name} onChange={e=>setNewResult({...newResult, student_name:e.target.value})} required data-testid="nr-name" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Examination Scale" value={newResult.exam} onChange={e=>setNewResult({...newResult, exam:e.target.value})} required data-testid="nr-exam" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Score Rank Metric (AIR/State)" value={newResult.rank} onChange={e=>setNewResult({...newResult, rank:e.target.value})} required data-testid="nr-rank" className="rounded-xl border-border bg-background/50 text-foreground text-accent font-bold"/>
                  <Input placeholder="Year" type="number" value={newResult.year} onChange={e=>setNewResult({...newResult, year:Number(e.target.value)})} required data-testid="nr-year" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <select className="border border-border rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer" value={newResult.course} onChange={e=>setNewResult({...newResult, course:e.target.value})} data-testid="nr-course">
                    {CATEGORIES.map(x=><option key={x} className="bg-background text-foreground">{x}</option>)}
                  </select>
                  <Input placeholder="Portrait asset URL endpoint" value={newResult.photo_url} onChange={e=>setNewResult({...newResult, photo_url:e.target.value})} data-testid="nr-photo" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <textarea className="sm:col-span-3 border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Learner reflection quote validation string..." value={newResult.quote} onChange={e=>setNewResult({...newResult, quote:e.target.value})} />
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Publish Honors Record</Button>
                </form>
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
                <form onSubmit={(e)=>{e.preventDefault(); const payload = { ...newGallery, category: newGallery.category || "Uncategorised" }; if (!payload.media_url && payload.media_type !== "text") delete payload.media_url; if (editingGalleryId) { api.put(`/admin/gallery/${editingGalleryId}`, payload).then(() => { toast.success("Gallery item updated"); setEditingGalleryId(null); setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 }); load(); }).catch(err => toast.error(formatError(err.response?.data?.detail))); } else { post("/admin/gallery", payload, ()=>setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 }), "Gallery item"); }}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Title" value={newGallery.title} onChange={e=>setNewGallery({...newGallery, title:e.target.value})} required data-testid="ng-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Category (e.g. Campus, Events)" value={newGallery.category} onChange={e=>setNewGallery({...newGallery, category:e.target.value})} list="gallery-categories" data-testid="ng-category" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <datalist id="gallery-categories">
                    {galleryCategories.map(c => <option key={c} value={c} />)}
                  </datalist>
                  <select className="border border-border rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer" value={newGallery.media_type} onChange={e=>setNewGallery({...newGallery, media_type:e.target.value})}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="text">Text / Paragraph</option>
                  </select>
                  <div className="sm:col-span-2">
                    <FileUpload
                      label={newGallery.media_type === "video" ? "Upload video" : newGallery.media_type === "text" ? "Optional image for text post" : "Upload image"}
                      accept={newGallery.media_type === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp"}
                      onUploaded={(file) => file && setNewGallery(prev => ({ ...prev, media_url: file.url }))}
                      testId="gallery-upload"
                    />
                  </div>
                  {newGallery.media_url && (
                    <div className="sm:col-span-2">
                      <div className="relative inline-block">
                        {newGallery.media_type === "video" ? (
                          <video src={newGallery.media_url} controls className="max-h-40 rounded-xl" />
                        ) : (
                          <img src={newGallery.media_url} alt="Preview" className="max-h-40 rounded-xl object-cover" />
                        )}
                        <button type="button" onClick={()=>setNewGallery(prev => ({...prev, media_url:""}))} className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-lg"><X size={14}/></button>
                      </div>
                    </div>
                  )}
                  <textarea className="sm:col-span-2 border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-24 resize-none" placeholder="Caption or paragraph text..." value={newGallery.description} onChange={e=>setNewGallery({...newGallery, description:e.target.value})} />
                  <div className="sm:col-span-2 flex gap-3">
                    <Button type="submit" className="flex-1 bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>{editingGalleryId ? "Update Item" : "Add to gallery"}</Button>
                    {editingGalleryId && <Button type="button" onClick={()=>{setEditingGalleryId(null); setNewGallery({ title:"", description:"", media_type:"image", media_url:"", category:"", order:0 });}} className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">Cancel</Button>}
                  </div>
                </form>
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
                <form onSubmit={(e)=>{e.preventDefault(); const payload = { ...newPost, tags: (newPost.tags || []).filter(Boolean) }; if (!payload.slug) payload.slug = slugify(payload.title); if (!payload.meta_title) payload.meta_title = payload.title.slice(0, 60); if (!payload.meta_description) payload.meta_description = payload.excerpt || payload.title.slice(0, 160); post("/admin/posts", payload, ()=>setNewPost({ title:"", slug:"", excerpt:"", content:"", category:"", tags:[], author:"Admin", featured_image_url:"", image_alt:"", og_image_url:"", meta_title:"", meta_description:"", status:"draft", visibility:"public", published_at:"" }), "Post");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Post title" value={newPost.title} onChange={e=>setNewPost({...newPost, title:e.target.value})} required data-testid="np-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Slug / permalink" value={newPost.slug} onChange={e=>setNewPost({...newPost, slug:e.target.value})} required data-testid="np-slug" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Category (e.g. Exam Tips)" value={newPost.category} onChange={e=>setNewPost({...newPost, category:e.target.value})} data-testid="np-category" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Author" value={newPost.author} onChange={e=>setNewPost({...newPost, author:e.target.value})} data-testid="np-author" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1.5 block">Content</label>
                    <textarea className="w-full border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-48 resize-y font-mono" placeholder="HTML or plain text content..." value={newPost.content} onChange={e=>setNewPost({...newPost, content:e.target.value})} required data-testid="np-content" />
                  </div>
                  <textarea className="sm:col-span-2 border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Short excerpt / summary..." value={newPost.excerpt} onChange={e=>setNewPost({...newPost, excerpt:e.target.value})} data-testid="np-excerpt" />
                  <div className="sm:col-span-2">
                    <FileUpload label="Featured image" accept="image/jpeg,image/png,image/webp" onUploaded={(file) => file && setNewPost(prev => ({ ...prev, featured_image_url: file.url }))} testId="post-featured-image" />
                  </div>
                  <Input placeholder="Image alt text" value={newPost.image_alt} onChange={e=>setNewPost({...newPost, image_alt:e.target.value})} data-testid="np-image-alt" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="OG image URL (optional)" value={newPost.og_image_url} onChange={e=>setNewPost({...newPost, og_image_url:e.target.value})} data-testid="np-og-image" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Meta title" value={newPost.meta_title} onChange={e=>setNewPost({...newPost, meta_title:e.target.value})} data-testid="np-meta-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Meta description" value={newPost.meta_description} onChange={e=>setNewPost({...newPost, meta_description:e.target.value})} data-testid="np-meta-desc" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <select className="border border-border rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer" value={newPost.status} onChange={e=>setNewPost({...newPost, status:e.target.value})} data-testid="np-status">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  <select className="border border-border rounded-xl px-3 py-2 bg-background text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer" value={newPost.visibility} onChange={e=>setNewPost({...newPost, visibility:e.target.value})} data-testid="np-visibility">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Save Post</Button>
                </form>
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
                <div className="font-display font-bold text-xl text-foreground">Scholarship Campaigns Drivers</div>
                <form onSubmit={(e)=>{e.preventDefault(); post("/scholarships", newCampaign, ()=>setNewCampaign({title:"",description:"",exam_date:"",deadline:"",eligibility:"",venue:"",available_venues:[],whatsapp_community_url:"",exam_time:"10:00 AM",total_marks:100,active:true,is_featured:false,type:"general",start_date:"",end_date:"",eligible_classes:[],time_slots:[]}), "Campaign");}} className="glass border border-border p-4 sm:p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 bg-background/20">
                  <Input placeholder="Driver Name (e.g. NST 2026)" value={newCampaign.title} onChange={e=>setNewCampaign({...newCampaign, title:e.target.value})} required data-testid="ncm-title" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Eligibility Criteria Parameters" value={newCampaign.eligibility} onChange={e=>setNewCampaign({...newCampaign, eligibility:e.target.value})} required data-testid="ncm-elig" className="rounded-xl border-border bg-background/50 text-foreground"/>
                  <Input placeholder="Examination Date" value={newCampaign.exam_date} onChange={e=>setNewCampaign({...newCampaign, exam_date:e.target.value})} required data-testid="ncm-exam" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Lock Expiration Deadline" value={newCampaign.deadline} onChange={e=>setNewCampaign({...newCampaign, deadline:e.target.value})} required data-testid="ncm-dead" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Execution Time Grid" value={newCampaign.exam_time} onChange={e=>setNewCampaign({...newCampaign, exam_time:e.target.value})} data-testid="ncm-time" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <Input placeholder="Total marks value" type="number" value={newCampaign.total_marks} onChange={e=>setNewCampaign({...newCampaign, total_marks:Number(e.target.value)})} data-testid="ncm-marks" className="rounded-xl border-border bg-background/50 text-foreground font-mono"/>
                  <select className="border border-border rounded-xl px-3 py-2 bg-background text-sm" value={newCampaign.type} onChange={e=>setNewCampaign({...newCampaign, type:e.target.value})} data-testid="ncm-type">
                    <option value="general">General</option>
                    <option value="school">School</option>
                  </select>
                  {newCampaign.type === "school" && (
                    <>
                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Campaign Start Date</label>
                          <input type="date" value={newCampaign.start_date} onChange={e=>setNewCampaign({...newCampaign, start_date:e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 bg-background text-sm" data-testid="ncm-start-date" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Campaign End Date</label>
                          <input type="date" value={newCampaign.end_date} onChange={e=>setNewCampaign({...newCampaign, end_date:e.target.value})} className="w-full border border-border rounded-xl px-3 py-2 bg-background text-sm" data-testid="ncm-end-date" />
                        </div>
                      </div>
                      <div className="sm:col-span-2 border border-border rounded-xl p-4 bg-background/30">
                        <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-2">Eligible Classes</div>
                        <div className="flex flex-wrap gap-2">
                          {["ALL","7th Class","8th Class","9th Class","10th Class","11th Class","12th Class"].map(cls => {
                            const checked = newCampaign.eligible_classes?.includes(cls);
                            return (
                              <label key={cls} className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${checked ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-border text-muted-foreground hover:bg-muted/50"}`}>
                                <input type="checkbox" className="hidden" checked={checked} onChange={() => setNewCampaign(prev => ({ ...prev, eligible_classes: checked ? (prev.eligible_classes || []).filter(c => c !== cls) : [...(prev.eligible_classes || []), cls] }))} />
                                {cls}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                      <div className="sm:col-span-2 border border-border rounded-xl p-4 bg-background/30">
                        <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-2">Time Slots</div>
                        <div className="space-y-2">
                          {(newCampaign.time_slots || []).map((slot, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input type="time" value={slot.from_time || ""} onChange={e => { const slots = [...(newCampaign.time_slots || [])]; slots[idx] = { ...slots[idx], from_time: e.target.value }; setNewCampaign({ ...newCampaign, time_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1" />
                              <span className="text-xs text-muted-foreground">to</span>
                              <input type="time" value={slot.to_time || ""} onChange={e => { const slots = [...(newCampaign.time_slots || [])]; slots[idx] = { ...slots[idx], to_time: e.target.value }; setNewCampaign({ ...newCampaign, time_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1" />
                              <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                                <input type="checkbox" checked={slot.enabled !== false} onChange={e => { const slots = [...(newCampaign.time_slots || [])]; slots[idx] = { ...slots[idx], enabled: e.target.checked }; setNewCampaign({ ...newCampaign, time_slots: slots }); }} />
                                Enabled
                              </label>
                              <button type="button" onClick={() => setNewCampaign({ ...newCampaign, time_slots: (newCampaign.time_slots || []).filter((_, i) => i !== idx) })} className="text-rose-500 hover:text-rose-600 text-xs px-2">Remove</button>
                            </div>
                          ))}
                          <button type="button" onClick={() => setNewCampaign({ ...newCampaign, time_slots: [...(newCampaign.time_slots || []), { from_time: "09:00", to_time: "10:00", enabled: true }] })} className="text-xs text-primary hover:text-primary/80 font-medium">+ Add Time Slot</button>
                        </div>
                      </div>
                    </>
                  )}
                  {newCampaign.type === "school" && (
                    <div className="sm:col-span-2 border border-border rounded-xl p-4 bg-background/30">
                      <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-2">School Visit Slots</div>
                      <div className="space-y-2">
                        {(newCampaign.school_visit_slots || []).map((slot, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input type="date" value={slot.date} onChange={e => { const slots = [...(newCampaign.school_visit_slots || [])]; slots[idx] = { ...slots[idx], date: e.target.value }; setNewCampaign({ ...newCampaign, school_visit_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1" />
                            <input type="time" value={slot.time} onChange={e => { const slots = [...(newCampaign.school_visit_slots || [])]; slots[idx] = { ...slots[idx], time: e.target.value }; setNewCampaign({ ...newCampaign, school_visit_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs flex-1" />
                            <input type="number" value={slot.max_schools || 2} onChange={e => { const slots = [...(newCampaign.school_visit_slots || [])]; slots[idx] = { ...slots[idx], max_schools: Number(e.target.value) }; setNewCampaign({ ...newCampaign, school_visit_slots: slots }); }} className="border border-border rounded-md px-2 py-1.5 bg-background text-xs w-20" min={1} max={10} />
                            <button type="button" onClick={() => setNewCampaign({ ...newCampaign, school_visit_slots: (newCampaign.school_visit_slots || []).filter((_, i) => i !== idx) })} className="text-rose-500 hover:text-rose-600 text-xs px-2">Remove</button>
                          </div>
                        ))}
                        <button type="button" onClick={() => setNewCampaign({ ...newCampaign, school_visit_slots: [...(newCampaign.school_visit_slots || []), { date: "", time: "10:00 AM", max_schools: 2 }] })} className="text-xs text-primary hover:text-primary/80 font-medium">+ Add Slot</button>
                      </div>
                    </div>
                  )}
                  <Input placeholder="WhatsApp Community Endpoint URL" value={newCampaign.whatsapp_community_url} onChange={e=>setNewCampaign({...newCampaign, whatsapp_community_url:e.target.value})} className="sm:col-span-2 rounded-xl border-border bg-background/50 text-foreground" data-testid="ncm-wa"/>
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground mb-1.5 block">Authorized Running Venues</label>
                    <div className="flex flex-wrap gap-2 glass rounded-xl p-2.5 bg-background/50 border border-border">
                      {centers.map((c) => {
                        const checked = newCampaign.available_venues.includes(c.name);
                        return (
                          <label key={c.id} className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer select-none transition ${checked ? "bg-primary text-primary-foreground border-primary shadow-md" : "border-border text-muted-foreground hover:bg-muted/50"}`} data-testid={`ncm-venue-${c.id}`}>
                            <input type="checkbox" className="hidden" checked={checked} onChange={() => {
                              setNewCampaign(prev => ({...prev, available_venues: checked ? prev.available_venues.filter(v=>v!==c.name) : [...prev.available_venues, c.name]}));
                            }}/>
                            {c.name}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <textarea className="sm:col-span-2 border border-border rounded-xl px-3 py-2 bg-background/50 text-sm focus:outline-none focus:border-accent text-foreground min-h-20 resize-none" placeholder="Description data string..." value={newCampaign.description} onChange={e=>setNewCampaign({...newCampaign, description:e.target.value})} required data-testid="ncm-desc"/>
                  <label className="text-sm flex items-center gap-2 text-muted-foreground select-none cursor-pointer font-medium"><input type="checkbox" checked={newCampaign.active} onChange={e=>setNewCampaign({...newCampaign, active:e.target.checked})} className="accent-primary"/>Flag project as active status</label>
                  <Button type="submit" className="bg-primary text-primary-foreground rounded-xl text-xs font-bold uppercase tracking-wider px-4 py-2 cursor-pointer"><Plus size={14} className="mr-1.5"/>Launch Test Campaign</Button>
                </form>
                
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

            {activeTab === "school-visits" && (
              <AdminSchoolVisits />
            )}

            {activeTab === "school-students" && (
              <SchoolStudentsTab />
            )}
          </div>
        </main>
      </div>
    </div>,
    portalHost
  );
}