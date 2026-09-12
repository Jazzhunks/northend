import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { erp, isSuper, isManagerPlus, fmtINR, fmtDate } from "@/lib/erpApi";
import { formatError } from "@/lib/api";
import { API_BASE } from "@/lib/api";
import { Plus, Download, X, Check, Ban, Wallet, Search } from "lucide-react";

const CATEGORIES = ["Salary", "Rent", "Electricity", "Internet", "Marketing", "Maintenance", "Miscellaneous"];

export default function ErpExpenses() {
  const { erpUser } = useOutletContext();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 25;
  const queryClient = useQueryClient();

  const { data: branches = [] } = useQuery({
    queryKey: ['erp-branches'],
    queryFn: () => erp.listBranches()
  });

  const { data: expensesData = { items: [], total: 0, pages: 1 }, isLoading } = useQuery({
    queryKey: ['erp-expenses', branchId, search, statusFilter, page],
    queryFn: async () => {
      const params = { skip: (page - 1) * limit, limit };
      if (search) params.search = search;
      if (branchId) params.branch_id = branchId;
      if (statusFilter) params.status = statusFilter;
      return erp.listExpenses(params);
    },
    keepPreviousData: true
  });
  
  const items = expensesData.items;

  const handleSearch = (e) => {
    setQ(e.target.value);
    if (window.searchTimeout) clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 500);
  };

  const reload = () => queryClient.invalidateQueries(['erp-expenses']);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn" data-testid="erp-expenses-page">
      {/* Header Block Layer */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Outflow Reporting Matrix</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">Expense Sheets</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filteredItems.length} records parsed • Total approved settlement: <span className="text-rose-600 font-semibold font-mono">{fmtINR(total)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`${API_BASE}/erp/exports/expenses.xlsx`} target="_blank" rel="noreferrer" className="block">
            <button className="px-4 py-2.5 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 flex items-center gap-2 transition" data-testid="export-expenses-btn">
              <Download size={14}/> Excel
            </button>
          </a>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg transition" data-testid="create-expense-btn">
            <Plus size={14}/> Record Expense
          </button>
        </div>
      </div>

      {/* Interactive Filtering Track */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} // Fixed setQ mutation bug cleanly here
            placeholder="Filter list by description parameter, vendor name, or utility tag..." 
            className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
          />
        </div>
        {isSuper(erpUser) && (
          <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" data-testid="filter-branch">
            <option value="">All network branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[200px] focus:outline-none text-foreground" data-testid="filter-status">
          <option value="">All validation states</option>
          <option value="pending">Pending Verification</option>
          <option value="approved">Approved &amp; Settled</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Main Container Core (Independent Scroll Pinned Layer with Explicit Table Width Limits) */}
      <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[900px]">
            <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[12%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Date</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Category</th>
                <th className="w-[28%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Description</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Vendor / Party</th>
                <th className="w-[10%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Recorded By</th>
                <th className="w-[10%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Status</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-right bg-muted">Amount</th>
                <th className="w-[8%] px-5 py-3.5 bg-muted"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background/20">
              {filteredItems.map(e => (
                <tr key={e.id} className="hover:bg-muted/50 transition-colors group" data-testid={`exp-row-${e.id}`}>
                  <td className="px-5 py-4 text-xs whitespace-nowrap text-muted-foreground font-mono">{fmtDate(e.expense_date)}</td>
                  <td className="px-5 py-4 text-xs whitespace-nowrap">
                    <span className="px-2.5 py-0.5 bg-muted/50 rounded-md border border-border text-foreground font-medium text-[11px]">{e.category}</span>
                  </td>
                  <td className="px-5 py-4 text-xs font-normal text-foreground truncate" title={e.description}>{e.description}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground truncate" title={e.vendor}>{e.vendor || "—"}</td>
                  <td className="px-5 py-4 text-xs text-muted-foreground/80 whitespace-nowrap truncate">{e.recorded_by_name || "—"}</td>
                  <td className="px-5 py-4 whitespace-nowrap"><StatusBadge s={e.status}/></td>
                  <td className="px-5 py-4 font-mono text-right font-bold text-rose-600 whitespace-nowrap text-sm">{fmtINR(e.amount)}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    {isManagerPlus(erpUser) && e.status === "pending" && (
                      <div className="flex gap-1.5 justify-end">
                        <button 
                          disabled={busyRows.has(e.id)}
                          onClick={() => decide(e.id, "approve")} 
                          title="Approve & Settle" 
                          className="p-1.5 text-emerald-600 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 rounded-lg transition duration-200 disabled:opacity-40" 
                          data-testid={`approve-${e.id}`}
                        >
                          <Check size={14}/>
                        </button>
                        <button 
                          disabled={busyRows.has(e.id)}
                          onClick={() => decide(e.id, "reject")} 
                          title="Reject Entry" 
                          className="p-1.5 text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition duration-200 disabled:opacity-40" 
                          data-testid={`reject-${e.id}`}
                        >
                          <Ban size={14}/>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No financial outflow records parsed matching execution filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Portal Sheet */}
      {showCreate && (
        <CreateExpenseModal
          erpUser={erpUser}
          branches={branches}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); reload(); toast.success("Expense recorded successfully."); }}
        />
      )}
    </div>
  );
}

function StatusBadge({ s }) {
  const meta = {
    approved: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    rejected: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
  };
  return <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${meta[s] || ""}`}>{s}</span>;
}

function CreateExpenseModal({ erpUser, branches, onClose, onCreated }) {
  const [form, setForm] = useState({
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
    category: "Salary", amount: "", description: "", vendor: "", expense_date: new Date().toISOString().slice(0,10),
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (Number(form.amount) <= 0) {
      toast.error("Allocation quantity metrics must exceed structural zero boundary values");
      return;
    }
    setBusy(true);
    try {
      await erp.createExpense({ ...form, amount: Number(form.amount) });
      onCreated();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to commit allocation matrix mapping");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose} data-testid="create-expense-modal">
      <form 
        onClick={e => e.stopPropagation()} 
        onSubmit={submit} 
        className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent flex items-center gap-1">
              <Wallet size={12}/> Balance Tracking Framework
            </div>
            <h3 className="font-display text-2xl font-medium mt-1">Record Cost Outflow</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition">
            <X size={18}/>
          </button>
        </div>

        <div className="space-y-4">
          {isSuper(erpUser) && (
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Branch Target *</label>
              <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition">
                <option value="">— Select Target Hub Center —</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Expense Functional Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Outflow Valued Quantity (INR) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/60 font-mono">₹</span>
              <input type="number" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" className="w-full pl-7 pr-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="ce-amount"/>
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Ledger Statement Description *</label>
            <input type="text" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe operational utility allocation parameters..." className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="ce-description"/>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Recipient Vendor / Party</label>
              <input type="text" value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} placeholder="Optional" className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="ce-vendor"/>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Transaction Date *</label>
              <input type="date" required value={form.expense_date} onChange={e => setForm({...form, expense_date: e.target.value})} className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm font-mono text-foreground focus:outline-none focus:border-accent/40 transition" data-testid="ce-date"/>
            </div>
          </div>
        </div>

        {erpUser.role === "accountant" && (
          <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 leading-relaxed font-sans">
            Note: Accountant role assets require management or super user verification validation before surfacing inside metrics dashboards.
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition shadow-lg flex items-center justify-center" data-testid="ce-submit">
            {busy ? "Writing Matrix Records…" : "Commit Outflow Statement"}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-3 border border-border rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}