import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { erp, isSuper, fmtINR, fmtDate } from "@/lib/erpApi";
import { API_BASE } from "@/lib/api";
import { Download, Search, Calendar, FileText, CreditCard, Banknote } from "lucide-react";

export default function ErpPayments() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  
  useEffect(() => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    if (from) params.from_date = from;
    if (to) params.to_date = to;
    erp.listPayments(params).then(setItems);
  }, [branchId, from, to]);

  // Client-side quick filtering across critical strings
  const filteredItems = items.filter(p => 
    p.receipt_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.student_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.collected_by_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = filteredItems.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col min-h-0 animate-fadeIn" data-testid="erp-payments-page">
      {/* Header Operational Block */}
      <div className="flex justify-between items-end flex-wrap gap-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Cashbook &amp; Ledgers</div>
          <h1 className="font-display text-4xl font-light tracking-tight mt-1">Fee Collections</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filteredItems.length} receipts compiled • Gross collection total: <span className="text-emerald-400 font-semibold font-mono">{fmtINR(total)}</span>
          </p>
        </div>
        <a href={`${API_BASE}/erp/exports/payments.xlsx`} target="_blank" rel="noreferrer" className="block">
          <button className="px-4 py-2.5 border border-white/10 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center gap-2 transition" data-testid="export-payments-btn">
            <Download size={14}/> Export Excel
          </button>
        </a>
      </div>

      {/* Interactive Parameters Track */}
      <div className="flex gap-3 flex-wrap shrink-0 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input 
            type="text"
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Search records by receipt ID, student allocation code, or collector identity..." 
            className="w-full pl-9 pr-4 py-2 border border-white/10 bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent/40 transition text-foreground"
          />
        </div>
        {isSuper(erpUser) && (
          <select 
            value={branchId} 
            onChange={e => setBranchId(e.target.value)} 
            className="border border-white/10 rounded-xl px-4 py-2 bg-background/50 text-sm min-w-[180px] focus:outline-none text-foreground" 
            data-testid="filter-branch"
          >
            <option value="">All network branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <div className="flex items-center gap-2 border border-white/10 bg-background/30 rounded-xl px-3 py-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">From</span>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="bg-transparent border-0 p-1 text-sm text-foreground focus:outline-none focus:ring-0" data-testid="filter-from"/>
        </div>
        <div className="flex items-center gap-2 border border-white/10 bg-background/30 rounded-xl px-3 py-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">To</span>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="bg-transparent border-0 p-1 text-sm text-foreground focus:outline-none focus:ring-0" data-testid="filter-to"/>
        </div>
      </div>

      {/* Main Container Core Table Grid (Scroll & Explicit Boundaries Fixed Layer) */}
      <div className="glass-elevated rounded-2xl border border-white/5 w-full overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
          <table className="w-full text-sm table-fixed border-collapse min-w-[850px]">
            <thead className="bg-[#18181b] text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
              <tr className="text-left backdrop-blur-md">
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Receipt ID</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Collection Date</th>
                <th className="w-[18%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Student No</th>
                <th className="w-[12%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Method Mode</th>
                <th className="w-[17%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider bg-[#131316]">Collected By</th>
                <th className="w-[15%] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-right bg-[#131316]">Net Amount</th>
                <th className="w-[8%] px-5 py-3.5 bg-[#131316]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-background/20">
              {filteredItems.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group" data-testid={`pay-row-${p.id}`}>
                  <td className="px-5 py-4 font-mono text-xs text-foreground tracking-wide font-semibold">{p.receipt_no}</td>
                  <td className="px-5 py-4 text-xs whitespace-nowrap text-muted-foreground">{fmtDate(p.paid_at)}</td>
                  <td className="px-5 py-4 font-mono text-xs text-foreground">{p.student_no}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <ModeBadge mode={p.mode} />
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground truncate" title={p.collected_by_name}>{p.collected_by_name || "—"}</td>
                  <td className="px-5 py-4 font-mono text-right font-bold text-emerald-400 whitespace-nowrap text-sm">{fmtINR(p.amount)}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <a 
                      href={`${API_BASE}/erp/payments/${p.id}/receipt`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 border border-accent/10 hover:bg-accent/20 rounded-lg transition duration-200" 
                      data-testid={`dl-${p.id}`}
                    >
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                    No verified cashbook transactions found matching your filter selections.
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

// --- CONTEXT SENSITIVE TRANSACTION TYPE BADGES ---
function ModeBadge({ mode }) {
  const norm = mode?.toLowerCase() || "";
  let config = "bg-white/5 text-muted-foreground border-white/5"; // Fallback details
  
  if (norm === "cash") {
    config = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  } else if (norm === "upi" || norm === "online") {
    config = "bg-sky-500/10 text-sky-400 border-sky-500/20";
  } else if (norm === "cheque" || norm === "card") {
    config = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config}`}>
      {norm === "cash" && <Banknote size={10} />}
      {["card", "online", "upi"].includes(norm) && <CreditCard size={10} />}
      {mode}
    </span>
  );
}