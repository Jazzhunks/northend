import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import GlassPanel from "@/components/GlassPanel";
import { CTAPrimary, Eyebrow } from "@/components/Cinematic";
import { useIsMobile } from "@/hooks/useIsMobile";
import HeroScene, { HeroSceneFallback } from "@/components/three/HeroScene";
import { User, EnvelopeSimple, Phone, Lock } from "@phosphor-icons/react";

export default function Register() {
  const { register, formatError } = useAuth();
  const nav = useNavigate();
  const isMobile = useIsMobile();
  const [f, setF] = useState({ name:"", email:"", password:"", phone:"" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      await register(f);
      toast.success("Account created!");
      nav("/dashboard");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally { setBusy(false); }
  };

  const inputCls = "w-full pl-11 pr-4 py-3.5 rounded-xl glass text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent/50 transition";

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 relative overflow-hidden" data-testid="register-page">
      <div className="hidden lg:block relative overflow-hidden">
        {isMobile ? <HeroSceneFallback /> : <HeroScene />}
        <div className="absolute inset-0 flex items-end p-12">
          <div>
            <Eyebrow>Join the future</Eyebrow>
            <div className="font-display text-5xl xl:text-6xl font-light tracking-tight leading-tight mt-4">
              Begin your<br/><span className="font-medium italic text-accent">Northend journey.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center p-6 lg:p-12">
         <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md relative">
          <div className="lg:hidden mb-8">
            <Eyebrow>Create account</Eyebrow>
            <h1 className="font-display text-4xl font-light tracking-tight mt-4">Get started.</h1>
          </div>
          <GlassPanel elevated className="p-8">
            <div className="hidden lg:block mb-6">
              <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-accent">Create account</div>
              <h2 className="font-display text-3xl font-medium mt-2">Get started in 90s</h2>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <div className="relative">
                <User weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input className={inputCls} placeholder="Full name" value={f.name} onChange={e=>setF({...f, name: e.target.value})} required data-testid="reg-name"/>
              </div>
              <div className="relative">
                <EnvelopeSimple weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input className={inputCls} type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f, email: e.target.value})} required data-testid="reg-email"/>
              </div>
              <div className="relative">
                <Phone weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input className={inputCls} placeholder="Phone" value={f.phone} onChange={e=>setF({...f, phone: e.target.value})} data-testid="reg-phone"/>
              </div>
              <div className="relative">
                <Lock weight="duotone" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input className={inputCls} type="password" placeholder="Password (min 6 chars)" minLength={6} value={f.password} onChange={e=>setF({...f, password: e.target.value})} required data-testid="reg-password"/>
              </div>
              <div className="pt-2">
                <CTAPrimary type="submit" className="w-full justify-center" data-testid="reg-submit" disabled={busy}>{busy ? "Creating…" : "Create account"}</CTAPrimary>
              </div>
            </form>
            <p className="text-sm text-muted-foreground mt-6 text-center">Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Sign in</Link></p>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
