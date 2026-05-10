import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { login, formatError } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      const u = await login(email, password);
      toast.success("Welcome back!");
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(formatError(err.response?.data?.detail) || err.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16" data-testid="login-page">
      <h1 className="font-display text-4xl font-black tracking-tighter">Welcome back.</h1>
      <p className="mt-2 text-muted-foreground">Sign in to track your enrollments and study material.</p>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required data-testid="login-email"/>
        <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required data-testid="login-password"/>
        <Button type="submit" className="w-full bg-primary text-primary-foreground h-12" disabled={busy} data-testid="login-submit">{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">No account? <Link to="/register" className="text-primary font-bold">Register</Link></p>
    </div>
  );
}
