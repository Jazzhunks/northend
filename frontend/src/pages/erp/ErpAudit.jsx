import { useEffect, useState } from "react";
import { erp, fmtDate } from "@/lib/erpApi";
import { Search, ShieldAlert, X, Eye, FileText, Calendar, ShieldCheck } from "lucide-react";

export default function ErpAudit() {
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayload, setSelectedPayload] = useState(null);

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  
  useEffect(() => {
    erp.audit(branchId ? { branch_id: branchId } : {}).then(setItems);
  }, [branchId]);

  // Client-side quick filter for actor emails, action states, or entities
  const filteredItems = items.filter(item => 
    item.actor_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.entity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn" data-testid="erp-audit-page">
      {/* Header Panel */}
      <div className="shrink-0">
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Compliance &amp; Oversight</div>
        <h1 className="font-display text-4xl font-light tracking-tight mt-1">System Audit Log</h1>
        <p className="text-muted-foreground mt-1 text-sm">Reviewing last {filteredItems.length} records matching security verification rules.</p>
      </div>

      {/* Filter and Control Strips */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Filter audit logs by actor email, target action, or entity signature..." 
            className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition font-sans text-foreground"
          />
        </div>
        <select 
          value={branchId} 
          onChange={e => setBranchId(e.target.value)} 
          className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" 
          data-testid="filter-branch"
        >
          <option value="">All enterprise branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {/* Main Container (Independent Scroll Fixed Layer) */}
      <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-auto border-collapse">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Timestamp</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">System Actor</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Role Access</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Action</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Target Entity</th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Payload Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background/20">
              {filteredItems.map(a => (
                <tr key={a.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-5 py-4 text-xs whitespace-nowrap text-muted-foreground font-mono">
                    <span className="text-foreground">{fmtDate(a.created_at)}</span>{" "}
                    <span className="opacity-60">{a.created_at?.slice(11, 16)}</span>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-foreground">{a.actor_email}</td>
                  <td className="px-5 py-4 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted/50 border border-border text-muted-foreground">
                      {a.actor_role?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <ActionBadge action={a.action} />
                  </td>
                  <td className="px-5 py-4 text-xs text-foreground font-medium whitespace-nowrap">{a.entity}</td>
                  <td className="px-5 py-4 text-xs max-w-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground font-mono truncate block flex-1">
                        {JSON.stringify(a.payload)}
                      </span>
                      {a.payload && (
                        <button 
                          onClick={() => setSelectedPayload({ actor: a.actor_email, action: a.action, entity: a.entity, data: a.payload })}
                          className="p-1 text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 shrink-0"
                          title="Inspect Data State"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No historic verification changes logged matching current tracking parameter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Payload Inspector Sheets */}
      {selectedPayload && (
        <PayloadInspectorModal target={selectedPayload} onClose={() => setSelectedPayload(null)} />
      )}
    </div>
  );
}

// --- CONTEXT DRIVEN BADGES LAYER ---
function ActionBadge({ action }) {
  const norm = action?.toLowerCase() || "";
  let config = "bg-sky-500/10 text-sky-400 border-sky-500/20"; // Update/Patch fallback
  
  if (norm.includes("create") || norm.includes("post") || norm.includes("admit")) {
    config = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  } else if (norm.includes("delete") || norm.includes("remove") || norm.includes("deactivate") || norm.includes("reject")) {
    config = "bg-rose-500/10 text-rose-600 border-rose-500/20";
  } else if (norm.includes("approve") || norm.includes("login")) {
    config = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border ${config}`}>
      {action}
    </span>
  );
}

// --- INTERACTIVE METADATA INSPECTION LAYER ---
function PayloadInspectorModal({ target, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()} 
        className="bg-background border border-border rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="flex justify-between items-start shrink-0">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <ShieldCheck size={12}/> Security Ledger Inspector
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Data State Transaction</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition"><X size={18}/></button>
        </div>

        <div className="space-y-2 text-xs border border-border bg-white/[0.01] p-4 rounded-xl font-mono shrink-0">
          <p><span className="text-muted-foreground">Actor:</span> <span className="text-foreground font-semibold">{target.actor}</span></p>
          <p><span className="text-muted-foreground">Execution:</span> <span className="text-foreground font-semibold">{target.action} ({target.entity})</span></p>
        </div>

        <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-background p-4">
          <pre className="text-xs text-emerald-600 font-mono leading-relaxed whitespace-pre-wrap font-medium">
            {JSON.stringify(target.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}