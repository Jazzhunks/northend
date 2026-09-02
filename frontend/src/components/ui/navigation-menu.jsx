import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  List, X, ChartBar, Users, GraduationCap, 
  Briefcase, FileText, Settings, SignOut 
} from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Analytics", path: "/admin", icon: ChartBar },
    { label: "Scholarships", path: "/admin/scholarships", icon: GraduationCap },
    { label: "Applicants", path: "/admin/applicants", icon: Users },
    { label: "Careers", path: "/admin/jobs", icon: Briefcase },
    { label: "Notices", path: "/admin/notices", icon: FileText },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      
      {/* 1. Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Responsive Sidebar (Hidden Off-screen on Mobile, Drawer-style) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          <div className="flex items-center justify-between px-2 py-4 mb-6 border-b border-border">
            <div>
              <h2 className="font-display text-lg font-bold">Northend</h2>
              <p className="text-[10px] tracking-widest text-muted-foreground uppercase">Admin Portal</p>
            </div>
            <button 
              className="md:hidden p-1 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-accent/15 text-accent border border-accent/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <SignOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* 3. Main Body Container (Claims 100% width on Mobile) */}
      <div className="flex flex-1 flex-col min-w-0 w-full overflow-y-auto">
        
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:hidden bg-card/50 backdrop-blur-md">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg border border-border text-foreground hover:bg-muted/50"
            aria-label="Open sidebar"
          >
            <List size={20} />
          </button>
          <span className="font-display text-sm font-semibold">Admin Panel</span>
          <div className="w-8" />
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  );
}