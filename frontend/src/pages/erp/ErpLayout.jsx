import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { erp, isSuper, isManagerPlus, isERPUser } from "@/lib/erpApi";
import {
  LayoutDashboard, Users, Receipt, Wallet, UserPlus, Building2,
  ScrollText, LogOut, Menu, X, GraduationCap, Contact2, QrCode, MessageSquare
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
  { to: "/erp/erpattendance", label: "Gate Attendance", icon: QrCode, show: () => true },
  { to: "/erp/erpidcards", label: "ID Cards", icon: Contact2, show: (u) => u.role === "super_admin" || u.role === "admin" || u.role === "accountant" || u.role === "center_manager" },
  { to: "/erp/whatsapp", label: "WhatsApp Broadcast", icon: MessageSquare, show: () => true },
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
      <div className="min-h-screen grid place-items-center p-6 bg-background" data-testid="erp-no-access">
        <div className="text-center max-w-md clay-card p-8">
          <div className="text-xs uppercase tracking-widest font-bold text-primary mb-2">Access Denied</div>
          <h2 className="font-display text-2xl font-bold mb-3 text-foreground">ERP Staff Portal Only</h2>
          <p className="text-sm text-muted-foreground mb-6">Your logged in account does not have active ERP staff clearance.</p>
          <button onClick={() => { logout(); nav("/login?next=/erp"); }} className="clay-btn-primary" data-testid="erp-relogin-btn">Switch Account</button>
        </div>
      </div>
    );
  }

  if (!erpUser) return <div className="min-h-screen grid place-items-center text-sm font-semibold text-muted-foreground bg-background">Loading ERP Portal…</div>;

  const navItems = NAV.filter(n => n.show(erpUser));

  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden select-none print-layout-override">
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

      {/* Mobile Drawer Overlay Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 z-30 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Fixed Sidebar */}
      <aside 
        className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 h-full bg-background border-r border-border flex flex-col justify-between transition-transform duration-200 shrink-0 shadow-sm print:hidden`}
        data-testid="erp-sidebar"
      >
        <div className="w-full shrink-0 flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="text-[10px] uppercase tracking-widest text-accent font-bold">Northend</div>
            <div className="font-display text-xl font-bold tracking-tight mt-0.5 text-foreground">ERP Console</div>
          </div>
          
          <div className="px-5 py-3 border-b border-border bg-muted/40">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Signed in as</div>
            <div className="font-semibold mt-0.5 text-xs text-foreground truncate" data-testid="erp-user-name">{erpUser.name}</div>
            <div className="text-[10px] text-primary font-bold mt-0.5 uppercase tracking-wider" data-testid="erp-user-role">{erpUser.role?.replace("_", " ")}</div>
            {erpUser.branch && <div className="text-[11px] text-muted-foreground mt-1 truncate">📍 {erpUser.branch.name}</div>}
          </div>
        </div>

        {/* Navigation Item Track */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar min-h-0">
          {navItems.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.exact}
              onClick={() => setOpen(false)}
              data-testid={`erp-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <item.icon size={16} className="shrink-0" /> <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Signout */}
        <div className="p-3 border-t border-border shrink-0 bg-muted/40">
          <button 
            onClick={async () => { await logout(); nav("/login"); }}
            data-testid="erp-logout-btn"
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition duration-150"
          >
            <LogOut size={16} className="shrink-0"/> <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden print:overflow-visible print:h-auto">
        <header className="lg:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-20 shrink-0 print:hidden">
          <button onClick={() => setOpen(o => !o)} aria-label="menu" className="text-foreground p-1.5 hover:bg-muted/50 rounded-lg transition" data-testid="erp-menu-toggle">
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
          <div className="font-display font-bold text-sm tracking-tight text-foreground">Northend ERP</div>
          <div className="w-6" />
        </header>

        {/* Dynamic Route Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto relative custom-scrollbar print:p-0 print:h-auto print:overflow-visible">
          <Outlet context={{ erpUser }} />
        </main>
      </div>
    </div>
  );
}