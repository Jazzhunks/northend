import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { erp, isSuper, isManagerPlus, isERPUser } from "@/lib/erpApi";
import {
  LayoutDashboard, Users, Receipt, Wallet, UserPlus, Building2,
  ScrollText, LogOut, Menu, X, GraduationCap
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
          <h2 className="font-display text-3xl font-black mb-3">ERP staff only</h2>
          <p className="text-muted-foreground mb-6">Your account does not have ERP access. Please log in with a staff account.</p>
          <button onClick={() => { logout(); nav("/login?next=/erp"); }} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md font-bold" data-testid="erp-relogin-btn">Switch account</button>
        </div>
      </div>
    );
  }

  if (!erpUser) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading ERP…</div>;

  const navItems = NAV.filter(n => n.show(erpUser));

  return (
    <div className="light min-h-screen flex bg-secondary/20" data-theme="light">
      {/* Sidebar */}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transition-transform`} data-testid="erp-sidebar">
        <div className="p-6 border-b border-white/10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Northend</div>
          <div className="font-display text-lg font-black">ERP Console</div>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="text-xs text-white/60 uppercase tracking-wider">Signed in as</div>
          <div className="font-bold mt-1 text-sm" data-testid="erp-user-name">{erpUser.name}</div>
          <div className="text-xs text-accent font-mono mt-0.5" data-testid="erp-user-role">{erpUser.role}</div>
          {erpUser.branch && <div className="text-xs text-white/60 mt-0.5">{erpUser.branch.name}</div>}
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.exact}
              onClick={() => setOpen(false)}
              data-testid={`erp-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${isActive ? "bg-white text-primary" : "hover:bg-white/10"}`}>
              <item.icon size={16} /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button onClick={async () => { await logout(); nav("/login"); }}
            data-testid="erp-logout-btn"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-white/10 transition">
            <LogOut size={16}/> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 p-4 bg-background border-b border-border sticky top-0 z-30">
          <button onClick={() => setOpen(o => !o)} aria-label="menu" data-testid="erp-menu-toggle">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="font-display font-black">Northend ERP</div>
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet context={{ erpUser }} />
        </main>
      </div>
    </div>
  );
}
