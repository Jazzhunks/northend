import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { erp, isSuper, isManagerPlus, isERPUser } from "@/lib/erpApi";
import {
  LayoutDashboard, Users, Receipt, Wallet, UserPlus, Building2,
  ScrollText, LogOut, Menu, X, GraduationCap, Contact2, QrCode
} from "lucide-react";

const NAV = [
  { to: "/erp", label: "Dashboard", icon: LayoutDashboard, exact: true, show: () => true },
  { to: "/erp/students", label: "Students", icon: GraduationCap, show: () => true },
  { to: "/erp/payments", label: "Fee Collections", icon: Receipt, show: (u) => u.role !== "counsellor" },
  { to: "/erp/expenses", label: "Expenses", icon: Wallet, show: (u) => u.role !== "counsellor" },
  { to: "/erp/leads", label: "Leads", icon: UserPlus, show: () => true },
  { to: "/erp/staff", label: "Staff", icon: Users, show: isManagerPlus },
  { to: "/erp/branches", label: "Branches", icon: Building2, show: isSuper },
  { to: "/erp/audit", label: "Audit Log", icon: ScrollText, show: isSuper },
  
  // ============================================================================
  // UPGRADED AUTOMATION MODULE NAVIGATION SHORTCUT SEGMENTS
  // ============================================================================
  { to: "/erp/erpattendance", label: "Gate Attendance", icon: QrCode, show: () => true },
  { to: "/erp/erpidcards", label: "ID Cards", icon: Contact2, show: (u) => u.role === "super_admin" || u.role === "admin" || u.role === "accountant" || u.role === "center_manager" },
];

export default function ErpLayout() {
  const { user, loading, logout } = useAuth();
  const nav = useNavigate();
  const [erpUser, setErpUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { nav("/login?next=/erp"); return; }
    if (!isERPUser(user)) { setErr("not-erp"); return; }
    erp.me().then(setErpUser).catch(() => setErr("not-erp"));
  }, [user, loading, nav]);

  if (err === "not-erp") {
    return (
      <div className="light min-h-screen grid place-items-center p-8" data-theme="light" data-testid="erp-no-access">
        <div className="text-center max-w-md">
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-2">Access Denied</div>
          <h2 className="font-display text-3xl font-medium mb-3">ERP staff only</h2>
          <p className="text-muted-foreground mb-6">Your account does not have ERP access. Please log in with a staff account.</p>
          <button onClick={() => { logout(); nav("/login?next=/erp"); }} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-bold" data-testid="erp-relogin-btn">Switch account</button>
        </div>
      </div>
    );
  }

  if (!erpUser) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading ERP…</div>;

  const navItems = NAV.filter(n => n.show(erpUser));

  return (
    <div className="h-screen w-screen flex bg-background relative overflow-hidden select-none print-layout-override">
      <style>{`
        @media print {
          .print-layout-override {
            height: auto !important;
            width: auto !important;
            overflow: visible !important;
            display: block !important;
          }
        }
      `}</style>

      {/* Ambient atmosphere */}
      <div className="ambient-orb ambient-orb--primary drift pointer-events-none print:hidden" style={{ width: 500, height: 500, top: "-150px", left: "10%" }} />
      <div className="ambient-orb ambient-orb--accent pointer-events-none print:hidden" style={{ width: 380, height: 380, bottom: "10%", right: "5%", opacity: 0.25 }} />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none print:hidden" />

      {/* Sidebar — Hard-Locked Non-Scrollable Layout Sheet */}
      <aside 
        className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 h-full glass-elevated border-r border-white/10 flex flex-col justify-between transition-transform duration-300 shrink-0 overflow-hidden print:hidden`} 
        data-testid="erp-sidebar"
      >
        <div className="w-full shrink-0 flex flex-col">
          <div className="p-6 border-b border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-[0.22em] text-accent font-bold">Northend</div>
            <div className="font-display text-xl font-medium tracking-tight mt-1 text-foreground">ERP Console</div>
          </div>
          
          <div className="p-4 border-b border-white/[0.06] bg-white/[0.01]">
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-bold">Signed in as</div>
            <div className="font-medium mt-1 text-sm text-foreground truncate" data-testid="erp-user-name">{erpUser.name}</div>
            <div className="text-[10px] text-accent font-mono mt-0.5 uppercase tracking-wider" data-testid="erp-user-role">{erpUser.role?.replace("_", " ")}</div>
            {erpUser.branch && <div className="text-xs text-muted-foreground/80 mt-1 truncate">📍 {erpUser.branch.name}</div>}
          </div>
        </div>

        {/* Mid Navigation Node Track Layer */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0">
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.exact}
              onClick={() => setOpen(false)}
              data-testid={`erp-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent text-accent-foreground shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)] font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              <item.icon size={16} className="shrink-0" /> <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Lock Control Pad */}
        <div className="p-3 border-t border-white/[0.06] shrink-0 bg-background/40">
          <button 
            onClick={async () => { await logout(); nav("/login"); }}
            data-testid="erp-logout-btn"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-rose-400 hover:bg-rose-500/5 transition duration-200"
          >
            <LogOut size={16} className="shrink-0"/> <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Framework Content Panel Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden print:overflow-visible print:h-auto">
        <header className="lg:hidden flex items-center gap-3 p-4 glass border-b border-white/[0.06] sticky top-0 z-30 shrink-0 print:hidden">
          <button onClick={() => setOpen(o => !o)} aria-label="menu" className="text-foreground p-1 hover:bg-white/5 rounded-lg transition" data-testid="erp-menu-toggle">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="font-display font-medium tracking-tight text-foreground">Northend ERP</div>
        </header>

        {/* Master Route Port Container Layer */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 max-w-[1400px] w-full mx-auto relative custom-scrollbar h-[calc(100vh-64px)] lg:h-screen print:p-0 print:h-auto print:overflow-visible">
          <Outlet context={{ erpUser }} />
        </main>
      </div>
    </div>
  );
}