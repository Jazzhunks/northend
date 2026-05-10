import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin, Mail, MessageCircle, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/scholarship", label: "Scholarship" },
  { to: "/centers", label: "Centers" },
  { to: "/results", label: "Results" },
  { to: "/jobs", label: "Careers" },
  { to: "/notices", label: "Notices" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header className="glass sticky top-0 z-50" data-testid="site-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 group" data-testid="logo-link">
          <div className="leading-tight">
            <div className="font-display font-black text-base tracking-tight">Northend</div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">Educational World</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "text-primary bg-primary/5" : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link to="/admin"><Button size="sm" variant="outline" data-testid="admin-btn">Admin</Button></Link>
              ) : (
                <Link to="/dashboard"><Button size="sm" variant="outline" data-testid="dashboard-btn">Dashboard</Button></Link>
              )}
              <Button size="sm" variant="ghost" onClick={logout} data-testid="logout-btn">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" variant="ghost" data-testid="login-nav-btn">Login</Button></Link>
              <Link to="/enroll"><Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="enroll-nav-btn">Enroll Now <ChevronRight size={16} /></Button></Link>
            </>
          )}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu" data-testid="mobile-menu-toggle">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                className={({isActive}) => `px-3 py-2 rounded-md text-sm ${isActive ? "bg-primary/5 text-primary" : ""}`}>
                {n.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              {user ? (
                <>
                  <Link className="flex-1" to={user.role === "admin" ? "/admin" : "/dashboard"}><Button className="w-full" variant="outline">{user.role === "admin" ? "Admin" : "Dashboard"}</Button></Link>
                  <Button className="flex-1" variant="ghost" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Link className="flex-1" to="/login"><Button className="w-full" variant="outline">Login</Button></Link>
                  <Link className="flex-1" to="/enroll"><Button className="w-full bg-primary text-primary-foreground">Enroll</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40 mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 bg-primary text-primary-foreground grid place-items-center rounded-md"><GraduationCap size={20} /></div>
            <div className="font-display font-black">Northend</div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Authorized Unacademy franchise partner. Empowering Kashmir's future through quality education across NEET, IIT-JEE, Foundation, CBSE and JKBOSE.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            {NAV.slice(1, 7).map(n => <li key={n.to}><Link to={n.to} className="hover:text-primary">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Reach Us</div>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5"/> Lal Chowk, Srinagar, J&K – 190001</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +91-9876500001</li>
            <li className="flex items-center gap-2"><Mail size={16}/> hello@northend.edu</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-primary mb-4">Stay Updated</div>
          <p className="text-sm text-muted-foreground mb-3">Subscribe to scholarship and batch notices.</p>
          <form onSubmit={(e)=>e.preventDefault()} className="flex gap-2">
            <input className="flex-1 border border-border rounded-md px-3 py-2 text-sm bg-background" placeholder="you@example.com" data-testid="newsletter-input"/>
            <Button className="bg-primary text-primary-foreground" data-testid="newsletter-submit">Join</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Northend Educational World · Authorized Unacademy Franchise · Kashmir
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/919876500001?text=Hi%20Northend%2C%20I%20want%20to%20know%20about%20your%20courses"
      target="_blank" rel="noreferrer"
      data-testid="floating-whatsapp"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition"
    >
      <MessageCircle size={26} />
    </a>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
