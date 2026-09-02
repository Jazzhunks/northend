import { useEffect, useState } from "react";
import { toast } from "sonner";
import { erp } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { Save, X, Building2, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function ErpBranches() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { erp.listBranches().then(setItems); }, []);

  const openEditModal = (b) => {
    setEditing(b.id);
    setForm({
      gstin: b.gstin || "",
      signatory_name: b.signatory_name || "",
      state_code: b.state_code || "",
    });
  };

  const executeSave = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const updated = await erp.updateBranch(editing, form);
      setItems(items.map(i => i.id === updated.id ? updated : i));
      setEditing(null);
      toast.success("Branch localization profiles updated successfully");
    } catch (e) { 
      toast.error(formatError(e.response?.data?.detail) || "Failed to finalize configuration state"); 
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn" data-testid="erp-branches-page">
      {/* Pinned Title Board */}
      <div>
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Enterprise Infrastructure</div>
        <h1 className="font-display text-4xl font-light tracking-tight mt-1">Network Hub Centres</h1>
        <p className="text-muted-foreground mt-1 text-sm">Configure localized taxation metrics, GSTIN parameters, and legal authorized signatories for each valley hub.</p>
      </div>

      {/* Grid Network Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {items.map(b => (
          <div key={b.id} className="glass-elevated rounded-2xl p-6 border border-border relative overflow-hidden group hover:border-accent/20 transition-all duration-300" data-testid={`branch-card-${b.id}`}>
            <div className="absolute right-0 top-0 opacity-[0.02] translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500 text-foreground pointer-events-none">
              <Building2 size={160} />
            </div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1.5 max-w-[80%]">
                <h3 className="font-display font-medium text-xl text-foreground tracking-tight flex items-center gap-2">
                  {b.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 leading-relaxed">
                  <MapPin size={13} className="text-accent shrink-0" /> {b.address}
                </p>
                <p className="text-xs font-mono text-muted-foreground/80 flex items-center gap-1.5 pt-0.5">
                  <Phone size={13} className="opacity-60 shrink-0" /> {b.phone}
                </p>
              </div>
              <button 
                onClick={() => openEditModal(b)} 
                className="text-xs uppercase tracking-wider font-bold text-accent hover:text-accent/80 transition-colors bg-accent/5 hover:bg-accent/10 border border-accent/10 px-3 py-1.5 rounded-xl" 
                data-testid={`edit-branch-${b.id}`}
              >
                Configure
              </button>
            </div>

            {/* Financial Metadata Grid Segment */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.06] pt-4 relative z-10">
              <div className="space-y-0.5">
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Taxation GSTIN</div>
                <div className="font-mono text-xs text-foreground font-semibold mt-0.5 tracking-wide">{b.gstin || "—"}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Legal Signatory</div>
                <div className="text-xs text-foreground font-medium mt-0.5">{b.signatory_name || "—"}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">State Location</div>
                <div className="font-mono text-xs text-foreground mt-0.5">
                  {b.state_code ? `${b.state_code} (J&K)` : "—"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Modal Sheet Portal */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={() => setEditing(null)} data-testid="edit-branch-modal">
          <form 
            onClick={e => e.stopPropagation()} 
            onSubmit={executeSave} 
            className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
                  <ShieldCheck size={12} /> Compliance Controller
                </div>
                <h3 className="font-display text-2xl font-medium mt-1">Branch Parameters</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditing(null)} 
                className="p-1 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition"
              >
                <X size={18}/>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Taxation GSTIN Reference</label>
                <input 
                  type="text"
                  value={form.gstin} 
                  onChange={e => setForm({...form, gstin: e.target.value.toUpperCase()})} // Forced structural standard casing rules
                  placeholder="01ABCDE1234F1Z5" 
                  className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/50" 
                  data-testid="eb-gstin"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Authorized Signatory Name</label>
                <input 
                  type="text"
                  value={form.signatory_name} 
                  onChange={e => setForm({...form, signatory_name: e.target.value})} 
                  placeholder="e.g. Legal Operations Desk"
                  className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/50" 
                  data-testid="eb-signatory"
                />
              </div>
              
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Jurisdiction State Code</label>
                <input 
                  type="text"
                  value={form.state_code} 
                  onChange={e => setForm({...form, state_code: e.target.value})} 
                  placeholder="01" 
                  className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent/50" 
                  data-testid="eb-state"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                disabled={busy} 
                type="submit" 
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg transition" 
                data-testid="eb-save"
              >
                <Save size={14}/>
                {busy ? "Writing Records…" : "Authorize Changes"}
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(null)} 
                className="px-4 py-3 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}