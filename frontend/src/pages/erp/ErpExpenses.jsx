import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, isManagerPlus, fmtINR, fmtDate } from "@/lib/erpApi";
import { API_BASE } from "@/lib/api";
import { Plus, Download, X, Check, Ban } from "lucide-react";

const CATEGORIES = ["Salary","Rent","Electricity","Internet","Marketing","Maintenance","Miscellaneous"];

export default function ErpExpenses() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const reload = () => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    if (statusFilter) params.status = statusFilter;
    erp.listExpenses(params).then(setItems);
  };

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { reload(); }, [branchId, statusFilter]);

  const decide = async (id, decision) => {
    try {
      await erp.decideExpense(id, { decision });
      toast.success(`Expense ${decision}d`);
      reload();
    } catch (e) { toast.error(e.response?.data?.detail || "Failed"); }
  };

  const total = items.filter(e => e.status === "approved").reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6" data-testid="erp-expenses-page">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Outflow</div>
          <h1 className="font-display text-4xl font-black tracking-tight mt-1">Expenses</h1>
          <p className="text-muted-foreground mt-1">{items.length} entries · Approved total {fmtINR(total)}</p>
        </div>
        <div className="flex gap-2">
          <a href={`${API_BASE}/erp/exports/expenses.xlsx`} target="_blank" rel="noreferrer">
            <button className="px-4 py-2 border border-border rounded-md text-sm font-medium flex items-center gap-2" data-testid="export-expenses-btn"><Download size={14}/>Excel</button>
          </a>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold flex items-center gap-2" data-testid="create-expense-btn"><Plus size={14}/>New expense</button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {isSuper(erpUser) && (
          <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-branch">
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-status">
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">By</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(e => (
                <tr key={e.id} className="border-t border-border" data-testid={`exp-row-${e.id}`}>
                  <td className="px-4 py-3 text-xs">{fmtDate(e.expense_date)}</td>
                  <td className="px-4 py-3 text-xs"><span className="px-2 py-0.5 bg-secondary rounded font-medium">{e.category}</span></td>
                  <td className="px-4 py-3 text-xs">{e.description}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.vendor || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.recorded_by_name || "—"}</td>
                  <td className="px-4 py-3"><Status s={e.status}/></td>
                  <td className="px-4 py-3 font-mono text-right font-bold">{fmtINR(e.amount)}</td>
                  <td className="px-4 py-3">
                    {isManagerPlus(erpUser) && e.status === "pending" && (
                      <div className="flex gap-1">
                        <button onClick={() => decide(e.id, "approve")} title="Approve" className="p-1 text-emerald-600 hover:bg-emerald-50 rounded" data-testid={`approve-${e.id}`}><Check size={14}/></button>
                        <button onClick={() => decide(e.id, "reject")} title="Reject" className="p-1 text-rose-600 hover:bg-rose-50 rounded" data-testid={`reject-${e.id}`}><Ban size={14}/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="8" className="px-4 py-12 text-center text-muted-foreground">No expenses recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateExpenseModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("Expense recorded"); }}
        />
      )}
    </div>
  );
}

function Status({ s }) {
  const m = {
    approved: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${m[s] || ""}`}>{s}</span>;
}

function CreateExpenseModal({ erpUser, branches, onClose, onCreated }) {
  const [form, setForm] = useState({
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
    category: "Salary", amount: "", description: "", vendor: "", expense_date: new Date().toISOString().slice(0,10),
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await erp.createExpense({ ...form, amount: Number(form.amount) });
      onCreated();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={onClose} data-testid="create-expense-modal">
      <form onClick={e => e.stopPropagation()} onSubmit={submit} className="bg-background rounded-md max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">New entry</div>
            <h3 className="font-display text-2xl font-black mt-1">Record an expense</h3>
          </div>
          <button type="button" onClick={onClose}><X size={18}/></button>
        </div>

        {isSuper(erpUser) && (
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Branch *</label>
            <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="ce-branch">
              <option value="">— Select —</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Category *</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="ce-category">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Amount *</label>
          <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="ce-amount"/>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Description *</label>
          <input required value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="ce-description"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Vendor</label>
            <input value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="ce-vendor"/>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Date *</label>
            <input type="date" required value={form.expense_date} onChange={e => setForm({...form, expense_date: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm" data-testid="ce-date"/>
          </div>
        </div>
        {erpUser.role === "accountant" && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">⚠ Accountant entries require manager approval before they show on the dashboard.</p>}
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-md font-bold disabled:opacity-50" data-testid="ce-submit">{busy ? "Saving…" : "Record expense"}</button>
      </form>
    </div>
  );
}
