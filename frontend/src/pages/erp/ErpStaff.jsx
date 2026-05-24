import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, fmtDate } from "@/lib/erpApi";
import { Plus, X, UserX } from "lucide-react";

const ROLES = ["center_manager", "accountant", "counsellor"];

export default function ErpStaff() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const reload = () => erp.listStaff(branchId || undefined).then(setItems);

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [branchId]);

  const deactivate = async (id, name) => {
    if (!window.confirm(`Deactivate ${name}? They will no longer be able to sign in.`)) return;
    try { await erp.deactivateStaff(id); toast.success("Deactivated"); reload(); }
    catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
  };

  return (
    <div className="space-y-6" data-testid="erp-staff-page">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Team</div>
          <h1 className="font-display text-4xl font-black tracking-tight mt-1">Staff</h1>
          <p className="text-muted-foreground mt-1">{items.length} staff members</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold flex items-center gap-2" data-testid="create-staff-btn"><Plus size={14}/>Add staff</button>
      </div>

      {isSuper(erpUser) && (
        <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-branch">
          <option value="">All branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      )}

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Branch</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id} className={`border-t border-border ${s.active === false ? "opacity-40" : ""}`} data-testid={`staff-row-${s.id}`}>
                  <td className="px-4 py-3 font-bold">{s.name}</td>
                  <td className="px-4 py-3 text-xs">{s.email}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-bold uppercase">{s.role.replace("_", " ")}</span></td>
                  <td className="px-4 py-3 text-xs">{branches.find(b => b.id === s.branch_id)?.name || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    {s.active !== false && (
                      <button onClick={() => deactivate(s.id, s.name)} title="Deactivate" className="text-rose-600 hover:bg-rose-50 p-1 rounded" data-testid={`deactivate-${s.id}`}><UserX size={14}/></button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="6" className="px-4 py-12 text-center text-muted-foreground">No staff yet. Add a manager first.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateStaffModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("Staff added"); }}
        />
      )}
    </div>
  );
}

function CreateStaffModal({ erpUser, branches, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", role: "accountant",
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
  });
  const [busy, setBusy] = useState(false);

  const allowedRoles = isSuper(erpUser) ? ROLES : ROLES.filter(r => r !== "center_manager");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await erp.createStaff(form);
      onCreated();
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onClose} data-testid="create-staff-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="bg-background rounded-md max-w-md w-full p-6 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">New staff</div>
            <h3 className="font-display text-2xl font-black mt-1">Add team member</h3>
          </div>
          <button type="button" onClick={onClose}><X size={18}/></button>
        </div>
        <input required placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cs-name"/>
        <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cs-email"/>
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cs-phone"/>
        <input required type="password" placeholder="Initial password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cs-password"/>
        <select required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="cs-role">
          {allowedRoles.map(r => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
        </select>
        <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} disabled={!isSuper(erpUser)} className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm disabled:opacity-60" data-testid="cs-branch">
          <option value="">— Branch —</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold disabled:opacity-50" data-testid="cs-submit">{busy ? "Saving…" : "Add staff"}</button>
      </form>
    </div>
  );
}
