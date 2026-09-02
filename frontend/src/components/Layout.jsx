import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import SmoothScroll from "@/components/SmoothScroll";
import {
  List, X, Phone, MapPinSimple, EnvelopeSimple, WhatsappLogo,
  ArrowUpRight, FacebookLogo, InstagramLogo, YoutubeLogo
} from "@phosphor-icons/react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/wath", label: "WATH", highlight: true },
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
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const loc = useLocation();

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "px-4 pt-4" : "px-0 pt-0"
      }`}
      data-testid="site-header"
    >
      <div className={`mx-auto transition-all duration-500 ${
        scrolled ? "max-w-6xl clay-nav-shell rounded-2xl" : "max-w-7xl clay-nav-shell rounded-2xl"
      }`}>
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="leading-tight">
              <div className="font-display font-medium text-base tracking-tight text-foreground">Northend</div>
              <div className="text-[9px] tracking-[0.28em] uppercase text-muted-foreground">Educational World</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`nav-${n.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative px-3 py-2 text-[13px] font-medium rounded-full transition-colors ${
                    isActive ? "text-accent" : n.highlight ? "text-accent/90 hover:text-accent" : "text-foreground/70 hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      {n.label}
                      {n.highlight && (
                        <span className="text-[8px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                          2026
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.04]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link to="/admin" data-testid="admin-btn" className="text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full border border-white/15 hover:border-white/30 transition text-foreground">Admin</Link>
                ) : (
                  <Link to="/dashboard" data-testid="dashboard-btn" className="text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full border border-white/15 hover:border-white/30 transition text-foreground">Dashboard</Link>
                )}
                <button onClick={logout} data-testid="logout-btn" className="text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 text-muted-foreground hover:text-foreground transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="login-nav-btn" className="text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 text-muted-foreground hover:text-foreground transition">Login</Link>
                <Link to="/enroll">
                  <motion.span
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 clay-btn text-xs font-bold uppercase tracking-[0.18em]"
                    data-testid="enroll-nav-btn"
                  >
                    Enroll <ArrowUpRight weight="bold" size={14}/>
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="menu" data-testid="mobile-menu-toggle">
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="lg:hidden mx-4 mt-2 glass-elevated rounded-2xl overflow-hidden"
          >
            <div className="p-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className={({isActive}) => `px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-between ${isActive ? "bg-white/10 text-accent" : n.highlight ? "text-accent/90" : "text-foreground/80"}`}>
                  <span>{n.label}</span>
                  {n.highlight && (
                    <span className="text-[8px] font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                      2026
                    </span>
                  )}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-3 mt-2 border-t border-white/10">
                {user ? (
                  <>
                    <Link className="flex-1" to={user.role === "admin" ? "/admin" : "/dashboard"}><div className="w-full text-center px-4 py-3 rounded-xl border border-white/15 text-sm font-bold text-foreground">{user.role === "admin" ? "Admin" : "Dashboard"}</div></Link>
                    <button onClick={logout} className="flex-1 px-4 py-3 rounded-xl border border-white/15 text-sm font-bold text-muted-foreground">Logout</button>
                  </>
                ) : (
                  <>
                    <Link className="flex-1" to="/login"><div className="w-full text-center px-4 py-3 rounded-xl border border-white/15 text-sm font-bold text-foreground">Login</div></Link>
                    <Link className="flex-1" to="/enroll"><div className="w-full text-center px-4 py-3 rounded-xl bg-accent text-accent-foreground text-sm font-bold">Enroll</div></Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/[0.06]" data-testid="site-footer">
      <div className="ambient-orb ambient-orb--primary" style={{ width: 600, height: 600, top: "-200px", left: "-100px" }} />
      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-display text-3xl lg:text-4xl font-light tracking-tight leading-tight text-foreground">
            The future of <span className="text-accent">Kashmir's classrooms</span> is being engineered here.
          </div>
          <p className="text-sm text-muted-foreground mt-6 max-w-md leading-relaxed">
            Authorised Unacademy franchise · NEET · IIT-JEE · Foundation · CBSE · JKBOSE.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.28em] text-accent mb-5">Explore</div>
          <ul className="space-y-3 text-sm">
            {NAV.slice(1, 7).map(n => <li key={n.to}><Link to={n.to} className="text-muted-foreground hover:text-foreground transition">{n.label}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.28em] text-accent mb-5">Connect</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><Link to="/jobs" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-accent mb-5">Reach us</div>
          <ul className="space-y-3 text-xs text-muted-foreground mb-6">
            <li className="flex items-start gap-2"><MapPinSimple weight="duotone" size={16}/> I G Road, Parray Pora, Srinagar, J&K 190005</li>
            <li className="flex items-center gap-2"><Phone weight="duotone" size={16}/> +91-8766238623</li>
            <li className="flex items-center gap-2"><EnvelopeSimple weight="duotone" size={16}/> info@northendedu.com</li>
          </ul>
          
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/unacademykashmiroffline" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Facebook">
              <FacebookLogo weight="fill" size={24} />
            </a>
            <a href="https://www.instagram.com/unacademykashmir" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Instagram">
              <InstagramLogo weight="fill" size={24} />
            </a>
            <a href="https://www.youtube.com/@Unacademyoflinekashmir" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-accent transition-colors" aria-label="YouTube">
              <YoutubeLogo weight="fill" size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-6 px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[11px] text-muted-foreground tracking-wider">
          © {new Date().getFullYear()} Northend Educational World · Authorised Unacademy Franchise · Kashmir
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFab() {
  return (
    <motion.a
      href="https://wa.me/917006149481?text=Hi%20Northend%2C%20I%20want%20to%20know%20about%20your%20courses"
      target="_blank" rel="noreferrer"
      data-testid="floating-whatsapp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-[0_0_30px_rgba(37,211,102,0.5)]"
    >
      <WhatsappLogo weight="fill" size={26} />
    </motion.a>
  );
}

export default function Layout() {
  const loc = useLocation();
  
  // --- REFACTORED CONDITION: DETECTS IF USER IS WITHIN THE ADMIN WORKSPACE ENVIRONMENT ---
  const isAdminPath = loc.pathname.startsWith("/admin");

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        <Outlet />
      </div>
    );
  }

  // Fallback layout wraps public website views safely
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </SmoothScroll>
  );
}