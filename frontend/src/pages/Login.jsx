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
import { Lock, EnvelopeSimple, Eye, EyeSlash, WarningCircle } from "@phosphor-icons/react";

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

  const inputCls = "w-full pl-11 pr-12 py-3.5 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <>
      <Helmet>
        <title>Sign In | Northend Educational World</title>
        <link rel="canonical" href="https://northendedu.com/login" />
      </Helmet>

      <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 relative overflow-hidden" data-testid="login-page">
        {/* Visual side */}
        <div className="hidden lg:block relative overflow-hidden">
          {isMobile ? <HeroSceneFallback /> : <HeroScene />}
          <div className="absolute inset-0 flex items-end p-12">
            <div>
              <Eyebrow>The future of learning</Eyebrow>
              <div className="font-display text-5xl xl:text-6xl font-light tracking-tight leading-tight mt-4">
                Welcome back.<br/><span className="font-medium italic text-accent">Resume your journey.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="relative flex items-center justify-center p-6 lg:p-12">
          <div className="ambient-orb ambient-orb--accent" style={{ width: 400, height: 400, bottom: "-100px", left: "-100px", opacity: 0.3 }} />
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-md relative">
            <div className="lg:hidden mb-8">
              <Eyebrow>Sign in</Eyebrow>
              <h1 className="font-display text-4xl font-light tracking-tight mt-4">Welcome back.</h1>
            </div>
            <GlassPanel elevated className="p-8">
              <div className="hidden lg:block mb-6">
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Sign in</div>
                <h2 className="font-display text-3xl font-medium mt-2">Continue your journey</h2>
              </div>
              
              <AnimatePresence mode="wait">
                {inlineError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2.5 overflow-hidden"
                  >
                    <WarningCircle size={18} weight="fill" className="shrink-0 text-destructive" />
                    <span>{inlineError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={submit} className="space-y-3">
                <div className="relative">
                  <EnvelopeSimple weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <input 
                    className={inputCls} 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    maxLength={254}
                    autoComplete="email"
                    data-testid="email-input"
                  />
                </div>
                
                <div className="relative">
                  <Lock weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                  <input 
                    className={inputCls} 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    maxLength={128}
                    autoComplete="current-password"
                    data-testid="password-input"
                  />
                  
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeSlash size={18} weight="duotone" /> : <Eye size={18} weight="duotone" />}
                  </button>
                </div>

                <div className="pt-2">
                  <CTAPrimary type="submit" className="w-full justify-center" data-testid="login-submit" disabled={busy}>
                    {busy ? "Signing in…" : "Sign in"}
                  </CTAPrimary>
                </div>
              </form>
              <p className="text-sm text-muted-foreground mt-6 text-center">New here? <Link to="/register" className="text-accent font-bold hover:underline">Create an account</Link></p>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </>
  );
}
