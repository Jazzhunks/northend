import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, fmtDate } from "@/lib/erpApi";
import { Plus, X } from "lucide-react";

const STATUSES = ["new", "contacted", "follow_up", "converted", "lost"];

export default function ErpLeads() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [status, setStatus] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const reload = () => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    if (status) params.status = status;
    erp.listLeads(params).then(setItems);
  };

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [branchId, status]);

  const updateStatus = async (id, newStatus) => {
    try {
      await erp.updateLead(id, { status: newStatus });
      toast.success("Status updated");
      reload();
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
  };

  return (
    <div className="space-y-6" data-testid="erp-leads-page">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Pipeline</div>
          <h1 className="font-display text-4xl font-black tracking-tight mt-1">Leads</h1>
          <p className="text-muted-foreground mt-1">{items.length} leads in your view</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold flex items-center gap-2" data-testid="create-lead-btn"><Plus size={14}/>New lead</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        {isSuper(erpUser) && (
          <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-branch">
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <select value={status} onChange={e => setStatus(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-status">
          <option value="">All status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Target</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(l => (
                <tr key={l.id} className="border-t border-border" data-testid={`lead-row-${l.id}`}>
                  <td className="px-4 py-3 text-xs">{fmtDate(l.created_at)}</td>
                  <td className="px-4 py-3 font-bold">{l.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.phone}</td>
                  <td className="px-4 py-3 text-xs">{l.target_exam || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{l.notes || "—"}</td>
                  <td className="px-4 py-3">
                    <select value={l.status} onChange={e => updateStatus(l.id, e.target.value)}
                      className="text-xs border border-border rounded px-2 py-1 bg-background uppercase tracking-wider font-bold" data-testid={`status-${l.id}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="6" className="px-4 py-12 text-center text-muted-foreground">No leads yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateLeadModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("Lead added"); }}
        />
      )}
    </div>
  );
}

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
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onClose} data-testid="create-lead-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="bg-background rounded-md max-w-md w-full p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">New lead</div>
            <h3 className="font-display text-2xl font-black mt-1">Add a prospect</h3>
          </div>
          <button type="button" onClick={onClose}><X size={18}/></button>
        </div>
        {isSuper(erpUser) && (
          <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cl-branch">
            <option value="">— Branch —</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <input required placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cl-name"/>
        <input required placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cl-phone"/>
        <input type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cl-email"/>
        <select value={form.target_exam} onChange={e => setForm({...form, target_exam: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cl-target">
          {["NEET","IIT-JEE","Foundation","CBSE","JKBOSE"].map(x => <option key={x}>{x}</option>)}
        </select>
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cl-notes"/>
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold disabled:opacity-50" data-testid="cl-submit">{busy ? "Saving…" : "Add lead"}</button>
      </form>
    </div>
  );
}
