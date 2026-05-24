import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { erp, isSuper, fmtINR, fmtDate } from "@/lib/erpApi";
import { API_BASE } from "@/lib/api";
import { Download } from "lucide-react";

export default function ErpPayments() {
  const { erpUser } = useOutletContext();
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    if (from) params.from_date = from;
    if (to) params.to_date = to;
    erp.listPayments(params).then(setItems);
  }, [branchId, from, to]);

  const total = items.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6" data-testid="erp-payments-page">
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Cashbook</div>
          <h1 className="font-display text-4xl font-black tracking-tight mt-1">Fee Collections</h1>
          <p className="text-muted-foreground mt-1">{items.length} receipts · Total {fmtINR(total)}</p>
        </div>
        <a href={`${API_BASE}/erp/exports/payments.xlsx`} target="_blank" rel="noreferrer">
          <button className="px-4 py-2 border border-border rounded-md text-sm font-medium flex items-center gap-2" data-testid="export-payments-btn"><Download size={14}/>Excel</button>
        </a>
      </div>

      <div className="flex gap-3 flex-wrap">
        {isSuper(erpUser) && (
          <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-branch">
            <option value="">All branches</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        )}
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-from"/>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-to"/>
      </div>

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Receipt</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Mode</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">By</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-right">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t border-border" data-testid={`pay-row-${p.id}`}>
                  <td className="px-4 py-3 font-mono text-xs">{p.receipt_no}</td>
                  <td className="px-4 py-3 text-xs">{fmtDate(p.paid_at)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.student_no}</td>
                  <td className="px-4 py-3 text-xs uppercase">{p.mode}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.collected_by_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-right font-bold">{fmtINR(p.amount)}</td>
                  <td className="px-4 py-3">
                    <a href={`${API_BASE}/erp/payments/${p.id}/receipt`} target="_blank" rel="noreferrer" className="text-primary text-xs underline font-bold" data-testid={`dl-${p.id}`}>PDF</a>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="7" className="px-4 py-12 text-center text-muted-foreground">No payments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
