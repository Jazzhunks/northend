import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary, Eyebrow } from "@/components/Cinematic";
import { useIsMobile } from "@/hooks/useIsMobile";
import HeroScene, { HeroSceneFallback } from "@/components/three/HeroScene";
import { Lock, EnvelopeSimple, Eye, EyeSlash, WarningCircle, Sparkle } from "@phosphor-icons/react";

const ERP_ROLES = ["super_admin", "center_manager", "accountant", "counsellor"];

const ALLOWED_REDIRECTS = new Set([
  "/dashboard",
  "/admin",
  "/erp",
  "/profile",
  "/settings"
]);

export default function Login() {
  const { login, formatError } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const isMobile = useIsMobile();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inlineError, setInlineError] = useState("");
  
  const abortControllerRef = useRef(null);
  const lastAttemptRef = useRef(0);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const isValidRedirect = (path) => {
    if (!path) return false;
    try {
      const decoded = decodeURIComponent(path);
      if (decoded.includes("\\") || decoded.includes("\0") || decoded.startsWith("//")) {
        return false;
      }
      return ALLOWED_REDIRECTS.has(decoded);
    } catch {
      return false; 
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setInlineError("");

    const now = Date.now();
    if (now - lastAttemptRef.current < 2000) {
      setInlineError("Please wait a moment before trying again.");
      return;
    }
    lastAttemptRef.current = now;

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.includes("@")) {
      setInlineError("Invalid email or password.");
      return;
    }
    if (password.length < 8) {
      setInlineError("Invalid email or password.");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setBusy(true);

    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setInlineError("Authentication request timed out. Please try again.");
        setBusy(false);
      }
    }, 15000);

    try {
      const u = await login(cleanEmail, password, {
        signal: abortControllerRef.current.signal,
      });
      
      clearTimeout(timeoutId);
      toast.success("Welcome back!");

      const next = params.get("next");
      if (isValidRedirect(next)) {
        nav(next);
        return;
      }

      if (ERP_ROLES.includes(u.role)) {
        nav("/erp");
        return;
      }
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "CanceledError" || err.name === "AbortError") return;

      if (err.response?.status === 429) {
        setInlineError("Too many login attempts. Please try again later.");
      } else {
        const backendError = typeof formatError === "function"
          ? formatError(err.response?.data?.detail)
          : (err.response?.data?.detail || err.message);

        setInlineError(backendError || "Invalid email or password.");
      }
    } finally {
      setBusy(false);
      setPassword(""); 
      abortControllerRef.current = null;
    }
  };

  const inputCls = "w-full pl-11 pr-12 py-3.5 rounded-xl glass text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition shadow-inner";

  return (
    <>
      <Helmet>
        <title>Sign In | Northend Educational World</title>
        <link rel="canonical" href="https://northendedu.com/login" />
      </Helmet>

      <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-12 relative overflow-hidden bg-background" data-testid="login-page">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Visual / Branding side - removed border-r */}
        <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden flex-col justify-end p-12 lg:p-16">
          <div className="absolute inset-0 z-0">
            {isMobile ? <HeroSceneFallback /> : <HeroScene />}
          </div>
          {/* Softened dark shade overlay to prevent harsh dark gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-0 pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 glass rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-6 text-accent">
              <Sparkle weight="fill" size={12} className="text-accent" />
              Unacademy Kashmir
            </div>
            <Eyebrow>The future of learning</Eyebrow>
            <div className="font-display text-4xl xl:text-6xl font-light tracking-tight leading-[1.08] mt-3">
              Welcome back.<br/><span className="font-medium italic text-accent text-glow-accent">Resume your journey.</span>
            </div>
            <p className="text-muted-foreground mt-4 text-sm font-light leading-relaxed">
              Log in to access your personalized dashboard, track academic performance, study modules, and upcoming tests.
            </p>
          </div>
        </div>

        {/* Form side */}
        <div className="lg:col-span-5 relative flex items-center justify-center p-6 sm:p-10 lg:p-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="w-full max-w-md relative"
          >
            <div className="lg:hidden mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-[0.22em] mb-4 text-accent">
                <Sparkle weight="fill" size={12} className="text-accent" />
                Unacademy Kashmir
              </div>
              <h1 className="font-display text-3xl font-light tracking-tight">Welcome back.</h1>
            </div>

            <GlassPanel elevated className="p-8 sm:p-10 shadow-2xl backdrop-blur-xl border-border/80">
              <div className="hidden lg:block mb-8">
                <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-accent mb-2">Secure Authentication</div>
                <h2 className="font-display text-3xl font-medium tracking-tight">Sign in to portal</h2>
              </div>
              
              <AnimatePresence mode="wait">
                {inlineError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-3 shadow-sm"
                  >
                    <WarningCircle size={18} weight="fill" className="shrink-0 text-destructive mt-0.5" />
                    <span className="leading-relaxed">{inlineError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold ml-1">Email Address</label>
                  <div className="relative">
                    <EnvelopeSimple weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                    <input 
                      className={inputCls} 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      maxLength={254}
                      autoComplete="email"
                      data-testid="email-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1 mr-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Password</label>
                  </div>
                  <div className="relative">
                    <Lock weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                    <input 
                      className={inputCls} 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••••••" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      maxLength={128}
                      autoComplete="current-password"
                      data-testid="password-input"
                    />
                    
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition p-1"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeSlash size={18} weight="duotone" /> : <Eye size={18} weight="duotone" />}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <CTAPrimary type="submit" className="w-full justify-center py-4 text-sm font-medium tracking-wide shadow-lg shadow-accent/20" data-testid="login-submit" disabled={busy}>
                    {busy ? "Signing in…" : "Sign In to Portal"}
                  </CTAPrimary>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border/60 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-accent font-bold hover:underline inline-flex items-center gap-1 ml-1">
                    Register now
                  </Link>
                </p>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </>
  );
}