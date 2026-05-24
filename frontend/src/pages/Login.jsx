import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary, Eyebrow } from "@/components/Cinematic";
import { useIsMobile } from "@/hooks/useIsMobile";
import HeroScene, { HeroSceneFallback } from "@/components/three/HeroScene";
import { GraduationCap, Lock, EnvelopeSimple } from "@phosphor-icons/react";

const ERP_ROLES = ["super_admin", "center_manager", "accountant", "counsellor"];

export default function Login() {
  const { login, formatError } = useAuth();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const u = await login(email, password);
      toast.success("Welcome back!");
      const next = params.get("next");
      if (next && next.startsWith("/")) { nav(next); return; }
      if (ERP_ROLES.includes(u.role)) { nav("/erp"); return; }
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally { setBusy(false); }
  };

  const inputCls = "w-full pl-11 pr-4 py-3.5 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
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
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative"
        >
          <div className="lg:hidden mb-8">
            <Eyebrow>Sign in</Eyebrow>
            <h1 className="font-display text-4xl font-light tracking-tight mt-4">Welcome back.</h1>
          </div>
          <GlassPanel elevated className="p-8">
            <div className="hidden lg:block mb-6">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Sign in</div>
              <h2 className="font-display text-3xl font-medium mt-2">Continue your journey</h2>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <div className="relative">
                <EnvelopeSimple weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input className={inputCls} type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required data-testid="email-input"/>
              </div>
              <div className="relative">
                <Lock weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input className={inputCls} type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required data-testid="password-input"/>
              </div>
              <div className="pt-2">
                <CTAPrimary type="submit" className="w-full justify-center" data-testid="login-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</CTAPrimary>
              </div>
            </form>
            <p className="text-sm text-muted-foreground mt-6 text-center">New here? <Link to="/register" className="text-accent font-bold hover:underline">Create an account</Link></p>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
