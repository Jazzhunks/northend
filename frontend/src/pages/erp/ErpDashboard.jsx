import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { erp, isSuper, isFinance, isManagerPlus, fmtINR, fmtDate } from "@/lib/erpApi";
import { formatError, api, API_BASE } from "@/lib/api";
import { toast } from "sonner";
import { 
  TrendingUp, TrendingDown, Users, AlertCircle, Building2, 
  Plus, IndianRupee, FileText, ArrowUpRight, ArrowDownRight, Wallet, 
  MapPinSimple, Download, Search, X, Check, Ban, Layers, MessageSquare, Clock
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from "recharts";

// --- CORE SYSTEM MATRIX CONFIGS ---
const EXP_CATEGORIES = ["Salary", "Rent", "Electricity", "Internet", "Marketing", "Maintenance", "Miscellaneous"];
const CHART_COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185', '#a78bfa', '#f472b6'];

// --- SHARED UI COMPONENT BLOCKS ---
const Stat = ({ label, value, icon: Icon, accent, testid }) => (
  <div className="glass-elevated rounded-2xl p-6 relative overflow-hidden group border border-border" data-testid={testid}>
    <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-500">
      {Icon && <Icon size={120} />}
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className="text-xs uppercase tracking-[0.18em] font-bold text-muted-foreground">{label}</div>
      {Icon && <Icon size={20} className={accent || "text-muted-foreground"}/>}
    </div>
    <div className={`font-display text-4xl font-medium mt-4 tracking-tight ${accent || "text-foreground"}`}>
      {value}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-border p-4 rounded-xl shadow-xl backdrop-blur-md z-50">
        <p className="font-bold text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6 text-sm mb-1 last:mb-0">
            <span style={{ color: entry.color }} className="font-medium">{entry.name}:</span>
            <span className="font-mono font-bold">{fmtINR(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ============================================================================
// MAIN DASHBOARD PLATFORM CONSOLE CONTAINER
// ============================================================================
export default function ErpDashboard() {
  const { erpUser } = useOutletContext();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'admission' | 'expense' | 'cashbook' | 'students' | 'outflow' | 'duelist'

  const refreshDashboard = () => {
    setData(null); setErr(null);
    const p = isSuper(erpUser) ? erp.superDashboard() : erp.branchDashboard(erpUser.branch_id);
    p.then(setData).catch(e => setErr(formatError(e.response?.data?.detail) || "Failed to load"));
  };

  useEffect(() => { refreshDashboard(); }, [erpUser]);

  if (err) return (
    <div className="flex flex-col items-center justify-center py-20 text-center" data-testid="erp-dashboard-error">
      <AlertCircle size={48} className="text-destructive mb-4" />
      <h2 className="text-xl font-bold">Dashboard Error</h2>
      <p className="text-muted-foreground mt-2">{err}</p>
    </div>
  );
  
  if (!data) return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse p-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-muted/50 rounded-2xl"></div>)}
    </div>
  );

  const canSeeFinance = isFinance(erpUser);

  return (
    <div className="p-1 sm:p-6 space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="w-full md:w-auto">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
            {isSuper(erpUser) ? "Operations Console" : "Centre Console"}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-2 break-words">
            {isSuper(erpUser) ? "Network Overview" : data.branch?.name}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-xl leading-relaxed">
            {isSuper(erpUser) 
              ? `Live operational metrics across ${data.total_branches} learning branches.` 
              : `${data.branch?.address || "Active Learning Center Execution Layer Branch."}`}
          </p>
        </div>

        {/* Command Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <button onClick={() => setActiveModal("duelist")} className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider transition border border-amber-500/20 shadow-md whitespace-nowrap">
            <Clock size={14} /> <span className="whitespace-nowrap">Today's Dues</span>
          </button>
          {erpUser.role !== "counsellor" && (
            <button onClick={() => setActiveModal("admission")} className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition shadow-lg whitespace-nowrap">
              <Plus size={14} /> <span className="whitespace-nowrap">New Admission</span>
            </button>
          )}
          {canSeeFinance && (
            <button onClick={() => setActiveModal("expense")} className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-muted/50 hover:bg-muted/80 text-foreground text-xs font-bold uppercase tracking-wider transition whitespace-nowrap">
              <Wallet size={14} /> <span className="whitespace-nowrap">Add Expense</span>
            </button>
          )}
          <button onClick={() => setActiveModal("students")} className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-muted/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider transition border border-border whitespace-nowrap">
            <Users size={14} /> <span className="whitespace-nowrap">Records</span>
          </button>
          {canSeeFinance && (
            <button onClick={() => setActiveModal("cashbook")} className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-muted/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider transition border border-border whitespace-nowrap">
              <IndianRupee size={14} /> <span className="whitespace-nowrap">Cashbook</span>
            </button>
          )}
          {canSeeFinance && (
            <button onClick={() => setActiveModal("outflow")} className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-muted/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-wider transition border border-border whitespace-nowrap">
              <Layers size={14} /> <span className="whitespace-nowrap">Outflow</span>
            </button>
          )}
        </div>
      </div>

      {/* CORE STATISTICAL MONITORING LAYER */}
      {isSuper(erpUser) ? (
        <SuperView d={data} />
      ) : (
        <BranchView d={data} canSeeFinance={canSeeFinance} />
      )}

      {/* CONTROL SHEETS PORTALS */}
      {activeModal === "admission" && (
        <CreateStudentModal erpUser={erpUser} onClose={() => setActiveModal(null)} onCreated={() => { setActiveModal(null); refreshDashboard(); }} />
      )}
      {activeModal === "expense" && (
        <CreateExpenseModal erpUser={erpUser} onClose={() => setActiveModal(null)} onCreated={() => { setActiveModal(null); refreshDashboard(); }} />
      )}
      {activeModal === "cashbook" && canSeeFinance && (
        <CashbookViewModal erpUser={erpUser} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "students" && (
        <StudentsViewModal erpUser={erpUser} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "outflow" && canSeeFinance && (
        <ExpensesViewModal erpUser={erpUser} onClose={() => setActiveModal(null)} refreshRoot={refreshDashboard} />
      )}
      {activeModal === "duelist" && (
        <TodayDueListModal erpUser={erpUser} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

// ============================================================================
// TODAY'S STUDENT FEE DUE MONITORING INTERFACE SLIDE SHEET
// ============================================================================
function TodayDueListModal({ erpUser, onClose }) {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = isSuper(erpUser) ? {} : { branch_id: erpUser.branch_id };
    
    erp.listStudents(params)
      .then(async (res) => {
        try {
          const resolvedStatements = await Promise.all(
            res.map(async (student) => {
              try {
                const statement = await erp.studentStatement(student.id);
                return {
                  ...student,
                  computedPending: Number(statement.pending || 0),
                  computedNet: Number(statement.net_fee || 0),
                  computedPaid: Number(statement.total_paid || 0)
                };
              } catch {
                const rawTotal = Number(student.total_fee || 0);
                const rawPaid = Number(student.paid_fee || 0); 
                return {
                  ...student,
                  computedPending: Math.max(0, rawTotal - rawPaid),
                  computedNet: rawTotal,
                  computedPaid: rawPaid
                };
              }
            })
          );

          const activeDues = resolvedStatements.filter(s => s.computedPending > 0);
          activeDues.sort((a, b) => b.computedPending - a.computedPending);
          setDues(activeDues);
        } catch (err) {
          toast.error("Error processing financial sub-ledger matrix records");
        }
      })
      .catch(() => toast.error("Failed to parse directory network tracking streams"))
      .finally(() => setLoading(false));
  }, [erpUser]);

  const triggeringWhatsAppNudge = (student) => {
    const textMessage = `Dear Parent,\n\nThis is an official tracking reminder from Northend Educational World regarding the pending academic installment fee balance of ${fmtINR(student.computedPending)} for your child ${student.full_name} (${student.student_no}).\n\nKindly arrange for the collection balance settlement at your nearest center desk layer.\n\nThank you,\nAdministration Management Console`;
    const targetPhone = student.parent_phone || student.contact_phone || "";
    
    if (!targetPhone) {
      toast.error("No valid communication parameters found for this profile record");
      return;
    }
    
    window.open(`https://wa.me/${targetPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(textMessage)}`, "_blank");
  };

  const runtimeFilteredDues = dues.filter(d => 
    d.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.student_no?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-background border-l border-border w-full max-w-2xl h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-start shrink-0">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-amber-400 flex items-center gap-1">
                <Clock size={12}/> Installment Balance Core Console
              </div>
              <h2 className="font-display text-3xl font-light tracking-tight mt-1">Due Tracking Register</h2>
              <p className="text-muted-foreground text-sm mt-1">Live algorithmic compilation matching isolated backend statement states.</p>
            </div>
            <button onClick={onClose} className="p-2 border border-border rounded-xl hover:bg-muted/50 transition"><X size={16}/></button>
          </div>

          <div className="relative w-full shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input 
              type="text"
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Search due tracking fields by student parameter or ID string..." 
              className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-amber-500/40 transition font-sans text-foreground"
            />
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-20 text-center">
              <div className="h-6 w-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <div className="text-muted-foreground text-xs font-mono tracking-wider uppercase">Evaluating global collection statements matrix...</div>
            </div>
          ) : (
            <div className="glass-elevated rounded-2xl border border-border flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground sticky top-0 backdrop-blur-md z-10 border-b border-border">
                  <tr className="text-left">
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider">Academic Record Profile</th>
                    <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-right">Outstanding Deficit</th>
                    <th className="px-5 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {runtimeFilteredDues.map(s => (
                    <tr key={s.id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-sm group-hover:text-amber-400/90 transition-colors">{s.full_name}</div>
                        <div className="text-[11px] font-mono text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 divide-x divide-border/30">
                          <span>{s.student_no}</span>
                          <span className="pl-2">Batch: {s.batch || "Unallocated"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-right font-bold text-sm text-rose-600">
                        {fmtINR(s.computedPending)}
                        <div className="text-[10px] text-muted-foreground font-normal tracking-wide mt-0.5">
                          Paid: {fmtINR(s.computedPaid)}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => triggeringWhatsAppNudge(s)} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-bold transition duration-300 border border-emerald-500/10 shadow-sm"
                        >
                          <MessageSquare size={13}/> Nudge
                        </button>
                      </td>
                    </tr>
                  ))}
                  {runtimeFilteredDues.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-5 py-16 text-center text-muted-foreground italic text-sm">
                        No outstanding student due records located under validation rules.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SYSTEM WORKSTATIONS SUB-CONSOLES (SUPER / BRANCH AGGREGATES)
// ============================================================================
function SuperView({ d }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat label="Total Revenue" value={fmtINR(d.total_revenue)} icon={TrendingUp} accent="text-emerald-600" testid="stat-revenue"/>
        <Stat label="Total Expense" value={fmtINR(d.total_expense)} icon={TrendingDown} accent="text-rose-600" testid="stat-expense"/>
        <Stat label="Net Income" value={fmtINR(d.net_income)} icon={Wallet} accent={d.net_income >= 0 ? "text-emerald-600" : "text-rose-600"} testid="stat-net"/>
        <Stat label="Pending Fees" value={fmtINR(d.total_pending_fees)} icon={AlertCircle} accent="text-amber-400" testid="stat-pending"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-elevated rounded-2xl p-6 border border-border">
          <h3 className="font-display font-medium text-lg mb-6">Revenue vs Expense by Branch</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.branches || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="branch_name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                <Bar dataKey="revenue" name="Revenue" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={50} />
                <Bar dataKey="expense" name="Expense" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <Stat label="Active Students" value={d.total_students} icon={Users} accent="text-sky-400" testid="stat-students"/>
          <Stat label="Operating Branches" value={d.total_branches} icon={Building2} accent="text-indigo-400" testid="stat-branches"/>
        </div>
      </div>

      <div className="glass-elevated rounded-2xl overflow-hidden border border-border" data-testid="branches-table">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-medium text-lg">Branch Metrics Summary</h3>
          <FileText size={18} className="text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr className="text-left text-muted-foreground">
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Branch Details</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Students</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Revenue</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Expense</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Net Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(d.branches || []).map(b => (
                <tr key={b.branch_id} className="hover:bg-muted/50 transition-colors" data-testid={`branch-row-${b.branch_id}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-base">{b.branch_name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{b.city}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-right">{b.students}</td>
                  <td className="px-6 py-4 font-mono text-right text-emerald-600/90">{fmtINR(b.revenue)}</td>
                  <td className="px-6 py-4 font-mono text-right text-rose-600/90">{fmtINR(b.expense)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-md font-mono font-bold text-xs ${b.net >= 0 ? "bg-emerald-400/10 text-emerald-600" : "bg-rose-400/10 text-rose-600"}`}>
                      {fmtINR(b.net)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BranchView({ d, canSeeFinance }) {
  const expenseData = Object.entries(d.expense_by_category || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {canSeeFinance && (
          <>
            <Stat label="Gross Revenue" value={fmtINR(d.revenue)} icon={TrendingUp} accent="text-emerald-600" testid="stat-revenue"/>
            <Stat label="Total Expense" value={fmtINR(d.expense)} icon={TrendingDown} accent="text-rose-600" testid="stat-expense"/>
          </>
        )}
        <Stat label="Pending Fees" value={fmtINR(d.pending_fees)} icon={AlertCircle} accent="text-amber-400" testid="stat-pending"/>
        <Stat label="Active Students" value={d.student_count} icon={Users} accent="text-sky-400" testid="stat-students"/>
      </div>

      <div className={`grid grid-cols-1 ${canSeeFinance ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-5`}>
        {canSeeFinance && (
          <div className="glass-elevated rounded-2xl p-6 flex flex-col border border-border" data-testid="expense-breakdown">
            <h3 className="font-display font-medium text-lg mb-2">Expense Distribution</h3>
            {expenseData.length === 0 ? (
               <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic py-10">No approved expenses to chart.</div>
            ) : (
              <div className="h-[280px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="rgba(0,0,0,0.2)"/>
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <div className="glass-elevated rounded-2xl p-6 flex flex-col border border-border" data-testid="counsellor-performance">
          <h3 className="font-display font-medium text-lg mb-2">Counsellor Conversion</h3>
          {(d.counsellor_performance || []).length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm italic py-10">No counsellor data available.</div>
          ) : (
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.counsellor_performance} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{backgroundColor: '#111', borderColor: '#333', borderRadius: '8px'}}/>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                  <Bar dataKey="leads" name="Total Leads" fill="#38bdf8" radius={[0, 4, 4, 0]} barSize={16} />
                  <Bar dataKey="converted" name="Converted" fill="#34d399" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {d.recent_payments?.length > 0 && (
        <div className="glass-elevated rounded-2xl overflow-hidden border border-border animate-fadeIn" data-testid="recent-payments">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-medium text-lg">Latest Center Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr className="text-left text-muted-foreground">
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Receipt No.</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Student Enrollment</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Payment Mode</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {d.recent_payments.map(p => (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.receipt_no}</td>
                    <td className="px-6 py-4 font-medium">{p.student_no}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 rounded bg-muted/50 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                        {p.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-right text-emerald-600 font-medium">{fmtINR(p.amount)}</td>
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

// ============================================================================
// MODAL PORTS & SLIDE-OVER CONSOLE RENDERS
// ============================================================================

function CashbookViewModal({ erpUser, onClose }) {
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
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-background border-l border-border w-full max-w-4xl h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Realtime Cashbook Log</div>
              <h2 className="font-display text-3xl font-light tracking-tight mt-1">Fee Collections</h2>
              <p className="text-muted-foreground text-sm mt-1">{items.length} records • Aggregate total {fmtINR(total)}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={`${API_BASE}/erp/exports/payments.xlsx`} target="_blank" rel="noreferrer" className="p-2 border border-border rounded-xl hover:bg-muted/50 transition">
                <Download size={16}/>
              </a>
              <button onClick={onClose} className="p-2 border border-border rounded-xl hover:bg-muted/50 transition"><X size={16}/></button>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {isSuper(erpUser) && (
              <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-xl px-3 py-2 bg-background/50 text-sm flex-1 min-w-[150px]">
                <option value="">All branches</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            )}
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border border-border rounded-xl px-3 py-2 bg-background/50 text-sm flex-1"/>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border border-border rounded-xl px-3 py-2 bg-background/50 text-sm flex-1"/>
          </div>

          <div className="glass-elevated rounded-2xl overflow-hidden border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-muted-foreground">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Receipt</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Student</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Mode</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Collector</th>
                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Amount</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map(p => (
                    <tr key={p.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{p.receipt_no}</td>
                      <td className="px-4 py-3 text-xs">{fmtDate(p.paid_at)}</td>
                      <td className="px-4 py-3 font-mono text-xs">{p.student_no}</td>
                      <td className="px-4 py-3 text-xs uppercase"><span className="px-1.5 py-0.5 bg-muted/50 rounded text-[10px] font-bold">{p.mode}</span></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.collected_by_name || "—"}</td>
                      <td className="px-4 py-3 font-mono text-right font-bold text-emerald-600">{fmtINR(p.amount)}</td>
                      <td className="px-4 py-3 text-right">
                        <a href={`${API_BASE}/erp/payments/${p.id}/receipt`} target="_blank" rel="noreferrer" className="text-accent text-xs font-bold hover:underline">PDF</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsViewModal({ erpUser, onClose }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]);

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => {
    const params = {};
    if (q) params.q = q;
    if (branchId) params.branch_id = branchId;
    erp.listStudents(params).then(setItems);
  }, [q, branchId]);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="bg-background border-l border-border w-full max-w-5xl h-full p-6 flex flex-col gap-6 overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Active Operational Database</div>
            <h2 className="font-display text-3xl font-light tracking-tight mt-1">Student Directory</h2>
            <p className="text-muted-foreground text-sm mt-1">{items.length} records active under framework execution roles.</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={`${API_BASE}/erp/exports/students.xlsx`} target="_blank" rel="noreferrer" className="p-2 border border-border rounded-xl hover:bg-muted/50 transition">
              <Download size={16}/>
            </a>
            <button onClick={onClose} className="p-2 border border-border rounded-xl hover:bg-muted/50 transition"><X size={16}/></button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
            <input value={q} onChange={e => setQ(setQ.target.value)} placeholder="Search by full name, registration number, phone..." className="w-full pl-9 pr-4 py-2 border border-border bg-background/50 rounded-xl text-sm"/>
          </div>
          {isSuper(erpUser) && (
            <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-xl px-3 py-2 bg-background/50 text-sm min-w-[180px]">
              <option value="">All network centres</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}
        </div>

        <div className="glass-elevated rounded-2xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Student ID</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Full Name</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Contact Line</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Assigned Branch</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Committed Fee</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Admission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map(s => (
                  <tr key={s.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.student_no}</td>
                    <td className="px-4 py-3 font-bold">{s.full_name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{s.contact_phone}</td>
                    <td className="px-4 py-3 text-xs">{branches.find(b => b.id === s.branch_id)?.name || s.branch_id?.slice(0,8)}</td>
                    <td className="px-4 py-3 font-mono text-right text-sky-400 font-medium">{fmtINR(s.total_fee)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(s.admission_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. EXPENSES SHEET LAYERING CONSOLE (SCROLL-FIXED)
function ExpensesViewModal({ erpUser, onClose, refreshRoot }) {
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const sync = () => {
    const params = {};
    if (branchId) params.branch_id = branchId;
    if (statusFilter) params.status = statusFilter;
    erp.listExpenses(params).then(setItems);
  };

  useEffect(() => { erp.listBranches().then(setBranches); }, []);
  useEffect(() => { sync(); }, [branchId, statusFilter]);

  const handleDecision = async (id, decision) => {
    try {
      await erp.decideExpense(id, { decision });
      toast.success(`Outflow item marked as ${decision}d`);
      sync();
      refreshRoot();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || "Operation failed"); }
  };

  const total = items.filter(e => e.status === "approved").reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-end backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()} 
        className="bg-background border-l border-border w-full max-w-5xl h-full p-6 flex flex-col justify-between shadow-2xl overflow-hidden"
      >
        <div className="space-y-6 flex flex-col h-full min-h-0">
          
          {/* Header Section (Pinned) */}
          <div className="flex justify-between items-start shrink-0">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Outflow Reporting Matrix</div>
              <h2 className="font-display text-3xl font-light tracking-tight mt-1">Expense Sheets</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {items.length} entries registered • Total approved execution: <span className="text-rose-600 font-bold">{fmtINR(total)}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a href={`${API_BASE}/erp/exports/expenses.xlsx`} target="_blank" rel="noreferrer" className="p-2 border border-border rounded-xl hover:bg-muted/50 transition">
                <Download size={16}/>
              </a>
              <button onClick={onClose} className="p-2 border border-border rounded-xl hover:bg-muted/50 transition"><X size={16}/></button>
            </div>
          </div>

          {/* Filters Section (Pinned) */}
          <div className="flex gap-3 flex-wrap shrink-0">
            {isSuper(erpUser) && (
              <select value={branchId} onChange={e => setBranchId(e.target.value)} className="border border-border rounded-xl px-3 py-2 bg-background/50 text-sm flex-1 min-w-[150px] focus:outline-none text-foreground">
                <option value="">All branches</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            )}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-border rounded-xl px-3 py-2 bg-background/50 text-sm flex-1 min-w-[150px] focus:outline-none text-foreground">
              <option value="">All statuses</option>
              <option value="pending">Pending Verification</option>
              <option value="approved">Approved & Settled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Table Container Layer (Hard-Bound Calculation Height Grid) */}
          <div className="glass-elevated rounded-2xl border border-border w-full overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-0">
            <div className="overflow-y-auto overflow-x-auto w-full h-full custom-scrollbar">
              <table className="w-full text-sm table-auto border-collapse">
                <thead className="bg-muted text-muted-foreground sticky top-0 z-20 shadow-[0_1px_0_rgba(255,255,255,0.05)]">
                  <tr className="text-left backdrop-blur-md">
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Date</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Category</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Description</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Vendor/Party</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider bg-muted">Status</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-right bg-muted">Amount</th>
                    <th className="px-4 py-3.5 bg-muted"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background/20">
                  {items.map(e => (
                    <tr key={e.id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap text-muted-foreground">{fmtDate(e.expense_date)}</td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-muted/50 rounded-md border border-border text-foreground font-medium">{e.category}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-normal text-foreground max-w-xs truncate" title={e.description}>{e.description}</td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-[150px] truncate" title={e.vendor}>{e.vendor || "—"}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge s={e.status}/></td>
                      <td className="px-4 py-3.5 font-mono text-right font-bold text-rose-600 whitespace-nowrap">{fmtINR(e.amount)}</td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        {isManagerPlus(erpUser) && e.status === "pending" && (
                          <div className="flex gap-1.5 justify-end">
                            <button onClick={() => handleDecision(e.id, "approve")} className="p-1 text-emerald-600 hover:bg-emerald-500/10 border border-emerald-500/0 hover:border-emerald-500/20 rounded-lg transition duration-200"><Check size={14}/></button>
                            <button onClick={() => handleDecision(e.id, "reject")} className="p-1 text-rose-600 hover:bg-rose-500/10 border border-rose-500/0 hover:border-rose-500/20 rounded-lg transition duration-200"><Ban size={14}/></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-16 text-center text-muted-foreground italic tracking-wide text-sm">
                        No financial outflow statements logged under variable matrix parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function CreateStudentModal({ erpUser, onClose, onCreated }) {
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [counsellors, setCounsellors] = useState([]);
  const [form, setForm] = useState({
    full_name: "", contact_phone: "", contact_email: "", parent_name: "", parent_phone: "",
    address: "", course_id: "", batch: "",
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
    counsellor_id: "", total_fee: "", scholarship_percent: 0, discount: 0
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => { 
    erp.listBranches().then(setBranches);
    api.get("/courses").then(r => setCourses(r.data)); 
  }, []);
  
  useEffect(() => {
    if (form.branch_id) erp.listStaff(form.branch_id).then(s => setCounsellors(s.filter(x => x.role === "counsellor")));
  }, [form.branch_id]);

  const executeSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form, total_fee: Number(form.total_fee), scholarship_percent: Number(form.scholarship_percent), discount: Number(form.discount) };
      if (!payload.counsellor_id) delete payload.counsellor_id;
      await erp.createStudent(payload);
      toast.success("New student academic enrollment committed successfully");
      onCreated();
    } catch (e) {
      toast.error(formatError(e.response?.data?.detail) || "Failed to commit parameters");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 grid place-items-center p-4 backdrop-blur-sm overflow-y-auto animate-fadeIn" onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={executeSubmit} className="bg-background border border-border rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Admission Interface Layer</div>
            <h3 className="font-display text-2xl font-medium mt-1">Enroll New Student</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg"><X size={18}/></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputCard label="Full name" v={form.full_name} on={v => setForm({...form, full_name: v})} req />
          <InputCard label="Phone String" v={form.contact_phone} on={v => setForm({...form, contact_phone: v})} req />
          <InputCard label="Email Address" type="email" v={form.contact_email} on={v => setForm({...form, contact_email: v})} />
          <InputCard label="Parent / Guardian Name" v={form.parent_name} on={v => setForm({...form, parent_name: v})} />
          <InputCard label="Parent Contact Line" v={form.parent_phone} on={v => setForm({...form, parent_phone: v})} />
          <InputCard label="Batch Allocation Code" v={form.batch} on={v => setForm({...form, batch: v})} placeholder="e.g. NEET-2026-ALPHA" />
          <SelectCard label="Operation Branch Center" v={form.branch_id} on={v => setForm({...form, branch_id: v, counsellor_id: ""})} req disabled={!isSuper(erpUser)} opts={branches.map(b => ({ v: b.id, l: b.name }))} />
          <SelectCard label="Course Academic Target" v={form.course_id} on={v => setForm({...form, course_id: v})} req opts={courses.map(c => ({ v: c.id, l: `${c.title} (${c.category})` }))} />
          <SelectCard label="Attending Onboarding Counsellor" v={form.counsellor_id} on={v => setForm({...form, counsellor_id: v})} opts={[{ v: "", l: "— Direct Walk In —" }, ...counsellors.map(c => ({ v: c.id, l: c.name }))]} />
          <InputCard label="Gross Structured Fee (INR) *" type="number" v={form.total_fee} on={v => setForm({...form, total_fee: v})} req />
          <InputCard label="Franchise Waiver Scholarship %" type="number" v={form.scholarship_percent} on={v => setForm({...form, scholarship_percent: v})} />
          <InputCard label="Special Management Discount (INR)" type="number" v={form.discount} on={v => setForm({...form, discount: v})} />
          <div className="sm:col-span-2">
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Physical Address</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2} className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent" />
          </div>
        </div>
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-wider text-xs disabled:opacity-50 transition shadow-lg">{busy ? "Committing Entry Parameters…" : "Authorize Academic Enrollment"}</button>
      </form>
    </div>
  );
}

function CreateExpenseModal({ erpUser, onClose, onCreated }) {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    branch_id: isSuper(erpUser) ? "" : erpUser.branch_id,
    category: "Salary", amount: "", description: "", vendor: "", expense_date: new Date().toISOString().slice(0,10),
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (isSuper(erpUser)) erp.listBranches().then(setBranches); }, []);

  const executeSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await erp.createExpense({ ...form, amount: Number(form.amount) });
      toast.success("Expense ledger statement logged successfully");
      onCreated();
    } catch (e) { toast.error(formatError(e.response?.data?.detail) || "Failed to commit sheet"); }
  };

  return (
    <div className="fixed inset-0 bg-black/20 z-50 grid place-items-center p-4 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={executeSubmit} className="bg-background border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Auditing &amp; Balances</div>
            <h3 className="font-display text-2xl font-medium mt-1">Record Cost Outflow</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted/50 rounded-lg"><X size={18}/></button>
        </div>

        {isSuper(erpUser) && (
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Allocation Center Target *</label>
            <select required value={form.branch_id} onChange={e => setForm({...form, branch_id: e.target.value})} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm focus:outline-none">
              <option value="">— Select Target Center —</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Expense Functional Category *</label>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-border bg-background rounded-xl text-sm focus:outline-none">
            {EXP_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <InputCard label="Outflow Valued Amount (INR) *" type="number" v={form.amount} on={v => setForm({...form, amount: v})} req />
        <InputCard label="Ledger Statement Description *" v={form.description} on={v => setForm({...form, description: v})} req />
        <div className="grid grid-cols-2 gap-3">
          <InputCard label="Recipient Vendor / Party" v={form.vendor} on={v => setForm({...form, vendor: v})} />
          <InputCard label="Transaction Date *" type="date" v={form.expense_date} on={v => setForm({...form, expense_date: v})} req />
        </div>
        <button disabled={busy} type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-wider text-xs transition shadow-lg">{busy ? "Writing Matrix State…" : "Commit Cost Outflow Statement"}</button>
      </form>
    </div>
  );
}

function StatusBadge({ s }) {
  const meta = {
    approved: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    rejected: "bg-rose-500/10 text-rose-600 border border-rose-500/20",
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${meta[s] || ""}`}>{s}</span>;
}

function InputCard({ label, v, on, type = "text", req, placeholder }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}{req && " *"}</label>
      <input type={type} value={v} required={req} placeholder={placeholder} onChange={e => on(e.target.value)} className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent font-mono text-foreground placeholder:text-muted-foreground/50" />
    </div>
  );
}

function SelectCard({ label, v, on, opts, req, disabled }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-1 block">{label}{req && " *"}</label>
      <select value={v} onChange={e => on(e.target.value)} required={req} disabled={disabled} className="w-full px-3 py-2 border border-border bg-background/50 rounded-xl text-sm focus:outline-none focus:border-accent disabled:opacity-50">
        {req && <option value="">— Select Option Layer —</option>}
        {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}