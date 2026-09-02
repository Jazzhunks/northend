import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, fmtDate } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { Plus, X, UserX, Search, ShieldAlert, KeyRound, Smartphone, Mail, Edit3, Save } from "lucide-react";

const ROLES = ["center_manager", "accountant", "counsellor"];

const ROLE_STYLES = {
  super_admin: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  admin: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  center_manager: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  accountant: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  counsellor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
};

export default function ErpStaff() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null); // Tracks the personnel profile currently loading changes
  const [busyRows, setBusyRows] = useState(new Set());

  const reload = () => {
    erp.listStaff(branchId || undefined)
      .then(setItems)
      .catch(e => toast.error(formatError(e) || "Failed to load team roster profiles"));
  };

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [branchId]);

  const toggleDeactivate = async (id, name) => {
    if (busyRows.has(id)) return;
    if (!window.confirm(`Deactivate access profile for ${name}? They will lose immediate database visibility.`)) return;
    
    setBusyRows(prev => { const next = new Set(prev); next.add(id); return next; });
    try {
      await erp.deactivateStaff(id);
      toast.success(`Access permissions revoked for ${name}`);
      reload();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to modify authorization status");
    } finally {
      setBusyRows(prev => { const next = new Set(prev); next.delete(id); return next; });
    }
  };

  const filteredItems = items.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role?.toLowerCase().replace("_", " ").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn" data-testid="erp-staff-page">
      {/* Header Panel */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Human Capital Stack</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">Team Roster</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filteredItems.length} active enterprise execution profiles mapped in directory view.
          </p>
        </div>
        <button 
          onClick={() => setShowCreate(true)} 
          className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition" 
          data-testid="create-staff-btn"
        >
          <Plus size={14}/> Add Staff Member
        </button>
      </div>

      {/* Navigation Parameter Tracks */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search roster fields by identity description, role layout name, or authorization email..." 
            className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
          />
        </div>
        {isSuper(erpUser) && (
          <select 
            value={branchId} 
            onChange={e => setBranchId(e.target.value)} 
            className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" 
            data-testid="filter-branch"
          >
            <option value="">All active network branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
      </div>

      {/* Main Container Core Table Grid */}
      <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[850px]">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[20%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Staff Identity</th>
                <th className="w-[23%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Authorization Email</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Role Profile</th>
                <th className="w-[17%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Branch Station</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Joined Date</th>
                <th className="w-[10%] px-5 py-3.5 bg-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background/20">
              {filteredItems.map(s => (
                <tr key={s.id} className={`hover:bg-muted/50 transition-colors group ${s.active === false ? "opacity-35" : ""}`} data-testid={`staff-row-${s.id}`}>
                  <td className="px-5 py-4 text-xs font-semibold text-foreground truncate">{s.name}</td>
                  <td className="px-5 py-4 text-xs font-mono text-muted-foreground truncate" title={s.email}>{s.email}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono border ${ROLE_STYLES[s.role] || "bg-muted/50 border-border"}`}>
                      {s.role?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-foreground font-medium truncate">
                    {branches.find(b => b.id === s.branch_id)?.name || "Network Core Global"}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground font-mono whitespace-nowrap">{fmtDate(s.created_at)}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap pr-6">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingStaff(s)}
                        disabled={s.active === false}
                        title="Edit Profile Configuration"
                        className="p-1.5 text-accent border border-transparent hover:bg-muted/50 hover:border-border rounded-lg transition duration-150 disabled:opacity-30"
                      >
                        <Edit3 size={14}/>
                      </button>
                      
                      {s.active !== false ? (
                        <button 
                          disabled={busyRows.has(s.id)}
                          onClick={() => toggleDeactivate(s.id, s.name)} 
                          title="Revoke Permissions" 
                          className="p-1.5 text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition duration-200 disabled:opacity-40" 
                          data-testid={`deactivate-${s.id}`}
                        >
                          <UserX size={14}/>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold font-mono tracking-wider text-rose-500 bg-rose-500/5 px-2 py-0.5 border border-rose-500/10 rounded-md select-none">Inactive</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No matching personnel access records found inside current execution space parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Wizard Dialog Layer */}
      {showCreate && (
        <CreateStaffModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("New personnel profile deployed safely"); }}
        />
      )}

      {/* Profile Modification Wizard Dialog Layer */}
      {editingStaff && (
        <UpdateStaffModal
          erpUser={erpUser}
          branches={branches}
          staffMember={editingStaff}
          onClose={() => setEditingStaff(null)}
          onUpdated={() => { setEditingStaff(null); reload(); toast.success("Personnel profile configuration synchronized successfully"); }}
        />
      )}
    </div>
  );
}

// ============================================================================
// PERSONNEL PROFILE CREATION MODAL COMPONENT
// ============================================================================
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
    } catch (e) { 
      toast.error(formatError(e.response?.data?.detail) || "Failed to finalize database credentials allocation parameters"); 
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose} data-testid="create-staff-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <ShieldAlert size={12}/> Access Permission Layer
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Add Team Member</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition"><X size={18}/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Full Name *</label>
            <input required placeholder="E.g. Junaid Ahmad" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cs-name"/>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">System Login Email *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"><Mail size={14}/></span>
              <input required type="email" placeholder="username@northendedu.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cs-email"/>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Primary Mobile Handle</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"><Smartphone size={14}/></span>
              <input type="text" placeholder="Contact string" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cs-phone"/>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Initial Security Password *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"><KeyRound size={14}/></span>
              <input required type="password" placeholder="••••••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cs-password"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Assigned Role *</label>
              <select required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="cs-role">
                {allowedRoles.map(r => <option key={r} value={r}>{r.replace("_", " ").toUpperCase()}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Station Branch *</label>
              <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} disabled={!isSuper(erpUser)} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition disabled:opacity-50" data-testid="cs-branch">
                <option value="">— Choose Station —</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={busy} type="submit" className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center" data-testid="cs-submit">
            {busy ? "Authorizing Personnel Parameters…" : "Deploy Staff Access Instance"}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// PERSONNEL PROFILE EDIT/UPDATE MODAL COMPONENT (WITH PASSWORD HASHER PASSES)
// ============================================================================
function UpdateStaffModal({ erpUser, branches, staffMember, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: staffMember.name || "",
    phone: staffMember.phone || "",
    role: staffMember.role || "accountant",
    branch_id: staffMember.branch_id || "",
    new_password: "" // Left empty intentionally; only sent to backend if updated by admin
  });
  const [busy, setBusy] = useState(false);

  const allowedRoles = isSuper(erpUser) ? ROLES : ROLES.filter(r => r !== "center_manager");

  const submitUpdate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form };
      // Strip password string parameter from payload if no changes are made
      if (!payload.new_password.trim()) {
        delete payload.new_password;
      }
      
      await erp.updateStaff(staffMember.id, payload);
      onUpdated();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to commit credential changes to database records");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={submitUpdate} className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <ShieldAlert size={12}/> Modifying Credentials Loop
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Edit Staff Profile</h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{staffMember.email}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition"><X size={18}/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Full Name *</label>
            <input required placeholder="E.g. Junaid Ahmad" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" />
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Primary Mobile Handle</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"><Smartphone size={14}/></span>
              <input type="text" placeholder="Contact string" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">Force Security Password Reset</label>
              <span className="text-[9px] uppercase font-bold tracking-wider text-accent font-mono bg-accent/5 border border-accent/10 px-2 py-0.5 rounded">Optional</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"><KeyRound size={14}/></span>
              <input type="password" placeholder="Leave empty to retain current password" value={form.new_password} onChange={e => setForm({...form, new_password: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Assigned Role *</label>
              <select required value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition">
                {allowedRoles.map(r => <option key={r} value={r}>{r.replace("_", " ").toUpperCase()}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Station Branch *</label>
              <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} disabled={!isSuper(erpUser)} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition disabled:opacity-50">
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button disabled={busy} type="submit" className="flex-1 py-3 bg-accent text-accent-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center">
            <Save size={14} className="mr-1.5"/> {busy ? "Synchronizing Records..." : "Commit Update Changes"}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}