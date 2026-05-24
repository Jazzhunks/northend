import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { erp, isSuper, fmtINR } from "@/lib/erpApi";
import { TrendingUp, TrendingDown, Users, AlertCircle, Building2 } from "lucide-react";

const Stat = ({ label, value, icon: Icon, accent, testid }) => (
  <div className="bg-background border border-border rounded-md p-5" data-testid={testid}>
    <div className="flex items-start justify-between">
      <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">{label}</div>
      {Icon && <Icon size={18} className="text-muted-foreground"/>}
    </div>
    <div className={`font-display text-3xl font-black mt-2 ${accent || ""}`}>{value}</div>
  </div>
);

export default function ErpDashboard() {
  const { erpUser } = useOutletContext();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setData(null); setErr(null);
    const p = isSuper(erpUser)
      ? erp.superDashboard()
      : erp.branchDashboard(erpUser.branch_id);
    p.then(setData).catch(e => setErr(e.response?.data?.detail || "Failed to load"));
  }, [erpUser]);

  if (err) return <div className="text-destructive" data-testid="erp-dashboard-error">Error: {err}</div>;
  if (!data) return <div className="text-muted-foreground">Loading…</div>;

  if (isSuper(erpUser)) return <SuperView d={data}/>;
  return <BranchView d={data}/>;
}

function SuperView({ d }) {
  return (
    <div className="space-y-8" data-testid="erp-super-dashboard">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Operations Console</div>
        <h1 className="font-display text-4xl font-black tracking-tight mt-1">All branches overview</h1>
        <p className="text-muted-foreground mt-2">Live financial &amp; admission performance across {d.total_branches} centres.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total Revenue" value={fmtINR(d.total_revenue)} icon={TrendingUp} accent="text-emerald-600" testid="stat-revenue"/>
        <Stat label="Total Expense" value={fmtINR(d.total_expense)} icon={TrendingDown} accent="text-rose-600" testid="stat-expense"/>
        <Stat label="Net Income" value={fmtINR(d.net_income)} icon={TrendingUp} accent={d.net_income>=0 ? "text-emerald-600" : "text-rose-600"} testid="stat-net"/>
        <Stat label="Pending Fees" value={fmtINR(d.total_pending_fees)} icon={AlertCircle} accent="text-amber-600" testid="stat-pending"/>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        <Stat label="Active Students" value={d.total_students} icon={Users} testid="stat-students"/>
        <Stat label="Branches" value={d.total_branches} icon={Building2} testid="stat-branches"/>
      </div>

      <div className="bg-background border border-border rounded-md overflow-hidden" data-testid="branches-table">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-lg">Branch performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr className="text-left">
                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Branch</th>
                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Students</th>
                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider text-right">Revenue</th>
                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider text-right">Expense</th>
                <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {d.branches.map(b => (
                <tr key={b.branch_id} className="border-t border-border" data-testid={`branch-row-${b.branch_id}`}>
                  <td className="px-5 py-3">
                    <div className="font-bold">{b.branch_name}</div>
                    <div className="text-xs text-muted-foreground">{b.city}</div>
                  </td>
                  <td className="px-5 py-3 font-mono">{b.students}</td>
                  <td className="px-5 py-3 font-mono text-right text-emerald-700">{fmtINR(b.revenue)}</td>
                  <td className="px-5 py-3 font-mono text-right text-rose-700">{fmtINR(b.expense)}</td>
                  <td className={`px-5 py-3 font-mono text-right font-bold ${b.net>=0 ? "text-emerald-700":"text-rose-700"}`}>{fmtINR(b.net)}</td>
                </tr>
              ))}
              {d.branches.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-muted-foreground">No branches yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BranchView({ d }) {
  return (
    <div className="space-y-8" data-testid="erp-branch-dashboard">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary">Centre Console</div>
        <h1 className="font-display text-4xl font-black tracking-tight mt-1">{d.branch?.name}</h1>
        <p className="text-muted-foreground mt-2">{d.branch?.address}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Branch Revenue" value={fmtINR(d.revenue)} icon={TrendingUp} accent="text-emerald-600" testid="stat-revenue"/>
        <Stat label="Branch Expense" value={fmtINR(d.expense)} icon={TrendingDown} accent="text-rose-600" testid="stat-expense"/>
        <Stat label="Pending Fees" value={fmtINR(d.pending_fees)} icon={AlertCircle} accent="text-amber-600" testid="stat-pending"/>
        <Stat label="Active Students" value={d.student_count} icon={Users} testid="stat-students"/>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-background border border-border rounded-md p-5" data-testid="expense-breakdown">
          <h3 className="font-display font-bold text-lg mb-3">Expense by category</h3>
          {Object.keys(d.expense_by_category || {}).length === 0
            ? <p className="text-muted-foreground text-sm">No approved expenses yet</p>
            : Object.entries(d.expense_by_category).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
              <div key={cat} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm">{cat}</span>
                <span className="font-mono text-sm">{fmtINR(amt)}</span>
              </div>
            ))
          }
        </div>

        <div className="bg-background border border-border rounded-md p-5" data-testid="counsellor-performance">
          <h3 className="font-display font-bold text-lg mb-3">Counsellor performance</h3>
          {(d.counsellor_performance || []).length === 0
            ? <p className="text-muted-foreground text-sm">No counsellors active</p>
            : <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="py-2">Counsellor</th><th className="text-center">Leads</th><th className="text-center">Converted</th></tr></thead>
                <tbody>
                  {d.counsellor_performance.map(c => (
                    <tr key={c.counsellor_id} className="border-t border-border">
                      <td className="py-2">{c.name}</td>
                      <td className="py-2 text-center font-mono">{c.leads}</td>
                      <td className="py-2 text-center font-mono font-bold text-emerald-700">{c.converted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      </div>

      {d.recent_payments?.length > 0 && (
        <div className="bg-background border border-border rounded-md overflow-hidden" data-testid="recent-payments">
          <div className="px-5 py-4 border-b border-border"><h3 className="font-display font-bold text-lg">Recent payments</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40"><tr className="text-left">
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Receipt</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Mode</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider text-right">Amount</th>
              </tr></thead>
              <tbody>
                {d.recent_payments.map(p => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-5 py-3 font-mono text-xs">{p.receipt_no}</td>
                    <td className="px-5 py-3">{p.student_no}</td>
                    <td className="px-5 py-3 text-xs uppercase">{p.mode}</td>
                    <td className="px-5 py-3 font-mono text-right">{fmtINR(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
