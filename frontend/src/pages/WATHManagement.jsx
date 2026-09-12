import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, formatError } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Plus, Pencil, Trash2, Play, Pause, XCircle, Calendar, Clock,
  Users, ChevronRight, RefreshCw, CheckCircle2, PowerOff, GraduationCap,
} from "lucide-react";

const MODES = [
  { id: "exam", label: "Normal WATH Exam", desc: "Show the permanent WATH scholarship exam page.", icon: GraduationCap },
  { id: "carnival", label: "WATH Carnival", desc: "Temporarily replace the page with an active carnival.", icon: Calendar },
  { id: "disabled", label: "Disabled", desc: "Show a 'coming soon' banner. Blocks all registrations.", icon: PowerOff },
];

export default function WATHManagement() {
  const navigate = useNavigate();
  const [pageCfg, setPageCfg] = useState(null);
  const [carnivals, setCarnivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);  // carnival being edited/created

  const reload = async () => {
    setLoading(true);
    try {
      const [cfg, list] = await Promise.all([
        api.get("/admin/wath/page-config"),
        api.get("/admin/wath/carnivals"),
      ]);
      setPageCfg(cfg.data);
      setCarnivals(Array.isArray(list.data) ? list.data : []);
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to load WATH management");
    } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const setMode = async (mode, active_carnival_id = null) => {
    try {
      const body = { mode };
      if (mode === "carnival") body.active_carnival_id = active_carnival_id;
      await api.post("/admin/wath/page-config", body);
      toast.success("WATH page updated");
      reload();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to update page config");
    }
  };

  const deleteCarnival = async (cid) => {
    if (!confirm("Delete this carnival and all its slot capacity counters? Registrations already made will remain.")) return;
    try {
      await api.delete(`/admin/wath/carnivals/${cid}`);
      toast.success("Carnival deleted");
      reload();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Delete failed");
    }
  };

  return (
    <div className="space-y-6" data-testid="wath-management">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display font-medium text-lg sm:text-xl text-foreground">WATH Management</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Toggle the /wath page mode and manage WATH Carnival campaigns</p>
        </div>
        <button onClick={reload} className="text-xs font-bold uppercase tracking-[0.16em] px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition inline-flex items-center gap-2" data-testid="wath-mgmt-refresh">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""}/> Refresh
        </button>
      </div>

      {/* Page-mode toggle */}
      <div className="glass-elevated border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent mb-3">/wath Page Mode</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {MODES.map(m => {
            const isActive = pageCfg?.mode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === "carnival") {
                    const active = carnivals.find(c => c.active) || carnivals[0];
                    if (!active) { toast.error("Create a carnival first, then switch to carnival mode"); return; }
                    setMode("carnival", active.id);
                  } else setMode(m.id);
                }}
                className={`text-left p-4 rounded-xl border transition ${isActive ? "border-accent bg-accent/[0.06]" : "border-white/10 hover:border-white/20 bg-background/40"}`}
                data-testid={`wath-mode-${m.id}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon size={14} className={isActive ? "text-accent" : "text-muted-foreground"}/>
                  <div className={`text-sm font-medium ${isActive ? "text-accent" : "text-foreground"}`}>{m.label}</div>
                  {isActive && <CheckCircle2 size={13} className="text-accent ml-auto"/>}
                </div>
                <div className="text-[11px] text-muted-foreground">{m.desc}</div>
              </button>
            );
          })}
        </div>
        {pageCfg?.mode === "carnival" && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Active carnival:</span>
            <select
              value={pageCfg.active_carnival_id || ""}
              onChange={e => setMode("carnival", e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-accent/40"
              data-testid="wath-active-carnival-select"
            >
              {carnivals.map(c => <option key={c.id} value={c.id} className="bg-background">{c.title}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Carnival list */}
      <div className="glass-elevated border border-white/10 rounded-2xl">
        <div className="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-sm font-medium">WATH Carnivals</div>
          <button
            onClick={() => setEditing({ __new: true, title: "", subtitle: "", description: "", start_date: "", end_date: "", active: true, exam_dates: [] })}
            className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-accent text-accent-foreground inline-flex items-center gap-1.5"
            data-testid="new-carnival-btn"
          >
            <Plus size={13}/> New Carnival
          </button>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {loading && carnivals.length === 0 && <div className="p-6 text-center text-xs text-muted-foreground">Loading…</div>}
          {!loading && carnivals.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <Calendar size={28} className="mx-auto mb-3 opacity-30"/>
              <div className="font-medium mb-1">No carnivals yet</div>
              <div className="opacity-70">Create your first WATH Carnival campaign to open slot-based registration.</div>
            </div>
          )}
          {carnivals.map(c => {
            const isActiveOnPage = pageCfg?.mode === "carnival" && pageCfg?.active_carnival_id === c.id;
            const totalCap = (c.exam_dates || []).flatMap(d => d.slots || []).reduce((s, x) => s + (x.capacity || 0), 0);
            const totalBooked = (c.exam_dates || []).flatMap(d => d.slots || []).reduce((s, x) => s + (x.booked_count || 0), 0);
            return (
              <div key={c.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-3" data-testid={`carnival-${c.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-sm font-medium text-foreground truncate">{c.title}</div>
                    {isActiveOnPage && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/20 text-accent">LIVE on /wath</span>}
                    {!c.active && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground">Inactive</span>}
                  </div>
                  {c.subtitle && <div className="text-xs text-muted-foreground mt-0.5">{c.subtitle}</div>}
                  <div className="flex flex-wrap gap-3 mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-bold">
                    <span className="inline-flex items-center gap-1"><Calendar size={11}/>{c.start_date} → {c.end_date}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11}/>{(c.exam_dates || []).length} dates · {(c.exam_dates || []).flatMap(d => d.slots || []).length} slots</span>
                    <span className="inline-flex items-center gap-1"><Users size={11}/>{totalBooked}/{totalCap} booked</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button onClick={() => navigate(`/admin/carnivals/${c.id}/dashboard`)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 inline-flex items-center gap-1" data-testid={`carnival-regs-${c.id}`}>
                    <Users size={12}/> Dashboard
                  </button>
                  <button onClick={() => setEditing({ ...c })} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 inline-flex items-center gap-1" data-testid={`carnival-edit-${c.id}`}>
                    <Pencil size={12}/> Edit
                  </button>
                  <button onClick={() => deleteCarnival(c.id)} className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-rose-500/25 text-rose-400 hover:bg-rose-500/10 inline-flex items-center gap-1" data-testid={`carnival-delete-${c.id}`}>
                    <Trash2 size={12}/> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {editing && <CarnivalEditor value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }}/>}
      </div>
  );
}

function CarnivalEditor({ value, onClose, onSaved }) {
  const [c, setC] = useState(() => ({
    ...value,
    exam_dates: (value.exam_dates || []).map(d => ({
      date: d.date,
      slots: (d.slots || []).map(s => ({ time: s.time, capacity: s.capacity, is_open: s.is_open ?? true })),
    })),
  }));
  const [busy, setBusy] = useState(false);
  const isNew = !!c.__new;

  const save = async () => {
    if (!c.title.trim() || !c.start_date || !c.end_date) {
      toast.error("Fill title, start date and end date");
      return;
    }
    setBusy(true);
    try {
      const body = {
        title: c.title.trim(),
        subtitle: c.subtitle || null,
        description: c.description || null,
        start_date: c.start_date,
        end_date: c.end_date,
        active: c.active !== false,
        banner_url: c.banner_url || null,
        exam_dates: (c.exam_dates || []).map(d => ({
          date: d.date,
          slots: (d.slots || []).map(s => ({ time: s.time, capacity: Number(s.capacity || 0), is_open: s.is_open !== false })),
        })),
      };
      if (isNew) await api.post("/admin/wath/carnivals", body);
      else await api.put(`/admin/wath/carnivals/${c.id}`, body);
      toast.success(`Carnival ${isNew ? "created" : "updated"}`);
      onSaved();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Save failed");
    } finally { setBusy(false); }
  };

  const addDate = () => setC(prev => ({ ...prev, exam_dates: [...(prev.exam_dates || []), { date: "", slots: [{ time: "10:00 AM", capacity: 30, is_open: true }] }] }));
  const removeDate = (i) => setC(prev => ({ ...prev, exam_dates: prev.exam_dates.filter((_, idx) => idx !== i) }));
  const patchDate = (i, patch) => setC(prev => ({ ...prev, exam_dates: prev.exam_dates.map((d, idx) => idx === i ? { ...d, ...patch } : d) }));
  const addSlot = (di) => patchDate(di, { slots: [...(c.exam_dates[di].slots || []), { time: "10:00 AM", capacity: 30, is_open: true }] });
  const removeSlot = (di, si) => patchDate(di, { slots: c.exam_dates[di].slots.filter((_, idx) => idx !== si) });
  const patchSlot = (di, si, patch) => patchDate(di, { slots: c.exam_dates[di].slots.map((s, idx) => idx === si ? { ...s, ...patch } : s) });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] grid place-items-center p-4" onClick={onClose}>
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-3xl bg-background border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()} data-testid="carnival-editor">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-background">
          <div className="font-medium">{isNew ? "New Carnival" : "Edit Carnival"}</div>
           <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer z-10"><XCircle size={16}/></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <input className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" placeholder="Title (e.g. WATH Carnival 2026)" value={c.title || ""} onChange={e => setC({ ...c, title: e.target.value })} data-testid="carnival-title"/>
          <input className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" placeholder="Subtitle (optional)" value={c.subtitle || ""} onChange={e => setC({ ...c, subtitle: e.target.value })}/>
          <textarea className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-accent/40" rows={2} placeholder="Description (optional)" value={c.description || ""} onChange={e => setC({ ...c, description: e.target.value })}/>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">Start date</div>
              <input type="date" className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm" value={c.start_date || ""} onChange={e => setC({ ...c, start_date: e.target.value })} data-testid="carnival-start"/>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">End date</div>
              <input type="date" className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm" value={c.end_date || ""} onChange={e => setC({ ...c, end_date: e.target.value })} data-testid="carnival-end"/>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={c.active !== false} onChange={e => setC({ ...c, active: e.target.checked })} className="rounded border-white/20"/>
            Active
          </label>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Exam Dates & Slots</div>
              <button onClick={addDate} className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-accent text-accent-foreground inline-flex items-center gap-1" data-testid="carnival-add-date">
                <Plus size={12}/> Add Date
              </button>
            </div>
            {(c.exam_dates || []).length === 0 && <div className="text-[11px] text-muted-foreground py-4 text-center border border-dashed border-white/10 rounded-xl">No exam dates yet</div>}
            <div className="space-y-3">
              {(c.exam_dates || []).map((d, di) => (
                <div key={di} className="p-3 rounded-xl border border-white/10 bg-white/[0.02]" data-testid={`carnival-date-${di}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="date" value={d.date || ""} onChange={e => patchDate(di, { date: e.target.value })} className="px-2 py-1.5 rounded-lg bg-background border border-white/10 text-xs" data-testid={`carnival-date-input-${di}`}/>
                    <button onClick={() => addSlot(di)} className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-accent/25 text-accent" data-testid={`carnival-add-slot-${di}`}>+ Slot</button>
                    <button onClick={() => removeDate(di)} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-rose-500/25 text-rose-400">Remove</button>
                  </div>
                  <div className="space-y-1.5">
                    {(d.slots || []).map((s, si) => (
                      <div key={si} className="flex items-center gap-2">
                        <input value={s.time} onChange={e => patchSlot(di, si, { time: e.target.value })} placeholder="10:00 AM" className="flex-1 px-2 py-1.5 rounded-lg bg-background border border-white/10 text-xs" data-testid={`carnival-slot-time-${di}-${si}`}/>
                        <input type="number" min="1" value={s.capacity} onChange={e => patchSlot(di, si, { capacity: Number(e.target.value) })} placeholder="Capacity" className="w-24 px-2 py-1.5 rounded-lg bg-background border border-white/10 text-xs" data-testid={`carnival-slot-cap-${di}-${si}`}/>
                        <label className="inline-flex items-center gap-1 text-[10px]">
                          <input type="checkbox" checked={s.is_open !== false} onChange={e => patchSlot(di, si, { is_open: e.target.checked })} className="rounded border-white/20"/>
                          Open
                        </label>
                        <button onClick={() => removeSlot(di, si)} className="text-rose-400 p-1" title="Remove slot"><Trash2 size={12}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-wider">Cancel</button>
          <button onClick={save} disabled={busy} className="flex-1 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider disabled:opacity-50" data-testid="carnival-save">
            {busy ? "Saving…" : isNew ? "Create Carnival" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
