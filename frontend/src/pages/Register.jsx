import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const { register, formatError } = useAuth();
  const nav = useNavigate();
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

  return (
    <div className="max-w-md mx-auto px-4 py-16" data-testid="register-page">
      <h1 className="font-display text-4xl font-black tracking-tighter">Create your account.</h1>
      <p className="mt-2 text-muted-foreground">Get access to your dashboard, study material and notices.</p>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <Input placeholder="Full name" value={f.name} onChange={e=>setF({...f, name: e.target.value})} required data-testid="reg-name"/>
        <Input type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f, email: e.target.value})} required data-testid="reg-email"/>
        <Input placeholder="Phone" value={f.phone} onChange={e=>setF({...f, phone: e.target.value})} data-testid="reg-phone"/>
        <Input type="password" placeholder="Password (min 6 chars)" minLength={6} value={f.password} onChange={e=>setF({...f, password: e.target.value})} required data-testid="reg-password"/>
        <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" disabled={busy} data-testid="reg-submit">{busy ? "Creating…" : "Create account"}</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">Already have an account? <Link to="/login" className="text-primary font-bold">Sign in</Link></p>
    </div>
  );
}
