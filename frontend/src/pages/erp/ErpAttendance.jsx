import { useEffect, useState, useCallback, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, isManagerPlus, fmtDate } from "@/lib/erpApi";
import { formatError, API_BASE } from "@/lib/api";
import { 
  QrCode, Users, Clock, ShieldAlert, Wifi, WifiOff, FileDown,
  Terminal, Search, UserCheck, CheckCircle2, AlertCircle 
} from "lucide-react";

export default function ErpAttendance() {
  const { erpUser } = useOutletContext();
  const [logs, setLogs] = useState([]);
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(erpUser?.branch_id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [streamConnected, setStreamConnected] = useState(false);
  const [busyOverrides, setBusyOverrides] = useState(new Set());
  
  // Terminal interface states
  const [scanInput, setScanInput] = useState("");
  const [processingScan, setProcessingScan] = useState(false);
  
  const sseConnectionRef = useRef(null);

  // Fetch baseline static collection matrices
  useEffect(() => {
    erp.listBranches().then(setBranches).catch(() => {});
    erp.listStudents().then(setStudents).catch(() => {});
  }, []);

  // Sync log archives on mount or center shift
  const fetchHistoricalLogs = useCallback(() => {
    if (!branchId) return;
    erp.listAttendanceLogs({ branch_id: branchId })
      .then(setLogs)
      .catch(e => toast.error(formatError(e) || "Failed to load log metrics"));
  }, [branchId]);

  useEffect(() => {
    fetchHistoricalLogs();
  }, [fetchHistoricalLogs]);

  // ============================================================================
  // SSE BROADCASTER PIPELINE SYNC ENGINE
  // ============================================================================
  const establishLiveStream = useCallback(() => {
    if (!branchId) return;

    if (sseConnectionRef.current) {
      sseConnectionRef.current.close();
    }

    const targetStreamUrl = erp.getAttendanceStreamUrl(branchId);
    const eventSourceInstance = new EventSource(targetStreamUrl, { withCredentials: true });
    sseConnectionRef.current = eventSourceInstance;

    eventSourceInstance.onopen = () => {
      setStreamConnected(true);
    };

    eventSourceInstance.onerror = () => {
      setStreamConnected(false);
    };

    eventSourceInstance.addEventListener("attendance_scanned_event", (e) => {
      try {
        const freshLogDocument = JSON.parse(e.data);
        setLogs(prev => [freshLogDocument, ...prev]);
        toast.success(`Check-In Verified: ${freshLogDocument.full_name}`, {
          description: `Logged status [${freshLogDocument.status.toUpperCase()}] at entry gate.`,
          icon: <CheckCircle2 className="text-emerald-600" />
        });
      } catch (err) {
        console.error("Payload parse error on live context wire:", err);
      }
    });

    return () => {
      eventSourceInstance.close();
      setStreamConnected(false);
    };
  }, [branchId]);

  useEffect(() => {
    const cleanupStream = establishLiveStream();
    return () => {
      if (cleanupStream) cleanupStream();
    };
  }, [establishLiveStream]);

  // ============================================================================
  // HARDWARE TERMINAL INPUT SIMULATION CONTROLLER
  // ============================================================================
  const handleTerminalScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanInput.trim() || processingScan) return;

    setProcessingScan(true);
    try {
      const payload = {
        student_no: scanInput.trim().toUpperCase(),
        device_signature: "CON-DESK-KEYPAD"
      };
      
      const loggedEntry = await erp.submitAttendanceScan(payload);
      if (!streamConnected) {
        setLogs(prev => [loggedEntry, ...prev]);
        toast.success(`Check-In logged for ${loggedEntry.full_name}`);
      }
      setScanInput("");
    } catch (err) {
      toast.error(formatError(err) || "Scan validation check failed.");
    } finally {
      setProcessingScan(false);
    }
  };

  // ============================================================================
  // MANUAL DESK OVERRIDE LIFE HANDLER
  // ============================================================================
  const handleManualOverrideTrigger = async (studentId, studentName, forcedStatus) => {
    if (busyOverrides.has(studentId)) return;

    setBusyOverrides(prev => { const next = new Set(prev); next.add(studentId); return next; });
    try {
      await erp.submitManualAttendanceOverride({
        student_id: studentId,
        status: forcedStatus
      });
      toast.success(`Forced override ledger saved: ${studentName} -> ${forcedStatus}`);
    } catch (err) {
      toast.error(formatError(err) || "Override access blocked by system policies.");
    } finally {
      setBusyOverrides(prev => { const next = new Set(prev); next.delete(studentId); return next; });
    }
  };

  const filteredLogs = logs.filter(log => 
    log.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.student_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const buildExcelExportUrl = () => {
  const queryToken = localStorage.getItem("nw_token") || "";
  let destinationUrl = `${API_BASE}/erp/erpattendance/exports/attendance_today.xlsx?token=${encodeURIComponent(queryToken)}`;
  if (branchId) {
    destinationUrl += `&branch_id=${encodeURIComponent(branchId)}`;
  }
  return destinationUrl;
};

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn relative" data-testid="erp-attendance-page">
      
      {/* UPPER MASTER RUNTIME STATS RIBBON */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1.5">
            <QrCode size={12}/> Biometric Verification Hub
          </div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">Gate Attendance Terminal</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Asynchronous monitoring environment. Processing class and batch data segments automatically.
          </p>
        </div>

        {/* OPERATION CONTROL PACKET LAYOUT */}
        <div className="flex items-center gap-3">
          <a href={buildExcelExportUrl()} target="_blank" rel="noreferrer" className="block">
            <button 
              disabled={!branchId}
              className="px-4 py-2.5 bg-zinc-900 border border-border text-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition"
            >
              <FileDown size={14} className="text-emerald-600" /> Export Today's Excel
            </button>
          </a>

          <div className={`px-3 py-1.5 border rounded-xl text-xs font-mono font-bold tracking-wider flex items-center gap-2 transition ${
            streamConnected 
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
              : "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse"
          }`}>
            {streamConnected ? (
              <><Wifi size={14} className="animate-pulse" /> STREAM ACTIVE</>
            ) : (
              <><WifiOff size={14} /> STREAM DISCONNECTED</>
            )}
          </div>
        </div>
      </div>

      {/* DASHBOARD UTILITY ACTION BARS LAYOUT */}
      <div className="grid md:grid-cols-3 gap-4 shrink-0">
        <div className="glass-elevated p-4 rounded-xl border border-border bg-background/40 md:col-span-2 flex flex-col justify-center">
          <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Terminal size={13} className="text-accent" /> Manual Entry Keypad Emulator
          </label>
          <form onSubmit={handleTerminalScanSubmit} className="flex gap-2">
            <input 
              type="text"
              value={scanInput}
              disabled={processingScan || !branchId}
              onChange={e => setScanInput(e.target.value)}
              placeholder={branchId ? "Scan badge barcode or type Enrollment Number (e.g. NES-SRI-0001)..." : "Select an operational branch first..."}
              className="flex-1 px-3 py-2 border border-border bg-background/80 font-mono text-sm uppercase rounded-xl text-foreground focus:outline-none focus:border-accent transition disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={processingScan || !scanInput.trim() || !branchId}
              className="px-4 py-2 bg-accent text-accent-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-40 transition shrink-0"
            >
              {processingScan ? "Checking..." : "Submit Scan"}
            </button>
          </form>
        </div>

        <div className="glass-elevated p-4 rounded-xl border border-border bg-background/40 flex flex-col justify-center">
          <label className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Users size={13} className="text-accent"/> Operational Tracking Scope
          </label>
          {isSuper(erpUser) ? (
            <select
              value={branchId}
              onChange={e => { setBranchId(e.target.value); setLogs([]); }}
              className="w-full border border-border rounded-xl px-3 py-2 bg-background/80 text-sm text-foreground focus:outline-none focus:border-accent transition"
            >
              <option value="">— Select Monitoring Station —</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          ) : (
            <div className="px-3 py-2 border border-border bg-muted text-sm text-foreground rounded-xl font-medium truncate">
              {branches.find(b => b.id === erpUser?.branch_id)?.name || "Assigned Branch Workspace"}
            </div>
          )}
        </div>
      </div>

      {/* CORE TRANSACTIONAL SECTION MATRIX LAYOUTS */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="glass-elevated rounded-2xl border border-border overflow-hidden flex flex-col lg:col-span-2 min-h-0 bg-background/10">
          <div className="p-4 border-b border-white/[0.04] bg-background/40 flex justify-between items-center shrink-0">
            <div className="font-display font-medium text-lg text-foreground flex items-center gap-2">
              <Clock size={16} className="text-accent"/> Live Gate Check-In Stream
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter running logs..."
              className="px-3 py-1 border border-border bg-background/50 rounded-lg text-xs text-foreground focus:outline-none focus:border-accent/40 w-48 transition"
            />
          </div>

          <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar min-h-0">
            <table className="w-full text-sm table-fixed border-collapse min-w-[550px]">
              <thead className="bg-muted/90 backdrop-blur-md text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                <tr className="text-left">
                  <th className="w-[20%] px-4 py-3 text-xs font-bold uppercase tracking-wider bg-muted">Reg Code</th>
                  <th className="w-[35%] px-4 py-3 text-xs font-bold uppercase tracking-wider bg-muted">Student Full Name</th>
                  <th className="w-[25%] px-4 py-3 text-xs font-bold uppercase tracking-wider bg-muted">Verified Clock</th>
                  <th className="w-[20%] px-4 py-3 text-xs font-bold uppercase tracking-wider text-center bg-muted">Status Block</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-muted/50 transition-colors bg-background/10 animate-slideUp">
                    <td className="px-4 py-3.5 font-mono text-xs text-foreground font-semibold tracking-wide">{log.student_no}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-foreground truncate" title={log.full_name}>{log.full_name}</td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground font-mono">{fmtDate(log.scanned_at, true)}</td>
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-widest uppercase border ${
                        log.status === "present"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-16 text-center text-muted-foreground/60 italic text-xs">
                      {branchId ? "Awaiting terminal handshake scanning logs sequence..." : "Select monitoring target center scope to instantiate telemetry feeds."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-elevated rounded-2xl border border-border overflow-hidden flex flex-col min-h-0 bg-background/10">
          <div className="p-4 border-b border-white/[0.04] bg-background/40 shrink-0">
            <div className="font-display font-medium text-base text-foreground flex items-center gap-1.5">
              <ShieldAlert size={15} className="text-accent" /> Desk Override Registry
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Force-verify a student directly from the directory if they forgot their printed hardware access cards profile.
            </p>
          </div>

          <div className="overflow-y-auto p-4 space-y-2.5 flex-1 min-h-0 custom-scrollbar">
            {isManagerPlus(erpUser) ? (
              students
                .filter(s => s.branch_id === branchId && s.status === "active")
                .map(st => (
                  <div key={st.id} className="p-3 border border-border bg-background/40 rounded-xl flex items-center justify-between gap-3 group hover:border-border transition">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-foreground truncate">{st.full_name}</div>
                      <div className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{st.student_no}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        disabled={busyOverrides.has(st.id)}
                        onClick={() => handleManualOverrideTrigger(st.id, st.full_name, "present")}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 rounded-md text-[10px] font-bold uppercase tracking-wider transition disabled:opacity-30"
                      >
                        Present
                      </button>
                      <button
                        disabled={busyOverrides.has(st.id)}
                        onClick={() => handleManualOverrideTrigger(st.id, st.full_name, "late")}
                        className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-md text-[10px] font-bold uppercase tracking-wider transition disabled:opacity-30"
                      >
                        Late
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-4 text-muted-foreground italic text-xs">
                <AlertCircle size={24} className="text-muted-foreground/30 mb-2" />
                Administrative credentials verification required to access localized floor override parameters.
              </div>
            )}
            {branchId && students.filter(s => s.branch_id === branchId && s.status === "active").length === 0 && (
              <div className="text-center text-xs text-muted-foreground italic py-8">
                No active student assets found registered to this center layout branch context.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}