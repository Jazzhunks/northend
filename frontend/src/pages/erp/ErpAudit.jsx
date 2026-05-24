import { useEffect, useState } from "react";
import { erp, fmtDate } from "@/lib/erpApi";

export default function ErpAudit() {
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => {
    erp.audit(branchId ? { branch_id: branchId } : {}).then(setItems);
  }, [branchId]);

  return (
    <div className="space-y-6" data-testid="erp-audit-page">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Compliance</div>
        <h1 className="font-display text-4xl font-black tracking-tight mt-1">Audit log</h1>
        <p className="text-muted-foreground mt-1">Last {items.length} actions.</p>
      </div>

      <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-md px-3 py-2 bg-background text-sm" data-testid="filter-branch">
        <option value="">All branches</option>
        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
      </select>

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs uppercase tracking-wider">When</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Actor</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Entity</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className="border-t border-border" data-testid={`audit-row-${a.id}`}>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{fmtDate(a.created_at)} <span className="text-muted-foreground">{a.created_at?.slice(11,16)}</span></td>
                  <td className="px-4 py-3 text-xs">{a.actor_email}</td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">{a.actor_role}</td>
                  <td className="px-4 py-3 text-xs"><span className="px-2 py-0.5 bg-secondary rounded font-mono">{a.action}</span></td>
                  <td className="px-4 py-3 text-xs">{a.entity}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono max-w-md truncate">{JSON.stringify(a.payload)}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan="6" className="px-4 py-12 text-center text-muted-foreground">No audit entries.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
