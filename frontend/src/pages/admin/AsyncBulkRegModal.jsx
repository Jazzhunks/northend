import { useState, useEffect, useRef } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UserPlus, X, Loader2, CheckCircle2, AlertCircle, UploadCloud, PlaySquare } from "lucide-react";

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

export default AsyncBulkRegModal;
