import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { Printer, Search, CheckSquare, Square, Contact2, X } from "lucide-react";

export default function ErpIdCards() {
  const { erpUser } = useOutletContext();
  const [queue, setQueue] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [generating, setGenerating] = useState(false);

  const loadBranches = useCallback(() => {
    erp.listBranches().then(setBranches).catch(() => {});
  }, []);

  const loadQueue = useCallback(() => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    erp.idCardQueue(params)
      .then(setQueue)
      .catch(e => toast.error(formatError(e) || "Failed to load ID card queue"));
  }, [branchId]);

  useEffect(() => { loadBranches(); }, [loadBranches]);
  useEffect(() => { loadQueue(); }, [loadQueue]);

  useEffect(() => {
    const id = setInterval(() => { loadQueue(); }, 30000);
    return () => clearInterval(id);
  }, [loadQueue]);

  const filteredQueue = queue.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.enrollment_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.batch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const downloadIdCard = async (student) => {
    try {
      const token = localStorage.getItem("nw_token");
      const url = `/api/erp/students/${encodeURIComponent(student.id)}/id-card`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to download ID card");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `id-card-${student.enrollment_number || student.student_no}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      toast.error(formatError(e) || "Failed to download ID card");
    }
  };

  const handleGenerateAndPrint = async () => {
    if (selectedIds.size === 0) {
      toast.error("Select at least one student to generate ID cards");
      return;
    }
    setGenerating(true);
    try {
      const selected = queue.filter(s => selectedIds.has(s.id));
      for (const student of selected) {
        await downloadIdCard(student);
      }
      const token = localStorage.getItem("nw_token");
      await fetch("/api/erp/id-cards/clear-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ student_ids: Array.from(selectedIds) }),
      });
      setSelectedIds(new Set());
      loadQueue();
      toast.success("ID cards generated and queue cleared");
    } catch (e) {
      toast.error(formatError(e) || "Failed to generate ID cards");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn relative">
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Credential Production Deck</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">ID Card Queue</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filteredQueue.length} student{filteredQueue.length === 1 ? "" : "s"} queued for ID card generation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <button onClick={clearSelection} className="px-3 py-2 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground transition bg-background/30">
              Clear Choice ({selectedIds.size})
            </button>
          )}
          <button onClick={handleGenerateAndPrint} disabled={generating || selectedIds.size === 0} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition disabled:opacity-50">
            <Printer size={14}/> {generating ? "Generating..." : "Generate & Download ID Cards"}
          </button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search queue by name, enrollment, or batch..." 
            className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
          />
        </div>
        {isSuper(erpUser) && (
          <select 
            value={branchId} 
            onChange={e => setBranchId(e.target.value)} 
            className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground"
          >
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
      </div>

      <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[750px]">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[6%] px-5 py-3.5 text-center bg-muted"></th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Student No</th>
                <th className="w-[25%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Learner Profile Name</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Class Batch Allocation</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Enrollment Number</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Contact Line</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background/20">
              {filteredQueue.map(s => {
                const isChecked = selectedIds.has(s.id);
                return (
                  <tr 
                    key={s.id} 
                    onClick={() => toggleSelect(s.id)}
                    className={`cursor-pointer transition-colors ${isChecked ? "bg-accent/5 hover:bg-accent/10" : "hover:bg-muted/50"}`}
                  >
                    <td className="px-5 py-4 text-center">
                      <div className="text-accent flex justify-center items-center">
                        {isChecked ? <CheckSquare size={16} className="text-primary"/> : <Square size={16} className="text-muted-foreground/30"/>}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-foreground font-semibold tracking-wide">{s.student_no}</td>
                    <td className="px-5 py-4 text-xs font-bold text-foreground truncate">{s.full_name}</td>
                    <td className="px-5 py-4 text-xs text-foreground font-medium truncate">{s.batch || "—"}</td>
                    <td className="px-5 py-4 text-xs font-mono text-foreground">{s.enrollment_number || "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{s.contact_phone}</td>
                  </tr>
                );
              })}
              {filteredQueue.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No students queued for ID card generation. Go to student profile and click "Generate ID Card" to queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
