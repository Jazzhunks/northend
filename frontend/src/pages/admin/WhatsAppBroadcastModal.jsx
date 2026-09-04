import { useState, useEffect, useRef, useMemo } from "react";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";

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

export default WhatsAppBroadcastModal;
