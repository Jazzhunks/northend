import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, fmtDate } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { Plus, X, Search, FileText, Smartphone, Compass, Edit3, MessageSquare, Calendar, Milestone } from "lucide-react";

const STATUSES = ["new", "contacted", "follow_up", "converted", "lost"];

const STATUS_STYLES = {
  new: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  contacted: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  follow_up: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  converted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  lost: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function ErpLeads() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [status, setStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [activeLeadLog, setActiveLeadLog] = useState(null); // Tracks the lead currently being modified

  const reload = useCallback(() => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    if (status) params.status = status;
    erp.listLeads(params).then(setItems).catch(e => {
      toast.error(formatError(e) || "Failed to load lead tracking parameters");
    });
  }, [branchId, status]);

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [reload]);

  const filteredItems = items.filter(l => 
    l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.target_exam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.notes?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn" data-testid="erp-leads-page">
      {/* Title Board Dashboard Deck */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Onboarding Pipeline</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">Prospect Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filteredItems.length} active prospect segments parsed under authorization parameters.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(true)} 
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition" 
          data-testid="create-lead-btn"
        >
          <Plus size={14}/> Add Prospect
        </button>
      </div>

      {/* Control Tracks & Filters */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Filter pipeline by prospect name, target syllabus, or operational notes..." 
            className="w-full pl-9 pr-4 py-2 border border-white/10 bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
          />
        </div>
        {isSuper(erpUser) && (
          <select 
            value={branchId} 
            onChange={e => setBranchId(e.target.value)} 
            className="border border-white/10 rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" 
            data-testid="filter-branch"
          >
            <option value="">All network branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)} 
          className="border border-white/10 rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" 
          data-testid="filter-status"
        >
          <option value="">All pipeline segments</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ").toUpperCase()}</option>)}
        </select>
      </div>

      {/* Main Container Core Table Grid */}
      <div className="glass-elevated rounded-2xl border border-white/5 w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[900px]">
            <thead className="bg-[#18181b] text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[12%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Date Logged</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Prospect Name</th>
                <th className="w-[14%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Contact Line</th>
                <th className="w-[12%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Target Program</th>
                <th className="w-[26%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Pipeline Notes</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Pipeline State / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-background/20">
              {filteredItems.map(l => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group" data-testid={`lead-row-${l.id}`}>
                  <td className="px-5 py-4 text-xs whitespace-nowrap text-muted-foreground font-mono">{fmtDate(l.created_at)}</td>
                  <td className="px-5 py-4 text-xs font-semibold text-foreground truncate">{l.name}</td>
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground whitespace-nowrap">{l.phone}</td>
                  <td className="px-5 py-4 text-xs whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/5 text-foreground font-medium text-[11px]">{l.target_exam || "—"}</span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground truncate font-sans" title={l.notes || "No context references logged"}>
                    {l.notes ? l.notes.split("\n").filter(Boolean).pop() : "—"} 
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono border ${STATUS_STYLES[l.status] || "bg-white/5 border-white/10"}`}>
                        {l.status?.replace("_", " ")}
                      </span>
                      <button
                        onClick={() => setActiveLeadLog(l)}
                        title="Update Log Context"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent bg-accent/5 border border-accent/10 hover:bg-accent/20 rounded-lg transition duration-150"
                      >
                        <Edit3 size={12} /> Log
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No active prospect lead records match variable matrix queries.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Sheet Dialog */}
      {showCreate && (
        <CreateLeadModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("New onboarding prospect added"); }}
        />
      )}

      {/* Interaction Updating Modal Context Overlay */}
      {activeLeadLog && (
        <UpdateLeadModal
          lead={activeLeadLog}
          erpUser={erpUser}
          onClose={() => setActiveLeadLog(null)}
          onUpdated={() => { setActiveLeadLog(null); reload(); }}
        />
      )}
    </div>
  );
}

// ============================================================================
// DYNAMIC INTERACTION LOGGER MODAL COMPONENT (WITH SAFE LOG PRESERVATION)
// ============================================================================
function UpdateLeadModal({ lead, erpUser, onClose, onUpdated }) {
  const [currentStatus, setCurrentStatus] = useState(lead.status || "new");
  const [newLogText, setNewLogText] = useState("");
  const [busy, setBusy] = useState(false);

  const handleUpdateLogSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      let combinedNotes = lead.notes || "";
      
      // If fresh note commentary text is written, build a clean timestamped block appendation
      if (newLogText.trim()) {
        const timestamp = new Date().toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
        const actorSignature = erpUser?.name || erpUser?.role || "Counsellor";
        const formattedLogWrapper = `\n\n[${timestamp} · ${actorSignature}]: ${newLogText.trim()}`;
        combinedNotes = combinedNotes + formattedLogWrapper;
      }

      const res = await erp.updateLead(lead.id, {
        status: currentStatus,
        notes: combinedNotes
      });

      if (currentStatus === "converted" && res?.converted_student) {
        toast.success(`Lead Converted! Auto-enrolled student ${res.converted_student.student_no} (${res.converted_student.full_name}).`);
      } else {
        toast.success("Lead conversion profile status and engagement records appended");
      }
      onUpdated();
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || "Failed to commit conversion parameters modification loops");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <form 
        onClick={e => e.stopPropagation()} 
        onSubmit={handleUpdateLogSubmit} 
        className="bg-background border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-start shrink-0">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <MessageSquare size={12}/> Engagement Management Loop
            </div>
            <h3 className="font-display text-2xl font-medium mt-1 truncate max-w-[350px]">{lead.name}</h3>
            <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">{lead.phone} · Target Exam: {lead.target_exam || "General"}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition">
            <X size={18}/>
          </button>
        </div>

        {/* Dynamic Content Columns Section */}
        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar px-1 min-h-0">
          
          {/* Historical Notes Narrative Logs Stream */}
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block flex items-center gap-1">
              <Calendar size={12} className="text-accent"/> Historical Interaction History Timeline
            </label>
            <div className="w-full h-40 overflow-y-auto px-3 py-2.5 border border-white/5 bg-white/[0.01] rounded-xl text-xs font-sans text-muted-foreground/80 leading-relaxed whitespace-pre-wrap font-medium custom-scrollbar border border-white/10">
              {lead.notes ? lead.notes.trim() : "— No engagement historical entry segments recorded yet for this lead blueprint line —"}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-1">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block flex items-center gap-1">
                <Milestone size={12} className="text-accent"/> Modify Pipeline Status Track *
              </label>
              <select 
                value={currentStatus} 
                onChange={e => setCurrentStatus(e.target.value)} 
                className="w-full px-3 py-2 border border-white/10 bg-background rounded-xl text-sm font-semibold tracking-wide text-foreground focus:outline-none focus:border-accent"
              >
                {STATUSES.map(s => <option key={s} value={s} className="bg-background text-foreground">{s.replace("_", " ").toUpperCase()}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">
                Append Fresh Interaction Entry Logs
              </label>
              <textarea 
                required={lead.status === currentStatus} // Requires text only if status didn't change
                placeholder="Type here details of the phone conversation, follow-up parameters, or counseling notes..." 
                value={newLogText} 
                onChange={e => setNewLogText(e.target.value)} 
                rows={3} 
                className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex gap-3 pt-2 shrink-0 border-t border-white/[0.04]">
          <button 
            disabled={busy} 
            type="submit" 
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center" 
          >
            {busy ? "Appending Interaction Timeline…" : "Save Logs & Update Status"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// BASE PROSPECT INBOUND GENERATION MODAL COMPONENT
// ============================================================================
function CreateLeadModal({ erpUser, branches, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", target_exam: "NEET", notes: "",
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form };
      if (!payload.email) delete payload.email;
      await erp.createLead(payload);
      onCreated();
    } catch (e) { 
      toast.error(formatError(e.response?.data?.detail) || "Failed to commit prospect metrics"); 
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose} data-testid="create-lead-modal">
      <form 
        onClick={e => e.stopPropagation()} 
        onSubmit={submit} 
        className="bg-background border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <Compass size={12}/> Pipeline Onboarding Gateway
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Add Prospect Entry</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition">
            <X size={18}/>
          </button>
        </div>

        <div className="space-y-4">
          {isSuper(erpUser) && (
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Allocation Center Hub Target *</label>
              <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition">
                <option value="">— Select Target Hub Center —</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Prospect Name *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"><FileText size={14}/></span>
              <input type="text" required placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cl-name"/>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Primary Contact Mobile *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"><Smartphone size={14}/></span>
              <input type="text" required placeholder="Phone String" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cl-phone"/>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Email Address (Optional)</label>
            <input type="email" placeholder="name@domain.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cl-email"/>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Course Syllabus Target Track *</label>
            <div className="relative">
              <select value={form.target_exam} onChange={e => setForm({...form, target_exam: e.target.value})} className="w-full px-3 py-2 border border-white/10 bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cl-target">
                {["NEET", "IIT-JEE", "Foundation", "CBSE", "JKBOSE"].map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Pipeline Context Notes</label>
            <textarea placeholder="Log prospective interaction logs, previous student tracks, or onboarding milestones..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-white/10 bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition resize-none" data-testid="cl-notes"/>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            disabled={busy} 
            type="submit" 
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center" 
            data-testid="cl-submit"
          >
            {busy ? "Writing Ledger Pipeline…" : "Commit Prospect Log"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-3 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}