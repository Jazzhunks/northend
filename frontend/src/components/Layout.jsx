import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
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
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const loc = useLocation();

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2 px-4 bg-background/90 backdrop-blur-md shadow-sm border-b border-border" : "py-4 px-4 bg-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12">
        <Link to="/" className="flex items-center gap-3 group shrink-0" data-testid="logo-link">
          <img src="/logo.svg" alt="Unacademy Kashmir" className="h-6 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation Link Track */}
        <nav className="hidden xl:flex items-center gap-1 shrink-0">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-[13px] font-semibold rounded-full transition-colors whitespace-nowrap ${
                  isActive ? "text-primary" : n.highlight ? "text-accent hover:text-accent" : "text-foreground/80 hover:text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="inline-flex items-center gap-1">
                    {n.label}
                    {n.highlight && (
                      <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        2026
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full border border-primary/20 bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Action Right Strip */}
        <div className="hidden xl:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {user.role === "admin" ? (
                <Link to="/admin" data-testid="admin-btn" className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/10 text-primary transition">Admin</Link>
              ) : user.role === "school" ? (
                <Link to="/school-dashboard" data-testid="dashboard-btn" className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/10 text-primary transition">School Dashboard</Link>
              ) : (
                <Link to="/dashboard" data-testid="dashboard-btn" className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/10 text-primary transition">Dashboard</Link>
              )}
              <button onClick={logout} data-testid="logout-btn" className="text-xs font-bold uppercase tracking-wider px-3 py-2 text-foreground/70 hover:text-foreground transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" data-testid="login-nav-btn" className="text-xs font-bold uppercase tracking-wider px-3 py-2 text-foreground/80 hover:text-primary transition">Login</Link>
              <Link to="/enroll">
                <span className="clay-btn text-xs font-bold uppercase tracking-wider px-5" data-testid="enroll-nav-btn">
                  Enroll <ArrowUpRight weight="bold" size={14}/>
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="xl:hidden min-h-[48px] min-w-[48px] flex items-center justify-center p-2 text-foreground hover:text-primary transition focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="xl:hidden mx-2 mt-2 rounded-2xl overflow-hidden shadow-2xl bg-background border border-border p-4"
          >
            <div className="flex flex-col gap-1">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                  className={({isActive}) => `px-4 py-3 min-h-[48px] rounded-xl text-sm font-semibold transition flex items-center justify-between ${isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"}`}>
                  <span>{n.label}</span>
                  {n.highlight && (
                    <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                      2026
                    </span>
                  )}
                </NavLink>
              ))}
              <div className="flex gap-2 pt-3 mt-2 border-t border-border">
                {user ? (
                  <>
                    <Link className="flex-1" to={user.role === "admin" ? "/admin" : user.role === "school" ? "/school-dashboard" : "/dashboard"}><div className="w-full text-center px-4 py-2.5 rounded-xl border border-primary/30 text-xs font-bold text-primary">{user.role === "admin" ? "Admin" : user.role === "school" ? "School Dashboard" : "Dashboard"}</div></Link>
                    <button onClick={logout} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground">Logout</button>
                  </>
                ) : (
                  <>
                    <Link className="flex-1" to="/login"><div className="w-full text-center px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground">Login</div></Link>
                    <Link className="flex-1" to="/enroll"><div className="w-full text-center px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-bold uppercase tracking-wider">Enroll</div></Link>
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
    <footer className="relative border-t border-border bg-muted" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            The future of <span className="text-primary">Kashmir's classrooms</span> is engineered here.
          </div>
          <p className="text-xs text-foreground/80 mt-4 max-w-md leading-relaxed">
            Authorised Unacademy franchise · NEET · IIT-JEE · Foundation · CBSE · JKBOSE.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-4">Explore</div>
          <ul className="space-y-2.5 text-xs font-medium text-foreground">
            {NAV.slice(1, 7).map(n => <li key={n.to}><Link to={n.to} className="hover:text-primary transition">{n.label}</Link></li>)}
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-4">Connect</div>
          <ul className="space-y-2.5 text-xs font-medium text-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/jobs" className="hover:text-primary">Careers</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-4">Reach us</div>
          <ul className="space-y-2.5 text-xs text-foreground/90 mb-5">
            <li className="flex items-start gap-2"><MapPinSimple weight="duotone" size={16} className="text-primary shrink-0"/> I G Road, Parray Pora, Srinagar, J&amp;K 190005</li>
            <li className="flex items-center gap-2"><Phone weight="duotone" size={16} className="text-primary shrink-0"/> +91-8766238623</li>
            <li className="flex items-center gap-2"><EnvelopeSimple weight="duotone" size={16} className="text-primary shrink-0"/> info@northendedu.com</li>
          </ul>
          
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/unacademykashmiroffline" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition" aria-label="Facebook">
              <FacebookLogo weight="fill" size={20} />
            </a>
            <a href="https://www.instagram.com/unacademykashmir" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition" aria-label="Instagram">
              <InstagramLogo weight="fill" size={20} />
            </a>
            <a href="https://www.youtube.com/@Unacademyoflinekashmir" target="_blank" rel="noreferrer" className="text-foreground/70 hover:text-primary transition" aria-label="YouTube">
              <YoutubeLogo weight="fill" size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 px-4 text-center text-[11px] text-foreground/70">
        © {new Date().getFullYear()} Northend Educational World · Authorised Unacademy Franchise · Kashmir
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
      transition={{ delay: 1, type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-6 right-6 z-40 h-12 w-12 grid place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
    >
      <WhatsappLogo weight="fill" size={24} />
    </motion.a>
  );
}

export default function Layout() {
  const loc = useLocation();
  const isAdminPath = loc.pathname.startsWith("/admin") || loc.pathname.startsWith("/erp");
  const canonicalUrl = `https://northendedu.com${loc.pathname === "/" ? "" : loc.pathname}`;

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Helmet>
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <Outlet />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
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